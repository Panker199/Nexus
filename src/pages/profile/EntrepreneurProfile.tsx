import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Users, Calendar, Building2, MapPin, UserCircle, FileText, DollarSign, Send, ArrowLeft, Target, Lightbulb } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { findUserById } from '../../data/users';
import { createCollaborationRequest, getRequestsFromInvestor } from '../../data/collaborationRequests';
import { Entrepreneur } from '../../types';

export const EntrepreneurProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();

  const entrepreneur = findUserById(id || '') as Entrepreneur | null;

  if (!entrepreneur || entrepreneur.role !== 'entrepreneur') {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 rounded bg-gray-100 flex items-center justify-center mb-4">
          <Building2 size={32} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Entrepreneur not found</h2>
        <p className="text-gray-500 mt-1">This profile doesn't exist or has been removed.</p>
        <Link to="/dashboard/investor">
          <Button variant="outline" className="mt-4">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isCurrentUser = currentUser?.id === entrepreneur.id;
  const isInvestor = currentUser?.role === 'investor';
  const hasRequestedCollaboration = isInvestor && id
    ? getRequestsFromInvestor(currentUser.id).some(req => req.entrepreneurId === id)
    : false;

  const handleSendRequest = () => {
    if (isInvestor && currentUser && id) {
      createCollaborationRequest(
        currentUser.id,
        id,
        `I'm interested in learning more about ${entrepreneur.startupName} and would like to explore potential investment opportunities.`
      );
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <Link to={isInvestor ? '/dashboard/investor' : '/investors'} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} />
        Back
      </Link>

      {/* Profile header */}
      <Card className="bg-white">
        <CardBody className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:gap-6 items-center sm:items-start">
              <Avatar
                src={entrepreneur.avatarUrl}
                alt={entrepreneur.name}
                size="xl"
                status={entrepreneur.isOnline ? 'online' : 'offline'}
                ring
              />
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{entrepreneur.name}</h1>
                <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                  <Building2 size={16} className="text-primary-500 flex-shrink-0" />
                  <span>Founder at {entrepreneur.startupName}</span>
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                  <Badge variant="primary">{entrepreneur.industry}</Badge>
                  <Badge variant="gray"><MapPin size={14} className="mr-1" />{entrepreneur.location}</Badge>
                  <Badge variant="accent"><Calendar size={14} className="mr-1" />Founded {entrepreneur.foundedYear}</Badge>
                  <Badge variant="secondary"><Users size={14} className="mr-1" />{entrepreneur.teamSize} members</Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:self-start">
              {!isCurrentUser && (
                <>
                  <Button
                    variant="outline"
                    leftIcon={<MessageCircle size={18} />}
                    onClick={() => window.location.href = `/chat/${entrepreneur.id}`}
                  >
                    Message
                  </Button>
                  {isInvestor && (
                    <Button leftIcon={<Send size={18} />} disabled={hasRequestedCollaboration} onClick={handleSendRequest}>
                      {hasRequestedCollaboration ? 'Request Sent' : 'Request Collaboration'}
                    </Button>
                  )}
                </>
              )}
              {isCurrentUser && (
                <Button variant="outline" leftIcon={<UserCircle size={18} />}>Edit Profile</Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb size={18} className="text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">About</h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 leading-relaxed">{entrepreneur.bio}</p>
            </CardBody>
          </Card>

          {/* Startup Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target size={18} className="text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Startup Overview</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                <div className="bg-primary-50 rounded p-4 border border-primary-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Problem Statement</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {entrepreneur.pitchSummary?.split('.')[0]}.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Solution</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{entrepreneur.pitchSummary}</p>
                </div>
                <div className="bg-amber-50 rounded p-4 border border-amber-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Market Opportunity</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    The {entrepreneur.industry} market is experiencing significant growth, with a projected CAGR of 14.5% through 2027.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Competitive Advantage</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    We combine innovative technology with deep industry expertise for superior outcomes.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Team</h2>
              <span className="text-xs text-gray-500">{entrepreneur.teamSize} members</span>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center p-3 border border-gray-200 rounded bg-gray-50">
                  <Avatar src={entrepreneur.avatarUrl} alt={entrepreneur.name} size="md" className="mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{entrepreneur.name}</h3>
                    <p className="text-xs text-gray-500">Founder & CEO</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-gray-200 rounded bg-gray-50">
                  <Avatar src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg" alt="Alex Johnson" size="md" className="mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Alex Johnson</h3>
                    <p className="text-xs text-gray-500">CTO</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-gray-200 rounded bg-gray-50">
                  <Avatar src="https://images.pexels.com/photos/773371/pexels-photo-773371.jpeg" alt="Jessica Chen" size="md" className="mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Jessica Chen</h3>
                    <p className="text-xs text-gray-500">Head of Product</p>
                  </div>
                </div>
                {entrepreneur.teamSize > 3 && (
                  <div className="flex items-center justify-center p-3 border border-dashed border-gray-300 rounded">
                    <p className="text-sm text-gray-500">+ {entrepreneur.teamSize - 3} more</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Funding */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-accent-600" />
                <h2 className="text-lg font-semibold text-gray-900">Funding</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="bg-amber-50 rounded p-4 border border-amber-100">
                <span className="text-xs text-gray-500">Current Round</span>
                <p className="text-xl font-bold text-gray-900 mt-0.5">{entrepreneur.fundingNeeded}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Valuation</span>
                <p className="text-sm font-semibold text-gray-900">$8M - $12M</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Previous Funding</span>
                <p className="text-sm font-semibold text-gray-900">$750K Seed (2022)</p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">Timeline</span>
                <div className="mt-2 space-y-2">
                  {[
                    { label: 'Pre-seed', status: 'Completed' as const, color: 'success' as const },
                    { label: 'Seed', status: 'Completed' as const, color: 'success' as const },
                    { label: 'Series A', status: 'In Progress' as const, color: 'warning' as const },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-700">{item.label}</span>
                      <Badge variant={item.color} size="sm">{item.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {['Pitch Deck', 'Business Plan', 'Financial Projections'].map((doc, i) => (
                  <div key={i} className="flex items-center p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                    <div className="p-2 bg-primary-50 rounded mr-3">
                      <FileText size={16} className="text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{doc}</h3>
                      <p className="text-xs text-gray-500">Updated 2 months ago</p>
                    </div>
                    <Button variant="ghost" size="xs">View</Button>
                  </div>
                ))}
              </div>
              {!isCurrentUser && isInvestor && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-3">Request access to detailed documents by sending a collaboration request.</p>
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={handleSendRequest}
                    disabled={hasRequestedCollaboration}
                  >
                    {hasRequestedCollaboration ? 'Request Sent' : 'Request Collaboration'}
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
