import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Message } from '../../types';
import { Avatar } from '../ui/Avatar';
import { findUserById } from '../../data/users';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  const user = findUserById(message.senderId);
  if (!user) return null;

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
      {!isCurrentUser && (
        <Avatar src={user.avatarUrl} alt={user.name} size="sm" className="flex-shrink-0 mb-1" />
      )}

      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed ${
            isCurrentUser
              ? 'bg-primary-600 text-white rounded rounded-br-sm'
              : 'bg-white text-gray-800 rounded rounded-bl-sm border border-gray-200'
          }`}
        >
          {message.content}
        </div>
        <span className={`text-[10px] text-gray-400 mt-1 ${isCurrentUser ? 'mr-1' : 'ml-1'}`}>
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </span>
      </div>

      {isCurrentUser && (
        <Avatar src={user.avatarUrl} alt={user.name} size="sm" className="flex-shrink-0 mb-1" />
      )}
    </div>
  );
};
