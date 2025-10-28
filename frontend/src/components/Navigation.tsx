import { useState } from 'react';
import { Shield, User, LogIn, Menu, X } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  currentPage: string;
  isLoggedIn: boolean;
  institutionName?: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function Navigation({ currentPage, isLoggedIn, institutionName, onNavigate, onLogout }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('graphene_token'); // ensure token is cleared
    onLogout?.();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Button
            variant="ghost"
            className="flex items-center p-0 h-auto hover:bg-transparent"
            onClick={() => handleNavigate('home')}
            aria-label="Graphene - Go to homepage"
          >
            <Shield className="h-8 w-8 text-[#1A237E] mr-3" />
            <span className="text-2xl font-bold text-[#1A237E] font-brand">Graphene</span>
          </Button>

          <div className="hidden md:flex items-center space-x-2">
            {['home', 'issuers', 'ledger', 'verify'].map((page) => (
              <Button
                key={page}
                onClick={() => onNavigate(page)}
                variant="ghost"
                className={`${currentPage === page ? 'text-[#1A237E] font-semibold bg-[#1A237E]/10' : 'text-gray-600 hover:text-[#1A237E] hover:bg-[#1A237E]/5'} transition-all duration-200`}
                aria-label={`Navigate to ${page} page`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page === 'home' ? 'Home' : page === 'issuers' ? 'Public Registry' : page === 'ledger' ? 'Blockchain Ledger' : 'Verify'}
              </Button>
            ))}

            <span className="text-gray-300">|</span>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-[#1A237E]" />
                  <span className="text-sm font-medium text-gray-700">{institutionName}</span>
                </div>
                <Button onClick={() => onNavigate('issue')} variant="outline" className="border-[#1A237E] text-[#1A237E] hover:bg-[#1A237E] hover:text-white">
                  Issue Certificate
                </Button>
                <Button onClick={handleLogout} variant="ghost" className="text-gray-600 hover:text-[#1A237E] hover:bg-[#1A237E]/5" aria-label="Log out">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button onClick={() => onNavigate('login')} variant="ghost" className="text-gray-600 hover:text-[#1A237E] hover:bg-[#1A237E]/5" aria-label="Login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button onClick={() => onNavigate('register')} className="bg-[#1A237E] hover:bg-[#0D47A1] text-white" aria-label="Register">
                  Register
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 p-2 hover:bg-gray-100"
              aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {['home', 'issuers', 'ledger', 'verify'].map((page) => (
                <Button
                  key={page}
                  onClick={() => handleNavigate(page)}
                  variant={currentPage === page ? 'default' : 'ghost'}
                  className={`w-full justify-start ${currentPage === page ? 'bg-[#1A237E] text-white' : 'text-gray-600 hover:text-[#1A237E] hover:bg-gray-50'}`}
                  aria-label={`Navigate to ${page} page`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page === 'home' ? 'Home' : page === 'issuers' ? 'Public Registry' : page === 'ledger' ? 'Blockchain Ledger' : 'Verify'}
                </Button>
              ))}

              <div className="border-t border-gray-200 pt-4 mt-4">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center px-3 py-2">
                      <User className="h-5 w-5 text-[#1A237E] mr-2" />
                      <span className="text-sm font-medium text-gray-700">{institutionName}</span>
                    </div>
                    <Button
                      onClick={() => handleNavigate('issue')}
                      variant={currentPage === 'issue' ? 'default' : 'ghost'}
                      className={`w-full justify-start ${currentPage === 'issue' ? 'bg-[#1A237E] text-white' : 'text-gray-600 hover:text-[#1A237E] hover:bg-gray-50'}`}
                      aria-label="Navigate to Issue Certificate page"
                      aria-current={currentPage === 'issue' ? 'page' : undefined}
                    >
                      Issue Certificate
                    </Button>
                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-gray-600 hover:text-[#1A237E] hover:bg-gray-50" aria-label="Log out">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button onClick={() => handleNavigate('login')} variant="ghost" className="w-full justify-start text-gray-600 hover:text-[#1A237E] hover:bg-gray-50" aria-label="Login">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                    <Button onClick={() => handleNavigate('register')} className="w-full justify-start bg-[#1A237E] text-white hover:bg-[#0D47A1]" aria-label="Register">
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
