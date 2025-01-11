import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Debug from './components/Debug';
import Header from './components/Header';
import BackToTop from './components/BackToTop';
import FloatingChatButton from './components/FloatingChatButton';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PsychologistPage from './pages/PsychologistPage';
import InstitutionPage from './pages/InstitutionPage';
import PsychologistsListPage from './pages/PsychologistsListPage';
import InstitutionsListPage from './pages/InstitutionsListPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticlePage from './pages/ArticlePage';
import PricingPage from './pages/PricingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import PsychologistDashboard from './pages/dashboard/PsychologistDashboard';
import InstitutionDashboard from './pages/dashboard/InstitutionDashboard';
import ClientDashboard from './pages/dashboard/ClientDashboard';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminInstitutionsPage from './pages/admin/InstitutionsPage';
import AdminArticlesPage from './pages/admin/ArticlesPage';
import AdminSettingsPage from './pages/admin/SettingsPage';

const Routes = () => {
  return (
    <BrowserRouter>
      <Debug />
    <RouterRoutes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <>
            <Debug />
            <Header />
            <HomePage />
            <BackToTop />
            <FloatingChatButton />
          </>
        }
      />
      <Route
        path="/search"
        element={
          <>
            <Debug />
            <Header />
            <SearchPage />
            <BackToTop />
            <FloatingChatButton />
          </>
        }
      />
      <Route
        path="/psychologists"
        element={
          <>
            <Debug />
            <Header />
            <PsychologistsListPage />
            <BackToTop />
            <FloatingChatButton />
          </>
        }
      />
      <Route
        path="/psychologist/:id"
        element={
          <>
            <Debug />
            <Header />
            <PsychologistPage />
            <BackToTop />
            <FloatingChatButton />
          </>
        }
      />
      <Route
        path="/institutions"
        element={
          <>
            <Debug />
            <Header />
            <InstitutionsListPage />
            <BackToTop />
            <FloatingChatButton />
          </>
        }
      />
      <Route
        path="/institution/:id"
        element={
          <>
            <Debug />
            <Header />
            <InstitutionPage />
            <BackToTop />
            <FloatingChatButton />
          </>
        }
      />
      <Route
        path="/articles"
        element={
          <>
            <Debug />
            <Header />
            <ArticlesPage />
            <BackToTop />
            <FloatingChatButton />
          </>
        }
      />
      <Route
        path="/article/:id"
        element={
          <>
            <Debug />
            <Header />
            <ArticlePage />
            <BackToTop />
            <FloatingChatButton />
          </>
        }
      />
      <Route
        path="/pricing"
        element={
          <>
            <Debug />
            <Header />
            <PricingPage />
            <BackToTop />
            <FloatingChatButton />
          </>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard/*"
        element={<PrivateRoute><DashboardPage /></PrivateRoute>}
      />
      <Route
        path="/dashboard/admin/*"
        element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>}
      />
      <Route
        path="/dashboard/psychologist/*"
        element={<PrivateRoute roles={['psychologist']}><PsychologistDashboard /></PrivateRoute>}
      />
      <Route
        path="/dashboard/institute/*"
        element={<PrivateRoute roles={['institute']}><InstitutionDashboard /></PrivateRoute>}
      />
      <Route
        path="/dashboard/client/*"
        element={<PrivateRoute roles={['client']}><ClientDashboard /></PrivateRoute>}
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute roles={['admin']}>
            <AdminDashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute roles={['admin']}>
            <AdminUsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/institutions"
        element={
          <PrivateRoute roles={['admin']}>
            <AdminInstitutionsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/articles"
        element={
          <PrivateRoute roles={['admin']}>
            <AdminArticlesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <PrivateRoute roles={['admin']}>
            <AdminSettingsPage />
          </PrivateRoute>
        }
      />
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Routes;