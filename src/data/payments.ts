import { Transaction } from '../types';
import { format, subDays } from 'date-fns';

const today = new Date();

export const transactions: Transaction[] = [
  { id: 't1', type: 'deposit', amount: '50,000.00', senderId: 'u_system', receiverId: 'u1', description: 'Wallet Deposit', status: 'completed', createdAt: format(subDays(today, 1), 'yyyy-MM-dd') },
  { id: 't2', type: 'transfer', amount: '10,000.00', senderId: 'u1', receiverId: 'u4', description: 'Seed Round Investment', status: 'completed', createdAt: format(subDays(today, 2), 'yyyy-MM-dd') },
  { id: 't3', type: 'funding', amount: '25,000.00', senderId: 'u4', receiverId: 'u1', description: 'Funding: TechWave AI', status: 'completed', createdAt: format(subDays(today, 3), 'yyyy-MM-dd') },
  { id: 't4', type: 'withdraw', amount: '5,000.00', senderId: 'u1', receiverId: 'u_system', description: 'Bank Withdrawal', status: 'pending', createdAt: format(subDays(today, 0), 'yyyy-MM-dd') },
  { id: 't5', type: 'deposit', amount: '100,000.00', senderId: 'u_system', receiverId: 'u2', description: 'Wallet Deposit', status: 'completed', createdAt: format(subDays(today, 5), 'yyyy-MM-dd') },
  { id: 't6', type: 'transfer', amount: '15,000.00', senderId: 'u2', receiverId: 'u5', description: 'Series A Funding', status: 'completed', createdAt: format(subDays(today, 4), 'yyyy-MM-dd') },
  { id: 't7', type: 'funding', amount: '75,000.00', senderId: 'u5', receiverId: 'u2', description: 'Funding: GreenLife Solutions', status: 'completed', createdAt: format(subDays(today, 6), 'yyyy-MM-dd') },
  { id: 't8', type: 'withdraw', amount: '2,000.00', senderId: 'u2', receiverId: 'u_system', description: 'Bank Withdrawal', status: 'failed', createdAt: format(subDays(today, 3), 'yyyy-MM-dd') },
];

export const getTransactionsForUser = (userId: string): Transaction[] =>
  transactions.filter(t => t.senderId === userId || t.receiverId === userId);

export const getWalletBalance = (userId: string): string => {
  const txs = getTransactionsForUser(userId);
  let balance = 0;
  for (const t of txs) {
    if (t.status !== 'completed') continue;
    const amt = parseFloat(t.amount.replace(/,/g, ''));
    if (t.receiverId === userId) balance += amt;
    if (t.senderId === userId) balance -= amt;
  }
  return balance.toLocaleString('en-US', { minimumFractionDigits: 2 });
};

export const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>): Transaction => {
  const t: Transaction = { ...tx, id: `t${Date.now()}`, createdAt: format(today, 'yyyy-MM-dd') };
  transactions.unshift(t);
  return t;
};
