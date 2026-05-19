import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Phone, Video, Info, Smile } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ChatMessage } from '../../components/chat/ChatMessage';
import { ChatUserList } from '../../components/chat/ChatUserList';
import { useAuth } from '../../context/AuthContext';
import { Message } from '../../types';
import { findUserById } from '../../data/users';
import { getMessagesBetweenUsers, sendMessage, getConversationsForUser } from '../../data/messages';

export const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const chatPartner = userId ? findUserById(userId) : null;

  useEffect(() => {
    if (currentUser) {
      setConversations(getConversationsForUser(currentUser.id));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && userId) {
      setMessages(getMessagesBetweenUsers(currentUser.id, userId));
    }
  }, [currentUser, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !userId) return;

    const message = sendMessage({
      senderId: currentUser.id,
      receiverId: userId,
      content: newMessage,
    });

    setMessages([...messages, message]);
    setNewMessage('');
    setConversations(getConversationsForUser(currentUser.id));
  };

  if (!currentUser) return null;

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden animate-fade-in">
      {/* Conversations sidebar */}
      <div className="hidden md:block w-80 lg:w-1/4 border-r border-gray-100">
        <ChatUserList conversations={conversations} />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {chatPartner ? (
          <>
            {/* Chat header */}
            <div className="border-b border-gray-100 px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Avatar src={chatPartner.avatarUrl} alt={chatPartner.name} size="md" status={chatPartner.isOnline ? 'online' : 'offline'} />
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">{chatPartner.name}</h2>
                  <p className="text-xs text-gray-500">{chatPartner.isOnline ? 'Online' : 'Last seen recently'}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="rounded-full p-2" aria-label="Voice call"><Phone size={18} /></Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2" aria-label="Video call"><Video size={18} /></Button>
                <Button variant="ghost" size="sm" className="rounded-full p-2" aria-label="Info"><Info size={18} /></Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map(message => (
                    <ChatMessage key={message.id} message={message} isCurrentUser={message.senderId === currentUser.id} />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <Smile size={28} className="text-gray-400" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">No messages yet</h3>
                  <p className="text-xs text-gray-500 mt-1">Send a message to start the conversation</p>
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="border-t border-gray-100 px-6 py-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Button type="button" variant="ghost" size="sm" className="rounded-full p-2 flex-shrink-0" aria-label="Add emoji">
                  <Smile size={20} />
                </Button>
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  fullWidth
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!newMessage.trim()} className="rounded-full px-4" leftIcon={<Send size={18} />}>
                  Send
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mb-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-500">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Select a conversation</h2>
            <p className="text-sm text-gray-500 mt-1">Choose a contact from the list to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};
