import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Calendar, TrendingUp, PlusCircle, ArrowRight, Briefcase } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequest, NotificationItem } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { getDealsForEntrepreneur } from '../../data/deals';
import { getNotificationsForUser, getUnreadCount } from '../../data/notifications';
import { investors } from '../../data/users';

const statStyles = {
  primary: { bg: 'bg-primary-50', icon: 'text-primary-600', label: 'text-primary-700', value: 'text-primary-900' },
  secondary: { bg: 'bg-gray-50', icon: 'text-gray-600', label: 'text-gray-700', value: 'text-gray-900' },
  accent: { bg: 'bg-amber-50', icon: 'text-amber-600', label: 'text-amber-700', value: 'text-amber-900' },
  success: { bg: 'bg-success-50', icon: 'text-success-600', label: 'text-success-700', value: 'text-success-900' },
} as const;

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [recommendedInvestors] = useState(investors.slice(0, 3));
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState<NotificationItem[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (user) {
      setCollaborationRequests(getRequestsForEntrepreneur(user.id));
      setUnreadNotifs(getUnreadCount(user.id));
      setRecentNotifs(getNotificationsForUser(user.id).slice(0, 3));
    }
  }, [user]);

  const handleRequestStatusUpdate = (requestId: string) => {
    if (user) {
      setCollaborationRequests(getRequestsForEntrepreneur(user.id));
      setUnreadNotifs(getUnreadCount(user.id));
      setRecentNotifs(getNotificationsForUser(user.id).slice(0, 3));
    }
  };

  if (!user) return null;

  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');
  const deals = getDealsForEntrepreneur(user.id);

  const stats = [
    { label: 'Pending Requests', value: pendingRequests.length, icon: Bell, color: 'primary' as const },
    { label: 'Connections', value: collaborationRequests.filter(r => r.status === 'accepted').length, icon: Users, color: 'secondary' as const },
    { label: 'Active Deals', value: deals.length, icon: Briefcase, color: 'accent' as const },
    { label: 'Profile Views', value: '24', icon: TrendingUp, color: 'success' as const },
  ];

  return (
    <div className="space-y-6 page-entrance">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-primary-50 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Here's your startup overview today</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Button
              variant="outline"
              leftIcon={<Bell size={18} />}
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative"
            >
              Notifications
              {unreadNotifs > 0 && (
                <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-error-500 rounded-full">
                  {unreadNotifs}
                </span>
              )}
            </Button>
            {showNotifs && recentNotifs.length > 0 && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded border border-gray-200 shadow-dropdown z-50">
                <div className="p-3 space-y-2">
                  {recentNotifs.map(n => (
                    <div key={n.id} className={`text-xs p-2 rounded ${n.isRead ? '' : 'bg-primary-50'}`}>
                      <p className="text-gray-700">{n.content}</p>
                    </div>
                  ))}
                  <Link to="/notifications" className="block text-center text-xs text-primary-600 font-medium pt-1" onClick={() => setShowNotifs(false)}>
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link to="/investors">
            <Button leftIcon={<PlusCircle size={18} />}>Find Investors</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-list">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const s = statStyles[stat.color];
          return (
            <Card key={i} className={s.bg}>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded bg-white">
                    <Icon size={20} className={s.icon} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${s.label}`}>{stat.label}</p>
                    <h3 className={`text-xl font-bold ${s.value} mt-0.5`}>{stat.value}</h3>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Collaboration Requests</h2>
            </div>
            <Badge variant="primary" dot={pendingRequests.length > 0} pulse={pendingRequests.length > 0}>
              {pendingRequests.length} pending
            </Badge>
          </div>

          {collaborationRequests.length > 0 ? (
            <div className="space-y-3">
              {collaborationRequests.map(request => (
                <CollaborationRequestCard
                  key={request.id}
                  request={request}
                  onStatusUpdate={handleRequestStatusUpdate}
                />
              ))}
              <Link to="/investors" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors mt-2">
                View all investors <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <Card>
              <CardBody className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded bg-gray-100 flex items-center justify-center mb-3">
                  <Bell size={24} className="text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">No requests yet</h3>
                <p className="text-xs text-gray-500 mt-1">Investors will reach out when interested</p>
              </CardBody>
            </Card>
          )}

          {deals.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-primary-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Active Deals</h3>
                </div>
                <Link to="/deals" className="text-xs text-primary-600 hover:text-primary-700 font-medium">View all</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 stagger-list">
                {deals.slice(0, 2).map(deal => (
                  <Card key={deal.id}>
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900">{deal.startupName}</span>
                        <Badge variant="primary" size="sm">{deal.status}</Badge>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{deal.amount}</span>
                        <span>{deal.equity}</span>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recommended Investors</h2>
          </div>
          <div className="space-y-3">
            {recommendedInvestors.map(investor => (
              <InvestorCard key={investor.id} investor={investor} showActions={false} />
            ))}
          </div>
          <Link to="/investors">
            <Button variant="outline" fullWidth rightIcon={<ArrowRight size={16} />}>
              Browse All Investors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
