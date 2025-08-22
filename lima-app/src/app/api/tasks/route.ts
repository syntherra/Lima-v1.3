import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error in tasks API:', error);
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
    const { title, description, priority, project_id, due_date, extracted_from_email, email_id, ai_confidence_score } = body;

    if (!title?.trim() || !project_id) {
      return NextResponse.json({ error: 'Title and project ID are required' }, { status: 400 });
    }

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        title: title.trim(),
        description: description?.trim() || '',
        priority: priority || 'medium',
        project_id,
        due_date: due_date || null,
        status: 'pending',
        extracted_from_email: extracted_from_email || false,
        email_id: email_id || null,
        ai_confidence_score: ai_confidence_score || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('Error in tasks POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { task_id, status, title, description, priority, due_date } = body;

    if (!task_id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Verify task ownership through project
    const { data: task } = await supabase
      .from('tasks')
      .select(`
        id,
        project:projects(user_id)
      `)
      .eq('id', task_id)
      .single();

    if (!task || task.project?.user_id !== user.id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updateData: any = { updated_at: new Date().toISOString() };
    if (status !== undefined) updateData.status = status;
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (priority !== undefined) updateData.priority = priority;
    if (due_date !== undefined) updateData.due_date = due_date;

    const { data: updatedTask, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', task_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('Error in tasks PATCH API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}