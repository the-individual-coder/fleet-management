import React from 'react';

export interface KanbanCardProps {
  description: string;
  time: string;
}

const KanbanBoard: React.FC<KanbanCardProps> = ({ description, time }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white  overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-medium text-gray-700">Logs</h2>
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-2">{description}</p>
          <div className="text-xs text-gray-400 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDate(time)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;