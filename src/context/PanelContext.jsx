'use client'
import { createContext, useContext, useState } from 'react';

const PanelContext = createContext();

export function PanelProvider({ children }) {
  const [panel, setPanel] = useState(null); // { component: <JSX> }

  const openPanel = (component) => setPanel({ component });
  const closePanel = () => setPanel(null);

  return (
    <PanelContext.Provider value={{ panel, openPanel, closePanel }}>
      {children}
    </PanelContext.Provider>
  );
}

export const usePanel = () => useContext(PanelContext);
