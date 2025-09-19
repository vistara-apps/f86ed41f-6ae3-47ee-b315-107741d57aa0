'use client';

import { useState } from 'react';
import { useData } from '@/lib/hooks/useData';
import { User } from '@/lib/types';
import { validateForm, tripValidationSchema, validateTripDates, sanitizeInput } from '@/lib/validation';

interface CreateTripFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateTripForm({ onSuccess, onCancel }: CreateTripFormProps) {
  const { addGroup, addUser } = useData();
  const [formData, setFormData] = useState({
    groupName: '',
    tripDestination: '',
    startDate: '',
    endDate: '',
    memberInput: '',
  });
  const [members, setMembers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const sanitizedData = {
      groupName: sanitizeInput(formData.groupName),
      tripDestination: sanitizeInput(formData.tripDestination),
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    const validation = validateForm(sanitizedData, tripValidationSchema);
    const newErrors = { ...validation.errors };

    // Additional date range validation
    if (formData.startDate && formData.endDate) {
      const dateError = validateTripDates(formData.startDate, formData.endDate);
      if (dateError) {
        newErrors.endDate = dateError;
      }
    }

    // Members validation
    if (members.length === 0) {
      newErrors.members = 'At least one member is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMember = () => {
    const input = formData.memberInput.trim();
    if (!input) return;

    // Check if it's a Farcaster handle (starts with @)
    if (input.startsWith('@')) {
      const farcasterHandle = input.substring(1);
      const newMember: User = {
        userId: `farcaster_${farcasterHandle}`,
        displayName: farcasterHandle,
        farcasterId: farcasterHandle,
      };
      setMembers(prev => [...prev, newMember]);
    } else if (input.includes('0x') || input.length === 42) {
      // Assume it's a wallet address
      const walletAddress = input.startsWith('0x') ? input : `0x${input}`;
      const newMember: User = {
        userId: `wallet_${walletAddress}`,
        displayName: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        walletAddress,
      };
      setMembers(prev => [...prev, newMember]);
    } else {
      // Regular name
      const newMember: User = {
        userId: `user_${Date.now()}`,
        displayName: input,
      };
      setMembers(prev => [...prev, newMember]);
    }

    setFormData(prev => ({ ...prev, memberInput: '' }));
  };

  const handleRemoveMember = (userId: string) => {
    setMembers(prev => prev.filter(member => member.userId !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Add members to the data store
      members.forEach(member => {
        addUser(member);
      });

      // Create the group with sanitized data
      addGroup({
        groupName: sanitizeInput(formData.groupName),
        tripDestination: sanitizeInput(formData.tripDestination),
        startDate: formData.startDate,
        endDate: formData.endDate,
        members,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating trip:', error);
      setErrors({ submit: 'Failed to create trip. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-2">Create New Trip</h2>
        <p className="text-textSecondary">Plan your next adventure and invite your friends</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Name */}
        <div>
          <label htmlFor="groupName" className="block text-sm font-medium text-textPrimary mb-2">
            Trip Name
          </label>
          <input
            type="text"
            id="groupName"
            value={formData.groupName}
            onChange={(e) => setFormData(prev => ({ ...prev, groupName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Tokyo Adventure 2024"
          />
          {errors.groupName && <p className="text-red-500 text-sm mt-1">{errors.groupName}</p>}
        </div>

        {/* Destination */}
        <div>
          <label htmlFor="tripDestination" className="block text-sm font-medium text-textPrimary mb-2">
            Destination
          </label>
          <input
            type="text"
            id="tripDestination"
            value={formData.tripDestination}
            onChange={(e) => setFormData(prev => ({ ...prev, tripDestination: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Tokyo, Japan"
          />
          {errors.tripDestination && <p className="text-red-500 text-sm mt-1">{errors.tripDestination}</p>}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-textPrimary mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-textPrimary mb-2">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>
        </div>

        {/* Members */}
        <div>
          <label className="block text-sm font-medium text-textPrimary mb-2">
            Trip Members
          </label>

          {/* Add Member Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={formData.memberInput}
              onChange={(e) => setFormData(prev => ({ ...prev, memberInput: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="@farcaster_handle, wallet address, or name"
            />
            <button
              type="button"
              onClick={handleAddMember}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Member List */}
          <div className="space-y-2">
            {members.map(member => (
              <div key={member.userId} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">
                      {member.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-textPrimary">{member.displayName}</span>
                  {member.farcasterId && (
                    <span className="text-xs text-textSecondary">@{member.farcasterId}</span>
                  )}
                  {member.walletAddress && (
                    <span className="text-xs text-textSecondary">Wallet</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member.userId)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {errors.members && <p className="text-red-500 text-sm mt-1">{errors.members}</p>}
        </div>

        {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

        {/* Submit Buttons */}
        <div className="flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-textPrimary rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Trip'}
          </button>
        </div>
      </form>
    </div>
  );
}
