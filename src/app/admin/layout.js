import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata = {
  title: "Admin Dashboard - Ram Prasad Sapkota Campaign",
  description: "CMS Dashboard for managing campaign content",
};

export default function AdminLayout({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
