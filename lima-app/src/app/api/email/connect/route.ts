import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { google } from 'googleapis';
import config from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const { provider, code, userId } = await request.json();

    if (!provider || !code || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    let tokens;
    let emailAddress;

    if (provider === 'gmail') {
      // Exchange code for tokens
      const oauth2Client = new google.auth.OAuth2(
        config.oauth.google.clientId,
        config.oauth.google.clientSecret,
        `${config.app.url}/auth/callback`
      );

      const { tokens: googleTokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(googleTokens);

      // Get user's email address
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      const profile = await gmail.users.getProfile({ userId: 'me' });
      emailAddress = profile.data.emailAddress;

      tokens = {
        access_token: googleTokens.access_token,
        refresh_token: googleTokens.refresh_token,
      };
    } else if (provider === 'outlook') {
      // Exchange code for tokens
      const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: config.oauth.microsoft.clientId!,
          client_secret: config.oauth.microsoft.clientSecret!,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${config.app.url}/auth/callback`,
          scope: 'Mail.ReadWrite Mail.Send User.Read',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for tokens');
      }

      const outlookTokens = await response.json();

      // Get user's email address
      const profileResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${outlookTokens.access_token}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to get user profile');
      }

      const profile = await profileResponse.json();
      emailAddress = profile.mail || profile.userPrincipalName;

      tokens = {
        access_token: outlookTokens.access_token,
        refresh_token: outlookTokens.refresh_token,
      };
    } else {
      return NextResponse.json(
        { error: 'Unsupported provider' },
        { status: 400 }
      );
    }

    // Store email account in database
    const { data: emailAccount, error } = await supabase
      .from('email_accounts')
      .insert({
        user_id: userId,
        email_address: emailAddress,
        provider,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        is_connected: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to save email account' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailAccount: {
        id: emailAccount.id,
        email_address: emailAccount.email_address,
        provider: emailAccount.provider,
        is_connected: emailAccount.is_connected,
      },
    });
  } catch (error) {
    console.error('Email connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect email account' },
      { status: 500 }
    );
  }
}