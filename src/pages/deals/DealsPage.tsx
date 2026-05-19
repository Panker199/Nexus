import React, { useState } from 'react';
import { Search, DollarSign, TrendingUp, Users, Calendar, Briefcase } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { deals, updateDealStatus } from '../../data/deals';
import { findUserById } from '../../data/users';
import { Deal } from '../../types';

const statStyles = {
  primary: { bg: 'bg-primary-50', icon: 'text-primary-600', label: 'text-primary-700', value: 'text-primary-900' },
  secondary: { bg: 'bg-gray-50', icon: 'text-gray-600', label: 'text-gray-700', value: 'text-gray-900' },
  accent: { bg: 'bg-amber-50', icon: 'text-amber-600', label: 'text-amber-700', value: 'text-amber-900' },
  success: { bg: 'bg-success-50', icon: 'text-success-600', label: 'text-success-700', value: 'text-success-900' },
} as const;

export const DealsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const statuses = ['Due Diligence', 'Term Sheet', 'Negotiation', 'Closed', 'Passed'];

  const toggleStatus = (status: string) => {
    setSelectedStatus(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
  };

  const getStatusVariant = (status: string) => {
    const map: Record<string, 'primary' | 'secondary' | 'accent' | 'success' | 'error'> = {
      'Due Diligence': 'primary',
      'Term Sheet': 'secondary',
      'Negotiation': 'accent',
      'Closed': 'success',
      'Passed': 'error',
    };
    return map[status] || 'gray';
  };

  const userDeals = user
    ? deals.filter(d => d.investorId === user.id || d.entrepreneurId === user.id)
    : [];

  const filteredDeals = userDeals.filter(deal => {
    const matchesSearch = searchQuery === '' ||
      deal.startupName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(deal.status);
    return matchesSearch && matchesStatus;
  });

  const totalInvestment = userDeals.reduce((sum, d) => {
    const num = parseFloat(d.amount.replace(/[$,MK]/g, m => m === 'M' ? '' : m === 'K' ? '' : ''));
    return sum + (isNaN(num) ? 0 : num * (d.amount.includes('M') ? 1 : d.amount.includes('K') ? 0.001 : 0));
  }, 0);

  const stats = [
    { label: 'Total Investment', value: `$${totalInvestment.toFixed(1)}M`, icon: DollarSign, color: 'primary' as const },
    { label: 'Active Deals', value: userDeals.filter(d => !['Closed', 'Passed'].includes(d.status)).length.toString(), icon: TrendingUp, color: 'secondary' as const },
    { label: 'Portfolio Companies', value: new Set(userDeals.map(d => d.startupName)).size.toString(), icon: Users, color: 'accent' as const },
    { label: 'Deals Pending', value: userDeals.filter(d => d.status === 'Due Diligence').length.toString(), icon: Calendar, color: 'success' as const },
  ];

  return (
    <div className="space-y-6 page-entrance">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-primary-50 flex items-center justify-center flex-shrink-0">
            <Briefcase size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Deals</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your investment pipeline</p>
          </div>
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
                  <div className="p-2.5 rounded bg-white">
                    <Icon size={18} className={s.icon} />
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${s.label}`}>{stat.label}</p>
                    <p className={`text-lg font-bold ${s.value} mt-0.5`}>{stat.value}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardBody className="space-y-4">
          <Input
            placeholder="Search deals by startup..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={<Search size={18} />}
            fullWidth
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mr-1">Status:</span>
            {statuses.map(status => (
              <Badge
                key={status}
                variant={selectedStatus.includes(status) ? getStatusVariant(status) : 'gray'}
                className="cursor-pointer select-none"
                onClick={() => toggleStatus(status)}
              >
                {status}
              </Badge>
            ))}
            {selectedStatus.length > 0 && (
              <button
                onClick={() => setSelectedStatus([])}
                className="text-xs text-gray-500 hover:text-gray-700 ml-1 underline"
              >
                Clear
              </button>
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-primary-600" />
            <h2 className="text-sm font-semibold text-gray-900">Active Deals</h2>
            <span className="text-xs text-gray-500">{filteredDeals.length} results</span>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {filteredDeals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Startup', 'Amount', 'Equity', 'Status', 'Stage', 'Last Activity', ''].map((h, i) => (
                      <th key={i} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 stagger-list">
                  {filteredDeals.map(deal => (
                    <tr key={deal.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={findUserById(deal.entrepreneurId)?.avatarUrl || ''}
                            alt={deal.startupName}
                            size="sm"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{deal.startupName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{deal.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{deal.equity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusVariant(deal.status)} size="sm">{deal.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{deal.stage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(deal.lastActivity).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button variant="outline" size="xs">Details</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="mx-auto w-12 h-12 rounded bg-gray-100 flex items-center justify-center mb-3">
                <DollarSign size={24} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No deals yet</p>
              <p className="text-xs text-gray-400 mt-1">Deals are automatically created when collaboration requests are accepted</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
