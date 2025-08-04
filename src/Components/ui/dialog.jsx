import { useState, cloneElement, isValidElement } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export function Dialog({ children, open, onOpenChange }) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = (val) => {
    if (isControlled) {
      onOpenChange?.(val);
    } else {
      setInternalOpen(val);
    }
  };

  return (
    <DialogContext.Provider value={{ isOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

import { createContext, useContext } from "react";
const DialogContext = createContext();

export function DialogTrigger({ children, asChild = false }) {
  const { setOpen } = useContext(DialogContext);

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      onClick: () => setOpen(true),
    });
  }

  return (
    <button onClick={() => setOpen(true)} className="text-blue-600 hover:underline">
      {children}
    </button>
  );
}

export function DialogContent({ children }) {
  const { isOpen, setOpen } = useContext(DialogContext);
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-lg"
        >
          {children}
          <div className="mt-4 text-right">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold mb-2">{children}</h2>;
}