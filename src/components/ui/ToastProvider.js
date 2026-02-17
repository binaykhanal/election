"use client";
import * as React from "react";
import * as Toast from "@radix-ui/react-toast";
import { X } from "lucide-react";

export const ToastContext = React.createContext({
  showToast: (title, description, type = "success") => {},
});

export function ToastProvider({ children }) {
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState({
    title: "",
    description: "",
    type: "success",
  });

  const showToast = (title, description, type = "success") => {
    setContent({ title, description, type });
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right">
        {children}

        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className={`bg-white rounded-xl shadow-2xl border p-4 grid grid-cols-[1fr_auto] gap-x-4 items-center data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-out ${
            content.type === "error"
              ? "border-l-4 border-l-red-600"
              : "border-l-4 border-l-green-600"
          }`}
        >
          <div className="flex flex-col gap-1">
            <Toast.Title className="text-sm font-bold text-gray-900">
              {content.title}
            </Toast.Title>
            <Toast.Description className="text-xs text-gray-500">
              {content.description}
            </Toast.Description>
          </div>
          <Toast.Close className="text-gray-400 hover:text-gray-900 transition-colors">
            <X size={16} />
          </Toast.Close>
        </Toast.Root>

        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-[390px] max-w-[100vw] m-0 list-none z-[100] outline-none" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}

export const useToast = () => React.useContext(ToastContext);
