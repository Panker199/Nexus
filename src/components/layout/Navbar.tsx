import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, Bell, MessageCircle, User, LogOut, Building2, CircleDollarSign, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { GoogleIcon } from '../ui/GoogleIcon';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { getUnreadCount } from '../../data/notifications';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { mode, toggle } = useTheme();
  const navigate = useNavigate();
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (user) {
      setNotifCount(getUnreadCount(user.id));
      const interval = setInterval(() => setNotifCount(getUnreadCount(user.id)), 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dashboardRoute = user?.role === 'entrepreneur'
    ? '/dashboard/entrepreneur'
    : '/dashboard/investor';

  const profileRoute = user
    ? `/profile/${user.role}/${user.id}`
    : '/login';

  const navLinks = [
    {
      icon: <LayoutDashboard size={18} />,
      text: 'Dashboard',
      path: dashboardRoute,
    },
    {
      icon: <MessageCircle size={18} />,
      text: 'Messages',
      path: user ? '/messages' : '/login',
    },
    {
      icon: (
        <div className="relative">
          <Bell size={18} />
          {notifCount > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-4 h-4 text-[8px] font-bold text-white bg-error-500 rounded-full">
              {notifCount > 9 ? '9+' : notifCount}
            </span>
          )}
        </div>
      ),
      text: 'Notifications',
      path: user ? '/notifications' : '/login',
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded bg-primary-600 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900">Nexus</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center">
            {user ? (
              <div className="flex items-center gap-1">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                  >
                    {link.icon}
                    {link.text}
                  </Link>
                ))}

                <button
                  onClick={toggle}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  <GoogleIcon icon={mode === 'dark' ? 'light_mode' : 'dark_mode'} size={18} />
                </button>

                <div className="w-px h-6 bg-gray-200 mx-2" />

                <Link
                  to={profileRoute}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded hover:bg-gray-100"
                >
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    size="sm"
                    status={user.isOnline ? 'online' : 'offline'}
                    ring
                  />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="ml-1 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login"><Button variant="ghost">Log in</Button></Link>
                <Link to="/register"><Button size="sm">Sign up</Button></Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-gray-50 rounded">
                  <Avatar src={user.avatarUrl} alt={user.name} size="md" status={user.isOnline ? 'online' : 'offline'} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>

                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.icon}
                    {link.text}
                  </Link>
                ))}

                <Link
                  to={profileRoute}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  Profile
                </Link>

                <button
                  onClick={() => { toggle(); setIsMenuOpen(false); }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded"
                >
                  <GoogleIcon icon={mode === 'dark' ? 'light_mode' : 'dark_mode'} size={18} />
                  {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>

                <div className="pt-2 mt-2 border-t border-gray-200">
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-error-600 hover:bg-error-50 rounded"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-3 py-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button variant="outline" fullWidth>Log in</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full">
                  <Button fullWidth>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
