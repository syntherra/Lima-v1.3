import { GmailService } from './gmail-service';
import { OutlookService } from './outlook-service';
import { supabase } from '@/lib/supabase';
import type { EmailAccount } from '@/types/database';

export class EmailServiceFactory {
  static async createService(emailAccount: EmailAccount) {
    if (!emailAccount.access_token) {
      throw new Error('No access token available for email account');
    }

    switch (emailAccount.provider) {
      case 'gmail':
        return new GmailService(
          emailAccount.access_token,
          emailAccount.refresh_token || ''
        );
      
      case 'outlook':
        return new OutlookService(
          emailAccount.access_token,
          emailAccount.refresh_token || ''
        );
      
      default:
        throw new Error(`Unsupported email provider: ${emailAccount.provider}`);
    }
  }

  static async syncEmails(userId: string, emailAccountId: string) {
    try {
      // Get email account
      const { data: emailAccount, error } = await supabase
        .from('email_accounts')
        .select('*')
        .eq('id', emailAccountId)
        .eq('user_id', userId)
        .single();

      if (error || !emailAccount) {
        throw new Error('Email account not found');
      }

      const service = await this.createService(emailAccount);
      
      // Get messages based on provider
      let messages;
      if (emailAccount.provider === 'gmail') {
        const gmailService = service as GmailService;
        const messageList = await gmailService.getMessages(50);
        messages = messageList.messages || [];
      } else if (emailAccount.provider === 'outlook') {
        const outlookService = service as OutlookService;
        const messageList = await outlookService.getMessages(50);
        messages = messageList.value || [];
      }

      // Process and store emails
      const processedEmails = [];
      for (const message of messages.slice(0, 10)) { // Limit to 10 for initial sync
        try {
          let emailData;
          if (emailAccount.provider === 'gmail') {
            const gmailService = service as GmailService;
            const fullMessage = await gmailService.getMessage(message.id);
            emailData = this.parseGmailMessage(fullMessage);
          } else {
            const outlookService = service as OutlookService;
            const fullMessage = await outlookService.getMessage(message.id);
            emailData = this.parseOutlookMessage(fullMessage);
          }

          if (emailData) {
            processedEmails.push(emailData);
          }
        } catch (error) {
          console.error(`Error processing message ${message.id}:`, error);
        }
      }

      // Update last synced timestamp
      await supabase
        .from('email_accounts')
        .update({ last_synced: new Date().toISOString() })
        .eq('id', emailAccountId);

      return { success: true, emailsProcessed: processedEmails.length };
    } catch (error) {
      console.error('Email sync error:', error);
      throw error;
    }
  }

  private static parseGmailMessage(message: any) {
    const headers = message.payload?.headers || [];
    const headerMap: Record<string, string> = {};
    headers.forEach((header: any) => {
      headerMap[header.name.toLowerCase()] = header.value;
    });

    const gmailService = new GmailService('', ''); // Temporary instance for parsing
    const body = gmailService.extractEmailBody(message.payload);

    return {
      external_id: message.id,
      subject: headerMap.subject || '',
      from_email: headerMap.from || '',
      to_email: headerMap.to || '',
      body_html: body.html,
      body_text: body.text,
      thread_id: message.threadId,
      sent_at: headerMap.date ? new Date(headerMap.date).toISOString() : null,
      direction: 'inbound' as const,
      headers: headerMap,
    };
  }

  private static parseOutlookMessage(message: any) {
    return {
      external_id: message.id,
      subject: message.subject || '',
      from_email: message.from?.emailAddress?.address || '',
      to_email: message.toRecipients?.[0]?.emailAddress?.address || '',
      body_html: message.body?.contentType === 'html' ? message.body.content : undefined,
      body_text: message.body?.contentType === 'text' ? message.body.content : undefined,
      thread_id: message.conversationId,
      sent_at: message.sentDateTime ? new Date(message.sentDateTime).toISOString() : null,
      direction: 'inbound' as const,
      headers: {
        'message-id': message.internetMessageId,
        'conversation-id': message.conversationId,
      },
    };
  }
}