import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Building2, AlertCircle } from 'lucide-react'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [clinicName, setClinicName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [googleReviewUrl, setGoogleReviewUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 2. Sign in explicitly to ensure session is active (fixes RLS)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (signInError) {
      setError('Cuenta creada pero no se pudo iniciar sesión. Prueba desde Login.')
      setLoading(false)
      return
    }

    // 3. Create clinic record (now session is guaranteed)
    const slug = slugify(clinicName)
    const { data: clinicData, error: clinicError } = await supabase
      .from('clinics')
      .insert({
        owner_id: authData.user.id,
        name: clinicName,
        slug: slug,
        google_review_url: googleReviewUrl || null,
        primary_color: '#0074c5'
      })
      .select()

    if (clinicError) {
      console.error('Clinic creation error:', clinicError)
      if (clinicError.code === '23505') {
        setError('Ya existe una clínica con ese nombre. Prueba otro nombre.')
      } else {
        setError(`Error al crear la clínica: ${clinicError.message}`)
      }
      setLoading(false)
      return
    }

    navigate('/panel')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Registra tu clínica</h1>
          <p className="text-gray-500 text-sm mt-1">Crea tu sistema NPS en 2 minutos</p>
        </div>

        <form onSubmit={handleRegister} className="card">
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de la clínica</label>
            <input
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="input-field"
              placeholder="Ej: Clínica Podium"
              required
            />
            {clinicName && (
              <p className="text-xs text-gray-400 mt-1">
                URL de la encuesta: /encuesta/<span className="text-brand-600">{slugify(clinicName)}</span>
              </p>
            )}
          </div>

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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Enlace de Google Reviews
              <span className="text-gray-400 font-normal"> (opcional, puedes añadirlo luego)</span>
            </label>
            <input
              type="url"
              value={googleReviewUrl}
              onChange={(e) => setGoogleReviewUrl(e.target.value)}
              className="input-field"
              placeholder="https://g.page/r/tu-clinica/review"
            />
            <details className="mt-2 text-xs text-gray-400">
              <summary className="cursor-pointer hover:text-gray-600 font-medium">
                ¿Cómo consigo este enlace?
              </summary>
              <div className="mt-2 bg-gray-50 rounded-lg p-3 space-y-1.5 text-gray-500">
                <p><strong>Opción A — Desde Google Maps:</strong></p>
                <p>1. Busca tu clínica en <a href="https://maps.google.com" target="_blank" rel="noopener" className="text-brand-600 underline">Google Maps</a></p>
                <p>2. Haz clic en tu ficha de negocio</p>
                <p>3. Pulsa en <strong>"Escribir una reseña"</strong></p>
                <p>4. Copia la URL de la barra del navegador</p>
                <p className="pt-1.5"><strong>Opción B — Desde Google Business Profile:</strong></p>
                <p>1. Entra en <a href="https://business.google.com" target="_blank" rel="noopener" className="text-brand-600 underline">business.google.com</a></p>
                <p>2. Ve a <strong>Inicio → Pedir reseñas</strong></p>
                <p>3. Copia el enlace que te genera</p>
              </div>
            </details>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creando...' : 'Crear mi clínica'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-brand-600 hover:underline font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
