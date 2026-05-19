import React, { useState } from 'react';
import { Search, Filter, DollarSign, TrendingUp, Users, Calendar, Plus } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

const statStyles = {
  primary: { bg: 'from-primary-500/10 to-primary-600/5', icon: 'text-primary-600', label: 'text-primary-700', value: 'text-primary-900' },
  secondary: { bg: 'from-secondary-500/10 to-secondary-600/5', icon: 'text-secondary-600', label: 'text-secondary-700', value: 'text-secondary-900' },
  accent: { bg: 'from-accent-500/10 to-accent-600/5', icon: 'text-accent-600', label: 'text-accent-700', value: 'text-accent-900' },
  success: { bg: 'from-success-500/10 to-success-600/5', icon: 'text-success-600', label: 'text-success-700', value: 'text-success-900' },
} as const;

interface Deal {
  id: number;
  startup: { name: string; logo: string; industry: string };
  amount: string;
  equity: string;
  status: string;
  stage: string;
  lastActivity: string;
}

const allDeals: Deal[] = [
  { id: 1, startup: { name: 'TechWave AI', logo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', industry: 'FinTech' }, amount: '$1.5M', equity: '15%', status: 'Due Diligence', stage: 'Series A', lastActivity: '2024-02-15' },
  { id: 2, startup: { name: 'GreenLife Solutions', logo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', industry: 'CleanTech' }, amount: '$2M', equity: '20%', status: 'Term Sheet', stage: 'Seed', lastActivity: '2024-02-10' },
  { id: 3, startup: { name: 'HealthPulse', logo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', industry: 'HealthTech' }, amount: '$800K', equity: '12%', status: 'Negotiation', stage: 'Pre-seed', lastActivity: '2024-02-05' },
];

export const DealsPage: React.FC = () => {
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

  const filteredDeals = allDeals.filter(deal => {
    const matchesSearch = searchQuery === '' ||
      deal.startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.startup.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.status.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(deal.status);
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total Investment', value: '$4.3M', icon: DollarSign, color: 'primary' as const },
    { label: 'Active Deals', value: '8', icon: TrendingUp, color: 'secondary' as const },
    { label: 'Portfolio Companies', value: '12', icon: Users, color: 'accent' as const },
    { label: 'Closed This Month', value: '2', icon: Calendar, color: 'success' as const },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-500 mt-0.5">Manage your investment pipeline</p>
        </div>
        <Button leftIcon={<Plus size={18} />}>Add Deal</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const s = statStyles[stat.color];
          return (
            <Card key={i} className={`bg-gradient-to-br ${s.bg} border-0 shadow-soft`}>
              <CardBody>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/80 shadow-sm">
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
            placeholder="Search deals by startup or industry..."
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
          <div className="flex items-center justify-between">
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
                <tbody className="divide-y divide-gray-50">
                  {filteredDeals.map(deal => (
                    <tr key={deal.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar src={deal.startup.logo} alt={deal.startup.name} size="sm" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{deal.startup.name}</div>
                            <div className="text-xs text-gray-500">{deal.startup.industry}</div>
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
              <p className="text-sm text-gray-500">No deals match your filters</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => { setSearchQuery(''); setSelectedStatus([]); }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
