import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
  id?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  className = '',
  id,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (isControlled) {
      if (onToggle) onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  const contentId = id || `accordion-content-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`border-t border-violet-imperial/10 pt-3 mt-3 ${className}`}>
      {/* Fully clickable header with min 44px touch target & 16px readable font */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between min-h-[44px] py-2.5 px-1 text-left text-base font-semibold text-violet-imperial hover:text-[#7818e8] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-imperial/50 rounded-xl"
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span className="flex items-center gap-2 group-hover:underline underline-offset-4 text-onyx font-title text-lg sm:text-xl font-medium">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="p-1.5 rounded-full bg-violet-imperial/10 text-violet-imperial shrink-0 ml-3 group-hover:bg-violet-imperial/20 transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-3 px-1 text-base text-onyx/80 leading-relaxed font-body">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
