import { parseSession } from "@/lib/parse-session";
import { Button } from "./button";
import { Trash2 } from "lucide-react";

const SessionItem = (props: {
  loading?: boolean;
  userAgent: string;
  date: string;
  expiresAt: string;
  isCurrent?: boolean;
  onRemove?: () => void;
}) => {
  const { userAgent, loading, date, isCurrent = false, onRemove } = props;
  const { os, browser, timeAgo, icon: Icon } = parseSession(userAgent, date);

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };
  return (
    <div className="group w-full bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 p-4 hover:shadow-lg hover:shadow-gray-100 dark:hover:shadow-gray-900/20 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600">
      <div className="flex items-start gap-4">
        <div className="shrink-0 relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700/50 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          
          {isCurrent && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse">
              <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {os}
                </h3>
                <span className="text-gray-400 dark:text-gray-500">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {browser}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {isCurrent ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700/50 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                      Activo ahora
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {timeAgo || "Última actividad no disponible"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {!isCurrent && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  disabled={loading}
                  onClick={handleRemove}
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 group-hover:scale-105"
                  isLoading={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionItem;