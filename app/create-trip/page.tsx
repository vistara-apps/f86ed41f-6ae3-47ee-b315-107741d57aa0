'use client';

import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { CreateTripForm } from '@/components/CreateTripForm';

export default function CreateTripPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Redirect back to home page after successful creation
    router.push('/');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <AppShell
      title="Create New Trip"
      showBack
      onBack={() => router.back()}
    >
      <CreateTripForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </AppShell>
  );
}
