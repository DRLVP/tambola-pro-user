
import { SignIn } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router';

export default function UserSignInPage() {
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard';

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-in"
        forceRedirectUrl={redirectUrl}
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-card text-card-foreground',
          }
        }}
      />
    </div>
  );
}
