import { NotificationItem } from '../types';
import { findUserById } from './users';

export const notifications: NotificationItem[] = [];

export const createNotification = (
  userId: string,
  type: NotificationItem['type'],
  fromUserId: string,
  content: string,
  link?: string
): NotificationItem => {
  const notification: NotificationItem = {
    id: `notif${notifications.length + 1}`,
    userId,
    type,
    fromUserId,
    content,
    isRead: false,
    createdAt: new Date().toISOString(),
    link
  };
  notifications.unshift(notification);
  return notification;
};

export const getNotificationsForUser = (userId: string): NotificationItem[] => {
  return notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getUnreadCount = (userId: string): number => {
  return notifications.filter(n => n.userId === userId && !n.isRead).length;
};

export const markAsRead = (notificationId: string): void => {
  const n = notifications.find(item => item.id === notificationId);
  if (n) n.isRead = true;
};

export const markAllAsRead = (userId: string): void => {
  notifications.forEach(n => {
    if (n.userId === userId) n.isRead = true;
  });
};

export const notifyRequestSent = (investorId: string, entrepreneurId: string): void => {
  const investor = findUserById(investorId);
  const entrepreneur = findUserById(entrepreneurId);
  if (!investor || !entrepreneur) return;

  createNotification(
    entrepreneurId,
    'request_sent',
    investorId,
    `${investor.name} sent a collaboration request`,
    `/profile/investor/${investorId}`
  );
};

export const notifyRequestAccepted = (investorId: string, entrepreneurId: string): void => {
  const investor = findUserById(investorId);
  const entrepreneur = findUserById(entrepreneurId);
  if (!investor || !entrepreneur) return;

  createNotification(
    investorId,
    'request_accepted',
    entrepreneurId,
    `${entrepreneur.name} accepted your collaboration request`,
    `/profile/entrepreneur/${entrepreneurId}`
  );
};

export const notifyRequestDeclined = (investorId: string, entrepreneurId: string): void => {
  const entrepreneur = findUserById(entrepreneurId);
  if (!entrepreneur) return;

  createNotification(
    investorId,
    'request_declined',
    entrepreneurId,
    `${entrepreneur.name} declined your collaboration request`
  );
};

export const notifyDealCreated = (dealId: string, investorId: string, entrepreneurId: string): void => {
  const investor = findUserById(investorId);
  const entrepreneur = findUserById(entrepreneurId);
  if (!investor || !entrepreneur) return;

  createNotification(
    entrepreneurId,
    'deal',
    investorId,
    `A new deal has been created for ${entrepreneur.startupName}`,
    `/deals`
  );
  createNotification(
    investorId,
    'deal',
    entrepreneurId,
    `Deal started with ${entrepreneur.startupName}`,
    `/deals`
  );
};
