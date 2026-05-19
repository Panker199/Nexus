import { Meeting } from '../types';
import { addDays, format } from 'date-fns';

const today = new Date();

export const meetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Seed Round Discussion',
    organizerId: 'u1',
    participantId: 'u4',
    date: format(today, 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '11:00',
    status: 'confirmed',
    createdAt: format(addDays(today, -3), 'yyyy-MM-dd'),
  },
  {
    id: 'm2',
    title: 'Product Demo',
    organizerId: 'u1',
    participantId: 'u5',
    date: format(addDays(today, 1), 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '15:00',
    status: 'confirmed',
    createdAt: format(addDays(today, -1), 'yyyy-MM-dd'),
  },
  {
    id: 'm3',
    title: 'Partnership Pitch',
    organizerId: 'u4',
    participantId: 'u1',
    date: format(addDays(today, 2), 'yyyy-MM-dd'),
    startTime: '11:00',
    endTime: '12:00',
    status: 'pending',
    message: 'Would love to discuss a potential partnership opportunity.',
    createdAt: format(today, 'yyyy-MM-dd'),
  },
  {
    id: 'm4',
    title: 'Follow-up on Investment Terms',
    organizerId: 'u5',
    participantId: 'u2',
    date: format(addDays(today, 3), 'yyyy-MM-dd'),
    startTime: '15:00',
    endTime: '16:00',
    status: 'pending',
    message: 'Let us discuss the investment terms in detail.',
    createdAt: format(today, 'yyyy-MM-dd'),
  },
  {
    id: 'm5',
    title: 'Q1 Strategy Review',
    organizerId: 'u2',
    participantId: 'u4',
    date: format(addDays(today, -1), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    status: 'confirmed',
    createdAt: format(addDays(today, -5), 'yyyy-MM-dd'),
  },
];

export const getMeetingsForUser = (userId: string): Meeting[] =>
  meetings.filter(m => m.organizerId === userId || m.participantId === userId);

export const getMeetingsByDate = (userId: string, date: string): Meeting[] =>
  getMeetingsForUser(userId).filter(m => m.date === date);

export const getUpcomingMeetings = (userId: string, limit = 5): Meeting[] =>
  getMeetingsForUser(userId)
    .filter(m => m.date >= format(today, 'yyyy-MM-dd') && m.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, limit);

export const getPendingMeetings = (userId: string): Meeting[] =>
  getMeetingsForUser(userId).filter(m => m.status === 'pending' && m.participantId === userId);

export const createMeetingRequest = (
  title: string,
  organizerId: string,
  participantId: string,
  date: string,
  startTime: string,
  endTime: string,
  message?: string,
): Meeting => {
  const meeting: Meeting = {
    id: `m${Date.now()}`,
    title,
    organizerId,
    participantId,
    date,
    startTime,
    endTime,
    status: 'pending',
    message,
    createdAt: format(today, 'yyyy-MM-dd'),
  };
  meetings.push(meeting);
  return meeting;
};

export const respondToMeeting = (meetingId: string, accept: boolean): Meeting | null => {
  const meeting = meetings.find(m => m.id === meetingId);
  if (!meeting) return null;
  meeting.status = accept ? 'confirmed' : 'declined';
  return meeting;
};

export const cancelMeeting = (meetingId: string): Meeting | null => {
  const meeting = meetings.find(m => m.id === meetingId);
  if (!meeting) return null;
  meeting.status = 'cancelled';
  return meeting;
};
