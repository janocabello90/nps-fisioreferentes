import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'
import SurveyPage from './pages/SurveyPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'
import PatientsPage from './pages/PatientsPage'
import LandingPage from './pages/LandingPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public: Survey for patients */}
      <Route path="/encuesta/:clinicSlug" element={<SurveyPage />} />
      <Route path="/encuesta/:clinicSlug/p/:patientToken" element={<SurveyPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* Protected: Clinic admin */}
      <Route path="/panel" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/panel/ajustes" element={
        <ProtectedRoute><SettingsPage /></ProtectedRoute>
      } />
      <Route path="/panel/pacientes" element={
        <ProtectedRoute><PatientsPage /></ProtectedRoute>
      } />

      {/* Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
