import { Link } from 'react-router';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Ban, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TermsPage() {
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
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 2026</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <Card className="mb-8 max-w-4xl mx-auto bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border-violet-200 dark:border-violet-800">
        <CardContent className="pt-6">
          <p className="text-lg leading-relaxed">
            Welcome to Tambola Pro! These Terms of Service govern your use of our gaming platform.
            By accessing or using Tambola Pro, you agree to be bound by these terms. Please read them carefully.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Acceptance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              By creating an account or using Tambola Pro, you acknowledge that you have read, understood,
              and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
            <p>
              You must be at least 18 years old (or the age of majority in your jurisdiction) to use this service.
              By using Tambola Pro, you represent that you meet this age requirement.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-blue-500" />
              Service Description
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              Tambola Pro is a free-to-play online Tambola (Housie/Bingo) gaming platform for entertainment
              purposes only. No real money is involved in any aspect of our games.
            </p>
            <p>Key points about our service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All games are free to play</li>
              <li>No real money gambling is involved</li>
              <li>Prizes, if any, are purely virtual or promotional</li>
              <li>We reserve the right to modify or discontinue services at any time</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              User Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">As a user of Tambola Pro, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the service in compliance with all applicable laws</li>
              <li>Respect other players and maintain a friendly gaming environment</li>
              <li>Report any bugs, glitches, or security vulnerabilities</li>
              <li>Not attempt to manipulate or exploit game mechanics</li>
            </ul>
          </CardContent>
        </Card>

        {/* Prohibited Activities */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <Ban className="h-5 w-5" />
              Prohibited Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">The following activities are strictly prohibited:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Creating multiple accounts</li>
              <li>Using automated bots or scripts</li>
              <li>Attempting to hack or exploit the platform</li>
              <li>Harassing or abusing other players</li>
              <li>Impersonating others or providing false information</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
            <p className="mt-4 text-red-600 dark:text-red-400">
              Violation of these terms may result in immediate account termination.
            </p>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              All content on Tambola Pro, including but not limited to text, graphics, logos, images,
              and software, is owned by Tambola Pro and protected by intellectual property laws.
            </p>
            <p>
              You may not copy, modify, distribute, or create derivative works from our content
              without explicit written permission.
            </p>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              Tambola Pro is provided "as is" without warranties of any kind. We do not guarantee
              uninterrupted or error-free service.
            </p>
            <p>
              To the maximum extent permitted by law, Tambola Pro shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of the service.
            </p>
          </CardContent>
        </Card>

        {/* Changes */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify users
              of significant changes through the platform or email. Continued use of the service after
              changes constitutes acceptance of the modified terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Questions?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us.
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

export default TermsPage;
