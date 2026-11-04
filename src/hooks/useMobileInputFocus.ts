import { useState, useEffect } from 'react';

/**
 * Hook detecting when an input or form field is focused on mobile (< 768px).
 * Used to gracefully hide floating buttons (WhatsApp / ScrollToTop) during typing,
 * preventing any overlap with virtual keyboard, input fields, or submit buttons.
 */
export function useMobileInputFocus(): boolean {
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (window.innerWidth < 768) {
        const target = e.target as HTMLElement | null;
        if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
          setIsInputFocused(true);
        }
      }
    };

    const handleFocusOut = () => {
      if (window.innerWidth < 768) {
        // Small delay to prevent jitter between tabbed inputs
        setTimeout(() => {
          const active = document.activeElement;
          if (!active || !['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) {
            setIsInputFocused(false);
          }
        }, 80);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return isInputFocused;
}
