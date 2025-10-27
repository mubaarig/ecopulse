'use client';

import { useEffect } from 'react';

export function useKeyboardShortcut(key: string, callback: () => void) {
  // Global listener for ⌘/Ctrl + key combos that runs the provided callback.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === key) {
        event.preventDefault();
        callback();
      }
    };
    // Register once on mount and clean up to avoid duplicate listeners.
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, callback]);
}
