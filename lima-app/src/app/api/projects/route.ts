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

    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        tasks:tasks(count)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    // Calculate task counts and progress
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const { data: taskStats } = await supabase
          .from('tasks')
          .select('status')
          .eq('project_id', project.id);

        const totalTasks = taskStats?.length || 0;
        const completedTasks = taskStats?.filter(t => t.status === 'completed').length || 0;
        const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...project,
          task_count: totalTasks,
          progress_percentage: progressPercentage,
          team_members: 1, // For now, just the user
        };
      })
    );

    return NextResponse.json({ projects: projectsWithStats });
  } catch (error) {
    console.error('Error in projects API:', error);
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
    const { name, description, priority, due_date } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name: name.trim(),
        description: description?.trim() || '',
        priority: priority || 'medium',
        due_date: due_date || null,
        user_id: user.id,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error in projects POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}