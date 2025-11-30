import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Landing Page
import Landing from './pages/Landing';

// Employee Pages
import EmployeeLogin from './pages/employee/Login';
import EmployeeRegister from './pages/employee/Register';
import EmployeeDashboard from './pages/employee/Dashboard';
import AttendanceHistory from './pages/employee/AttendanceHistory';
import Profile from './pages/employee/Profile';

// Manager Pages
import ManagerLogin from './pages/manager/Login';
import ManagerDashboard from './pages/manager/Dashboard';
import AllAttendance from './pages/manager/AllAttendance';
import TeamCalendar from './pages/manager/TeamCalendar';
import Reports from './pages/manager/Reports';

const App = () => {
  const { user } = useSelector((state) => state.auth);

  const Layout = ({ children }) => {
    if (!user) return children;
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    );
  };

  return (
    <Routes>
      {/* Landing Page */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to={user.role === 'employee' ? '/employee/dashboard' : '/manager/dashboard'}
              replace
            />
          ) : (
            <Landing />
          )
        }
      />
      
      {/* Employee Login */}
      <Route
        path="/employee/login"
        element={
          user && user.role === 'employee' ? (
            <Navigate to="/employee/dashboard" replace />
          ) : user && user.role === 'manager' ? (
            <Navigate to="/manager/dashboard" replace />
          ) : (
            <Layout>
              <EmployeeLogin />
            </Layout>
          )
        }
      />
      
      {/* Old login route - redirect to landing */}
      <Route
        path="/login"
        element={<Navigate to="/" replace />}
      />
      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/employee/dashboard" replace />
          ) : (
            <Layout>
              <EmployeeRegister />
            </Layout>
          )
        }
      />

      {/* Employee Routes */}
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <EmployeeDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/attendance"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <AttendanceHistory />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/profile"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Manager Login */}
      <Route
        path="/manager/login"
        element={
          user && user.role === 'manager' ? (
            <Navigate to="/manager/dashboard" replace />
          ) : user && user.role === 'employee' ? (
            <Navigate to="/employee/dashboard" replace />
          ) : (
            <Layout>
              <ManagerLogin />
            </Layout>
          )
        }
      />
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <Layout>
              <ManagerDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/attendance"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <Layout>
              <AllAttendance />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/calendar"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <Layout>
              <TeamCalendar />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/reports"
        element={
          <ProtectedRoute allowedRoles={['manager']}>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

