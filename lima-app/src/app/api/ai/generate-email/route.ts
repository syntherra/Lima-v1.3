import { NextRequest, NextResponse } from 'next/server';
import { DeepSeekService } from '@/lib/ai/deepseek-service';

export async function POST(request: NextRequest) {
  try {
    const { 
      context, 
      recipient, 
      purpose, 
      tone, 
      userStyle 
    } = await request.json();

    if (!context || !recipient || !purpose) {
      return NextResponse.json(
        { error: 'Missing required parameters: context, recipient, purpose' },
        { status: 400 }
      );
    }

    const aiService = new DeepSeekService();
    
    const generatedEmail = await aiService.generateEmail({
      context,
      recipient,
      purpose,
      tone,
      userStyle,
    });

    return NextResponse.json({
      success: true,
      email: generatedEmail,
    });
  } catch (error) {
    console.error('AI email generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    );
  }
}