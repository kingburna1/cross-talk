import React from 'react';
import { ClipboardDocumentCheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ActionButtons = ({ onSave, onCancel, isSaleValid, isProcessing }) => {
    return (
        <div className="flex flex-col gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
            <button
                onClick={onSave}
                disabled={!isSaleValid || isProcessing}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg disabled:bg-gray-400"
            >
                <ClipboardDocumentCheckIcon className="w-5 h-5 inline mr-1" />
                {isProcessing ? 'Saving...' : 'Save Sale'}
            </button>
            <button onClick={onCancel} className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg">
                <XMarkIcon className="w-5 h-5 inline mr-1" /> Discard
            </button>
        </div>
    );
};
export default ActionButtons;
