import React, { useState } from 'react';
import { GoogleIcon } from '../../components/ui/GoogleIcon';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { investors } from '../../data/users';

export const InvestorsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const allStages = Array.from(new Set(investors.flatMap(i => i.investmentStage)));
  const allInterests = Array.from(new Set(investors.flatMap(i => i.investmentInterests)));

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = searchQuery === '' ||
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.investmentInterests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStages = selectedStages.length === 0 ||
      investor.investmentStage.some(s => selectedStages.includes(s));

    const matchesInterests = selectedInterests.length === 0 ||
      investor.investmentInterests.some(i => selectedInterests.includes(i));

    return matchesSearch && matchesStages && matchesInterests;
  });

  const toggleStage = (stage: string) => {
    setSelectedStages(prev => prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]);
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);
  };

  return (
    <div className="space-y-6 page-entrance">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded bg-primary-50 flex items-center justify-center flex-shrink-0">
          <GoogleIcon icon="attach_money" size={22} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Find Investors</h1>
          <p className="text-sm text-gray-500 mt-0.5">Connect with investors who match your startup</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
                <div className="flex items-center gap-2"><GoogleIcon icon="filter_list" size={18} className="text-primary-600" /><h2 className="text-sm font-semibold text-gray-900">Filters</h2></div>
            </CardHeader>
            <CardBody className="space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2"><GoogleIcon icon="trending_up" size={14} className="inline mr-1.5 text-primary-600 align-text-bottom" />Stage</h3>
                <div className="space-y-1">
                  {allStages.map(stage => (
                    <button
                      key={stage}
                      onClick={() => toggleStage(stage)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm ${
                        selectedStages.includes(stage)
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <GoogleIcon icon="trending_up" size={16} className="inline mr-1.5 text-gray-400 align-text-bottom" />{stage}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2"><GoogleIcon icon="favorite" size={14} className="inline mr-1.5 text-primary-600 align-text-bottom" />Interests</h3>
                <div className="flex flex-wrap gap-1.5">
                  {allInterests.map(interest => {
                    const iconMap: Record<string, string> = {
                      FinTech: 'account_balance',
                      SaaS: 'cloud',
                      'AI/ML': 'smart_toy',
                      CleanTech: 'energy_savings_leaf',
                      AgTech: 'agriculture',
                      Sustainability: 'eco',
                      HealthTech: 'biotech',
                      BioTech: 'science',
                      'Medical Devices': 'medical_services',
                    };
                    return (
                      <Badge
                        key={interest}
                        variant={selectedInterests.includes(interest) ? 'primary' : 'gray'}
                        className="cursor-pointer select-none"
                        onClick={() => toggleInterest(interest)}
                      >
                        <GoogleIcon icon={iconMap[interest] || 'favorite'} size={12} className="mr-0.5 align-text-bottom" />
                        {interest}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2"><GoogleIcon icon="location_on" size={14} className="inline mr-1.5 text-primary-600 align-text-bottom" />Location</h3>
                <div className="space-y-1">
                  {['San Francisco, CA', 'New York, NY', 'Boston, MA'].map((loc, i) => (
                    <button key={i} className="flex items-center w-full text-left px-3 py-2 rounded text-sm text-gray-600 hover:bg-gray-50">
                      <GoogleIcon icon="location_on" size={16} className="mr-2 text-gray-400" />
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search investors by name, interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={<GoogleIcon icon="search" size={18} />}
              fullWidth
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <GoogleIcon icon="filter_list" size={18} className="text-gray-400" />
              <span className="text-sm text-gray-500">{filteredInvestors.length} results</span>
            </div>
          </div>

          {filteredInvestors.length > 0 ? (
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-list">
            {filteredInvestors.map(investor => (
                <InvestorCard key={investor.id} investor={investor} />
              ))}
            </div>
          ) : (
            <Card>
              <CardBody className="text-center py-8">
                <p className="text-gray-500">No investors match your filters</p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
