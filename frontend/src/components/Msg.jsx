import { useEffect, useState } from "react";

export default function Msg({ text, type = "success" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (text) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [text]);

  if (!text || !visible) return null;

  const styleMap = {
    success: "bg-green-200 text-green-900",
    error: "bg-red-200 text-red-900",
    warning: "bg-yellow-100 text-yellow-900",
  };

  return (
    <div
      className={`fixed top-16 left-0 w-full z-50 px-4 py-2 rounded-none shadow-md text-center transition-opacity duration-1000 ${styleMap[type]}`}
    >
      {text}
    </div>
  );
}
