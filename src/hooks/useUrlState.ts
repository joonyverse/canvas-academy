import { useState, useEffect, useCallback } from 'react';

export const useUrlState = () => {
  const [urlParams, setUrlParams] = useState<URLSearchParams>(new URLSearchParams());

  useEffect(() => {
    const updateParams = () => {
      setUrlParams(new URLSearchParams(window.location.search));
    };

    updateParams();
    
    // Listen for URL changes
    window.addEventListener('popstate', updateParams);
    
    return () => {
      window.removeEventListener('popstate', updateParams);
    };
  }, []);

  const updateUrl = useCallback((params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(window.location.search);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    const newUrl = `${window.location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
    setUrlParams(newParams);
  }, []);

  const getParam = useCallback((key: string): string | null => {
    return urlParams.get(key);
  }, [urlParams]);

  return {
    getParam,
    updateUrl,
    urlParams
  };
};