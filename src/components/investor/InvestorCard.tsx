import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { Investor } from '../../types';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface InvestorCardProps {
  investor: Investor;
  showActions?: boolean;
}

export const InvestorCard: React.FC<InvestorCardProps> = ({
  investor,
  showActions = true
}) => {
  const navigate = useNavigate();

  const handleViewProfile = () => navigate(`/profile/investor/${investor.id}`);

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/chat/${investor.id}`);
  };

  return (
    <Card hoverable className="h-full" onClick={handleViewProfile}>
      <CardBody className="flex flex-col h-full">
        <div className="flex items-start gap-4">
          <Avatar src={investor.avatarUrl} alt={investor.name} size="lg" status={investor.isOnline ? 'online' : 'offline'} />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-0.5">{investor.name}</h3>
            <p className="text-xs text-gray-500 mb-2">{investor.totalInvestments} investments</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {investor.investmentStage.slice(0, 3).map((stage, index) => (
                <Badge key={index} variant="secondary" size="sm">{stage}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex-1">
          <h4 className="text-xs font-semibold text-gray-900 mb-1.5 uppercase tracking-wider">Interests</h4>
          <div className="flex flex-wrap gap-1.5">
            {investor.investmentInterests.slice(0, 4).map((interest, index) => (
              <Badge key={index} variant="primary" size="sm">{interest}</Badge>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Range</span>
            <p className="text-sm font-semibold text-gray-900">{investor.minimumInvestment} - {investor.maximumInvestment}</p>
          </div>
        </div>
      </CardBody>

      {showActions && (
        <CardFooter className="border-t border-gray-100 bg-gray-50/50 flex justify-between">
          <Button variant="outline" size="sm" leftIcon={<MessageCircle size={16} />} onClick={handleMessage}>Message</Button>
          <Button variant="primary" size="sm" rightIcon={<ExternalLink size={16} />} onClick={handleViewProfile}>View</Button>
        </CardFooter>
      )}
    </Card>
  );
};
