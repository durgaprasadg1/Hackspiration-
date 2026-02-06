"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Group } from "@/utils/algorand";

interface AppContextType {
  address: string | null;
  setAddress: (address: string | null) => void;
  activeGroup: Group | null;
  setActiveGroup: (group: Group | null) => void;
  groups: Group[];
  setGroups: (groups: Group[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  return (
    <AppContext.Provider
      value={{
        address,
        setAddress,
        activeGroup,
        setActiveGroup,
        groups,
        setGroups,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
};
