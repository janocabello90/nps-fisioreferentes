import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import {
  Settings, LogOut, Phone, MessageSquare,
  TrendingUp, TrendingDown, Minus, Users, Copy, Check,
  ChevronDown, ChevronUp, Filter, Plus, UserPlus, BarChart3
} from 'lucide-react'
import FRLogo from '../components/FRLogo'

export default function DashboardPage() {
  const { clinic, signOut, user } = useAuth()
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, detractor, passive, promoter
  const [timeRange, setTimeRange] = useState('30') // days
  const [copied, setCopied] = useState(false)
  const [expandedRow, setExpandedRow] = useState(null)

  // Quick add patient
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [qpName, setQpName] = useState('')
  const [qpEmail, setQpEmail] = useState('')
  const [qpPhone, setQpPhone] = useState('')
  const [qpAdding, setQpAdding] = useState(false)
  const [qpResult, setQpResult] = useState(null) // { token, name, isExisting }

  useEffect(() => {
    if (clinic) fetchResponses()
  }, [clinic, timeRange])

  async function fetchResponses() {
    setLoading(true)
    const since = new Date()
    since.setDate(since.getDate() - parseInt(timeRange))

    const { data, error } = await supabase
      .from('nps_responses')
      .select('*, patients(name, token)')
      .eq('clinic_id', clinic.id)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })

    if (data) setResponses(data)
    setLoading(false)
  }

  // Calculations
  const filteredResponses = filter === 'all'
    ? responses
    : responses.filter(r => r.category === filter)

  const totalResponses = responses.length
  const detractors = responses.filter(r => r.category === 'detractor')
  const passives = responses.filter(r => r.category === 'passive')
  const promoters = responses.filter(r => r.category === 'promoter')

  const avgScore = totalResponses > 0
    ? (responses.reduce((sum, r) => sum + r.score, 0) / totalResponses).toFixed(1)
    : 0

  const pendingCallbacks = responses.filter(r => r.wants_callback && !r.callback_done).length

  // NPS by staff member
  const staffStats = (() => {
    const map = {}
    responses.forEach(r => {
      if (r.staff_members && r.staff_members.length > 0) {
        r.staff_members.forEach(name => {
          if (!map[name]) map[name] = { scores: [], detractors: 0, passives: 0, promoters: 0 }
          map[name].scores.push(r.score)
          if (r.score <= 6) map[name].detractors++
          else if (r.score <= 8) map[name].passives++
          else map[name].promoters++
        })
      }
    })
    return Object.entries(map).map(([name, data]) => {
      const total = data.scores.length
      const avg = (data.scores.reduce((s, v) => s + v, 0) / total).toFixed(1)
      return { name, total, avg, ...data }
    }).sort((a, b) => parseFloat(b.avg) - parseFloat(a.avg))
  })()

  function getScoreColor(score) {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  function getScoreBg(score) {
    if (score >= 8) return 'bg-green-50 border-green-200'
    if (score >= 6) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  function getCategoryBadge(category) {
    const styles = {
      detractor: 'bg-red-100 text-red-700',
      passive: 'bg-yellow-100 text-yellow-700',
      promoter: 'bg-green-100 text-green-700'
    }
    const labels = {
      detractor: 'Detractor',
      passive: 'Pasivo',
      promoter: 'Promotor'
    }
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[category]}`}>
        {labels[category]}
      </span>
    )
  }

  function copySurveyUrl() {
    const url = `${window.location.origin}/encuesta/${clinic?.slug || ''}`
    try {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => {
        // Fallback for browsers that block clipboard API
        const textArea = document.createElement('textarea')
        textArea.value = url
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } catch {
      prompt('Copia este enlace:', url)
    }
  }

  async function quickAddPatient(e) {
    e.preventDefault()
    if (!qpName.trim()) return
    setQpAdding(true)
    setQpResult(null)

    try {
      const emailTrimmed = qpEmail.trim().toLowerCase() || null
      let foundPatient = null
      let isExisting = false

      // Try to find by email first
      if (emailTrimmed) {
        const { data: existing } = await supabase
          .from('patients')
          .select('*')
          .eq('clinic_id', clinic.id)
          .eq('email', emailTrimmed)
          .single()

        if (existing) {
          foundPatient = existing
          isExisting = true
          // Update name/phone if provided
          const updates = {}
          if (existing.name !== qpName.trim()) updates.name = qpName.trim()
          if (qpPhone.trim() && !existing.phone) updates.phone = qpPhone.trim()
          if (Object.keys(updates).length > 0) {
            await supabase.from('patients').update(updates).eq('id', existing.id)
          }
        }
      }

      if (!foundPatient) {
        const { data: newPatient, error } = await supabase
          .from('patients')
          .insert({
            clinic_id: clinic.id,
            name: qpName.trim(),
            email: emailTrimmed,
            phone: qpPhone.trim() || null
          })
          .select()
          .single()

        if (error) throw error
        foundPatient = newPatient
      }

      setQpResult({ token: foundPatient.token, name: foundPatient.name, isExisting })
      setQpName('')
      setQpEmail('')
      setQpPhone('')
    } catch (err) {
      console.error('Error creating patient:', err)
    }
    setQpAdding(false)
  }

  function copyPatientUrl(token) {
    const url = `${window.location.origin}/encuesta/${clinic?.slug}/p/${token}`
    try {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => {
        prompt('Copia este enlace:', url)
      })
    } catch {
      prompt('Copia este enlace:', url)
    }
  }

  async function toggleCallbackDone(responseId, currentStatus) {
    await supabase
      .from('nps_responses')
      .update({ callback_done: !currentStatus })
      .eq('id', responseId)
    fetchResponses()
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FRLogo size="md" variant="compact" />
            <div className="h-6 w-px bg-gray-200"></div>
            {clinic?.logo_url && (
              <img src={clinic.logo_url} alt="" className="h-8 object-contain" />
            )}
            <span className="font-semibold text-gray-800">{clinic?.name || 'Panel NPS'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/panel/pacientes" className="btn-secondary text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4" /> Pacientes
            </Link>
            <Link to="/panel/ajustes" className="btn-secondary text-sm flex items-center gap-1.5">
              <Settings className="w-4 h-4" /> Ajustes
            </Link>
            <button onClick={signOut} className="text-gray-400 hover:text-gray-600" title="Cerrar sesión">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Survey URL + Quick add patient */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Enlace genérico (QR / recepción)</p>
              <code className="text-sm text-brand-600 bg-brand-50 px-2 py-1 rounded">
                {window.location.origin}/encuesta/{clinic?.slug}
              </code>
            </div>
            <button onClick={copySurveyUrl} className="btn-secondary text-sm flex items-center gap-1.5">
              {copied && !qpResult ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied && !qpResult ? 'Copiado' : 'Copiar enlace'}
            </button>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-gray-400" />
                Enlace personalizado por paciente
              </p>
              <button
                onClick={() => { setShowQuickAdd(!showQuickAdd); setQpResult(null) }}
                className="btn-primary text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Crear paciente
              </button>
            </div>

            {showQuickAdd && (
              <form onSubmit={quickAddPatient} className="bg-gray-50 rounded-lg p-4 mb-3">
                <div className="grid sm:grid-cols-3 gap-2 mb-3">
                  <input
                    type="text"
                    value={qpName}
                    onChange={e => setQpName(e.target.value)}
                    placeholder="Nombre *"
                    className="input-field text-sm"
                    required
                    autoFocus
                  />
                  <input
                    type="email"
                    value={qpEmail}
                    onChange={e => setQpEmail(e.target.value)}
                    placeholder="Email (opcional)"
                    className="input-field text-sm"
                  />
                  <input
                    type="tel"
                    value={qpPhone}
                    onChange={e => setQpPhone(e.target.value)}
                    placeholder="Teléfono (opcional)"
                    className="input-field text-sm"
                  />
                </div>
                <button type="submit" disabled={qpAdding || !qpName.trim()} className="btn-primary text-sm">
                  {qpAdding ? 'Creando...' : 'Crear y generar enlace'}
                </button>
              </form>
            )}

            {qpResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-green-800 font-medium">
                    {qpResult.isExisting
                      ? `"${qpResult.name}" ya existía — enlace actualizado`
                      : `Paciente "${qpResult.name}" creado`}
                  </p>
                  <code className="text-xs text-green-600 mt-1 block break-all">
                    {window.location.origin}/encuesta/{clinic?.slug}/p/{qpResult.token}
                  </code>
                </div>
                <button
                  onClick={() => copyPatientUrl(qpResult.token)}
                  className="btn-secondary text-xs flex items-center gap-1 flex-shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copiado' : 'Copiar enlace'}
                </button>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-2">
              Crea pacientes y envíales su enlace personalizado por WhatsApp. Su NPS quedará vinculado a su perfil.
            </p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`card border ${getScoreBg(parseFloat(avgScore))}`}>
            <p className="text-xs text-gray-500 mb-1">Puntuación NPS</p>
            <p className={`text-3xl font-bold ${getScoreColor(parseFloat(avgScore))}`}>{avgScore}<span className="text-lg font-normal text-gray-400">/10</span></p>
          </div>
          <div className="card">
            <p className="text-xs text-gray-500 mb-1">Respuestas</p>
            <p className="text-3xl font-bold text-gray-800">{totalResponses}</p>
          </div>
          <div className="card">
            <p className="text-xs text-gray-500 mb-1">Distribución</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-red-600 font-medium">{detractors.length}</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-yellow-600 font-medium">{passives.length}</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-green-600 font-medium">{promoters.length}</span>
            </div>
            <div className="flex text-[10px] text-gray-400 gap-2 mt-0.5">
              <span>Det.</span><span>Pas.</span><span>Prom.</span>
            </div>
          </div>
          <div className="card">
            <p className="text-xs text-gray-500 mb-1">Llamadas pendientes</p>
            <p className="text-3xl font-bold text-orange-600">{pendingCallbacks}</p>
          </div>
        </div>

        {/* NPS by Staff Member */}
        {staffStats.length > 0 && (
          <div className="card mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" /> NPS por profesional
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {staffStats.map(staff => (
                <div key={staff.name} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 text-sm">{staff.name}</span>
                    <span className={`text-lg font-bold ${
                      parseFloat(staff.avg) >= 8 ? 'text-green-600' :
                      parseFloat(staff.avg) >= 6 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {staff.avg}
                    </span>
                  </div>
                  {/* Bar */}
                  <div className="flex h-2 rounded-full overflow-hidden bg-gray-100 mb-2">
                    {staff.total > 0 && (
                      <>
                        {staff.detractors > 0 && (
                          <div
                            className="bg-red-400 h-full"
                            style={{ width: `${(staff.detractors / staff.total) * 100}%` }}
                          />
                        )}
                        {staff.passives > 0 && (
                          <div
                            className="bg-yellow-400 h-full"
                            style={{ width: `${(staff.passives / staff.total) * 100}%` }}
                          />
                        )}
                        {staff.promoters > 0 && (
                          <div
                            className="bg-green-400 h-full"
                            style={{ width: `${(staff.promoters / staff.total) * 100}%` }}
                          />
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>{staff.total} resp.</span>
                    <span>
                      <span className="text-red-500">{staff.detractors}</span>
                      {' / '}
                      <span className="text-yellow-500">{staff.passives}</span>
                      {' / '}
                      <span className="text-green-500">{staff.promoters}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Filtrar:</span>
          </div>
          {[
            { key: 'all', label: 'Todos' },
            { key: 'detractor', label: 'Detractores' },
            { key: 'passive', label: 'Pasivos' },
            { key: 'promoter', label: 'Promotores' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                filter === f.key
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}

          <div className="ml-auto">
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
              <option value="365">Último año</option>
            </select>
          </div>
        </div>

        {/* Responses table */}
        <div className="card overflow-hidden p-0">
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600 mx-auto"></div>
            </div>
          ) : filteredResponses.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No hay respuestas todavía</p>
              <p className="text-sm mt-1">Comparte el enlace de la encuesta con tus pacientes</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Fecha</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Paciente</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Atendido por</th>
                    <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Nota</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Categoría</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Comentario</th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Teléfono</th>
                    <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Llamada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredResponses.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {r.patients?.name ? (
                          <span className="font-medium text-gray-700">{r.patients.name}</span>
                        ) : (
                          <span className="text-gray-300">Anónimo</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {r.staff_members && r.staff_members.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {r.staff_members.map((name, i) => (
                              <span key={i} className="bg-brand-50 text-brand-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                {name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          r.score <= 6 ? 'bg-red-100 text-red-700' :
                          r.score <= 8 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {r.score}
                        </span>
                      </td>
                      <td className="px-4 py-3">{getCategoryBadge(r.category)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {r.feedback_text || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {r.phone_number ? (
                          <a href={`tel:${r.phone_number}`} className="text-brand-600 hover:underline flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" /> {r.phone_number}
                          </a>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.wants_callback ? (
                          <button
                            onClick={() => toggleCallbackDone(r.id, r.callback_done)}
                            className={`text-xs px-2 py-1 rounded-full ${
                              r.callback_done
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            }`}
                          >
                            {r.callback_done ? '✓ Hecho' : 'Pendiente'}
                          </button>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
