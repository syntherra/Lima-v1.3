import { NextRequest, NextResponse } from 'next/server';
import { DeepSeekService } from '@/lib/ai/deepseek-service';
import { supabase } from '@/lib/supabase';

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

    // Get recent analytics data
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('analytics_snapshots')
      .select('*')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .order('date', { ascending: false });

    if (analyticsError) {
      console.error('Error fetching analytics:', analyticsError);
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      );
    }

    // Get campaign performance data
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select(`
        id,
        name,
        status,
        type,
        created_at,
        campaign_contacts (
          status,
          sent_count
        )
      `)
      .eq('user_id', userId)
      .limit(10);

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
    }

    // Prepare data for AI analysis
    const aggregatedData = {
      analytics: analyticsData || [],
      campaigns: campaigns || [],
      totalCampaigns: campaigns?.length || 0,
      activeCampaigns: campaigns?.filter(c => c.status === 'active').length || 0,
    };

    const aiService = new DeepSeekService();
    const insights = await aiService.generateInsights(aggregatedData);

    // Store insights in database
    const insightPromises = insights.map((insight, index) => 
      supabase
        .from('ai_insights')
        .insert({
          user_id: userId,
          insight_type: 'performance',
          message: insight,
          confidence: 0.8,
          triggered_at: new Date().toISOString(),
        })
    );

    await Promise.all(insightPromises);

    // Get all insights for user (including newly created ones)
    const { data: allInsights, error: insightsError } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false })
      .limit(10);

    if (insightsError) {
      console.error('Error fetching insights:', insightsError);
      return NextResponse.json(
        { error: 'Failed to fetch insights' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      insights: allInsights || [],
    });
  } catch (error) {
    console.error('AI insights generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { insightId, action } = await request.json();

    if (!insightId || !action) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (action === 'dismiss') {
      const { error } = await supabase
        .from('ai_insights')
        .update({ is_dismissed: true })
        .eq('id', insightId);

      if (error) {
        console.error('Error dismissing insight:', error);
        return NextResponse.json(
          { error: 'Failed to dismiss insight' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Insight dismissed',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('AI insights update error:', error);
    return NextResponse.json(
      { error: 'Failed to update insight' },
      { status: 500 }
    );
  }
}