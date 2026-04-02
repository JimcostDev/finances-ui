import { createContext, useContext, type ReactNode } from "react";

const ChurchContributionsContext = createContext<boolean>(false);

interface ChurchContributionsProviderProps {
  children: ReactNode;
  enabled: boolean;
}

export function ChurchContributionsProvider({
  children,
  enabled,
}: ChurchContributionsProviderProps) {
  return (
    <ChurchContributionsContext.Provider value={Boolean(enabled)}>
      {children}
    </ChurchContributionsContext.Provider>
  );
}

export function useChurchContributions() {
  return useContext(ChurchContributionsContext);
}
