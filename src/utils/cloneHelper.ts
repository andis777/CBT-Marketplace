function isCloneable(value: any): boolean {
  // Check if value is primitive
  if (value === null || value === undefined) return true;
  if (typeof value !== 'object') return true;
  
  // Check for special objects that can't be cloned
  if (value instanceof Symbol) return false;
  if (value instanceof Function) return false;
  if (value instanceof Error) {
    return true; // We'll handle Error objects specially
  }
  
  return true;
}

function sanitizeValue(value: any): any {
  if (!isCloneable(value)) {
    return String(value);
  }
  
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack
    };
  }
  
  return value;
}

export function safeClone<T>(data: T): T {
  try {
    // Deep clone while sanitizing non-cloneable values
    const sanitize = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map(item => sanitize(item));
      }
      
      if (obj && typeof obj === 'object') {
        const result: any = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = sanitize(sanitizeValue(obj[key]));
          }
        }
        return result;
      }
      
      return sanitizeValue(obj);
    };

    return sanitize(data);
  } catch {
    // If cloning fails, return a basic object with toString representation
    return {
      toString: () => '[Uncloneable data]'
    } as T;
  }
}