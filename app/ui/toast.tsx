import { toast, TypeOptions } from 'react-toastify';

type ToastType = 'info' | 'success' | 'error' | 'warning';

/**
 * A standard wrapper for application notifications.
 * This is a function, not a component.
 */
const showToast = (message: string, type: ToastType) => {
  return toast(message, {
    type: type as TypeOptions,
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored", // Optional: matches your dark/light mode better
  });
};

export default showToast