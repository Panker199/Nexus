import React, { useState, useMemo } from 'react';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Plus,
  CreditCard, Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { getTransactionsForUser, getWalletBalance, addTransaction } from '../../data/payments';
import { findUserById, users } from '../../data/users';
import { Transaction, TransactionType } from '../../types';

const typeConfig: Record<TransactionType, { label: string; icon: React.ReactNode; variant: 'success' | 'warning' | 'primary' | 'accent' }> = {
  deposit: { label: 'Deposit', icon: <ArrowDownLeft size={16} />, variant: 'success' },
  withdraw: { label: 'Withdraw', icon: <ArrowUpRight size={16} />, variant: 'warning' },
  transfer: { label: 'Transfer', icon: <ArrowLeftRight size={16} />, variant: 'primary' },
  funding: { label: 'Funding', icon: <ArrowLeftRight size={16} />, variant: 'accent' },
};

const statusBadge: Record<string, { variant: 'success' | 'warning' | 'error'; label: string }> = {
  completed: { variant: 'success', label: 'Completed' },
  pending: { variant: 'warning', label: 'Pending' },
  failed: { variant: 'error', label: 'Failed' },
};

export const PaymentPage: React.FC = () => {
  const { user } = useAuth();
  const [action, setAction] = useState<'deposit' | 'withdraw' | 'transfer' | null>(null);
  const [form, setForm] = useState({ amount: '', recipientId: '', description: '' });

  if (!user) return null;

  const balance = getWalletBalance(user.id);
  const txs = useMemo(() => getTransactionsForUser(user.id), [user.id]);

  const otherUsers = users.filter(u => u.id !== user.id);

  const handleSubmit = () => {
    const amount = form.amount.replace(/[^0-9.]/g, '');
    if (!amount || parseFloat(amount) <= 0) return;

    if (action === 'deposit') {
      addTransaction({ type: 'deposit', amount, senderId: 'u_system', receiverId: user.id, description: form.description || 'Wallet Deposit', status: 'completed' });
    } else if (action === 'withdraw') {
      addTransaction({ type: 'withdraw', amount, senderId: user.id, receiverId: 'u_system', description: form.description || 'Bank Withdrawal', status: 'pending' });
    } else if (action === 'transfer' && form.recipientId) {
      addTransaction({ type: 'transfer', amount, senderId: user.id, receiverId: form.recipientId, description: form.description || 'Transfer', status: 'completed' });
    }
    setForm({ amount: '', recipientId: '', description: '' });
    setAction(null);
  };

  return (
    <div className="space-y-6 page-entrance">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-primary-50 flex items-center justify-center flex-shrink-0">
            <CreditCard size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payments</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your wallet and transactions</p>
          </div>
        </div>
      </div>

      {/* Wallet Balance */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary-50">
                <Wallet size={28} className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Wallet Balance</p>
                <p className="text-3xl font-bold text-gray-900">${balance}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setAction('deposit')} variant="success" leftIcon={<ArrowDownLeft size={18} />}>Deposit</Button>
              <Button onClick={() => setAction('withdraw')} variant="warning" leftIcon={<ArrowUpRight size={18} />}>Withdraw</Button>
              <Button onClick={() => setAction('transfer')} leftIcon={<ArrowLeftRight size={18} />}>Transfer</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary-600" />
            <h2 className="text-sm font-semibold text-gray-900">Transaction History</h2>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">From / To</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {txs.map(tx => {
                  const cfg = typeConfig[tx.type];
                  const s = statusBadge[tx.status];
                  const isIncoming = tx.receiverId === user.id;
                  const other = findUserById(isIncoming ? tx.senderId : tx.receiverId);
                  return (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded ${cfg.variant === 'success' ? 'bg-success-50 text-success-600' : cfg.variant === 'warning' ? 'bg-warning-50 text-warning-600' : cfg.variant === 'accent' ? 'bg-accent-50 text-accent-600' : 'bg-primary-50 text-primary-600'}`}>
                            {cfg.icon}
                          </span>
                          <span className="font-medium text-gray-900">{cfg.label}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-3 font-medium ${isIncoming ? 'text-success-600' : 'text-error-600'}`}>
                        {isIncoming ? '+' : '-'}${tx.amount}
                      </td>
                      <td className="px-6 py-3 text-gray-600">{other ? other.name : 'System'}</td>
                      <td className="px-6 py-3 text-gray-500 max-w-[180px] truncate">{tx.description}</td>
                      <td className="px-6 py-3 text-gray-500">{tx.createdAt}</td>
                      <td className="px-6 py-3 text-right"><Badge variant={s.variant} size="sm">{s.label}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Action Modal */}
      <Modal open={!!action} onClose={() => setAction(null)} title={action ? `${action.charAt(0).toUpperCase() + action.slice(1)} Funds` : ''} maxWidth="max-w-md">
        <div className="space-y-4">
          <Input label="Amount ($)" type="number" placeholder="0.00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          {action === 'transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Recipient</label>
              <select value={form.recipientId} onChange={e => setForm({ ...form, recipientId: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                <option value="">Select...</option>
                {otherUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
            </div>
          )}
          <Input label="Description (optional)" placeholder="e.g. Investment round" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setAction(null)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.amount || (action === 'transfer' && !form.recipientId)}>
              {action === 'deposit' ? 'Deposit' : action === 'withdraw' ? 'Withdraw' : 'Send'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentPage;
