import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home, Building2, CircleDollarSign, Users, MessageCircle,
  Bell, FileText, Settings, HelpCircle, Briefcase, Calendar, Video
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2.5 px-4 rounded text-sm font-medium ${
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <span className={({ isActive }: { isActive: boolean }) => isActive ? 'text-primary-600' : 'text-gray-400'}>
        {icon}
      </span>
      <span>{text}</span>
    </NavLink>
  );
};

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const entrepreneurItems = [
    { to: '/dashboard/entrepreneur', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/profile/entrepreneur/' + user.id, icon: <Building2 size={20} />, text: 'My Startup' },
    { to: '/investors', icon: <CircleDollarSign size={20} />, text: 'Find Investors' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/documents', icon: <FileText size={20} />, text: 'Documents' },
    { to: '/calendar', icon: <Calendar size={20} />, text: 'Calendar' },
    { to: '/video-call', icon: <Video size={20} />, text: 'Video Call' },
  ];

  const investorItems = [
    { to: '/dashboard/investor', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/profile/investor/' + user.id, icon: <Briefcase size={20} />, text: 'My Portfolio' },
    { to: '/entrepreneurs', icon: <Users size={20} />, text: 'Find Startups' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/deals', icon: <Briefcase size={20} />, text: 'Deals' },
    { to: '/calendar', icon: <Calendar size={20} />, text: 'Calendar' },
    { to: '/video-call', icon: <Video size={20} />, text: 'Video Call' },
  ];

  const sidebarItems = user.role === 'entrepreneur' ? entrepreneurItems : investorItems;
  const primaryItems = sidebarItems.slice(0, 3);
  const secondaryItems = sidebarItems.slice(3);

  const commonItems = [
    { to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
    { to: '/help', icon: <HelpCircle size={20} />, text: 'Help & Support' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col">
      <div className="flex-1 flex flex-col h-full overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {primaryItems.map((item, index) => (
            <SidebarItem key={index} to={item.to} icon={item.icon} text={item.text} />
          ))}
        </div>

        <div className="mt-6">
          <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Inbox</h3>
          <div className="mt-2 space-y-1">
            {secondaryItems.map((item, index) => (
              <SidebarItem key={index} to={item.to} icon={item.icon} text={item.text} />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">Support</h3>
          <div className="mt-2 space-y-1">
            {commonItems.map((item, index) => (
              <SidebarItem key={index} to={item.to} icon={item.icon} text={item.text} />
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="bg-blue-50 rounded p-3 border border-blue-200">
            <p className="text-xs font-semibold text-blue-800 mb-1">Pro Tip</p>
            <p className="text-xs text-blue-700">
              Complete your profile to get better matches with investors.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
