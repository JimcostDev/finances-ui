import { createContext, useContext } from "react";

const ChurchContributionsContext = createContext(false);

export function ChurchContributionsProvider({ children, enabled }) {
  return (
    <ChurchContributionsContext.Provider value={Boolean(enabled)}>
      {children}
    </ChurchContributionsContext.Provider>
  );
}

export function useChurchContributions() {
  return useContext(ChurchContributionsContext);
}
