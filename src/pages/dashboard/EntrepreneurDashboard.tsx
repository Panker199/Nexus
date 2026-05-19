import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Calendar, TrendingUp, PlusCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequest } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { investors } from '../../data/users';

const statStyles = {
  primary: { bg: 'from-primary-500/10 to-primary-600/5', icon: 'text-primary-600', label: 'text-primary-700', value: 'text-primary-900' },
  secondary: { bg: 'from-secondary-500/10 to-secondary-600/5', icon: 'text-secondary-600', label: 'text-secondary-700', value: 'text-secondary-900' },
  accent: { bg: 'from-accent-500/10 to-accent-600/5', icon: 'text-accent-600', label: 'text-accent-700', value: 'text-accent-900' },
  success: { bg: 'from-success-500/10 to-success-600/5', icon: 'text-success-600', label: 'text-success-700', value: 'text-success-900' },
} as const;

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [recommendedInvestors] = useState(investors.slice(0, 3));

  useEffect(() => {
    if (user) {
      setCollaborationRequests(getRequestsForEntrepreneur(user.id));
    }
  }, [user]);

  const handleRequestStatusUpdate = (requestId: string, status: 'accepted' | 'rejected') => {
    setCollaborationRequests(prev =>
      prev.map(req => req.id === requestId ? { ...req, status } : req)
    );
  };

  if (!user) return null;

  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');

  const stats = [
    { label: 'Pending Requests', value: pendingRequests.length, icon: Bell, color: 'primary' as const },
    { label: 'Connections', value: collaborationRequests.filter(r => r.status === 'accepted').length, icon: Users, color: 'secondary' as const },
    { label: 'Meetings', value: '2', icon: Calendar, color: 'accent' as const },
    { label: 'Profile Views', value: '24', icon: TrendingUp, color: 'success' as const },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-gray-500 mt-0.5">Here's your startup overview today</p>
        </div>
        <Link to="/investors">
          <Button leftIcon={<PlusCircle size={18} />}>Find Investors</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const s = statStyles[stat.color];
          return (
            <Card key={i} className={`bg-gradient-to-br ${s.bg} border-0 shadow-soft`}>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/80 shadow-sm">
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
            <h2 className="text-lg font-semibold text-gray-900">Collaboration Requests</h2>
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
                <div className="mx-auto w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                  <Bell size={24} className="text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">No requests yet</h3>
                <p className="text-xs text-gray-500 mt-1">Investors will reach out when interested</p>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Recommended Investors</h2>
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
