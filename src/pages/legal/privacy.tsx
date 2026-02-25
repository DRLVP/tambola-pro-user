import { Link } from 'react-router';
import { ArrowLeft, Shield, Eye, Lock, Database, Bell, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      'Account information (name, email address)',
      'Game activity and preferences',
      'Device and browser information',
      'Usage data and analytics',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      'To provide and improve our gaming services',
      'To communicate with you about your account',
      'To personalize your gaming experience',
      'To ensure fair play and prevent fraud',
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      'Industry-standard encryption for data transmission',
      'Secure storage of personal information',
      'Regular security audits and updates',
      'Limited access to personal data by authorized personnel only',
    ],
  },
  {
    icon: Users,
    title: 'Sharing Your Information',
    content: [
      'We do not sell your personal information',
      'Data may be shared with service providers who help operate our platform',
      'We may disclose information if required by law',
      'Aggregated, anonymized data may be used for research',
    ],
  },
  {
    icon: Bell,
    title: 'Your Rights',
    content: [
      'Access your personal data upon request',
      'Request correction of inaccurate information',
      'Request deletion of your account and data',
      'Opt-out of marketing communications',
    ],
  },
];

export function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 2026</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <Card className="mb-8 max-w-4xl mx-auto bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border-violet-200 dark:border-violet-800">
        <CardContent className="pt-6">
          <p className="text-lg leading-relaxed">
            At Tambola Pro, we take your privacy seriously. This policy explains how we collect, use,
            and protect your personal information when you use our gaming platform. By using Tambola Pro,
            you agree to the practices described in this policy.
          </p>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <span className="text-violet-500 mt-1">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}

        {/* Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage patterns,
              and remember your preferences. You can control cookie settings through your browser.
            </p>
            <p>
              Essential cookies are required for the platform to function properly. Analytics cookies
              help us understand how players use our service so we can make improvements.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Questions About Privacy?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or how we handle your data,
              please don't hesitate to contact us.
            </p>
            <Link to="/contact">
              <Button>Contact Us</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PrivacyPage;
