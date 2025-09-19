// DirtyFormContext.tsx
import { createContext, useContext, useState } from "react";

interface DirtyFormContextType {
  isDirty: boolean;
  setDirty: (value: boolean) => void;
}

const DirtyFormContext = createContext<DirtyFormContextType | undefined>(undefined);

export const DirtyFormProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDirty, setIsDirty] = useState(false);
  return (
    <DirtyFormContext.Provider value={{ isDirty, setDirty: setIsDirty }}>
      {children}
    </DirtyFormContext.Provider>
  );
};

export const useDirtyForm = () => {
  const context = useContext(DirtyFormContext);
  if (!context) throw new Error("useDirtyForm must be used within DirtyFormProvider");
  return context;
};
