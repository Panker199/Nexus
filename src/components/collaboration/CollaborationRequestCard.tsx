import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, MessageCircle } from 'lucide-react';
import { CollaborationRequest } from '../../types';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { findUserById } from '../../data/users';
import { updateRequestStatus } from '../../data/collaborationRequests';
import { formatDistanceToNow } from 'date-fns';

interface CollaborationRequestCardProps {
  request: CollaborationRequest;
  onStatusUpdate?: (requestId: string, status: 'accepted' | 'rejected') => void;
}

export const CollaborationRequestCard: React.FC<CollaborationRequestCardProps> = ({
  request,
  onStatusUpdate
}) => {
  const navigate = useNavigate();
  const investor = findUserById(request.investorId);

  if (!investor) return null;

  const handleAccept = () => {
    updateRequestStatus(request.id, 'accepted');
    onStatusUpdate?.(request.id, 'accepted');
  };

  const handleReject = () => {
    updateRequestStatus(request.id, 'rejected');
    onStatusUpdate?.(request.id, 'rejected');
  };

  const handleMessage = () => navigate(`/chat/${investor.id}`);
  const handleViewProfile = () => navigate(`/profile/investor/${investor.id}`);

  const statusBadge = () => {
    switch (request.status) {
      case 'pending': return <Badge variant="warning" dot pulse>Pending</Badge>;
      case 'accepted': return <Badge variant="success" dot>Accepted</Badge>;
      case 'rejected': return <Badge variant="error">Declined</Badge>;
      default: return null;
    }
  };

  return (
    <Card className="hover:shadow-soft-lg transition-all duration-300">
      <CardBody className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Avatar src={investor.avatarUrl} alt={investor.name} size="md" status={investor.isOnline ? 'online' : 'offline'} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-900">{investor.name}</h3>
              <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{request.message}</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          {statusBadge()}
        </div>
      </CardBody>

      <CardFooter className="bg-gray-50/50 border-t border-gray-100">
        {request.status === 'pending' ? (
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" leftIcon={<X size={16} />} onClick={handleReject}>Decline</Button>
              <Button variant="success" size="sm" leftIcon={<Check size={16} />} onClick={handleAccept}>Accept</Button>
            </div>
            <Button variant="ghost" size="sm" leftIcon={<MessageCircle size={16} />} onClick={handleMessage}>Message</Button>
          </div>
        ) : (
          <div className="flex justify-between w-full">
            <Button variant="outline" size="sm" leftIcon={<MessageCircle size={16} />} onClick={handleMessage}>Message</Button>
            <Button variant="ghost" size="sm" onClick={handleViewProfile}>View Profile</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
