import React, { useState } from 'react';
import { GoogleIcon } from '../../components/ui/GoogleIcon';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { entrepreneurs } from '../../data/users';

export const EntrepreneursPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedFundingRange, setSelectedFundingRange] = useState<string[]>([]);

  const allIndustries = Array.from(new Set(entrepreneurs.map(e => e.industry)));
  const fundingRanges = ['< $500K', '$500K - $1M', '$1M - $5M', '> $5M'];

  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch = searchQuery === '' ||
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry = selectedIndustries.length === 0 ||
      selectedIndustries.includes(entrepreneur.industry);

    const matchesFunding = selectedFundingRange.length === 0 ||
      selectedFundingRange.some(range => {
        const amount = parseInt(entrepreneur.fundingNeeded.replace(/[^0-9]/g, ''));
        switch (range) {
          case '< $500K': return amount < 500;
          case '$500K - $1M': return amount >= 500 && amount <= 1000;
          case '$1M - $5M': return amount > 1000 && amount <= 5000;
          case '> $5M': return amount > 5000;
          default: return true;
        }
      });

    return matchesSearch && matchesIndustry && matchesFunding;
  });

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev => prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]);
  };

  const toggleFundingRange = (range: string) => {
    setSelectedFundingRange(prev => prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded bg-primary-50 flex items-center justify-center flex-shrink-0">
          <GoogleIcon icon="business" size={20} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Find Startups</h1>
          <p className="text-sm text-gray-500 mt-0.5">Discover promising startups looking for investment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2"><GoogleIcon icon="filter_list" size={18} className="text-primary-600" /><h2 className="text-sm font-semibold text-gray-900">Filters</h2></div>
            </CardHeader>
            <CardBody className="space-y-5">
              <div>
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2"><GoogleIcon icon="category" size={14} className="inline mr-1.5 text-primary-600 align-text-bottom" />Industry</h3>
                <div className="space-y-1">
                  {allIndustries.map(industry => {
                    const googleIcon: Record<string, string> = {
                      FinTech: 'account_balance',
                      CleanTech: 'energy_savings_leaf',
                      HealthTech: 'biotech',
                      AgTech: 'agriculture',
                    };
                    return (
                      <button
                        key={industry}
                        onClick={() => toggleIndustry(industry)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm ${
                          selectedIndustries.includes(industry)
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <GoogleIcon icon={googleIcon[industry] || 'business'} size={16} className="inline mr-1.5 text-gray-400 align-text-bottom" />
                        {industry}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2"><GoogleIcon icon="payments" size={14} className="inline mr-1.5 text-primary-600 align-text-bottom" />Funding Range</h3>
                <div className="space-y-1">
                  {fundingRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => toggleFundingRange(range)}
                      className={`block w-full text-left px-3 py-2 rounded text-sm ${
                        selectedFundingRange.includes(range)
                          ? 'bg-primary-50 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <GoogleIcon icon="payments" size={16} className="inline mr-1.5 text-gray-400 align-text-bottom" />{range}
                    </button>
                  ))}
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

        {/* Main */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search startups by name, industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={<GoogleIcon icon="search" size={18} />}
              fullWidth
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <GoogleIcon icon="filter_list" size={18} className="text-gray-400" />
              <span className="text-sm text-gray-500">{filteredEntrepreneurs.length} results</span>
            </div>
          </div>

          {filteredEntrepreneurs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEntrepreneurs.map(entrepreneur => (
                <EntrepreneurCard key={entrepreneur.id} entrepreneur={entrepreneur} />
              ))}
            </div>
          ) : (
            <Card>
              <CardBody className="text-center py-8">
                <p className="text-gray-500">No startups match your filters</p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
