import { toast } from 'react-toastify';

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showInfoToast = (message) => {
  toast.info(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showWarningToast = (message) => {
  toast.warning(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// For confirmation dialogs, we'll use a custom approach
export const showConfirmToast = (message, onConfirm, onCancel) => {
  const Msg = ({ closeToast }) => (
    <div>
      <p className="mb-3">{message}</p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            onConfirm();
            closeToast();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Confirm
        </button>
        <button
          onClick={() => {
            if (onCancel) onCancel();
            closeToast();
          }}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  toast.warning(Msg, {
    position: "top-center",
    autoClose: false,
    closeOnClick: false,
    closeButton: false,
    draggable: false,
  });
};
