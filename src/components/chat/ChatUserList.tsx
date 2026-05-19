import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Video } from 'lucide-react';
import { ChatConversation } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { findUserById } from '../../data/users';
import { useAuth } from '../../context/AuthContext';

interface ChatUserListProps {
  conversations: ChatConversation[];
}

export const ChatUserList: React.FC<ChatUserListProps> = ({ conversations }) => {
  const navigate = useNavigate();
  const { userId: activeUserId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();

  if (!currentUser) return null;

  const handleSelectUser = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="py-4">
        <h2 className="px-5 text-sm font-semibold text-gray-900 mb-1">Conversations</h2>
        <p className="px-5 text-xs text-gray-500 mb-4">{conversations.length} conversations</p>

        <div className="space-y-0.5">
          {conversations.length > 0 ? (
            conversations.map(conversation => {
              const otherParticipantId = conversation.participants.find(id => id !== currentUser.id);
              if (!otherParticipantId) return null;

              const otherUser = findUserById(otherParticipantId);
              if (!otherUser) return null;

              const lastMessage = conversation.lastMessage;
              const isActive = activeUserId === otherParticipantId;

              return (
                  <div
                    key={conversation.id}
                    className={`px-5 py-3 flex cursor-pointer group ${
                      isActive
                        ? 'bg-primary-50 border-r-2 border-primary-600'
                        : 'hover:bg-gray-50 border-r-2 border-transparent'
                    }`}
                    onClick={() => handleSelectUser(otherUser.id)}
                  >
                    <Avatar
                      src={otherUser.avatarUrl}
                      alt={otherUser.name}
                      size="md"
                      status={otherUser.isOnline ? 'online' : 'offline'}
                      className="mr-3 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{otherUser.name}</h3>
                        {lastMessage && (
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                            {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: false })}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-0.5">
                        {lastMessage && (
                          <p className="text-xs text-gray-500 truncate">
                            {lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                            {lastMessage.content}
                          </p>
                        )}
                        {lastMessage && !lastMessage.isRead && lastMessage.senderId !== currentUser.id && (
                          <Badge variant="primary" size="sm" rounded dot pulse>New</Badge>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/video-call/${otherUser.id}`); }}
                      className="ml-2 p-2 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-primary-50 hover:text-primary-600 transition-all self-center flex-shrink-0"
                      title={`Video call with ${otherUser.name}`}
                    >
                      <Video size={18} />
                    </button>
                  </div>
              );
            })
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-gray-500">No conversations yet</p>
              <p className="text-xs text-gray-400 mt-1">Start connecting to chat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
