import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
interface ApiLog {
  request?: any;
  response?: any;
  error?: any;
  timestamp: string;
}

const Debug = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [apiLogs, setApiLogs] = React.useState<ApiLog[]>([]);

  // Subscribe to API logs
  React.useEffect(() => {
    const handleApiLog = (event: CustomEvent) => {
      const detail = event.detail;
      setApiLogs(prev => {
        const newLog = {
          request: detail.request,
          response: detail.response,
          error: detail.error,
          timestamp: new Date().toISOString()
        };
        return [...prev.slice(-19), newLog];
      });
    };
    window.addEventListener('api-log' as any, handleApiLog);
    return () => window.removeEventListener('api-log' as any, handleApiLog);
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="bg-gray-900 text-white p-2 text-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-mono">ENV: {process.env.NODE_ENV}</span>
            <span className="font-mono">Path: {location.pathname}</span>
            <span className="font-mono">Search: {location.search}</span>
            <span className="font-mono">User: {user ? user.email : 'Not logged in'}</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-2 py-1 bg-gray-800 rounded hover:bg-gray-700"
          >
            {isOpen ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
        
        {isOpen && (
          <div className="mt-2 space-y-2">
            <div className="font-mono">
              <strong>URL:</strong> {window.location.href}
            </div>
            <div className="font-mono">
              <strong>User Agent:</strong> {navigator.userAgent}
            </div>
            <div className="font-mono">
              <strong>Screen:</strong> {window.innerWidth}x{window.innerHeight}
            </div>
            <div className="font-mono">
              <strong>Time:</strong> {new Date().toISOString()}
            </div>
            <div className="font-mono">
              <strong>Auth Token:</strong> {localStorage.getItem('token') ? 'Present' : 'None'}
            </div>
            {apiLogs.length > 0 && (
              <div className="mt-4">
                <strong>API Logs:</strong>
                <div className="max-h-60 overflow-y-auto">
                  {apiLogs.map((log, i) => (
                    <div key={i} className="mt-2 p-2 bg-gray-800 rounded">
                      <div className="text-xs opacity-50">{log.timestamp}</div>
                      {log.request && <div>Request: {JSON.stringify(log.request)}</div>}
                      {log.response && <div>Response: {JSON.stringify(log.response)}</div>}
                      {log.error && <div className="text-red-400">Error: {JSON.stringify(log.error)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Debug;