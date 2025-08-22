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

    const { data: orgMaps, error } = await supabase
      .from('org_intel_maps')
      .select(`
        *,
        company:companies(name, domain),
        departments:org_departments(*),
        decision_makers:org_decision_makers(*)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching org intel maps:', error);
      return NextResponse.json({ error: 'Failed to fetch org intel maps' }, { status: 500 });
    }

    return NextResponse.json({ org_maps: orgMaps || [] });
  } catch (error) {
    console.error('Error in org intel API:', error);
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
    const { company_id, analyze_emails = true } = body;

    if (!company_id) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // Get company information
    const { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('id', company_id)
      .single();

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Get all contacts for this company
    const { data: contacts } = await supabase
      .from('contacts')
      .select('*')
      .eq('company_id', company_id);

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ error: 'No contacts found for this company' }, { status: 404 });
    }

    const deepSeekService = new DeepSeekService();

    // Analyze organizational structure using AI
    const orgStructure = await analyzeOrganizationalStructure(contacts, deepSeekService);

    // Create or update org intel map
    const { data: orgMap, error: mapError } = await supabase
      .from('org_intel_maps')
      .upsert({
        user_id: user.id,
        company_id,
        total_contacts: contacts.length,
        hierarchy_levels: orgStructure.hierarchy_levels,
        structure_data: orgStructure.structure_data,
        confidence_score: orgStructure.confidence_score,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (mapError) {
      console.error('Error creating org intel map:', mapError);
      return NextResponse.json({ error: 'Failed to create org intel map' }, { status: 500 });
    }

    // Log AI action
    await supabase.from('ai_actions_log').insert({
      user_id: user.id,
      action_type: 'org_intel_analysis',
      details: {
        company_id,
        contacts_analyzed: contacts.length,
        hierarchy_levels: orgStructure.hierarchy_levels,
        confidence_score: orgStructure.confidence_score,
      },
    });

    return NextResponse.json({ 
      org_map: orgMap,
      message: 'Organization structure analyzed successfully'
    });

  } catch (error) {
    console.error('Error in org intel POST API:', error);
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
    const { email_content, target_company_id, routing_goal } = body;

    if (!email_content || !target_company_id) {
      return NextResponse.json({ error: 'Email content and target company are required' }, { status: 400 });
    }

    // Get org intel map for the company
    const { data: orgMap } = await supabase
      .from('org_intel_maps')
      .select('*')
      .eq('company_id', target_company_id)
      .eq('user_id', user.id)
      .single();

    if (!orgMap) {
      return NextResponse.json({ 
        error: 'No organizational intelligence found for this company. Please analyze the organization first.' 
      }, { status: 404 });
    }

    // Get contacts for routing analysis
    const { data: contacts } = await supabase
      .from('contacts')
      .select('*')
      .eq('company_id', target_company_id);

    const deepSeekService = new DeepSeekService();

    // Generate intelligent routing recommendation
    const routingRecommendation = await generateEmailRouting(
      email_content,
      contacts || [],
      orgMap,
      routing_goal || 'response_rate',
      deepSeekService
    );

    // Log the routing recommendation
    await supabase.from('ai_actions_log').insert({
      user_id: user.id,
      action_type: 'email_routing',
      details: {
        target_company_id,
        routing_goal,
        recommended_path: routingRecommendation.path,
        confidence_score: routingRecommendation.confidence_score,
      },
    });

    return NextResponse.json({ 
      routing_recommendation: routingRecommendation,
      message: 'Email routing generated successfully'
    });

  } catch (error) {
    console.error('Error in email routing API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function analyzeOrganizationalStructure(contacts: any[], deepSeekService: DeepSeekService) {
  const contactsData = contacts.map(c => ({
    name: c.first_name + ' ' + c.last_name,
    title: c.title,
    email: c.email,
    department: c.department,
  }));

  const prompt = `Analyze the following list of contacts and determine the organizational structure:

Contacts:
${JSON.stringify(contactsData, null, 2)}

Please analyze and return a JSON object with:
{
  "hierarchy_levels": number,
  "departments": [
    {
      "name": "department_name",
      "head": "person_name_or_null",
      "members": ["person1", "person2"],
      "seniority": "c_suite|vp|director|manager|individual"
    }
  ],
  "decision_makers": ["person1", "person2"],
  "influencers": ["person1", "person2"],
  "gatekeepers": ["person1", "person2"],
  "structure_data": {
    "org_chart": "description of reporting structure",
    "decision_flow": "how decisions are made",
    "communication_patterns": "how information flows"
  },
  "confidence_score": 0.0-1.0
}`;

  try {
    const response = await deepSeekService.makeRequest({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an organizational structure analyst. Analyze contact lists and determine company hierarchy and decision-making structures.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    // Fallback structure
    return {
      hierarchy_levels: 3,
      departments: [],
      decision_makers: [],
      structure_data: {},
      confidence_score: 0.5,
    };
  } catch (error) {
    console.error('Error analyzing org structure:', error);
    return {
      hierarchy_levels: 3,
      departments: [],
      decision_makers: [],
      structure_data: {},
      confidence_score: 0.3,
    };
  }
}

async function generateEmailRouting(
  emailContent: string,
  contacts: any[],
  orgMap: any,
  goal: string,
  deepSeekService: DeepSeekService
) {
  const prompt = `Given the following email content and organizational structure, recommend the best routing path:

Email Content: "${emailContent}"

Available Contacts:
${JSON.stringify(contacts.map(c => ({
  name: c.first_name + ' ' + c.last_name,
  title: c.title,
  department: c.department,
  response_rate: c.engagement_score || 0.5,
})), null, 2)}

Organizational Structure:
${JSON.stringify(orgMap.structure_data, null, 2)}

Routing Goal: ${goal}

Please recommend the optimal email routing path and return JSON:
{
  "path": [
    {
      "contact_name": "name",
      "reason": "why this contact",
      "order": 1
    }
  ],
  "strategy": "explanation of routing strategy",
  "confidence_score": 0.0-1.0,
  "expected_success_rate": 0.0-1.0
}`;

  try {
    const response = await deepSeekService.makeRequest({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are an expert email routing strategist. Recommend optimal contact paths based on organizational intelligence.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    // Fallback routing
    return {
      path: contacts.slice(0, 2).map((c, i) => ({
        contact_name: c.first_name + ' ' + c.last_name,
        reason: i === 0 ? 'High response rate' : 'Decision maker',
        order: i + 1,
      })),
      strategy: 'Standard routing through most responsive contact',
      confidence_score: 0.6,
      expected_success_rate: 0.4,
    };
  } catch (error) {
    console.error('Error generating email routing:', error);
    return {
      path: [],
      strategy: 'Unable to generate routing recommendation',
      confidence_score: 0.1,
      expected_success_rate: 0.2,
    };
  }
}