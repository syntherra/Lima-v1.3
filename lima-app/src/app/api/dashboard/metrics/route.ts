import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const timeRange = searchParams.get('timeRange') || '7'; // days

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const daysAgo = parseInt(timeRange);
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    // Get email metrics
    const { data: emails, error: emailsError } = await supabase
      .from('emails')
      .select(`
        id,
        direction,
        sent_at,
        opened_at,
        replied_at,
        is_from_ai,
        campaign_id,
        campaigns (user_id)
      `)
      .gte('created_at', startDate.toISOString())
      .eq('campaigns.user_id', userId);

    if (emailsError) {
      console.error('Error fetching emails:', emailsError);
    }

    // Get campaign metrics
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select(`
        id,
        status,
        type,
        created_at,
        campaign_contacts (
          status,
          sent_count
        )
      `)
      .eq('user_id', userId);

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
    }

    // Get AI insights
    const { data: insights, error: insightsError } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false })
      .limit(5);

    if (insightsError) {
      console.error('Error fetching insights:', insightsError);
    }

    // Get AI actions log
    const { data: aiActions, error: aiActionsError } = await supabase
      .from('ai_actions_log')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (aiActionsError) {
      console.error('Error fetching AI actions:', aiActionsError);
    }

    // Calculate metrics
    const totalEmails = emails?.length || 0;
    const sentEmails = (emails || []).filter((e: any) => e.direction === 'outbound').length;
    const openedEmails = (emails || []).filter((e: any) => e.opened_at).length;
    const repliedEmails = (emails || []).filter((e: any) => e.replied_at).length;
    const aiSentEmails = (emails || []).filter((e: any) => e.is_from_ai).length;

    // Calculate previous period for trends
    const prevStartDate = new Date(startDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const { data: prevEmails } = await supabase
      .from('emails')
      .select('id, direction, opened_at, replied_at, campaigns!inner(user_id)')
      .gte('created_at', prevStartDate.toISOString())
      .lt('created_at', startDate.toISOString())
      .eq('campaigns.user_id', userId);

    const prevSentEmails = (prevEmails || []).filter((e: any) => e.direction === 'outbound').length;
    const trendPercentage = prevSentEmails > 0 
      ? ((sentEmails - prevSentEmails) / prevSentEmails) * 100 
      : 0;

    const dashboardMetrics = {
      growth_pulse: {
        emails_sent: sentEmails,
        replies_received: repliedEmails,
        meetings_booked: 0, // Would come from calendar integration
        escalations: aiSentEmails,
        trend_percentage: Math.round(trendPercentage * 10) / 10,
      },
      campaign_performance: {
        total_campaigns: campaigns?.length || 0,
        active_campaigns: (campaigns || []).filter((c: any) => c.status === 'active').length,
        open_rate: sentEmails > 0 ? Math.round((openedEmails / sentEmails) * 100 * 10) / 10 : 0,
        reply_rate: sentEmails > 0 ? Math.round((repliedEmails / sentEmails) * 100 * 10) / 10 : 0,
        conversion_rate: sentEmails > 0 ? Math.round((repliedEmails / sentEmails) * 100 * 10) / 10 : 0,
      },
      ai_activity: (aiActions || []).map((action: any) => ({
        id: action.id,
        type: action.type,
        message: `${action.type.replace('_', ' ')} - ${action.reason || 'AI action performed'}`,
        timestamp: action.timestamp,
        confidence: action.confidence,
      })),
      insights: (insights || []).map((insight: any) => ({
        id: insight.id,
        message: insight.message,
        type: insight.insight_type,
        confidence: insight.confidence,
        created_at: insight.created_at,
      })),
      deliverability_health: {
        domain_reputation: 85, // Would come from email service provider
        bounce_rate: 2.1,
        spam_complaint_rate: 0.1,
        warm_up_progress: 75,
      },
    };

    return NextResponse.json({
      success: true,
      data: dashboardMetrics,
      timeRange: `${daysAgo} days`,
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}