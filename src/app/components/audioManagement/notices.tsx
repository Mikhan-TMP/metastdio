import React from "react";
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  X,
  Info,
  AlertTriangle,
} from "lucide-react";

const Notice = ({
  type = "info",
  message,
  onClose,
  className = "",
  duration = null,
}) => {
  const statusIcons = {
    generating: <RefreshCw className="animate-spin text-blue-500" />,
    error: <AlertCircle className="text-red-500" />,
    success: <CheckCircle className="text-green-500" />,
    warning: <AlertTriangle className="text-yellow-500" />,
    info: <Info className="text-blue-500" />,
  };

  const statusColors = {
    generating: "border-blue-200 bg-blue-50 text-blue-600",
    error: "border-red-200 bg-red-50 text-red-600",
    success: "border-green-200 bg-green-50 text-green-600",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-600",
    info: "border-blue-200 bg-blue-50 text-blue-600",
  };

  // Optional auto-close functionality
  React.useEffect(() => {
    let timer;
    if (duration && onClose) {
      timer = setTimeout(onClose, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`
        flex items-center justify-between 
        p-4 border rounded 
        ${statusColors[type]} 
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{statusIcons[type]}</div>
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close notice"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Notice;
