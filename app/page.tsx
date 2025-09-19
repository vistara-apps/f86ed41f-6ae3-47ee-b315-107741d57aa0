'use client';

import { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { GroupListItem } from '@/components/GroupListItem';
import { SAMPLE_GROUPS } from '@/lib/constants';
import { Group } from '@/lib/types';

export default function HomePage() {
  const [groups] = useState<Group[]>(SAMPLE_GROUPS);
  const [activeTab, setActiveTab] = useState<'trips' | 'dashboard' | 'friends'>('trips');

  const handleGroupClick = (groupId: string) => {
    window.location.href = `/group/${groupId}`;
  };

  const handleCreateTrip = () => {
    window.location.href = '/create-trip';
  };

  return (
    <AppShell 
      title="TripSplitter"
      actions={
        <button
          onClick={handleCreateTrip}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      }
    >
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'trips', label: 'Trips' },
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'friends', label: 'Friends' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-surface text-textPrimary shadow-sm'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'trips' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-textPrimary">Your Trips</h2>
            <span className="text-sm text-textSecondary">{groups.length} active</span>
          </div>
          
          {groups.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-textPrimary mb-2">No trips yet</h3>
              <p className="text-textSecondary mb-6">Create your first trip to start splitting expenses with friends.</p>
              <button onClick={handleCreateTrip} className="btn-primary">
                Create Your First Trip
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map(group => (
                <GroupListItem
                  key={group.groupId}
                  group={group}
                  variant="withBalance"
                  onClick={() => handleGroupClick(group.groupId)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-textPrimary mb-2">$40.20</h2>
            <p className="text-textSecondary">Total you owe</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="card text-center">
              <div className="text-lg font-semibold text-green-600 mb-1">$125.80</div>
              <div className="text-sm text-textSecondary">You're owed</div>
            </div>
            <div className="card text-center">
              <div className="text-lg font-semibold text-red-600 mb-1">$166.00</div>
              <div className="text-sm text-textSecondary">You owe</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-textPrimary mb-3">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">A</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Alice added "Dinner at Sushi Restaurant"</p>
                  <p className="text-xs text-textSecondary">Tokyo Adventure • 2 hours ago</p>
                </div>
                <div className="text-sm font-medium text-red-600">-$60.00</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-textPrimary mb-2">Friends feature coming soon</h3>
          <p className="text-textSecondary">Connect with friends to make splitting expenses even easier.</p>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-100">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex justify-around">
            {[
              { key: 'trips', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Trips' },
              { key: 'dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Dashboard' },
              { key: 'friends', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', label: 'Friends' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as any)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
                  activeTab === item.key ? 'text-primary' : 'text-textSecondary'
                }`}
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add some bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </AppShell>
  );
}
