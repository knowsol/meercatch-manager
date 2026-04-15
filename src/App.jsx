import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PanelProvider } from './context/PanelContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';

import Dashboard from './pages/Dashboard';
import GroupList from './pages/groups/GroupList';
import DeviceList from './pages/devices/DeviceList';
import PolicyList from './pages/policies/PolicyList';
import PauseList from './pages/pauses/PauseList';
import PauseHistory from './pages/pauses/PauseHistory';
import DetectionList from './pages/detections/DetectionList';
import UserList from './pages/users/UserList';
import Licenses from './pages/licenses/Licenses';
import Notifications from './pages/notifications/Notifications';
import Account from './pages/account/Account';
import Components from './pages/components/Components';

function AppInner() {
  const { loggedIn } = useAuth();
  if (!loggedIn) return <Login />;
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/groups" element={<GroupList />} />
        <Route path="/devices" element={<DeviceList />} />
        <Route path="/policies" element={<PolicyList />} />
        <Route path="/pauses" element={<PauseList />} />
        <Route path="/pauses-history" element={<PauseHistory />} />
        <Route path="/detections" element={<DetectionList />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/licenses" element={<Licenses />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/account" element={<Account />} />
        <Route path="/components" element={<Components />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PanelProvider>
          <BrowserRouter>
            <AppInner />
          </BrowserRouter>
        </PanelProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
