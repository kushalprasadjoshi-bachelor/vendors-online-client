import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message, duration = 4000) => {
      return showToast(message, "success", duration);
    },
    [showToast],
  );

  const error = useCallback(
    (message, duration = 4000) => {
      return showToast(message, "error", duration);
    },
    [showToast],
  );

  const info = useCallback(
    (message, duration = 4000) => {
      return showToast(message, "info", duration);
    },
    [showToast],
  );

  const warning = useCallback(
    (message, duration = 4000) => {
      return showToast(message, "warning", duration);
    },
    [showToast],
  );

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, removeToast, success, error, info, warning }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};
