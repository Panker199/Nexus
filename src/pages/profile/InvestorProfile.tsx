import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Building2, MapPin, UserCircle, BarChart3, Briefcase, Target, ArrowLeft, Award } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { findUserById } from '../../data/users';
import { Investor } from '../../types';

export const InvestorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const investor = findUserById(id || '') as Investor | null;

  if (!investor || investor.role !== 'investor') {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 rounded bg-gray-100 flex items-center justify-center mb-4">
          <Building2 size={32} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Investor not found</h2>
        <p className="text-gray-500 mt-1">This profile doesn't exist or has been removed.</p>
        <Link to="/dashboard/entrepreneur" className="inline-flex items-center justify-center font-medium rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm px-4 py-2 mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isCurrentUser = currentUser?.id === investor.id;

  return (
    <div className="space-y-6">
      <Link to={currentUser?.role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/entrepreneurs'} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} /> Back
      </Link>

      {/* Profile header */}
      <Card className="bg-white">
        <CardBody className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:gap-6 items-center sm:items-start">
              <Avatar src={investor.avatarUrl} alt={investor.name} size="xl" status={investor.isOnline ? 'online' : 'offline'} ring />
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{investor.name}</h1>
                <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                  <Building2 size={16} className="text-secondary-500 flex-shrink-0" />
                  <span>Investor &bull; {investor.totalInvestments} investments</span>
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                  <Badge variant="primary"><MapPin size={14} className="mr-1" />San Francisco, CA</Badge>
                  {investor.investmentStage.map((stage, index) => (
                    <Badge key={index} variant="secondary" size="sm">{stage}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:self-start">
              {!isCurrentUser && (
                <Button
                  leftIcon={<MessageCircle size={18} />}
                  onClick={() => window.location.href = `/chat/${investor.id}`}
                >
                  Message
                </Button>
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
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award size={18} className="text-secondary-600" />
                <h2 className="text-lg font-semibold text-gray-900">About</h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700 leading-relaxed">{investor.bio}</p>
            </CardBody>
          </Card>

          {/* Investment Interests */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target size={18} className="text-secondary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Investment Interests</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-5">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Industries</h3>
                <div className="flex flex-wrap gap-2">
                  {investor.investmentInterests.map((interest, index) => (
                    <Badge key={index} variant="primary">{interest}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Stages</h3>
                <div className="flex flex-wrap gap-2">
                  {investor.investmentStage.map((stage, index) => (
                    <Badge key={index} variant="secondary">{stage}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Criteria</h3>
                <ul className="space-y-2">
                  {[
                    'Strong founding team with domain expertise',
                    'Clear market opportunity and product-market fit',
                    'Scalable business model with strong unit economics',
                    'Potential for significant growth and market impact',
                  ].map((criteria, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary-500 mt-1.5 flex-shrink-0" />
                      {criteria}
                    </li>
                  ))}
                </ul>
              </div>
            </CardBody>
          </Card>

          {/* Portfolio */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Briefcase size={18} className="text-secondary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Portfolio</h2>
              </div>
              <span className="text-xs text-gray-500">{investor.portfolioCompanies.length} companies</span>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {investor.portfolioCompanies.map((company, index) => (
                  <div key={index} className="flex items-center p-3 border border-gray-200 rounded bg-gray-50">
                    <div className="p-2.5 bg-gray-100 rounded mr-3">
                      <Building2 size={16} className="text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{company}</h3>
                      <p className="text-xs text-gray-500">Invested in 2022</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Investment Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-secondary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Details</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="bg-gray-50 rounded p-4 border border-gray-200">
                <span className="text-xs text-gray-500">Investment Range</span>
                <p className="text-lg font-bold text-gray-900 mt-0.5">{investor.minimumInvestment} - {investor.maximumInvestment}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Total Investments</span>
                <p className="text-sm font-semibold text-gray-900">{investor.totalInvestments} companies</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Typical Timeline</span>
                <p className="text-sm font-semibold text-gray-900">3-5 years</p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">Focus Areas</span>
                <div className="mt-3 space-y-3">
                  {[
                    { label: 'SaaS & B2B', width: '75%' },
                    { label: 'FinTech', width: '60%' },
                    { label: 'HealthTech', width: '40%' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{item.label}</span>
                        <span className="text-gray-500">{item.width}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: item.width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award size={18} className="text-accent-600" />
                <h2 className="text-lg font-semibold text-gray-900">Stats</h2>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {[
                { label: 'Successful Exits', value: '4', color: 'text-primary-700' },
                { label: 'Avg. ROI', value: '3.2x', color: 'text-secondary-700' },
                { label: 'Active Investments', value: investor.portfolioCompanies.length.toString(), color: 'text-accent-700' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center p-3 border border-gray-200 rounded bg-gray-50">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
