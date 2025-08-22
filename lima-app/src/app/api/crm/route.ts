import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'companies';

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    if (type === 'companies') {
      // Get companies with contact counts
      const { data: companies, error } = await supabase
        .from('companies')
        .select(`
          *,
          contacts!inner(count)
        `)
        .eq('contacts.campaign_contacts.campaigns.user_id', userId);

      if (error) {
        console.error('Error fetching companies:', error);
        return NextResponse.json(
          { error: 'Failed to fetch companies' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: companies || [],
      });
    } else if (type === 'contacts') {
      // Get contacts with company information
      const { data: contacts, error } = await supabase
        .from('contacts')
        .select(`
          *,
          companies (
            id,
            name,
            domain,
            industry
          )
        `)
        .eq('campaign_contacts.campaigns.user_id', userId);

      if (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json(
          { error: 'Failed to fetch contacts' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: contacts || [],
      });
    }

    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('CRM API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data' },
        { status: 400 }
      );
    }

    if (type === 'company') {
      const { data: company, error } = await (supabase as any)
        .from('companies')
        .insert({
          name: data.name,
          domain: data.domain,
          size: data.size,
          industry: data.industry,
          location: data.location,
          funding_stage: data.funding_stage,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating company:', error);
        return NextResponse.json(
          { error: 'Failed to create company' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: company,
      });
    } else if (type === 'contact') {
      const { data: contact, error } = await (supabase as any)
        .from('contacts')
        .insert({
          company_id: data.company_id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          role: data.role,
          status: data.status || 'prospect',
          confidence_score: data.confidence_score || 50,
          source: data.source || 'manual',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating contact:', error);
        return NextResponse.json(
          { error: 'Failed to create contact' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: contact,
      });
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('CRM POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { type, id, data } = await request.json();

    if (!type || !id || !data) {
      return NextResponse.json(
        { error: 'Missing type, id, or data' },
        { status: 400 }
      );
    }

    if (type === 'company') {
      const { data: company, error } = await (supabase as any)
        .from('companies')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating company:', error);
        return NextResponse.json(
          { error: 'Failed to update company' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: company,
      });
    } else if (type === 'contact') {
      const { data: contact, error } = await (supabase as any)
        .from('contacts')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating contact:', error);
        return NextResponse.json(
          { error: 'Failed to update contact' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: contact,
      });
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('CRM PUT API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}