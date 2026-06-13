import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Registration from './pages/Registration';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import AdminHomeContent from './pages/AdminHomeContent';
import AdminAnalytics from './pages/AdminAnalytics';
import ContactUs from './pages/ContactUs';
import Gallery from './pages/Gallery';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Registration />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="gallery" element={<Gallery />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="content" element={<AdminHomeContent />} />
          <Route path="content/:section" element={<AdminHomeContent />} />
          <Route path="home-content" element={<AdminHomeContent />} />
          <Route path="home-content/:section" element={<AdminHomeContent />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="analytics/:scope" element={<AdminAnalytics />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
