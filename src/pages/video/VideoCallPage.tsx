import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff, MonitorUp,
  Users, Clock
} from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { findUserById, users } from '../../data/users';

type CallState = 'idle' | 'calling' | 'connected' | 'ended';

const VideoCallPage: React.FC = () => {
  const { user } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [callState, setCallState] = useState<CallState>('idle');
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(
    userId ? findUserById(userId) ?? null : null,
  );
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const otherUsers = users.filter(u => u.id !== user?.id);

  useEffect(() => {
    if (userId && selectedUser && callState === 'idle') {
      startCall();
    }
  }, []);

  useEffect(() => {
    if (callState === 'connected' && !timerRef.current) {
      timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
    }
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = undefined; } };
  }, [callState]);

  useEffect(() => {
    if (callState === 'idle' || callState === 'ended') {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = undefined; }
      setElapsed(0);
    }
  }, [callState]);

  const startLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch {
      return null;
    }
  }, []);

  const stopLocalStream = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      setLocalStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    }
  }, [localStream, screenStream]);

  const startCall = async () => {
    if (!selectedUser) return;
    await startLocalStream();
    setCallState('calling');
    setTimeout(() => setCallState('connected'), 2000);
  };

  const endCall = () => {
    stopLocalStream();
    setCallState('ended');
    setScreenShare(false);
  };

  const goToContacts = () => {
    setCallState('idle');
    setSelectedUser(null);
    setElapsed(0);
  };

  const callAgain = async () => {
    setElapsed(0);
    setCallState('calling');
    await startLocalStream();
    setTimeout(() => setCallState('connected'), 2000);
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(t => (t.enabled = !t.enabled));
    }
    setCameraOn(p => !p);
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(t => (t.enabled = !t.enabled));
    }
    setMicOn(p => !p);
  };

  const toggleScreenShare = async () => {
    if (screenShare) {
      screenStream?.getTracks().forEach(t => t.stop());
      setScreenStream(null);
      if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
      setScreenShare(false);
    } else {
      try {
        const s = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(s);
        if (localVideoRef.current) localVideoRef.current.srcObject = s;
        s.getVideoTracks()[0]?.addEventListener('ended', () => {
          setScreenShare(false);
          if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
        });
        setScreenShare(true);
      } catch { /* user cancelled */ }
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (!user) return null;

  return (
    <div className="space-y-6 page-entrance">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded bg-primary-50 flex items-center justify-center flex-shrink-0">
            <Video size={20} className="text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Video Call</h1>
            <p className="text-sm text-gray-500 mt-0.5">Start a video call with your connections</p>
          </div>
        </div>
      </div>

      {callState === 'idle' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardBody>
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-primary-600" />
                <h2 className="text-base font-semibold text-gray-900">Select a Contact</h2>
              </div>
              <div className="space-y-2">
                {otherUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`flex items-center gap-3 w-full p-3 rounded border text-left transition-colors ${
                      selectedUser?.id === u.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Avatar src={u.avatarUrl} alt={u.name} size="md" status={u.isOnline ? 'online' : 'offline'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{u.role} &middot; {('startupName' in u) ? u.startupName : ('investmentInterests' in u) ? u.investmentInterests.join(', ') : ''}</p>
                    </div>
                    <Badge variant={u.isOnline ? 'success' : 'gray'} size="sm" dot>
                      {u.isOnline ? 'Online' : 'Offline'}
                    </Badge>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  leftIcon={<Video size={18} />}
                  disabled={!selectedUser}
                  onClick={startCall}
                >
                  Start Call
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {(callState === 'calling' || callState === 'connected') && (
        <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video max-w-5xl mx-auto">
          {/* Remote video (mock) */}
          <div className="absolute inset-0 flex items-center justify-center">
            {selectedUser && (
              <div className="text-center">
                <Avatar src={selectedUser.avatarUrl} alt={selectedUser.name} size="xl" ring />
                <p className="text-white text-lg font-semibold mt-3">{selectedUser.name}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {callState === 'calling' ? 'Calling...' : 'Connected'}
                </p>
              </div>
            )}
            {callState === 'connected' && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 text-white text-sm px-3 py-1.5 rounded-full">
                <Clock size={14} />
                <span>{formatTime(elapsed)}</span>
              </div>
            )}
          </div>

          {/* Local video */}
          <div className="absolute bottom-4 right-4 w-48 aspect-video rounded-lg overflow-hidden border-2 border-white/30 bg-gray-800 shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraOn ? '' : 'hidden'}`}
            />
            {!cameraOn && (
              <div className="w-full h-full flex items-center justify-center">
                <Avatar src={user.avatarUrl} alt={user.name} size="md" />
              </div>
            )}
            {screenShare && (
              <div className="absolute top-1 left-1 bg-primary-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                Sharing
              </div>
            )}
          </div>

          {/* Calling state overlay */}
          {callState === 'calling' && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary-500/30 flex items-center justify-center animate-pulse">
                  <Phone size={28} className="text-white" />
                </div>
                <p className="text-white text-sm mt-4">Ringing...</p>
                <Button
                  variant="error"
                  size="sm"
                  className="mt-4"
                  leftIcon={<PhoneOff size={16} />}
                  onClick={endCall}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {callState === 'connected' && (
        <div className="flex justify-center gap-3">
          <button
            onClick={toggleMic}
            className={`p-4 rounded-full transition-colors ${micOn ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-error-500 text-white'}`}
            title={micOn ? 'Mute' : 'Unmute'}
          >
            {micOn ? <Mic size={22} /> : <MicOff size={22} />}
          </button>
          <button
            onClick={endCall}
            className="p-4 rounded-full bg-error-500 text-white hover:bg-error-600 transition-colors"
            title="End Call"
          >
            <PhoneOff size={22} />
          </button>
          <button
            onClick={toggleCamera}
            className={`p-4 rounded-full transition-colors ${cameraOn ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-error-500 text-white'}`}
            title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
          >
            {cameraOn ? <Video size={22} /> : <VideoOff size={22} />}
          </button>
          <button
            onClick={toggleScreenShare}
            className={`p-4 rounded-full transition-colors ${!screenShare ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-accent-500 text-white'}`}
            title={screenShare ? 'Stop sharing' : 'Share screen'}
          >
            <MonitorUp size={22} />
          </button>
        </div>
      )}

      {callState === 'ended' && (
        <div className="text-center py-12 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <PhoneOff size={28} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Call Ended</h2>
          {selectedUser && (
            <p className="text-sm text-gray-500 mt-1">You called {selectedUser.name}</p>
          )}
          <p className="text-sm text-gray-500">Duration: {formatTime(elapsed)}</p>
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="outline" onClick={goToContacts}>
              Back to Contacts
            </Button>
            <Button leftIcon={<Video size={18} />} onClick={callAgain}>
              Call Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallPage;
