"use client";

import React from 'react';
import Card from '../../Card';

interface ProfileSectionProps {
  userName?: string;
  userMajor?: string;
  profileViews?: number;
  threadReactions?: number;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  userName = "Campus User",
  userMajor = "Computer Science",
  profileViews = 178,
  threadReactions = 24
}) => {
  return (
    <Card className="mb-4">
      <div className="bg-secondary-bg rounded-lg overflow-hidden">
        {/* Cover photo */}
        <div className="h-20 bg-gradient-to-r from-accent to-accent-dark"></div>
        
        {/* Profile info */}
        <div className="p-4 text-center relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-secondary-bg absolute -top-10 left-1/2 transform -translate-x-1/2 bg-primary-bg">
            {/* Profile image placeholder */}
            <div className="w-full h-full flex items-center justify-center text-accent font-bold text-xl">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className="text-lg font-bold text-white">{userName}</h3>
            <p className="text-sm text-text-secondary">{userMajor}</p>
            <div className="mt-2 inline-block bg-accent-30 px-2 py-1 rounded-full">
              <span className="text-xs font-medium text-accent">Concordia University</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-accent-30">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-text-secondary">Profile views</p>
                <p className="font-bold text-white">{profileViews}</p>
              </div>
              <div>
                <p className="text-text-secondary">Thread reactions</p>
                <p className="font-bold text-white">{threadReactions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSection;
