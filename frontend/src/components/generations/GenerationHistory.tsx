import { Generation } from '@shared/generation';

interface GenerationHistoryProps {
  generations: Generation[];
  onSelect: (generation: Generation) => void;
  selectedId?: string;
}

export function GenerationHistory({ generations, onSelect, selectedId }: GenerationHistoryProps) {
  if (generations.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <p className="text-gray-600 font-medium">No generations yet</p>
        <p className="text-sm text-gray-500 mt-2">Your first generation will appear here</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {generations.map((generation) => (
        <button
          key={generation.id}
          onClick={() => onSelect(generation)}
          className={`
            w-full text-left p-3 rounded-lg border-2 transition-all
            ${selectedId === generation.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
            }
          `}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {generation.originalImageUrl && (
                <img
                  src={generation.originalImageUrl}
                  alt="Original"
                  className="w-12 h-12 object-cover rounded"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(generation.status)}`}>
                  {generation.status}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(generation.createdAt)}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 truncate">
                {generation.prompt}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {generation.style}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}