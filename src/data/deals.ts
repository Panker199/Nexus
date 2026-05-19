import { Deal } from '../types';
import { findUserById } from './users';

export const deals: Deal[] = [
  {
    id: 'deal1',
    requestId: 'req2',
    startupName: 'TechWave AI',
    investorId: 'i2',
    entrepreneurId: 'e1',
    amount: '$1.5M',
    equity: '15%',
    status: 'Due Diligence',
    stage: 'Series A',
    lastActivity: '2025-05-15T10:00:00Z',
    createdAt: '2025-04-10T08:00:00Z'
  },
  {
    id: 'deal2',
    requestId: 'req4',
    startupName: 'GreenLife Solutions',
    investorId: 'i2',
    entrepreneurId: 'e2',
    amount: '$2M',
    equity: '20%',
    status: 'Term Sheet',
    stage: 'Seed',
    lastActivity: '2025-05-10T14:30:00Z',
    createdAt: '2025-03-28T11:00:00Z'
  },
];

export const createDealFromAcceptedRequest = (
  requestId: string,
  investorId: string,
  entrepreneurId: string
): Deal | null => {
  const entrepreneur = findUserById(entrepreneurId);
  if (!entrepreneur || entrepreneur.role !== 'entrepreneur') return null;

  const existing = deals.find(d => d.requestId === requestId);
  if (existing) return existing;

  const deal: Deal = {
    id: `deal${deals.length + 1}`,
    requestId,
    startupName: entrepreneur.startupName,
    investorId,
    entrepreneurId,
    amount: entrepreneur.fundingNeeded,
    equity: '15%',
    status: 'Due Diligence',
    stage: 'Seed',
    lastActivity: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  deals.push(deal);
  return deal;
};

export const getDealsForInvestor = (investorId: string): Deal[] => {
  return deals.filter(d => d.investorId === investorId);
};

export const getDealsForEntrepreneur = (entrepreneurId: string): Deal[] => {
  return deals.filter(d => d.entrepreneurId === entrepreneurId);
};

export const updateDealStatus = (dealId: string, status: string): Deal | null => {
  const index = deals.findIndex(d => d.id === dealId);
  if (index === -1) return null;
  deals[index] = { ...deals[index], status, lastActivity: new Date().toISOString() };
  return deals[index];
};
