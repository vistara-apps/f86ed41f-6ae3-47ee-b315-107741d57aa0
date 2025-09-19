'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-textPrimary mb-4">
          Something went wrong!
        </h2>
        <p className="text-textSecondary mb-6">
          We encountered an error while loading TripSplitter.
        </p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
