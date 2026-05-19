import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleIcon } from '../../components/ui/GoogleIcon';
import { Card, CardBody } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { NotificationItem } from '../../types';
import { getNotificationsForUser, markAllAsRead, markAsRead } from '../../data/notifications';
import { findUserById } from '../../data/users';
import { formatDistanceToNow } from 'date-fns';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (user) {
      setNotifications(getNotificationsForUser(user.id));
    }
  }, [user]);

  if (!user) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <GoogleIcon icon="chat" size={16} className="text-primary-600" />;
      case 'connection':
      case 'request_accepted': return <GoogleIcon icon="person_add" size={16} className="text-secondary-600" />;
      case 'request_sent': return <GoogleIcon icon="send" size={16} className="text-accent-600" />;
      case 'request_declined': return <GoogleIcon icon="cancel" size={16} className="text-error-600" />;
      case 'deal': return <GoogleIcon icon="business" size={16} className="text-primary-600" />;
      default: return <GoogleIcon icon="notifications" size={16} className="text-gray-600" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    markAllAsRead(user.id);
    setNotifications(getNotificationsForUser(user.id));
  };

  const handleClick = (n: NotificationItem) => {
    markAsRead(n.id);
    setNotifications(getNotificationsForUser(user.id));
    if (n.link) navigate(n.link);
  };

  return (
    <div className="space-y-6 page-entrance">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-primary-50 flex items-center justify-center flex-shrink-0">
            <GoogleIcon icon="notifications" size={22} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h1>
            <p className="text-sm text-gray-500 mt-0.5">Stay updated with your network</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{unreadCount} unread</span>
            <Button variant="outline" size="sm" leftIcon={<GoogleIcon icon="done_all" size={18} />} onClick={handleMarkAllRead}>
              Mark all read
            </Button>
          </div>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3 stagger-list">
          {notifications.map(notification => {
            const fromUser = findUserById(notification.fromUserId);
            if (!fromUser) return null;
            return (
              <Card
                key={notification.id}
                className={`cursor-pointer hover:bg-gray-50 ${
                  !notification.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''
                }`}
                onClick={() => handleClick(notification)}
              >
                <CardBody className="flex items-start gap-4 p-4">
                  <Avatar src={fromUser.avatarUrl} alt={fromUser.name} size="md" className="flex-shrink-0" status={fromUser.isOnline ? 'online' : 'offline'} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-gray-900">{fromUser.name}</span>
                      {!notification.isRead && <Badge variant="primary" size="sm" rounded dot>New</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{notification.content}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                      {getIcon(notification.type)}
                      <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <div className="mx-auto w-14 h-14 rounded bg-gray-100 flex items-center justify-center mb-4">
              <GoogleIcon icon="notifications_none" size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No notifications yet</h3>
            <p className="text-sm text-gray-500 mt-1">We'll notify you when something happens</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
