import React from 'react';
import { User, Lock, Bell, Globe, Palette, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';

const tabs = [
  { icon: User, label: 'Profile' },
  { icon: Lock, label: 'Security' },
  { icon: Bell, label: 'Notifications' },
  { icon: Globe, label: 'Language' },
  { icon: Palette, label: 'Appearance' },
  { icon: CreditCard, label: 'Billing' },
];

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-0.5">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Nav */}
        <Card className="lg:col-span-1">
          <CardBody className="p-2">
            <nav className="space-y-0.5">
              {tabs.map((tab, i) => {
                const Icon = tab.icon;
                const isActive = i === 0;
                return (
                  <button
                    key={i}
                    className={`flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-medium rounded ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </CardBody>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            </CardHeader>
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
                <textarea
                  className="w-full rounded border border-gray-300 focus:border-primary-500 sm:text-sm px-3 py-2"
                  rows={4}
                  defaultValue={user.bio}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </CardBody>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded bg-gray-50 border border-gray-200">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Two-Factor Auth</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="error">Not Enabled</Badge>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <Input label="Current Password" type="password" />
                  <Input label="New Password" type="password" />
                  <Input label="Confirm New Password" type="password" />
                  <div className="flex justify-end">
                    <Button>Update Password</Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
