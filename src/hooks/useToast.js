import { useState } from "react";
import MDSnackbar from "components/MDSnackbar";

export default function useToast() {
  const [toast, setToast] = useState({
    open: false,
    color: "info",
    icon: "notifications",
    title: "",
    content: "",
  });

  const showToast = ({ color, icon, title, content }) => {
    setToast({ open: true, color, icon, title, content });
  };

  const closeToast = () => setToast({ ...toast, open: false });

  const ToastComponent = (
    <MDSnackbar
      color={toast.color}
      icon={toast.icon}
      title={toast.title}
      content={toast.content}
      open={toast.open}
      onClose={closeToast}
      close={closeToast}
      bgWhite
    />
  );

  return { showToast, ToastComponent };
}
