import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react'
import FRLogo from '../components/FRLogo'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    // Supabase automatically picks up the recovery token from the URL hash
    // and establishes a session. We listen for the PASSWORD_RECOVERY event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true)
      }
    })

    // Also check if there's already a session (user might have refreshed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Error al actualizar la contraseña. El enlace puede haber expirado.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    // Redirect to panel after 3 seconds
    setTimeout(() => navigate('/panel'), 3000)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <div className="card text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Contraseña actualizada</h2>
            <p className="text-gray-500 text-sm mb-4">
              Tu contraseña ha sido cambiada correctamente. Redirigiendo al panel...
            </p>
            <Link to="/panel" className="btn-primary w-full inline-block text-center">
              Ir al panel
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FRLogo size="xl" variant="full" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Nueva contraseña</h1>
          <p className="text-gray-500 text-sm mt-1">Elige tu nueva contraseña</p>
        </div>

        {!sessionReady ? (
          <div className="card text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Verificando enlace...</p>
            <p className="text-gray-400 text-xs mt-2">
              Si no se carga, el enlace puede haber expirado.{' '}
              <Link to="/login" className="text-brand-600 hover:underline">Solicita uno nuevo</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nueva contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
                autoFocus
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="Repite tu contraseña"
                minLength={6}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? 'Guardando...' : (
                <>
                  <Lock className="w-4 h-4" /> Cambiar contraseña
                </>
              )}
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
