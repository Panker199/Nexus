import React, { useState } from 'react';
import { GoogleIcon } from '../../components/ui/GoogleIcon';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { Themes } from './Themes/Themes';

type SettingTab = 'Profile' | 'Security' | 'Notifications' | 'Language' | 'Appearance' | 'Billing';

const tabs: { icon: string; label: SettingTab }[] = [
  { icon: 'person', label: 'Profile' },
  { icon: 'lock', label: 'Security' },
  { icon: 'notifications', label: 'Notifications' },
  { icon: 'language', label: 'Language' },
  { icon: 'palette', label: 'Appearance' },
  { icon: 'credit_card', label: 'Billing' },
];

const languages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Chinese'];
const timezones = ['UTC (GMT+0)', 'EST (GMT-5)', 'PST (GMT-8)', 'CET (GMT+1)', 'IST (GMT+5:30)', 'JST (GMT+9)'];
const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingTab>('Profile');

  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'Profile': return <ProfileSettings user={user} />;
      case 'Security': return <SecuritySettings />;
      case 'Notifications': return <NotificationSettings />;
      case 'Language': return <LanguageSettings />;
      case 'Appearance': return <Themes />;
      case 'Billing': return <BillingSettings />;
    }
  };

  return (
    <div className="space-y-6 page-entrance">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-0.5">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 self-start">
          <CardBody className="p-2">
            <nav className="space-y-0.5">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.label;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.label)}
                    className={`flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-medium rounded ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <GoogleIcon icon={tab.icon} size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </CardBody>
        </Card>

        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

/* ─── Profile ─────────────────────────────────────────── */
const ProfileSettings: React.FC<{ user: any }> = ({ user }) => (
  <Card>
    <CardHeader><div className="flex items-center gap-2"><GoogleIcon icon="person" size={20} className="text-primary-600" /><h2 className="text-lg font-semibold text-gray-900">Profile</h2></div></CardHeader>
    <CardBody className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar src={user.avatarUrl} alt={user.name} size="xl" ring />
        <div>
          <Button variant="outline" size="sm">Change Photo</Button>
          <p className="mt-1.5 text-xs text-gray-500">JPG, GIF or PNG. Max 800K</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Full Name" defaultValue={user.name} />
        <Input label="Email" type="email" defaultValue={user.email} />
        <Input label="Role" value={user.role} disabled />
        <Input label="Location" placeholder="Your location" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
        <textarea className="w-full rounded border border-gray-300 focus:border-primary-500 sm:text-sm px-3 py-2" rows={4} defaultValue={user.bio} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </CardBody>
  </Card>
);

/* ─── Security ─────────────────────────────────────────── */
const SecuritySettings: React.FC = () => (
  <Card>
    <CardHeader><div className="flex items-center gap-2"><GoogleIcon icon="lock" size={20} className="text-primary-600" /><h2 className="text-lg font-semibold text-gray-900">Security</h2></div></CardHeader>
    <CardBody className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded bg-gray-50 border border-gray-200">
        <div>
          <div className="flex items-center gap-2"><GoogleIcon icon="shield" size={18} className="text-primary-600" /><h3 className="text-sm font-medium text-gray-900">Two-Factor Auth</h3></div>
          <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="error">Not Enabled</Badge>
          <Button variant="outline" size="sm">Enable</Button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-4"><GoogleIcon icon="key" size={18} className="text-primary-600" /><h3 className="text-sm font-medium text-gray-900">Change Password</h3></div>
        <div className="space-y-4 max-w-md">
          <Input label="Current Password" type="password" />
          <Input label="New Password" type="password" />
          <Input label="Confirm New Password" type="password" />
          <div className="flex justify-end"><Button>Update Password</Button></div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-4"><GoogleIcon icon="monitor" size={18} className="text-primary-600" /><h3 className="text-sm font-medium text-gray-900">Active Sessions</h3></div>
        <div className="space-y-3">
          {[
            { device: 'Chrome on Windows', location: 'San Francisco, CA', time: 'Active now', current: true },
            { device: 'Safari on iPhone', location: 'San Francisco, CA', time: '2 hours ago', current: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded border border-gray-200">
              <div className="flex items-center gap-3">
                <GoogleIcon icon="smartphone" size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.device} {s.current && <Badge size="sm" variant="primary">Current</Badge>}</p>
                  <p className="text-xs text-gray-500">{s.location} &middot; {s.time}</p>
                </div>
              </div>
              {!s.current && <Button variant="ghost" size="xs" className="text-error-600">Revoke</Button>}
            </div>
          ))}
        </div>
      </div>
    </CardBody>
  </Card>
);

/* ─── Notifications ─────────────────────────────────────── */
const NotificationSettings: React.FC = () => {
  const [toggles, setToggles] = useState({
    messages: true,
    collaboration: true,
    deals: true,
    marketing: false,
    weeklyDigest: true,
    pushEnabled: true,
    sound: true,
    badgeCount: true,
  });

  const toggle = (key: keyof typeof toggles) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const Switch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${checked ? 'bg-primary-600' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-all duration-200 ${checked ? 'translate-x-[1.375rem]' : 'translate-x-0.5'}`} />
    </button>
  );

  const notifyItems = [
    { key: 'messages' as const, label: 'Messages', desc: 'New message notifications' },
    { key: 'collaboration' as const, label: 'Collaboration Requests', desc: 'When someone sends or responds to a request' },
    { key: 'deals' as const, label: 'Deal Updates', desc: 'Status changes on your active deals' },
    { key: 'marketing' as const, label: 'Marketing Emails', desc: 'Tips, product updates, and offers' },
    { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'Weekly summary of your activity' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><div className="flex items-center gap-2"><GoogleIcon icon="mail" size={20} className="text-primary-600" /><h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2></div></CardHeader>
        <CardBody className="space-y-4">
          {notifyItems.map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <Switch checked={toggles[item.key]} onChange={() => toggle(item.key)} />
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><GoogleIcon icon="notifications" size={20} className="text-primary-600" /><h2 className="text-lg font-semibold text-gray-900">Push Notifications</h2></div>
            <Switch checked={toggles.pushEnabled} onChange={() => toggle('pushEnabled')} />
          </div>
        </CardHeader>
        <CardBody>
          <div className={`space-y-4 ${!toggles.pushEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GoogleIcon icon="volume_up" size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Sound</p>
                  <p className="text-xs text-gray-500">Play a sound when notifications arrive</p>
                </div>
              </div>
              <Switch checked={toggles.sound} onChange={() => toggle('sound')} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GoogleIcon icon="badge" size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Badge Count</p>
                  <p className="text-xs text-gray-500">Show unread count on app icon</p>
                </div>
              </div>
              <Switch checked={toggles.badgeCount} onChange={() => toggle('badgeCount')} />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

/* ─── Language ──────────────────────────────────────────── */
const LanguageSettings: React.FC = () => {
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('UTC (GMT+0)');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

  return (
    <Card>
      <CardHeader><div className="flex items-center gap-2"><GoogleIcon icon="language" size={20} className="text-primary-600" /><h2 className="text-lg font-semibold text-gray-900">Language & Region</h2></div></CardHeader>
      <CardBody className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {languages.map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-3 py-2 text-sm rounded border text-left ${
                  language === l ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {timezones.map(tz => (
              <button
                key={tz}
                onClick={() => setTimezone(tz)}
                className={`px-3 py-2 text-sm rounded border text-left ${
                  timezone === tz ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {tz}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
          <div className="flex gap-2">
            {dateFormats.map(df => (
              <button
                key={df}
                onClick={() => setDateFormat(df)}
                className={`px-4 py-2 text-sm rounded border ${
                  dateFormat === df ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {df}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Preview: {new Date().toLocaleDateString(dateFormat === 'MM/DD/YYYY' ? 'en-US' : dateFormat === 'DD/MM/YYYY' ? 'en-GB' : 'en-CA')}</p>
        </div>

        <div className="flex justify-end pt-2">
          <Button>Save Preferences</Button>
        </div>
      </CardBody>
    </Card>
  );
};

/* ─── Billing ────────────────────────────────────────────── */
const BillingSettings: React.FC = () => {
  const [plan, setPlan] = useState('Pro');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><div className="flex items-center gap-2"><GoogleIcon icon="credit_card" size={20} className="text-primary-600" /><h2 className="text-lg font-semibold text-gray-900">Current Plan</h2></div></CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">You are currently on</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{plan} Plan</p>
              <p className="text-sm text-gray-500 mt-0.5">$29/month &middot; Billed monthly</p>
            </div>
            <Badge variant="primary" size="lg">{plan}</Badge>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="outline">Downgrade</Button>
            <Button>Upgrade Plan</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><GoogleIcon icon="credit_card" size={20} className="text-primary-600" /><h2 className="text-lg font-semibold text-gray-900">Payment Method</h2></div>
            <Button variant="outline" size="sm">Add Card</Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between p-3 rounded border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">VI</div>
              <div>
                <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                <p className="text-xs text-gray-500">Expires 12/2027</p>
              </div>
            </div>
            <Badge variant="primary" size="sm">Default</Badge>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><div className="flex items-center gap-2"><GoogleIcon icon="description" size={20} className="text-primary-600" /><h2 className="text-lg font-semibold text-gray-900">Billing History</h2></div></CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: 'May 1, 2026', amount: '$29.00', status: 'Paid' as const },
                  { date: 'Apr 1, 2026', amount: '$29.00', status: 'Paid' as const },
                  { date: 'Mar 1, 2026', amount: '$29.00', status: 'Paid' as const },
                  { date: 'Feb 1, 2026', amount: '$19.00', status: 'Paid' as const },
                  { date: 'Jan 1, 2026', amount: '$19.00', status: 'Paid' as const },
                ].map((inv, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 pr-4 text-gray-900">{inv.date}</td>
                    <td className="py-3 pr-4 text-gray-900">{inv.amount}</td>
                    <td className="py-3 pr-4"><Badge variant="success" size="sm">{inv.status}</Badge></td>
                    <td className="py-3 text-right"><Button variant="ghost" size="xs">Download</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
