import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import config from '@/lib/config';

export class GmailService {
  private auth: OAuth2Client;
  private gmail: any;

  constructor(accessToken: string, refreshToken: string) {
    this.auth = new google.auth.OAuth2(
      config.oauth.google.clientId,
      config.oauth.google.clientSecret,
      `${config.app.url}/auth/callback`
    );

    this.auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    this.gmail = google.gmail({ version: 'v1', auth: this.auth });
  }

  async getMessages(maxResults: number = 50, pageToken?: string) {
    try {
      const response = await this.gmail.users.messages.list({
        userId: 'me',
        maxResults,
        pageToken,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching Gmail messages:', error);
      throw error;
    }
  }

  async getMessage(messageId: string) {
    try {
      const response = await this.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching Gmail message:', error);
      throw error;
    }
  }

  async sendMessage(message: {
    to: string;
    subject: string;
    body: string;
    replyTo?: string;
    threadId?: string;
  }) {
    try {
      const email = this.createEmailMessage(message);
      
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: email,
          threadId: message.threadId,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error sending Gmail message:', error);
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await this.gmail.users.getProfile({
        userId: 'me',
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching Gmail profile:', error);
      throw error;
    }
  }

  async watchInbox() {
    try {
      const response = await this.gmail.users.watch({
        userId: 'me',
        requestBody: {
          topicName: `projects/${config.oauth.google.clientId}/topics/gmail`,
          labelIds: ['INBOX'],
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error setting up Gmail watch:', error);
      throw error;
    }
  }

  private createEmailMessage(message: {
    to: string;
    subject: string;
    body: string;
    replyTo?: string;
  }): string {
    const headers = [
      `To: ${message.to}`,
      `Subject: ${message.subject}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
    ];

    if (message.replyTo) {
      headers.push(`In-Reply-To: ${message.replyTo}`);
    }

    const email = [
      ...headers,
      '',
      message.body,
    ].join('\r\n');

    return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  }

  async refreshAccessToken() {
    try {
      const { credentials } = await this.auth.refreshAccessToken();
      this.auth.setCredentials(credentials);
      return credentials;
    } catch (error) {
      console.error('Error refreshing Gmail access token:', error);
      throw error;
    }
  }

  parseEmailHeaders(headers: any[]): Record<string, string> {
    const parsed: Record<string, string> = {};
    headers.forEach((header: any) => {
      parsed[header.name.toLowerCase()] = header.value;
    });
    return parsed;
  }

  extractEmailBody(payload: any): { html?: string; text?: string } {
    let html: string | undefined;
    let text: string | undefined;

    const findParts = (parts: any[]) => {
      parts.forEach((part: any) => {
        if (part.mimeType === 'text/html' && part.body?.data) {
          html = Buffer.from(part.body.data, 'base64').toString();
        } else if (part.mimeType === 'text/plain' && part.body?.data) {
          text = Buffer.from(part.body.data, 'base64').toString();
        } else if (part.parts) {
          findParts(part.parts);
        }
      });
    };

    if (payload.parts) {
      findParts(payload.parts);
    } else if (payload.body?.data) {
      if (payload.mimeType === 'text/html') {
        html = Buffer.from(payload.body.data, 'base64').toString();
      } else if (payload.mimeType === 'text/plain') {
        text = Buffer.from(payload.body.data, 'base64').toString();
      }
    }

    return { html, text };
  }
}