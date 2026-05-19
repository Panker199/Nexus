import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Walkthrough } from '../ui/Walkthrough';

export const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const walkthroughs: Record<string, { steps: { title: string; description: string }[]; storageKey: string }> = {
    '/dashboard/entrepreneur': {
      storageKey: 'entrepreneur_dash',
      steps: [
        { title: 'Your Dashboard', description: 'This is your command center. View pending requests, active deals, and startup metrics at a glance.' },
        { title: 'Stats Overview', description: 'Track your progress with key metrics like pending requests, connections, and wallet balance.' },
        { title: 'Find Investors', description: 'Use the sidebar to browse investors and send collaboration requests to fund your startup.' },
      ],
    },
    '/dashboard/investor': {
      storageKey: 'investor_dash',
      steps: [
        { title: 'Your Dashboard', description: 'Discover promising startups and manage your investment pipeline from one place.' },
        { title: 'Discover Startups', description: 'Search and filter startups by industry to find the best investment opportunities.' },
        { title: 'Manage Deals', description: 'Track your active deals and fund promising startups directly from the Deals page.' },
      ],
    },
  };

  const activeWalkthrough = walkthroughs[location.pathname];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded bg-primary-600 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden pt-16">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      {activeWalkthrough && (
        <Walkthrough steps={activeWalkthrough.steps} storageKey={activeWalkthrough.storageKey} />
      )}
    </div>
  );
};
