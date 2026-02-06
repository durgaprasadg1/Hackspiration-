"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Group } from "@/utils/algorand";
import { supabase } from "@/utils/supabase";

interface AppContextType {
  address: string | null;
  setAddress: (address: string | null) => void;
  activeGroup: Group | null;
  setActiveGroup: (group: Group | null) => void;
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("split_it_groups");
    if (saved) {
      setGroups(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (groups.length > 0) {
      localStorage.setItem("split_it_groups", JSON.stringify(groups));
    }
  }, [groups]);

  return (
    <AppContext.Provider
      value={{
        address,
        setAddress,
        activeGroup,
        setActiveGroup,
        groups,
        setGroups,
        isLoading,
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
