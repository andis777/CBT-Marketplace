interface LogEventData {
  success?: boolean;
  message?: string;
  role?: string;
  [key: string]: any;
}

export const logEvent = (eventName: string, data: LogEventData) => {
  // Create a safe copy of the data for logging
  const safeData = JSON.parse(JSON.stringify(data));

  window.dispatchEvent(new CustomEvent('api-log', {
    detail: {
      response: {
        event: eventName,
        ...safeData
      }
    }
  }));
};