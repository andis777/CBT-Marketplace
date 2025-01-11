import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DebugPanel = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  React.useEffect(() => {
    const handleApiLog = (event: CustomEvent) => {
      try {
        // Only store safe, serializable data
        const safeDetail = JSON.parse(JSON.stringify(event.detail));
        setLogs(prev => [...prev.slice(-19), safeDetail]);
      } catch (error) {
        console.debug('Failed to process debug log:', error);
      }
    };

    window.addEventListener('api-log' as any, handleApiLog);
    return () => window.removeEventListener('api-log' as any, handleApiLog);
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const token = localStorage.getItem('token');

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 shadow-lg"
      >
        {isOpen ? 'Hide Debug' : 'Show Debug'}
      </button>

      {isOpen && (
        <div className="fixed bottom-16 right-4 w-96 max-h-[600px] overflow-y-auto bg-gray-900 text-white rounded-lg p-4 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Dashboard Debug Info</h3>
          
          <div className="mb-4">
            <h4 className="font-medium text-gray-400">User Info:</h4>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap bg-gray-800 p-2 rounded mt-1">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-400">Auth Token:</h4>
            <div className="text-xs break-all bg-gray-800 p-2 rounded mt-1">
              {token || 'No token'}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-400">API Logs:</h4>
            {logs.map((log, index) => (
              <div key={index} className="border-b border-gray-700 pb-2">
                {log.request && (
                  <div className="mt-1">
                    <div className="text-sm font-medium text-blue-400">Request:</div>
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(log.request, null, 2)}
                    </pre>
                  </div>
                )}
                {log.response && (
                  <div className="mt-1">
                    <div className="text-sm font-medium text-green-400">Response:</div>
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(log.response, null, 2)}
                    </pre>
                  </div>
                )}
                {log.error && (
                  <div className="mt-1">
                    <div className="text-sm font-medium text-red-400">Error:</div>
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(log.error, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel;