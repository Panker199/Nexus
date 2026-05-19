import React, { useState, useMemo } from 'react';
import {
  Calendar, ChevronLeft, ChevronRight, Plus, Clock, Check, X,
  User, MessageSquare, Trash2
} from 'lucide-react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays,
  addMonths, subMonths, format, isSameMonth, isSameDay, isToday, parse
} from 'date-fns';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import {
  meetings, getMeetingsForUser, getMeetingsByDate,
  createMeetingRequest, respondToMeeting, cancelMeeting,
  getPendingMeetings
} from '../../data/meetings';
import { users } from '../../data/users';
import { Meeting } from '../../types';

const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', participantId: '', startTime: '09:00', endTime: '10:00', message: '' });

  const userMeetings = useMemo(() => getMeetingsForUser(user?.id ?? ''), [user?.id]);
  const dayMeetings = useMemo(
    () => getMeetingsByDate(user?.id ?? '', format(selectedDate, 'yyyy-MM-dd')),
    [user?.id, selectedDate],
  );
  const pendingRequests = useMemo(
    () => getPendingMeetings(user?.id ?? '').filter(m => m.participantId === user?.id),
    [user?.id],
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let d = calStart;
  while (d <= calEnd) {
    days.push(d);
    d = addDays(d, 1);
  }

  const getMeetingCount = (date: Date): number =>
    getMeetingsByDate(user?.id ?? '', format(date, 'yyyy-MM-dd')).length;

  const otherUsers = users.filter(u => u.id !== user?.id);

  const handleRequestMeeting = () => {
    if (!user || !form.title || !form.participantId) return;
    createMeetingRequest(
      form.title, user.id, form.participantId,
      format(selectedDate, 'yyyy-MM-dd'), form.startTime, form.endTime, form.message,
    );
    setForm({ title: '', participantId: '', startTime: '09:00', endTime: '10:00', message: '' });
    setShowForm(false);
  };

  const handleRespond = (meetingId: string, accept: boolean) => {
    respondToMeeting(meetingId, accept);
    setSelectedDate(new Date(selectedDate));
  };

  const handleCancel = (meetingId: string) => {
    cancelMeeting(meetingId);
    setSelectedDate(new Date(selectedDate));
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (!user) return null;

  return (
    <div className="space-y-6 page-entrance">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-primary-50 flex items-center justify-center flex-shrink-0">
            <Calendar size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Calendar</h1>
            <p className="text-sm text-gray-500 mt-0.5">Schedule and manage meetings</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} leftIcon={<Plus size={18} />}>Request Meeting</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <h2 className="text-base font-semibold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</h2>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded overflow-hidden">
                {dayNames.map(name => (
                  <div key={name} className="bg-gray-50 px-2 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {name}
                  </div>
                ))}
                {days.map(day => {
                  const count = getMeetingCount(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrent = isToday(day);
                  const inMonth = isSameMonth(day, currentMonth);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`relative bg-white px-2 py-3 text-sm transition-colors min-h-[72px]
                        ${inMonth ? 'text-gray-900' : 'text-gray-300'}
                        ${isSelected ? 'ring-2 ring-primary-500 ring-inset bg-primary-50' : 'hover:bg-gray-50'}
                      `}
                    >
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm
                        ${isCurrent ? 'bg-primary-600 text-white font-bold' : ''}
                      `}>
                        {format(day, 'd')}
                      </span>
                      {count > 0 && (
                        <div className="mt-1 flex justify-center gap-0.5">
                          {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                            <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Meeting List */}
        <div className="space-y-6">
          {/* Selected Day Meetings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary-600" />
                <h2 className="text-sm font-semibold text-gray-900">{format(selectedDate, 'MMM d, yyyy')}</h2>
              </div>
            </CardHeader>
            <CardBody>
              {dayMeetings.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No meetings on this day</p>
              ) : (
                <div className="space-y-3">
                  {dayMeetings.map(m => {
                    const other = users.find(u => u.id === (m.organizerId === user.id ? m.participantId : m.organizerId));
                    return (
                      <div key={m.id} className="p-3 rounded border border-gray-200 space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{m.title}</span>
                          <Badge variant={m.status === 'confirmed' ? 'success' : m.status === 'pending' ? 'warning' : 'error'} size="sm">
                            {m.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock size={14} />
                          <span>{m.startTime} – {m.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <User size={14} />
                          <span>{other?.name ?? 'Unknown'}</span>
                        </div>
                        {m.message && (
                          <div className="flex items-start gap-1 text-gray-500">
                            <MessageSquare size={14} className="mt-0.5" />
                            <span>{m.message}</span>
                          </div>
                        )}
                        {m.status === 'pending' && m.participantId === user.id && (
                          <div className="flex gap-2 pt-2">
                            <Button size="xs" variant="success" onClick={() => handleRespond(m.id, true)} leftIcon={<Check size={14} />}>Accept</Button>
                            <Button size="xs" variant="error" onClick={() => handleRespond(m.id, false)} leftIcon={<X size={14} />}>Decline</Button>
                          </div>
                        )}
                        {m.organizerId === user.id && m.status !== 'cancelled' && (
                          <div className="pt-2">
                            <Button size="xs" variant="ghost" className="text-error-500" onClick={() => handleCancel(m.id)} leftIcon={<Trash2 size={14} />}>Cancel</Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-warning-500" />
                  <h2 className="text-sm font-semibold text-gray-900">Pending Requests</h2>
                  <Badge variant="warning" size="sm">{pendingRequests.length}</Badge>
                </div>
              </CardHeader>
              <CardBody className="space-y-3">
                {pendingRequests.map(m => {
                  const organizer = users.find(u => u.id === m.organizerId);
                  return (
                    <div key={m.id} className="p-3 rounded border border-gray-200 space-y-2 text-sm">
                      <div className="font-medium text-gray-900">{m.title}</div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <User size={14} />
                        <span>{organizer?.name ?? 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock size={14} />
                        <span>{m.date} {m.startTime}–{m.endTime}</span>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button size="xs" variant="success" onClick={() => handleRespond(m.id, true)} leftIcon={<Check size={14} />}>Accept</Button>
                        <Button size="xs" variant="error" onClick={() => handleRespond(m.id, false)} leftIcon={<X size={14} />}>Decline</Button>
                      </div>
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* Request Meeting Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900">Request a Meeting</h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="e.g. Pitch Presentation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">With</label>
                <select
                  value={form.participantId}
                  onChange={e => setForm({ ...form, participantId: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                >
                  <option value="">Select a person...</option>
                  {otherUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={e => setSelectedDate(parse(e.target.value, 'yyyy-MM-dd', new Date()))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="text-sm text-gray-500 pt-2">{format(selectedDate, 'MMM d, yyyy')}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={e => setForm({ ...form, startTime: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={e => setForm({ ...form, endTime: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                  placeholder="Add a note..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleRequestMeeting} disabled={!form.title || !form.participantId}>Send Request</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
