'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { generateId } from '@/lib/utils';

export default function CreateTripPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    groupName: '',
    tripDestination: '',
    startDate: '',
    endDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would create the trip in the backend
      const newGroupId = generateId();
      
      // Redirect to the new group
      router.push(`/group/${newGroupId}`);
    } catch (error) {
      console.error('Failed to create trip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = formData.groupName && formData.tripDestination && 
                     formData.startDate && formData.endDate;

  return (
    <AppShell 
      title="Create New Trip"
      showBack
      onBack={() => router.back()}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Trip Name
          </label>
          <input
            type="text"
            value={formData.groupName}
            onChange={(e) => handleInputChange('groupName', e.target.value)}
            placeholder="e.g., Tokyo Adventure"
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Destination
          </label>
          <input
            type="text"
            value={formData.tripDestination}
            onChange={(e) => handleInputChange('tripDestination', e.target.value)}
            placeholder="e.g., Tokyo, Japan"
            className="input-field"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              min={formData.startDate}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="card">
          <h3 className="font-medium text-textPrimary mb-3">Next Steps</h3>
          <ul className="space-y-2 text-sm text-textSecondary">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
              <span>Invite friends to join your trip</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
              <span>Set up budget categories</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
              <span>Start adding shared expenses</span>
            </li>
          </ul>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Trip...</span>
              </>
            ) : (
              <span>Create Trip</span>
            )}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
