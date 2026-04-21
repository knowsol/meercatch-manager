'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface PanelState {
  component: ReactNode;
}

interface PanelContextValue {
  panel: PanelState | null;
  openPanel: (component: ReactNode) => void;
  closePanel: () => void;
}

const PanelContext = createContext<PanelContextValue | null>(null);

interface PanelProviderProps {
  children: ReactNode;
}

export function PanelProvider({ children }: PanelProviderProps) {
  const [panel, setPanel] = useState<PanelState | null>(null);

  const openPanel = (component: ReactNode) => setPanel({ component });
  const closePanel = () => setPanel(null);

  return (
    <PanelContext.Provider value={{ panel, openPanel, closePanel }}>
      {children}
    </PanelContext.Provider>
  );
}

export const usePanel = (): PanelContextValue => {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanel must be used within a PanelProvider');
  }
  return context;
};
