import React, { useState, useEffect } from 'react';

const ArticleDebug = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const handleApiLog = (event: CustomEvent) => {
      const detail = event.detail;
      setLogs(prev => [...prev.slice(-19), detail]);
    };

    window.addEventListener('api-log' as any, handleApiLog);
    return () => window.removeEventListener('api-log' as any, handleApiLog);
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
      >
        {isOpen ? 'Hide Article Debug' : 'Show Article Debug'}
      </button>

      {isOpen && (
        <div className="fixed bottom-16 left-4 w-96 max-h-[600px] overflow-y-auto bg-gray-900 text-white rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Article Creation Debug</h3>
          
          <div className="space-y-4">
            {logs.map((log, index) => (
              <div key={index} className="border-b border-gray-700 pb-2">
                <div className="text-xs text-gray-400">
                  {new Date().toISOString()}
                </div>
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

export default ArticleDebug;