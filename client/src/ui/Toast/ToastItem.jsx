import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeToast } from './toastSlice';

function ToastItem({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 2000);

    return () => clearTimeout(timer);
  }, [toast.id]);

  return (
    <div className=" bg-gray-600/70 text-white sm:px-8 sm:py-4 sm:text-base text-center px-6 py-2 text-sm rounded-md tracking-wider mb-2">
      {toast.message}
    </div>
  );
}

export default ToastItem;
