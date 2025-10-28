// src/App.tsx
import { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import { IssuePage } from './components/IssuePage';
import { VerifyPage } from './components/VerifyPage';
import { IssuersPage } from './components/IssuersPage';
import { LedgerPage } from './components/LedgerPage';
import { Button } from './components/ui/button';
import { api, type LoginResponse } from './components/utils/api';

type Page = 'home' | 'register' | 'login' | 'issue' | 'verify' | 'issuers' | 'ledger';

interface UserSession {
  isLoggedIn: boolean;
  email: string;
  institutionName: string;
  issuerId: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userSession, setUserSession] = useState<UserSession>({
    isLoggedIn: false,
    email: '',
    institutionName: '',
    issuerId: '',
  });

  // restore session from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('graphene_user');
    if (raw) {
      try {
        const u = JSON.parse(raw) as LoginResponse;
        setUserSession({
          isLoggedIn: true,
          email: u.email,
          institutionName: u.institutionName,
          issuerId: u.issuerId,
        });
      } catch {
        // ignore
      }
    }
  }, []);

  const handleNavigate = (page: string) => setCurrentPage(page as Page);

  const handleLogout = () => {
    api.logout();
    setUserSession({ isLoggedIn: false, email: '', institutionName: '', issuerId: '' });
    setCurrentPage('home');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'login':
        return (
          <LoginPage
            onNavigate={handleNavigate}
            onLogin={(email: string, institutionName: string) => {
              try {
                const raw = localStorage.getItem('graphene_user');
                if (raw) {
                  const lr = JSON.parse(raw) as LoginResponse;
                  setUserSession({
                    isLoggedIn: true,
                    email: lr.email,
                    institutionName: lr.institutionName,
                    issuerId: lr.issuerId,
                  });
                } else {
                  setUserSession({ isLoggedIn: true, email, institutionName, issuerId: '' });
                }
                setCurrentPage('issue');
              } catch {
                setCurrentPage('login');
              }
            }}
          />
        );
      case 'issue':
        return (
          <IssuePage
            institutionName={userSession.institutionName}
            issuerId={userSession.issuerId}
            isLoggedIn={userSession.isLoggedIn}
            onNavigate={handleNavigate}
          />
        );
      case 'verify':
        return <VerifyPage onNavigate={handleNavigate} />;
      case 'issuers':
        return <IssuersPage onNavigate={handleNavigate} />;
      case 'ledger':
        return <LedgerPage onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#1A237E] text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      <Navigation
        currentPage={currentPage}
        isLoggedIn={userSession.isLoggedIn}
        institutionName={userSession.institutionName}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main id="main-content" className="relative" role="main">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#1A237E] rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span className="text-xl font-bold text-[#1A237E]">Graphene</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                The unbreakable platform for verified digital records. Built on blockchain technology to ensure immutable, tamper-proof, and transparent certificate
                verification.
              </p>
              <p className="text-sm text-gray-500">© 2024 Graphene. All rights reserved.</p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A237E] mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Button
                    variant="link"
                    onClick={() => handleNavigate('verify')}
                    className="h-auto p-0 text-left justify-start text-gray-600 hover:text-[#1A237E] transition-colors"
                    aria-label="Navigate to Certificate Verification"
                  >
                    Verify Certificate
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    onClick={() => handleNavigate('issuers')}
                    className="h-auto p-0 text-left justify-start text-gray-600 hover:text-[#1A237E] transition-colors"
                    aria-label="Navigate to Public Registry"
                  >
                    Public Registry
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    onClick={() => handleNavigate('ledger')}
                    className="h-auto p-0 text-left justify-start text-gray-600 hover:text-[#1A237E] transition-colors"
                    aria-label="Navigate to Blockchain Ledger"
                  >
                    Blockchain Ledger
                  </Button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[#1A237E] mb-4">For Institutions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Button
                    variant="link"
                    onClick={() => handleNavigate('register')}
                    className="h-auto p-0 text-left justify-start text-gray-600 hover:text-[#1A237E] transition-colors"
                    aria-label="Register your institution"
                  >
                    Register Institution
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    onClick={() => handleNavigate('login')}
                    className="h-auto p-0 text-left justify-start text-gray-600 hover:text-[#1A237E] transition-colors"
                    aria-label="Login as issuer"
                  >
                    Issuer Login
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    onClick={() => handleNavigate('issue')}
                    className="h-auto p-0 text-left justify-start text-gray-600 hover:text-[#1A237E] transition-colors"
                    aria-label="Issue new certificates"
                  >
                    Issue Certificates
                  </Button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-500">Powered by blockchain technology for maximum security and transparency</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

