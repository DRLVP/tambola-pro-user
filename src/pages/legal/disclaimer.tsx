import { Link } from 'react-router';
import { ArrowLeft, AlertTriangle, Info, Ban, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DisclaimerPage() {
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
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Disclaimer</h1>
            <p className="text-muted-foreground">Important information about Tambola Pro</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Main Disclaimer */}
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Entertainment Purpose Only
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg font-medium">
              Tambola Pro is a free-to-play online game designed purely for entertainment purposes.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span className="text-muted-foreground">No real money is involved in playing our games</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span className="text-muted-foreground">This is NOT a gambling platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span className="text-muted-foreground">No real money can be won or lost</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span className="text-muted-foreground">All winnings are virtual and have no monetary value</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* No Gambling */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <Ban className="h-5 w-5" />
              No Real Money Gambling
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              Tambola Pro does not offer, facilitate, or encourage real money gambling in any form.
              Our platform is designed as a social gaming experience where friends and family can
              enjoy the classic Tambola game together.
            </p>
            <p>
              If you or someone you know has a gambling problem, please seek help from professional
              organizations in your area.
            </p>
          </CardContent>
        </Card>

        {/* Age Requirement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Info className="h-5 w-5 text-blue-500" />
              Age Requirement
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              Users must be at least 18 years old (or the age of majority in their jurisdiction) to
              use Tambola Pro. By using our service, you confirm that you meet this requirement.
              We encourage parents and guardians to monitor their children's online activities.
            </p>
          </CardContent>
        </Card>

        {/* No Warranty */}
        <Card>
          <CardHeader>
            <CardTitle>No Warranty</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              Tambola Pro is provided "as is" and "as available" without any warranties of any kind,
              either express or implied, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Merchantability or fitness for a particular purpose</li>
              <li>Non-infringement of intellectual property rights</li>
              <li>Accuracy, reliability, or completeness of content</li>
              <li>Uninterrupted or error-free service</li>
            </ul>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              Under no circumstances shall Tambola Pro, its operators, directors, employees, or agents
              be liable for any direct, indirect, incidental, special, consequential, or punitive damages
              arising from your use of or inability to use the service.
            </p>
          </CardContent>
        </Card>

        {/* External Links */}
        <Card>
          <CardHeader>
            <CardTitle>External Links</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              Tambola Pro may contain links to external websites. We are not responsible for the content,
              privacy practices, or policies of any third-party websites. Access to external sites is at
              your own risk.
            </p>
          </CardContent>
        </Card>

        {/* Responsible Gaming */}
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-green-500" />
              Play Responsibly
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              While Tambola Pro is a free game without real money involved, we encourage all players
              to game responsibly:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Set time limits for your gaming sessions</li>
              <li>Take regular breaks</li>
              <li>Don't let gaming interfere with your daily responsibilities</li>
              <li>Remember that gaming should be fun, not stressful</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border-violet-200 dark:border-violet-800">
          <CardHeader>
            <CardTitle>Questions?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this disclaimer, please feel free to contact us.
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

export default DisclaimerPage;
