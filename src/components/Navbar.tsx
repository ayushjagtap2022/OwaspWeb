import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '@/lib/store';
import { getRank } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => setUser(getCurrentUser());
    window.addEventListener('storage', check);
    const interval = setInterval(check, 500);
    return () => { window.removeEventListener('storage', check); clearInterval(interval); };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/');
    setIsMenuOpen(false);
  };

  const links = [
    { to: '', label: 'home' },
    // { to: 'challenges', label: 'challenges' },
    { to: 'archive', label: 'archive' },
  ];

  if (user?.role === 'admin') {
    links.push({ to: 'admin', label: 'admin' });
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="font-cyber capitalize sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo + Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
              <img
                src="/OwaspLogoWhite.png"
                alt="OWASP Logo"
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation - aligned left with logo */}
            <div className="hidden md:flex items-center gap-6">
              {links.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`text-base transition-colors ${location.pathname === l.to
                    ? 'text-terminal-green green-glow'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-base text-muted-foreground">
                  <span className="text-terminal-green">@{user.alias}</span>
                  {' '}
                  <span className={getRank(user.score).color}>[{getRank(user.score).name}]</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-base text-primary hover:text-primary/80 transition-colors"
                >
                  logout
                </button>
              </>
            ) : (
              <Link
                to="/register"
                className="text-base text-primary hover:text-primary/80 transition-colors"
              >
                register
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden z-50 p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="py-4 space-y-3 border-t border-border">
            {/* Mobile Navigation Links */}
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={closeMenu}
                className={`block px-4 py-2 text-base transition-colors ${location.pathname === l.to
                  ? 'text-terminal-green green-glow bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                {l.label}
              </Link>
            ))}

            {/* Mobile User Section */}
            <div className="px-4 pt-3 border-t border-border space-y-2">
              {user ? (
                <>
                  <div className="text-base text-muted-foreground py-2">
                    <span className="text-terminal-green">@{user.alias}</span>
                    {' '}
                    <span className={getRank(user.score).color}>[{getRank(user.score).name}]</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left py-2 text-base text-primary hover:text-primary/80 transition-colors"
                  >
                    logout
                  </button>
                </>
              ) : (
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block py-2 text-base text-primary hover:text-primary/80 transition-colors"
                >
                  register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
