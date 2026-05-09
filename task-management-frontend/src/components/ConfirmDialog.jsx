/**
 * ConfirmDialog component — confirmation modal before destructive actions.
 */
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Delete', danger = true }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in">
        <div className="p-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
            <AlertTriangle className={`h-6 w-6 ${danger ? 'text-red-600' : 'text-yellow-600'}`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{message}</p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl text-white transition-colors ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
