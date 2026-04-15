import Sidebar from './Sidebar';
import PanelShell from '../common/Panel';
import ToastContainer from '../common/Toast';
import { useToast } from '../../hooks/useToast';
import { createContext, useContext } from 'react';

const ToastCtx = createContext(() => {});
export const useToastCtx = () => useContext(ToastCtx);

export default function Layout({ children }) {
  const { toasts, toast } = useToast();
  return (
    <ToastCtx.Provider value={toast}>
      <div className="app">
        <Sidebar />
        <div className="mn">
          <div className="mb">{children}</div>
        </div>
        <PanelShell />
        <ToastContainer toasts={toasts} />
      </div>
    </ToastCtx.Provider>
  );
}
