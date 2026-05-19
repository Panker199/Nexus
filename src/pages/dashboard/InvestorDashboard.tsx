import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Search, PlusCircle, ArrowRight, Send, Bell, TrendingUp, Calendar, Briefcase, Wallet } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { GoogleIcon } from '../../components/ui/GoogleIcon';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequest, NotificationItem, Meeting } from '../../types';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';
import { getDealsForInvestor } from '../../data/deals';
import { getNotificationsForUser, getUnreadCount } from '../../data/notifications';
import { getUpcomingMeetings } from '../../data/meetings';
import { getWalletBalance } from '../../data/payments';

const statStyles = {
  primary: { bg: 'bg-primary-50', icon: 'text-primary-600', label: 'text-primary-700', value: 'text-primary-900' },
  secondary: { bg: 'bg-gray-50', icon: 'text-gray-600', label: 'text-gray-700', value: 'text-gray-900' },
  accent: { bg: 'bg-amber-50', icon: 'text-amber-600', label: 'text-amber-700', value: 'text-amber-900' },
  success: { bg: 'bg-success-50', icon: 'text-success-600', label: 'text-success-700', value: 'text-success-900' },
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
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    if (user) {
      setSentRequests(getRequestsFromInvestor(user.id));
      setUnreadNotifs(getUnreadCount(user.id));
      setRecentNotifs(getNotificationsForUser(user.id).slice(0, 3));
      setUpcomingMeetings(getUpcomingMeetings(user.id));
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
  const industryIcon: Record<string, string> = {
    FinTech: 'account_balance',
    CleanTech: 'energy_savings_leaf',
    HealthTech: 'biotech',
    AgTech: 'agriculture',
  };
  const deals = getDealsForInvestor(user.id);
  const acceptedCount = sentRequests.filter(r => r.status === 'accepted').length;
  const walletBalance = getWalletBalance(user.id);
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
    { label: 'Wallet Balance', value: `$${walletBalance}`, icon: Wallet, color: 'success' as const },
  ];

  return (
    <div className="space-y-6 page-entrance">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-primary-50 flex items-center justify-center flex-shrink-0">
            <TrendingUp size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Discover Startups</h1>
            <p className="text-sm text-gray-500 mt-0.5">Find and connect with promising entrepreneurs</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-list">
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

      {showRequests && (
        <div>
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Send size={18} className="text-primary-600" />
                    <h2 className="text-lg font-semibold text-gray-900">My Collaboration Requests</h2>
                  </div>
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
                    <GoogleIcon icon={industryIcon[industry] ?? 'business'} size={14} className="mr-0.5" />
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
              <div className="flex items-center gap-2">
                <Users size={18} className="text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Featured Startups</h2>
              </div>
              <span className="text-sm text-gray-500">{filteredEntrepreneurs.length} results</span>
            </div>

            {filteredEntrepreneurs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-list">
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
            <div className="flex items-center gap-2">
              <Briefcase size={18} className="text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Active Deals</h2>
            </div>
            <Link to="/deals" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-list">
            {deals.slice(0, 3).map(deal => (
              <Card key={deal.id}>
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

      {upcomingMeetings.length > 0 && !showRequests && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Meetings</h2>
              <Link to="/calendar" className="text-sm text-primary-600 hover:text-primary-700 font-medium">View all</Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-list">
            {upcomingMeetings.map(m => (
              <Card key={m.id}>
                <CardBody className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900">{m.title}</span>
                    <Badge variant={m.status === 'confirmed' ? 'success' : 'warning'} size="sm">{m.status}</Badge>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{m.date}</span>
                    <span>{m.startTime}–{m.endTime}</span>
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
