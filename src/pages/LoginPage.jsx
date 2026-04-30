import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { LogIn, AlertCircle, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import FRLogo from '../components/FRLogo'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Password reset state
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetError, setResetError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
      return
    }

    navigate('/panel')
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setResetError('')
    setResetLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      setResetError('Error al enviar el email. Verifica tu dirección.')
      setResetLoading(false)
      return
    }

    setResetSent(true)
    setResetLoading(false)
  }

  // --- PASSWORD RESET VIEW ---
  if (showReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <FRLogo size="xl" variant="full" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Recuperar contraseña</h1>
            <p className="text-gray-500 text-sm mt-1">Te enviaremos un enlace para crear una nueva contraseña</p>
          </div>

          {resetSent ? (
            <div className="card text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Email enviado</h2>
              <p className="text-gray-500 text-sm mb-4">
                Hemos enviado un enlace de recuperación a <strong>{resetEmail}</strong>. Revisa tu bandeja de entrada (y spam).
              </p>
              <button
                onClick={() => { setShowReset(false); setResetSent(false); setResetEmail('') }}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Volver al login
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="card">
              {resetError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email de tu cuenta
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="input-field"
                  placeholder="tu@clinica.com"
                  required
                  autoFocus
                />
              </div>

              <button type="submit" disabled={resetLoading} className="btn-primary w-full flex items-center justify-center gap-2">
                {resetLoading ? 'Enviando...' : (
                  <>
                    <Mail className="w-4 h-4" /> Enviar enlace de recuperación
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setShowReset(false); setResetError('') }}
                className="w-full text-center text-sm text-gray-400 mt-3 hover:text-gray-600"
              >
                Volver al login
              </button>
            </form>
          )}

          <div className="flex justify-center mt-6">
            <FRLogo size="sm" variant="badge" />
          </div>
        </div>
      </div>
    )
  }

  // --- LOGIN VIEW ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FRLogo size="xl" variant="full" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Accede a tu panel</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona las encuestas NPS de tu clínica</p>
        </div>

        <form onSubmit={handleLogin} className="card">
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="tu@clinica.com"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="mb-6 text-right">
            <button
              type="button"
              onClick={() => { setShowReset(true); setResetEmail(email) }}
              className="text-sm text-brand-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Accediendo...' : 'Acceder'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-brand-600 hover:underline font-medium">
            Registra tu clínica
          </Link>
        </p>

        <div className="flex justify-center mt-6">
          <FRLogo size="sm" variant="badge" />
        </div>
      </div>
    </div>
  )
}
