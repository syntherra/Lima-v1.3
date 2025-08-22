import { NextRequest, NextResponse } from 'next/server';
import { EmailServiceFactory } from '@/lib/email/email-service-factory';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, emailAccountId } = await request.json();

    if (!userId || !emailAccountId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify email account belongs to user
    const { data: emailAccount, error } = await supabase
      .from('email_accounts')
      .select('*')
      .eq('id', emailAccountId)
      .eq('user_id', userId)
      .single();

    if (error || !emailAccount) {
      return NextResponse.json(
        { error: 'Email account not found or access denied' },
        { status: 404 }
      );
    }

    if (!emailAccount.is_connected) {
      return NextResponse.json(
        { error: 'Email account not connected' },
        { status: 400 }
      );
    }

    // Perform email sync
    const result = await EmailServiceFactory.syncEmails(userId, emailAccountId);

    return NextResponse.json({
      success: true,
      message: 'Email sync completed',
      emailsProcessed: result.emailsProcessed,
    });
  } catch (error) {
    console.error('Email sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync emails' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Get all email accounts for user
    const { data: emailAccounts, error } = await supabase
      .from('email_accounts')
      .select('id, email_address, provider, is_connected, last_synced')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch email accounts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailAccounts: emailAccounts || [],
    });
  } catch (error) {
    console.error('Get email accounts error:', error);
    return NextResponse.json(
      { error: 'Failed to get email accounts' },
      { status: 500 }
    );
  }
}