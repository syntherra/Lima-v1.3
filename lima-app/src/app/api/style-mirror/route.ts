import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { DeepSeekService } from '@/lib/ai/deepseek-service';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('user_voice_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching voice profile:', error);
      return NextResponse.json({ error: 'Failed to fetch voice profile' }, { status: 500 });
    }

    return NextResponse.json({ profile: profile || null });
  } catch (error) {
    console.error('Error in voice profile API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { writing_sample, sample_type = 'manual' } = body;

    if (!writing_sample?.trim()) {
      return NextResponse.json({ error: 'Writing sample is required' }, { status: 400 });
    }

    const deepSeekService = new DeepSeekService();
    
    // Analyze the writing sample
    const styleAnalysis = await deepSeekService.analyzeWritingStyle(writing_sample);

    // Get existing profile or create new one
    let { data: existingProfile } = await supabase
      .from('user_voice_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    let profile;

    if (existingProfile) {
      // Update existing profile by merging new analysis
      const updatedProfile = mergeStyleAnalysis(existingProfile, styleAnalysis);
      
      const { data: updated, error } = await supabase
        .from('user_voice_profiles')
        .update(updatedProfile)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating voice profile:', error);
        return NextResponse.json({ error: 'Failed to update voice profile' }, { status: 500 });
      }
      
      profile = updated;
    } else {
      // Create new profile
      const { data: created, error } = await supabase
        .from('user_voice_profiles')
        .insert({
          user_id: user.id,
          ...styleAnalysis,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating voice profile:', error);
        return NextResponse.json({ error: 'Failed to create voice profile' }, { status: 500 });
      }
      
      profile = created;
    }

    // Log the analysis
    await supabase.from('ai_actions_log').insert({
      user_id: user.id,
      action_type: 'style_analysis',
      details: {
        sample_length: writing_sample.length,
        sample_type,
        confidence_score: styleAnalysis.confidence_score,
      },
    });

    return NextResponse.json({ 
      profile,
      message: 'Writing style analyzed successfully'
    });

  } catch (error) {
    console.error('Error in voice profile POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { original_text, target_style } = body;

    if (!original_text?.trim()) {
      return NextResponse.json({ error: 'Original text is required' }, { status: 400 });
    }

    // Get user's voice profile
    const { data: profile } = await supabase
      .from('user_voice_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ 
        error: 'No voice profile found. Please analyze some writing samples first.' 
      }, { status: 404 });
    }

    const deepSeekService = new DeepSeekService();
    
    // Generate style-matched text
    const mirroredText = await deepSeekService.mirrorWritingStyle(
      original_text,
      profile,
      target_style || 'email'
    );

    // Log the mirroring action
    await supabase.from('ai_actions_log').insert({
      user_id: user.id,
      action_type: 'style_mirroring',
      details: {
        original_length: original_text.length,
        mirrored_length: mirroredText.length,
        target_style: target_style || 'email',
      },
    });

    return NextResponse.json({ 
      mirrored_text: mirroredText,
      message: 'Text mirrored successfully'
    });

  } catch (error) {
    console.error('Error in style mirroring API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function mergeStyleAnalysis(existing: any, newAnalysis: any) {
  // Simple merging logic - in production, this would be more sophisticated
  return {
    ...existing,
    tone: newAnalysis.tone || existing.tone,
    formality_level: Math.round((existing.formality_level + newAnalysis.formality_level) / 2),
    sentence_length: newAnalysis.sentence_length || existing.sentence_length,
    vocabulary_complexity: newAnalysis.vocabulary_complexity || existing.vocabulary_complexity,
    punctuation_style: newAnalysis.punctuation_style || existing.punctuation_style,
    greeting_style: newAnalysis.greeting_style || existing.greeting_style,
    closing_style: newAnalysis.closing_style || existing.closing_style,
    common_phrases: [
      ...existing.common_phrases,
      ...(newAnalysis.common_phrases || [])
    ].slice(0, 10), // Keep top 10
    signature_words: [
      ...existing.signature_words,
      ...(newAnalysis.signature_words || [])
    ].slice(0, 15), // Keep top 15
    writing_patterns: {
      ...existing.writing_patterns,
      ...newAnalysis.writing_patterns,
    },
    confidence_score: Math.min(0.95, existing.confidence_score + 0.05),
    updated_at: new Date().toISOString(),
  };
}