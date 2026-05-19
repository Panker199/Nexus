import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ExternalLink, Users, MapPin, DollarSign, Calendar } from 'lucide-react';
import { Entrepreneur } from '../../types';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface EntrepreneurCardProps {
  entrepreneur: Entrepreneur;
  showActions?: boolean;
}

export const EntrepreneurCard: React.FC<EntrepreneurCardProps> = ({
  entrepreneur,
  showActions = true
}) => {
  const navigate = useNavigate();

  const handleViewProfile = () => navigate(`/profile/entrepreneur/${entrepreneur.id}`);

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/chat/${entrepreneur.id}`);
  };

  return (
    <Card hoverable className="h-full group" onClick={handleViewProfile}>
      <CardBody className="flex flex-col flex-1 p-5">
        {/* Header: Avatar + Name/Startup */}
        <div className="flex items-start gap-3.5">
          <div className="relative flex-shrink-0">
            <Avatar
              src={entrepreneur.avatarUrl}
              alt={entrepreneur.name}
              size="lg"
              status={entrepreneur.isOnline ? 'online' : 'offline'}
            />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-sm font-bold text-gray-900 truncate">{entrepreneur.name}</h3>
            <p className="text-xs text-primary-600 font-medium mt-0.5 truncate">{entrepreneur.startupName}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <Badge variant="primary" size="sm">{entrepreneur.industry}</Badge>
              <Badge variant="gray" size="sm">
                <MapPin size={11} className="mr-0.5" />{entrepreneur.location}
              </Badge>
            </div>
          </div>
        </div>

        {/* Pitch */}
        <div className="mt-3.5 flex-1">
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{entrepreneur.pitchSummary}</p>
        </div>

        {/* Metadata row */}
        <div className="mt-4 pt-3.5 border-t border-gray-200 grid grid-cols-3 gap-2">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Funding</span>
            <p className="text-sm font-bold text-gray-900 mt-0.5 flex items-center gap-1">
              <DollarSign size={13} className="text-accent-500" />
              {entrepreneur.fundingNeeded}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Team</span>
            <p className="text-sm font-semibold text-gray-900 mt-0.5 flex items-center gap-1">
              <Users size={13} className="text-primary-500" />
              {entrepreneur.teamSize}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Since</span>
            <p className="text-sm font-semibold text-gray-900 mt-0.5 flex items-center gap-1 justify-end">
              <Calendar size={13} className="text-secondary-500" />
              {entrepreneur.foundedYear}
            </p>
          </div>
        </div>
      </CardBody>

      {showActions && (
        <CardFooter className="border-t border-gray-100 bg-gray-50/40 px-5 py-3">
          <div className="flex justify-between w-full gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              leftIcon={<MessageCircle size={14} />}
              onClick={handleMessage}
            >
              Message
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              rightIcon={<ExternalLink size={14} />}
              onClick={handleViewProfile}
            >
              View
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
