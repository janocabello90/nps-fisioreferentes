import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Save, CheckCircle2, AlertCircle, Palette, Link2, Image, MessageSquare, Users, Plus, X } from 'lucide-react'
import FRLogo from '../components/FRLogo'

export default function SettingsPage() {
  const { clinic, refreshClinic } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    slug: '',
    google_review_url: '',
    logo_url: '',
    primary_color: '#0074c5',
    welcome_message: ''
  })
  const [teamMembers, setTeamMembers] = useState([])
  const [newMember, setNewMember] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (clinic) {
      setForm({
        name: clinic.name || '',
        slug: clinic.slug || '',
        google_review_url: clinic.google_review_url || '',
        logo_url: clinic.logo_url || '',
        primary_color: clinic.primary_color || '#0074c5',
        welcome_message: clinic.welcome_message || ''
      })
      setTeamMembers(clinic.team_members || [])
    }
  }, [clinic])

  function addTeamMember() {
    const name = newMember.trim()
    if (name && !teamMembers.includes(name)) {
      setTeamMembers(prev => [...prev, name])
      setNewMember('')
    }
  }

  function removeTeamMember(name) {
    setTeamMembers(prev => prev.filter(m => m !== name))
  }

  function handleMemberKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTeamMember()
    }
  }

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const { error } = await supabase
      .from('clinics')
      .update({
        name: form.name,
        google_review_url: form.google_review_url || null,
        logo_url: form.logo_url || null,
        primary_color: form.primary_color,
        welcome_message: form.welcome_message || null,
        team_members: teamMembers
      })
      .eq('id', clinic.id)

    if (error) {
      setError('Error al guardar los cambios.')
      setSaving(false)
      return
    }

    await refreshClinic()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const colorPresets = ['#0074c5', '#059669', '#7c3aed', '#dc2626', '#ea580c', '#0891b2', '#4f46e5', '#be185d']

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/panel" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <FRLogo size="sm" variant="compact" />
          <div className="h-5 w-px bg-gray-200"></div>
          <span className="font-semibold text-gray-800">Ajustes de la clínica</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSave} className="space-y-6">

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Cambios guardados correctamente.</span>
            </div>
          )}

          {/* Basic info */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" /> Información básica
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de la clínica</label>
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL de la encuesta</label>
              <div className="input-field bg-gray-50 text-gray-500">
                /encuesta/<span className="text-brand-600 font-medium">{form.slug}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">El slug no se puede cambiar tras el registro.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mensaje de bienvenida <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={form.welcome_message}
                onChange={e => handleChange('welcome_message', e.target.value)}
                className="input-field"
                placeholder="¿Cómo ha sido tu experiencia?"
              />
            </div>
          </div>

          {/* Google Reviews */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-gray-400" /> Google Reviews
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Enlace directo a Google Reviews</label>
              <input
                type="url"
                value={form.google_review_url}
                onChange={e => handleChange('google_review_url', e.target.value)}
                className="input-field"
                placeholder="https://g.page/r/tu-clinica/review"
              />
              <p className="text-xs text-gray-400 mt-1">
                Los pacientes que puntúen 9 o 10 serán redirigidos a este enlace para dejar una reseña de 5 estrellas.
              </p>
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
          </div>

          {/* Team Members */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" /> Equipo
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Añade a los miembros de tu equipo. Los pacientes podrán seleccionar quién les ha atendido en la encuesta.
            </p>

            {/* Current members */}
            {teamMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {teamMembers.map(name => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-lg"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => removeTeamMember(name)}
                      className="text-brand-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add new member */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMember}
                onChange={e => setNewMember(e.target.value)}
                onKeyDown={handleMemberKeyDown}
                className="input-field flex-1"
                placeholder="Nombre del profesional"
              />
              <button
                type="button"
                onClick={addTeamMember}
                disabled={!newMember.trim()}
                className="btn-secondary flex items-center gap-1.5 text-sm"
              >
                <Plus className="w-4 h-4" /> Añadir
              </button>
            </div>

            {teamMembers.length === 0 && (
              <p className="text-xs text-gray-300 mt-2">
                Si no añades miembros, la encuesta no preguntará quién atendió al paciente.
              </p>
            )}
          </div>

          {/* Branding */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4 text-gray-400" /> Personalización
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                <Image className="w-4 h-4 text-gray-400" /> URL del logo <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="url"
                value={form.logo_url}
                onChange={e => handleChange('logo_url', e.target.value)}
                className="input-field"
                placeholder="https://tu-clinica.com/logo.png"
              />
              {form.logo_url && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <img src={form.logo_url} alt="Preview" className="h-12 object-contain" onError={e => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Color principal</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.primary_color}
                  onChange={e => handleChange('primary_color', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer"
                />
                <div className="flex gap-1.5">
                  {colorPresets.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleChange('primary_color', color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        form.primary_color === color ? 'border-gray-800 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Save */}
          <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}
