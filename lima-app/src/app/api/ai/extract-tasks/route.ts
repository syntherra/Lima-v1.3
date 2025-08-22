import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { DeepSeekService } from '@/lib/ai/deepseek-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { project_id, email_batch_size = 10 } = body;

    if (!project_id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Verify project ownership
    const { data: project } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get recent emails that haven't been processed for task extraction
    const { data: emails, error: emailsError } = await supabase
      .from('emails')
      .select('id, subject, body, from_contact_id, sent_at')
      .eq('is_processed_for_tasks', false)
      .order('sent_at', { ascending: false })
      .limit(email_batch_size);

    if (emailsError) {
      console.error('Error fetching emails:', emailsError);
      return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
    }

    if (!emails || emails.length === 0) {
      return NextResponse.json({ 
        message: 'No new emails to process',
        extracted_tasks: []
      });
    }

    const deepSeekService = new DeepSeekService();
    const extractedTasks = [];

    // Process each email for task extraction
    for (const email of emails) {
      try {
        const emailContent = `Subject: ${email.subject}\n\nBody: ${email.body}\n\nProject Context: ${project.name}`;
        const taskResult = await deepSeekService.extractTasks(emailContent);
        const tasks = taskResult.has_tasks ? taskResult.tasks : [];

        for (const taskData of tasks) {
          // Create task in database
          const { data: newTask, error: taskError } = await supabase
            .from('tasks')
            .insert({
              title: taskData.title,
              description: taskData.description,
              priority: taskData.priority,
              project_id: project_id,
              due_date: taskData.due_date,
              status: 'pending',
              extracted_from_email: true,
              email_id: email.id,
              ai_confidence_score: taskData.confidence,
            })
            .select()
            .single();

          if (!taskError && newTask) {
            extractedTasks.push(newTask);
          }
        }

        // Mark email as processed
        await supabase
          .from('emails')
          .update({ is_processed_for_tasks: true })
          .eq('id', email.id);

      } catch (error) {
        console.error(`Error processing email ${email.id}:`, error);
        // Continue with other emails even if one fails
      }
    }

    // Log AI action
    await supabase.from('ai_actions_log').insert({
      user_id: user.id,
      action_type: 'task_extraction',
      details: {
        emails_processed: emails.length,
        tasks_extracted: extractedTasks.length,
        project_id: project_id,
      },
      metadata: {
        batch_size: email_batch_size,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      message: `Successfully extracted ${extractedTasks.length} tasks from ${emails.length} emails`,
      extracted_tasks: extractedTasks,
      emails_processed: emails.length,
    });

  } catch (error) {
    console.error('Error in AI task extraction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}