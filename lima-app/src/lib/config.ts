// Environment configuration and validation

const requiredEnvVars = {
  development: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ],
  production: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'DEEPSEEK_API_KEY',
    'RESEND_API_KEY',
    'NEXTAUTH_SECRET',
  ],
};

const optionalEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'MICROSOFT_CLIENT_ID',
  'MICROSOFT_CLIENT_SECRET',
  'MICROSOFT_TENANT_ID',
  'HUNTER_API_KEY',
  'APOLLO_API_KEY',
  'CLEARBIT_API_KEY',
  'REDIS_URL',
  'SENTRY_DSN',
  'VERCEL_ANALYTICS_ID',
];

export const config = {
  // App settings
  app: {
    name: 'Lima',
    description: 'AI-powered growth operating system',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },

  // Database
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // AI Services
  ai: {
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
      model: 'deepseek-chat',
      maxTokens: 4000,
      temperature: 0.7,
    },
  },

  // Email Services
  email: {
    resend: {
      apiKey: process.env.RESEND_API_KEY,
      fromAddress: 'lia@lima.ai',
      replyToAddress: 'noreply@lima.ai',
    },
    warming: {
      initialDailyLimit: 5,
      maxDailyLimit: 50,
      incrementDays: 21,
      incrementAmount: 2,
    },
  },

  // OAuth Providers
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scopes: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/calendar',
      ],
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      tenantId: process.env.MICROSOFT_TENANT_ID,
      scopes: [
        'User.Read',
        'Mail.ReadWrite',
        'Mail.Send',
        'Calendars.ReadWrite',
      ],
    },
  },

  // Third-party APIs
  thirdParty: {
    hunter: {
      apiKey: process.env.HUNTER_API_KEY,
      baseUrl: 'https://api.hunter.io/v2',
    },
    apollo: {
      apiKey: process.env.APOLLO_API_KEY,
      baseUrl: 'https://api.apollo.io/v1',
    },
    clearbit: {
      apiKey: process.env.CLEARBIT_API_KEY,
      baseUrl: 'https://person.clearbit.com/v2',
    },
  },

  // Redis (for caching)
  redis: {
    url: process.env.REDIS_URL,
    defaultTtl: 3600, // 1 hour
  },

  // Authentication
  auth: {
    secret: process.env.NEXTAUTH_SECRET,
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
    jwt: {
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  },

  // Rate limiting
  rateLimit: {
    requests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // File uploads
  uploads: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ],
  },

  // Monitoring
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    },
    vercel: {
      analyticsId: process.env.VERCEL_ANALYTICS_ID,
    },
  },

  // Features flags
  features: {
    voiceMatching: true,
    orgIntel: true,
    autonomousOutreach: true,
    realtimeUpdates: true,
    calendarSync: true,
    taskExtraction: true,
    inboxWarming: true,
  },

  // Business rules
  business: {
    maxCampaignsPerUser: 10,
    maxContactsPerCampaign: 1000,
    maxEmailsPerDay: 50,
    maxFollowUps: 5,
    defaultTimezone: 'UTC',
    supportedTimezones: [
      'America/New_York',
      'America/Chicago',
      'America/Denver',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Australia/Sydney',
    ],
  },
};

// Environment validation
export const validateEnv = (): void => {
  const env = config.app.env as keyof typeof requiredEnvVars;
  const required = requiredEnvVars[env] || requiredEnvVars.development;
  
  const missing: string[] = [];
  
  required.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env.local file and ensure all required variables are set.`
    );
  }
};

// Feature flags
export const isFeatureEnabled = (feature: keyof typeof config.features): boolean => {
  return config.features[feature];
};

// Environment helpers
export const isDevelopment = (): boolean => config.app.env === 'development';
export const isProduction = (): boolean => config.app.env === 'production';
export const isTest = (): boolean => config.app.env === 'test';

// API endpoints
export const getApiUrl = (path: string): string => {
  const baseUrl = config.app.url;
  return `${baseUrl}/api${path.startsWith('/') ? path : `/${path}`}`;
};

// Default export
export default config;