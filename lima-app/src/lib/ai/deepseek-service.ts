import { config } from '@/lib/config';
import type { 
  DeepSeekAPIRequest, 
  DeepSeekAPIResponse,
  TaskExtractionResult,
  EmailIntentClassification,
  StyleAnalysis 
} from '@/types/api';

export class DeepSeekService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.ai.deepseek.apiKey!;
    this.baseUrl = config.ai.deepseek.baseUrl;
  }

  private async makeRequest(request: DeepSeekAPIRequest): Promise<DeepSeekAPIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.ai.deepseek.model,
          max_tokens: config.ai.deepseek.maxTokens,
          temperature: config.ai.deepseek.temperature,
          ...request,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('DeepSeek API request failed:', error);
      throw error;
    }
  }

  async generateEmail(params: {
    context: string;
    recipient: string;
    purpose: string;
    tone?: string;
    userStyle?: StyleAnalysis;
  }): Promise<{ subject: string; body: string }> {
    const styleInstructions = params.userStyle 
      ? this.formatStyleInstructions(params.userStyle)
      : 'Write in a professional, friendly tone.';

    const prompt = `Generate a personalized email with the following requirements:

Context: ${params.context}
Recipient: ${params.recipient}
Purpose: ${params.purpose}

Style Guidelines: ${styleInstructions}

Please provide a response in JSON format with "subject" and "body" fields.
The email should be engaging, personalized, and professional.
Keep the subject under 60 characters and the body under 200 words.`;

    const request: DeepSeekAPIRequest = {
      model: config.ai.deepseek.model,
      messages: [
        {
          role: 'system',
          content: 'You are Lima, an AI email assistant that generates highly personalized B2B emails. Always respond with valid JSON containing subject and body fields.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    const response = await this.makeRequest(request);
    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated');
    }

    try {
      const parsed = JSON.parse(content);
      return {
        subject: parsed.subject || 'Subject',
        body: parsed.body || 'Email body',
      };
    } catch {
      // Fallback if JSON parsing fails
      return {
        subject: 'Follow up',
        body: content,
      };
    }
  }

  async extractTasks(emailContent: string): Promise<TaskExtractionResult> {
    const prompt = `Analyze the following email and extract any actionable tasks or action items:

Email Content:
${emailContent}

Please identify:
1. Explicit action items mentioned in the email
2. Implied tasks that need to be completed
3. Who should be responsible for each task
4. Any mentioned deadlines or urgency

Respond with JSON containing:
- has_tasks (boolean)
- tasks (array of objects with title, description, priority, due_date, assigned_to, confidence)
- confidence (overall confidence score 0-1)`;

    const request: DeepSeekAPIRequest = {
      model: config.ai.deepseek.model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that extracts actionable tasks from email content. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    const response = await this.makeRequest(request);
    const content = response.choices[0]?.message?.content;

    if (!content) {
      return { has_tasks: false, tasks: [], confidence: 0 };
    }

    try {
      return JSON.parse(content);
    } catch {
      return { has_tasks: false, tasks: [], confidence: 0 };
    }
  }

  async classifyEmailIntent(emailContent: string): Promise<EmailIntentClassification> {
    const prompt = `Analyze the following email and classify its intent and sentiment:

Email Content:
${emailContent}

Classify the email's:
1. Intent (question, request, meeting, follow_up, objection, positive, neutral)
2. Sentiment (positive, neutral, negative)
3. Urgency level (low, medium, high)
4. Key phrases that indicate the intent

Respond with JSON containing intent, sentiment, urgency, confidence, and key_phrases array.`;

    const request: DeepSeekAPIRequest = {
      model: config.ai.deepseek.model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that analyzes email intent and sentiment. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    const response = await this.makeRequest(request);
    const content = response.choices[0]?.message?.content;

    if (!content) {
      return {
        intent: 'neutral',
        sentiment: 'neutral',
        urgency: 'low',
        confidence: 0,
        key_phrases: [],
      };
    }

    try {
      return JSON.parse(content);
    } catch {
      return {
        intent: 'neutral',
        sentiment: 'neutral',
        urgency: 'low',
        confidence: 0,
        key_phrases: [],
      };
    }
  }

  async analyzeWritingStyle(emailHistory: string[]): Promise<StyleAnalysis> {
    const combinedEmails = emailHistory.slice(0, 10).join('\n\n---\n\n');
    
    const prompt = `Analyze the following email history to determine the user's writing style:

Email History:
${combinedEmails}

Analyze and extract:
1. Tone (formal, casual, friendly, professional, enthusiastic)
2. Greeting style (hi, hello, hey, greetings, good_morning)
3. Sign-off patterns (best, thanks, regards, talk_soon, cheers)
4. Punctuation style (minimal, standard, heavy)
5. Average sentence length
6. Common phrases used
7. Response length preference (brief, medium, detailed)
8. Formality score (0-10)
9. Enthusiasm score (0-10)

Respond with JSON containing all these fields.`;

    const request: DeepSeekAPIRequest = {
      model: config.ai.deepseek.model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that analyzes writing styles from email samples. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    const response = await this.makeRequest(request);
    const content = response.choices[0]?.message?.content;

    try {
      return JSON.parse(content);
    } catch {
      return {
        tone: 'professional',
        greeting_style: 'hi',
        sign_off: 'best',
        punctuation_style: 'standard',
        avg_sentence_length: 15,
        common_phrases: [],
        response_length: 'medium',
        formality_score: 5,
        enthusiasm_score: 5,
      };
    }
  }

  async generateInsights(analyticsData: any): Promise<string[]> {
    const prompt = `Based on the following analytics data, generate 3-4 actionable insights:

Analytics Data:
${JSON.stringify(analyticsData, null, 2)}

Generate insights that are:
1. Actionable and specific
2. Based on data trends
3. Helpful for improving outreach performance
4. Concise (1-2 sentences each)

Respond with a JSON array of insight strings.`;

    const request: DeepSeekAPIRequest = {
      model: config.ai.deepseek.model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that generates actionable business insights from analytics data.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    };

    const response = await this.makeRequest(request);
    const content = response.choices[0]?.message?.content;

    try {
      return JSON.parse(content);
    } catch {
      return ['Unable to generate insights at this time.'];
    }
  }

  private formatStyleInstructions(style: StyleAnalysis): string {
    return `Write in a ${style.tone} tone. 
Use "${style.greeting_style}" as greeting and "${style.sign_off}" as sign-off. 
Keep sentences around ${style.avg_sentence_length} words. 
Use ${style.punctuation_style} punctuation. 
Write in ${style.response_length} length.`;
  }

  async analyzeWritingStyleDetailed(text: string): Promise<any> {
    const prompt = `Analyze the writing style of the following text and extract key characteristics:

Text: "${text}"

Please analyze and return a JSON object with the following structure:
{
  "tone": "professional|casual|friendly|formal|conversational",
  "formality_level": 1-10,
  "sentence_length": "short|medium|long|varied",
  "vocabulary_complexity": "simple|moderate|advanced|technical",
  "punctuation_style": "minimal|standard|expressive",
  "greeting_style": "typical greeting pattern",
  "closing_style": "typical closing pattern",
  "common_phrases": ["phrase1", "phrase2"],
  "signature_words": ["word1", "word2"],
  "writing_patterns": {
    "avg_sentence_length": number,
    "passive_voice_percentage": number,
    "question_frequency": number,
    "exclamation_frequency": number,
    "paragraph_length": "short|medium|long",
    "transition_words_usage": "rare|moderate|frequent"
  },
  "confidence_score": 0.0-1.0
}`;

    const request: DeepSeekAPIRequest = {
      model: config.ai.deepseek.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert writing style analyst. Analyze text and return detailed style characteristics in JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
    };

    const response = await this.makeRequest(request);
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content generated for style analysis');
    }
    
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Failed to extract style analysis from response');
    } catch (error) {
      console.error('Error parsing style analysis:', error);
      throw error;
    }
  }

  async mirrorWritingStyle(originalText: string, styleProfile: any, targetType: string = 'email'): Promise<string> {
    const prompt = `Rewrite the following text to match the specified writing style profile:

Original Text: "${originalText}"

Style Profile:
- Tone: ${styleProfile.tone}
- Formality Level: ${styleProfile.formality_level}/10
- Sentence Length: ${styleProfile.sentence_length}
- Vocabulary: ${styleProfile.vocabulary_complexity}
- Greeting Style: ${styleProfile.greeting_style}
- Closing Style: ${styleProfile.closing_style}
- Common Phrases: ${styleProfile.common_phrases?.join(', ')}
- Signature Words: ${styleProfile.signature_words?.join(', ')}

Target Type: ${targetType}

Rewrite the text to perfectly match this writing style while maintaining the original meaning and intent. Use the person's characteristic phrases, tone, and patterns.`;

    const request: DeepSeekAPIRequest = {
      model: config.ai.deepseek.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert writing style mirroring assistant. Rewrite text to exactly match the provided style profile while preserving meaning.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
    };

    const response = await this.makeRequest(request);
    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content generated for style mirroring');
    }
    
    return content.trim();
  }
}