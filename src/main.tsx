import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { envConfig } from './lib/envConfig';
import { ClerkProvider } from '@clerk/clerk-react'


const clerkPublishableKey = envConfig.clerkPublishableKey;

if (!clerkPublishableKey) {
  throw new Error('Clerk publishable key is not defined');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)
