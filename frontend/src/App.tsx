import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StorePage from './pages/StorePage';
import SellPage from './pages/SellPage';
import GaragePage from './pages/GaragePage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import AppLayout from './layouts/AppLayout';
import { ThemeProvider } from './context/ThemeContext';
import { TabBarProvider } from './context/TabBarContext';

function App() {
  return (
    <ThemeProvider>
      <TabBarProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<StorePage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/garage" element={<GaragePage />} />
              <Route path="/garage/:garageId" element={<GaragePage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
            </Route>
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
          </Routes>
        </BrowserRouter>
      </TabBarProvider>
    </ThemeProvider>
  );
}

export default App;