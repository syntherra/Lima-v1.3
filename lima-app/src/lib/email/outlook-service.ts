import config from '@/lib/config';

export class OutlookService {
  private accessToken: string;
  private refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  async getMessages(top: number = 50) {
    try {
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/messages?$top=${top}&$orderby=receivedDateTime desc`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Outlook messages:', error);
      throw error;
    }
  }

  async getMessage(messageId: string) {
    try {
      const response = await fetch(`https://graph.microsoft.com/v1.0/me/messages/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching Outlook message:', error);
      throw error;
    }
  }

  async sendMessage(message: {
    to: string[];
    subject: string;
    body: string;
  }) {
    try {
      const emailMessage = {
        message: {
          subject: message.subject,
          body: {
            contentType: 'HTML',
            content: message.body,
          },
          toRecipients: message.to.map(email => ({
            emailAddress: { address: email },
          })),
        },
      };

      const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailMessage),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending Outlook message:', error);
      throw error;
    }
  }

  async refreshAccessToken() {
    try {
      const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: config.oauth.microsoft.clientId!,
          client_secret: config.oauth.microsoft.clientSecret!,
          refresh_token: this.refreshToken,
          grant_type: 'refresh_token',
          scope: 'Mail.ReadWrite Mail.Send',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh access token');
      }

      const tokens = await response.json();
      this.accessToken = tokens.access_token;
      
      return tokens;
    } catch (error) {
      console.error('Error refreshing Outlook access token:', error);
      throw error;
    }
  }
}