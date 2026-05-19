import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Search, PlusCircle, ArrowRight, Send, Bell, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequest, NotificationItem } from '../../types';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';
import { getDealsForInvestor } from '../../data/deals';
import { getNotificationsForUser, getUnreadCount } from '../../data/notifications';

const statStyles = {
  primary: { bg: 'from-primary-500/10 to-primary-600/5', icon: 'text-primary-600', label: 'text-primary-700', value: 'text-primary-900' },
  secondary: { bg: 'from-secondary-500/10 to-secondary-600/5', icon: 'text-secondary-600', label: 'text-secondary-700', value: 'text-secondary-900' },
  accent: { bg: 'from-accent-500/10 to-accent-600/5', icon: 'text-accent-600', label: 'text-accent-700', value: 'text-accent-900' },
  success: { bg: 'from-success-500/10 to-success-600/5', icon: 'text-success-600', label: 'text-success-700', value: 'text-success-900' },
} as const;

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [showRequests, setShowRequests] = useState(false);
  const [sentRequests, setSentRequests] = useState<CollaborationRequest[]>([]);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState<NotificationItem[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    if (user) {
      setSentRequests(getRequestsFromInvestor(user.id));
      setUnreadNotifs(getUnreadCount(user.id));
      setRecentNotifs(getNotificationsForUser(user.id).slice(0, 3));
    }
  }, [user]);

  if (!user) return null;

  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch = searchQuery === '' ||
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustries.length === 0 ||
      selectedIndustries.includes(entrepreneur.industry);
    return matchesSearch && matchesIndustry;
  });

  const handleRequestUpdate = () => {
    if (user) {
      setSentRequests(getRequestsFromInvestor(user.id));
      setUnreadNotifs(getUnreadCount(user.id));
      setRecentNotifs(getNotificationsForUser(user.id).slice(0, 3));
    }
  };

  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));
  const deals = getDealsForInvestor(user.id);
  const acceptedCount = sentRequests.filter(r => r.status === 'accepted').length;
  const pendingCount = sentRequests.filter(r => r.status === 'pending').length;

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  const stats = [
    { label: 'Total Startups', value: entrepreneurs.length, icon: Users, color: 'primary' as const },
    { label: 'Industries', value: industries.length, icon: PieChart, color: 'secondary' as const },
    { label: 'Connections', value: acceptedCount, icon: TrendingUp, color: 'accent' as const },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Startups</h1>
          <p className="text-gray-500 mt-0.5">Find and connect with promising entrepreneurs</p>
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
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-soft-lg border border-gray-100 z-50 animate-fade-in-up">
                <div className="p-3 space-y-2">
                  {recentNotifs.map(n => (
                    <div key={n.id} className={`text-xs p-2 rounded-lg ${n.isRead ? '' : 'bg-primary-50'}`}>
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
          <Button
            variant={showRequests ? 'primary' : 'outline'}
            leftIcon={<Send size={18} />}
            onClick={() => setShowRequests(!showRequests)}
            className="relative"
          >
            My Requests
            {pendingCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-warning-500 rounded-full">
                {pendingCount}
              </span>
            )}
          </Button>
          <Link to="/entrepreneurs">
            <Button leftIcon={<PlusCircle size={18} />}>View All</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {showRequests && (
        <div className="animate-fade-in-up">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">My Collaboration Requests</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{sentRequests.length} total &middot; {pendingCount} pending &middot; {acceptedCount} accepted</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowRequests(false)}>Close</Button>
              </div>

              {sentRequests.length > 0 ? (
                <div className="space-y-3">
                  {sentRequests.map(request => (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestUpdate}
                      isInvestorView
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Send size={24} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">You haven't sent any requests yet</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {!showRequests && (
        <>
          <Card>
            <CardBody className="space-y-4">
              <Input
                placeholder="Search startups, industries, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                startAdornment={<Search size={18} />}
              />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mr-1">Industries:</span>
                {industries.map(industry => (
                  <Badge
                    key={industry}
                    variant={selectedIndustries.includes(industry) ? 'primary' : 'gray'}
                    className="cursor-pointer select-none"
                    onClick={() => toggleIndustry(industry)}
                  >
                    {industry}
                  </Badge>
                ))}
                {selectedIndustries.length > 0 && (
                  <button
                    onClick={() => setSelectedIndustries([])}
                    className="text-xs text-gray-500 hover:text-gray-700 ml-1 underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </CardBody>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Featured Startups</h2>
              <span className="text-sm text-gray-500">{filteredEntrepreneurs.length} results</span>
            </div>

            {filteredEntrepreneurs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntrepreneurs.map(entrepreneur => (
                  <EntrepreneurCard key={entrepreneur.id} entrepreneur={entrepreneur} />
                ))}
              </div>
            ) : (
              <Card>
                <CardBody className="text-center py-8">
                  <p className="text-gray-500">No startups match your filters</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => { setSearchQuery(''); setSelectedIndustries([]); }}
                  >
                    Clear filters
                  </Button>
                </CardBody>
              </Card>
            )}

            <Link to="/entrepreneurs" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Browse all startups <ArrowRight size={16} />
            </Link>
          </div>
        </>
      )}

      {deals.length > 0 && !showRequests && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Active Deals</h2>
            <Link to="/deals" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.slice(0, 3).map(deal => (
              <Card key={deal.id} className="border border-gray-100">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{deal.startupName}</span>
                    <Badge variant="primary" size="sm">{deal.status}</Badge>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{deal.amount}</span>
                    <span>{deal.equity} equity</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
