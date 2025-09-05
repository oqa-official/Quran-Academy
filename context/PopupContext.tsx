// context/PopupContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

const PopupContext = createContext<any>(null);

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <PopupContext.Provider value={{ open, setOpen }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
