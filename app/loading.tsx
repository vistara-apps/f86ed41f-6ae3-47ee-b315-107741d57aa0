export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="animate-pulse space-y-4 w-full max-w-md mx-auto px-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
