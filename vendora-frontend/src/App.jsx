// @module frontend | Vendora v1.0 | SPIT Mini Project AY 2026-27
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import VendorSidebar from './components/common/VendorSidebar';
import AdminSidebar from './components/common/AdminSidebar';
import Loading from './components/common/Loading';
import { useAuth } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Catalog from './pages/Customer/Catalog';
import CustomerOrders from './pages/Customer/Orders';
import Notifications from './pages/Customer/Notifications';
import VendorDashboard from './pages/Vendor/Dashboard';
import VendorProducts from './pages/Vendor/Products';
import VendorOrders from './pages/Vendor/Orders';
import VendorAnalytics from './pages/Vendor/Analytics';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminVendors from './pages/Admin/Vendors';
import AdminCategories from './pages/Admin/Categories';
import AdminReports from './pages/Admin/Reports';
import AdminProducts from './pages/Admin/Products';

const homeForRole = (role) => (role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor' : '/customer');

function ProtectedRoute({ role }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Loading label="Restoring your Vendora session…" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to={homeForRole(user?.role)} replace />;
  return <Outlet />;
}

function GuestRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Loading />;
  return isAuthenticated ? <Navigate to={homeForRole(user?.role)} replace /> : <Outlet />;
}

function RoleHome() {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Loading />;
  return <Navigate to={isAuthenticated ? homeForRole(user?.role) : '/login'} replace />;
}

function CustomerLayout() {
  return <div className="min-h-screen bg-slate-50"><Navbar /><Outlet /></div>;
}

function PortalLayout({ type }) {
  const Sidebar = type === 'admin' ? AdminSidebar : VendorSidebar;
  return <div className="flex min-h-screen bg-slate-50"><Sidebar /><main className="min-w-0 flex-1 p-5 sm:p-7 lg:p-8"><div className="mx-auto max-w-[1400px]"><Outlet /></div></main></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute role="customer" />}>
          <Route element={<CustomerLayout />}>
            <Route path="/customer" element={<Catalog />} />
            <Route path="/customer/orders" element={<CustomerOrders />} />
            <Route path="/customer/notifications" element={<Notifications />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="vendor" />}>
          <Route element={<PortalLayout type="vendor" />}>
            <Route path="/vendor" element={<VendorDashboard />} />
            <Route path="/vendor/products" element={<VendorProducts />} />
            <Route path="/vendor/orders" element={<VendorOrders />} />
            <Route path="/vendor/analytics" element={<VendorAnalytics />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<PortalLayout type="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>
        </Route>

        <Route path="/" element={<RoleHome />} />
        <Route path="*" element={<RoleHome />} />
      </Routes>
    </BrowserRouter>
  );
}
