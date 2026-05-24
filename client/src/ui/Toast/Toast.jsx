import { useSelector } from 'react-redux';
import ToastItem from './ToastItem';

function Toast() {
  const { toasts } = useSelector((state) => state.toast);

  return (
    <div className="fixed  top-1/2 left-1/3 md:translate-x-20 translate-x-10 transition-all duration-500 z-30">
      {toasts.map((t) => (
        <ToastItem toast={t} key={t.id} />
      ))}
    </div>
  );
}

export default Toast;
