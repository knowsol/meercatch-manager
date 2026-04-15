import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PanelProvider } from './context/PanelContext';
import Layout from './components/layout/Layout';

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

export default function App() {
  return (
    <ThemeProvider>
      <PanelProvider>
        <BrowserRouter>
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
            </Routes>
          </Layout>
        </BrowserRouter>
      </PanelProvider>
    </ThemeProvider>
  );
}
