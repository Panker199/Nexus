import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, MessageCircle, Ban } from 'lucide-react';
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
  onStatusUpdate?: (requestId: string, status: 'accepted' | 'rejected' | 'canceled') => void;
  isInvestorView?: boolean;
}

export const CollaborationRequestCard: React.FC<CollaborationRequestCardProps> = ({
  request,
  onStatusUpdate,
  isInvestorView = false
}) => {
  const navigate = useNavigate();
  const counterparty = findUserById(isInvestorView ? request.entrepreneurId : request.investorId);
  const profileRoute = isInvestorView
    ? `/profile/entrepreneur/${request.entrepreneurId}`
    : `/profile/investor/${request.investorId}`;
  const chatRoute = isInvestorView ? `/chat/${request.entrepreneurId}` : `/chat/${request.investorId}`;

  if (!counterparty) return null;

  const handleAccept = () => {
    updateRequestStatus(request.id, 'accepted');
    onStatusUpdate?.(request.id, 'accepted');
  };

  const handleReject = () => {
    updateRequestStatus(request.id, 'rejected');
    onStatusUpdate?.(request.id, 'rejected');
  };

  const handleCancel = () => {
    updateRequestStatus(request.id, 'canceled');
    onStatusUpdate?.(request.id, 'canceled');
  };

  const handleMessage = () => navigate(chatRoute);
  const handleViewProfile = () => navigate(profileRoute);

  const statusBadge = () => {
    switch (request.status) {
      case 'pending': return <Badge variant="warning" dot>Pending</Badge>;
      case 'accepted': return <Badge variant="success" dot>Accepted</Badge>;
      case 'rejected': return <Badge variant="error">Declined</Badge>;
      case 'canceled': return <Badge variant="gray">Canceled</Badge>;
      default: return null;
    }
  };

  return (
    <Card>
      <CardBody className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Avatar src={counterparty.avatarUrl} alt={counterparty.name} size="md" status={counterparty.isOnline ? 'online' : 'offline'} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-900">{counterparty.name}</h3>
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
        {request.status === 'pending' && !isInvestorView && (
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" leftIcon={<X size={16} />} onClick={handleReject}>Decline</Button>
              <Button variant="success" size="sm" leftIcon={<Check size={16} />} onClick={handleAccept}>Accept</Button>
            </div>
            <Button variant="ghost" size="sm" leftIcon={<MessageCircle size={16} />} onClick={handleMessage}>Message</Button>
          </div>
        )}
        {request.status === 'pending' && isInvestorView && (
          <div className="flex justify-between w-full">
            <Button variant="outline" size="sm" leftIcon={<Ban size={16} />} onClick={handleCancel}>Cancel Request</Button>
            <Button variant="ghost" size="sm" onClick={handleViewProfile}>View Profile</Button>
          </div>
        )}
        {request.status !== 'pending' && (
          <div className="flex justify-between w-full">
            <Button variant="outline" size="sm" leftIcon={<MessageCircle size={16} />} onClick={handleMessage}>Message</Button>
            <Button variant="ghost" size="sm" onClick={handleViewProfile}>View Profile</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
