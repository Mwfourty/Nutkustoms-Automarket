import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import StorePage from './pages/StorePage';
import SellPage from './pages/SellPage';
import ListingPage from './pages/ListingPage';
import GaragePage from './pages/GaragePage';
import GaragesPage from './pages/GaragesPage';

const LegacyGarageRedirect = () => {
  const { garageId } = useParams();
  return <Navigate to={`/garages/${garageId}`} replace />;
};
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
              <Route path="/listings/:id" element={<ListingPage />} />
              <Route path="/garage" element={<GaragePage />} />
              <Route path="/garages" element={<GaragesPage />} />
              <Route path="/garages/:garageId" element={<GaragePage />} />
              <Route path="/garage/:garageId" element={<LegacyGarageRedirect />} />
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