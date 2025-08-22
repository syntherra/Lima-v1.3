'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useToast } from '@/components/providers/toast-provider';
import {
  Brain,
  FileText,
  TrendingUp,
  BarChart3,
  Zap,
  Eye,
  RefreshCw,
  Download,
  Upload,
  Palette,
  MessageSquare,
  Target
} from 'lucide-react';
import { cn } from '@/utils';

interface StyleProfile {
  id: string;
  user_id: string;
  tone: 'professional' | 'casual' | 'friendly' | 'formal' | 'conversational';
  formality_level: number; // 1-10 scale
  sentence_length: 'short' | 'medium' | 'long' | 'varied';
  vocabulary_complexity: 'simple' | 'moderate' | 'advanced' | 'technical';
  punctuation_style: 'minimal' | 'standard' | 'expressive';
  greeting_style: string;
  closing_style: string;
  common_phrases: string[];
  signature_words: string[];
  writing_patterns: any;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

interface WritingSample {
  id: string;
  text: string;
  type: 'email' | 'document' | 'note';
  analyzed: boolean;
  created_at: string;
}

export default function StyleMirror() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [styleProfile, setStyleProfile] = useState<StyleProfile | null>(null);
  const [writingSamples, setWritingSamples] = useState<WritingSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'samples' | 'matching'>('overview');
  const [newSampleText, setNewSampleText] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [mirroredEmail, setMirroredEmail] = useState('');

  useEffect(() => {
    if (user) {
      loadStyleProfile();
      loadWritingSamples();
    }
  }, [user]);

  const loadStyleProfile = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockProfile: StyleProfile = {
        id: '1',
        user_id: user?.id || '',
        tone: 'professional',
        formality_level: 7,
        sentence_length: 'varied',
        vocabulary_complexity: 'moderate',
        punctuation_style: 'standard',
        greeting_style: 'Hi [Name],',
        closing_style: 'Best regards,',
        common_phrases: [
          'I hope this email finds you well',
          'Please let me know if you have any questions',
          'Looking forward to hearing from you',
          'Thank you for your time',
          'I wanted to follow up on'
        ],
        signature_words: [
          'opportunity',
          'collaboration',
          'partnership',
          'innovative',
          'streamline'
        ],
        writing_patterns: {
          avg_sentence_length: 18.5,
          passive_voice_percentage: 15,
          question_frequency: 0.12,
          exclamation_frequency: 0.03,
          paragraph_length: 'medium',
          transition_words_usage: 'frequent'
        },
        confidence_score: 0.87,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setStyleProfile(mockProfile);
    } catch (err) {
      error('Failed to load style profile');
    } finally {
      setLoading(false);
    }
  };

  const loadWritingSamples = async () => {
    try {
      // Mock writing samples
      const mockSamples: WritingSample[] = [
        {
          id: '1',
          text: 'Hi Sarah, I hope this email finds you well. I wanted to follow up on our conversation about the potential partnership opportunity. Based on our discussion, I believe there could be significant value in exploring how our platforms might integrate...',
          type: 'email',
          analyzed: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        },
        {
          id: '2',
          text: 'Thank you for taking the time to speak with me yesterday. The demo was incredibly insightful, and I can see how this solution would streamline our current workflow. I have a few questions about the implementation timeline...',
          type: 'email',
          analyzed: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        },
        {
          id: '3',
          text: 'Quick update on the Q1 campaign performance. We\'ve seen a 23% increase in response rates compared to last quarter, which is fantastic news. The new personalization features seem to be making a real difference...',
          type: 'document',
          analyzed: false,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
      ];
      
      setWritingSamples(mockSamples);
    } catch (err) {
      error('Failed to load writing samples');
    }
  };

  const analyzeNewSample = async () => {
    if (!newSampleText.trim()) {
      error('Please enter some text to analyze');
      return;
    }

    try {
      setAnalyzing(true);
      
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newSample: WritingSample = {
        id: Date.now().toString(),
        text: newSampleText,
        type: 'note',
        analyzed: true,
        created_at: new Date().toISOString(),
      };
      
      setWritingSamples(prev => [newSample, ...prev]);
      setNewSampleText('');
      success('Writing sample analyzed and added to your profile');
      
      // Update style profile confidence
      if (styleProfile) {
        setStyleProfile(prev => prev ? {
          ...prev,
          confidence_score: Math.min(0.95, prev.confidence_score + 0.03),
          updated_at: new Date().toISOString(),
        } : null);
      }
    } catch (err) {
      error('Failed to analyze writing sample');
    } finally {
      setAnalyzing(false);
    }
  };

  const generateMirroredEmail = async () => {
    if (!testEmail.trim()) {
      error('Please enter an email to mirror');
      return;
    }

    try {
      setAnalyzing(true);
      
      // Simulate AI style mirroring
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mirrored = `Hi there,

I hope this email finds you well. I wanted to follow up on the opportunity we discussed. Based on our conversation, I believe there could be significant value in exploring this further.

The solution you mentioned sounds innovative and could really streamline our current processes. I'm particularly interested in how it might help us scale our outreach efforts while maintaining that personal touch.

Would you be available for a quick call this week to discuss the next steps? I'd love to dive deeper into the implementation timeline and partnership possibilities.

Looking forward to hearing from you.

Best regards,
[Your Name]`;
      
      setMirroredEmail(mirrored);
      success('Email mirrored to match your writing style');
    } catch (err) {
      error('Failed to generate mirrored email');
    } finally {
      setAnalyzing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'samples', label: 'Samples', icon: FileText },
    { id: 'matching', label: 'Style Matching', icon: Target },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Style Mirror</h1>
            <p className="text-gray-600">AI-powered writing style analysis and voice matching</p>
          </div>
        </div>

        {styleProfile && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-purple-900">Style Confidence Score</div>
                <div className="text-2xl font-bold text-purple-700">
                  {Math.round(styleProfile.confidence_score * 100)}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-600">
                  {writingSamples.filter(s => s.analyzed).length} samples analyzed
                </div>
                <div className="text-xs text-purple-500">
                  Last updated: {new Date(styleProfile.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && styleProfile && (
        <StyleOverview profile={styleProfile} />
      )}

      {activeTab === 'analysis' && styleProfile && (
        <StyleAnalysis profile={styleProfile} />
      )}

      {activeTab === 'samples' && (
        <WritingSamplesTab
          samples={writingSamples}
          newSampleText={newSampleText}
          setNewSampleText={setNewSampleText}
          onAnalyze={analyzeNewSample}
          analyzing={analyzing}
        />
      )}

      {activeTab === 'matching' && (
        <StyleMatchingTab
          testEmail={testEmail}
          setTestEmail={setTestEmail}
          mirroredEmail={mirroredEmail}
          onGenerate={generateMirroredEmail}
          analyzing={analyzing}
        />
      )}
    </div>
  );
}

interface StyleOverviewProps {
  profile: StyleProfile;
}

function StyleOverview({ profile }: StyleOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Style Characteristics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Style Characteristics</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tone</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {profile.tone}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Formality Level</span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${profile.formality_level * 10}%` }}
                />
              </div>
              <span className="text-sm text-gray-700">{profile.formality_level}/10</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Sentence Length</span>
            <span className="text-gray-900 font-medium">{profile.sentence_length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Vocabulary</span>
            <span className="text-gray-900 font-medium">{profile.vocabulary_complexity}</span>
          </div>
        </div>
      </div>

      {/* Common Patterns */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Patterns</h3>
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-700">Greeting Style</span>
            <p className="text-gray-600 mt-1">{profile.greeting_style}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Closing Style</span>
            <p className="text-gray-600 mt-1">{profile.closing_style}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Signature Words</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.signature_words.map((word, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm"
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Common Phrases */}
      <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Used Phrases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {profile.common_phrases.map((phrase, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <p className="text-gray-700 text-sm">"{phrase}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StyleAnalysisProps {
  profile: StyleProfile;
}

function StyleAnalysis({ profile }: StyleAnalysisProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Writing Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Writing Metrics</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Avg. Sentence Length</span>
            <span className="text-gray-900 font-medium">
              {profile.writing_patterns.avg_sentence_length} words
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Passive Voice Usage</span>
            <span className="text-gray-900 font-medium">
              {profile.writing_patterns.passive_voice_percentage}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Question Frequency</span>
            <span className="text-gray-900 font-medium">
              {Math.round(profile.writing_patterns.question_frequency * 100)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Exclamation Usage</span>
            <span className="text-gray-900 font-medium">
              {Math.round(profile.writing_patterns.exclamation_frequency * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Style Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Style Insights</h3>
        <div className="space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Strength</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your writing has a consistent professional tone that builds trust.
            </p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Opportunity</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Consider varying sentence length more to improve readability.
            </p>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Style Note</span>
            </div>
            <p className="text-sm text-purple-700 mt-1">
              Your signature phrases create a recognizable voice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface WritingSamplesTabProps {
  samples: WritingSample[];
  newSampleText: string;
  setNewSampleText: (text: string) => void;
  onAnalyze: () => void;
  analyzing: boolean;
}

function WritingSamplesTab({ 
  samples, 
  newSampleText, 
  setNewSampleText, 
  onAnalyze, 
  analyzing 
}: WritingSamplesTabProps) {
  return (
    <div className="space-y-6">
      {/* Add New Sample */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Writing Sample</h3>
        <div className="space-y-4">
          <textarea
            value={newSampleText}
            onChange={(e) => setNewSampleText(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            placeholder="Paste an email, document, or any text you've written to improve your style profile..."
          />
          <button
            onClick={onAnalyze}
            disabled={analyzing || !newSampleText.trim()}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {analyzing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Brain className="h-4 w-4" />
            )}
            <span>{analyzing ? 'Analyzing...' : 'Analyze Sample'}</span>
          </button>
        </div>
      </div>

      {/* Existing Samples */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Writing Samples</h3>
        <div className="space-y-4">
          {samples.map((sample) => (
            <div
              key={sample.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    'px-2 py-1 rounded text-xs font-medium',
                    sample.type === 'email' 
                      ? 'bg-blue-100 text-blue-800'
                      : sample.type === 'document'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                  )}>
                    {sample.type}
                  </span>
                  {sample.analyzed && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                      Analyzed
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(sample.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 text-sm line-clamp-3">
                {sample.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StyleMatchingTabProps {
  testEmail: string;
  setTestEmail: (text: string) => void;
  mirroredEmail: string;
  onGenerate: () => void;
  analyzing: boolean;
}

function StyleMatchingTab({ 
  testEmail, 
  setTestEmail, 
  mirroredEmail, 
  onGenerate, 
  analyzing 
}: StyleMatchingTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Style Matching Test</h3>
        <p className="text-gray-600 mb-4">
          Enter any email content and we'll rewrite it to match your personal writing style.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Email
            </label>
            <textarea
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Paste an email here to see it rewritten in your style..."
            />
            <button
              onClick={onGenerate}
              disabled={analyzing || !testEmail.trim()}
              className="mt-4 flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {analyzing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Target className="h-4 w-4" />
              )}
              <span>{analyzing ? 'Mirroring...' : 'Mirror Style'}</span>
            </button>
          </div>

          {/* Output */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Style-Matched Email
            </label>
            <div className="relative">
              <textarea
                value={mirroredEmail}
                readOnly
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                placeholder="Style-matched email will appear here..."
              />
              {mirroredEmail && (
                <button className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600">
                  <Download className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}