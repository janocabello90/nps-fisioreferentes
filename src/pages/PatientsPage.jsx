import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import {
  ArrowLeft, Plus, Copy, Check, Search, User, TrendingUp,
  TrendingDown, Minus, ChevronDown, ChevronUp, X, ExternalLink
} from 'lucide-react'
import FRLogo from '../components/FRLogo'

export default function PatientsPage() {
  const { clinic } = useAuth()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [adding, setAdding] = useState(false)
  const [copiedToken, setCopiedToken] = useState(null)
  const [expandedPatient, setExpandedPatient] = useState(null)
  const [patientHistory, setPatientHistory] = useState({})

  useEffect(() => {
    if (clinic) fetchPatients()
  }, [clinic])

  async function fetchPatients() {
    setLoading(true)
    const { data } = await supabase
      .from('patients')
      .select('*, nps_responses(id, score, category, created_at, staff_members, feedback_text)')
      .eq('clinic_id', clinic.id)
      .order('created_at', { ascending: false })

    if (data) {
      setPatients(data)
    }
    setLoading(false)
  }

  async function addPatient(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)

    const { data, error } = await supabase
      .from('patients')
      .insert({
        clinic_id: clinic.id,
        name: newName.trim(),
        email: newEmail.trim() || null,
        phone: newPhone.trim() || null
      })
      .select()

    if (!error) {
      setNewName('')
      setNewEmail('')
      setNewPhone('')
      setShowAddForm(false)
      fetchPatients()
    }
    setAdding(false)
  }

  function getPatientSurveyUrl(token) {
    return `${window.location.origin}/encuesta/${clinic.slug}/p/${token}`
  }

  function copyPatientUrl(token) {
    const url = getPatientSurveyUrl(token)
    try {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedToken(token)
        setTimeout(() => setCopiedToken(null), 2000)
      }).catch(() => {
        prompt('Copia este enlace:', url)
      })
    } catch {
      prompt('Copia este enlace:', url)
    }
  }

  function getLastScore(patient) {
    if (!patient.nps_responses || patient.nps_responses.length === 0) return null
    const sorted = [...patient.nps_responses].sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    )
    return sorted[0]
  }

  function getScoreTrend(patient) {
    if (!patient.nps_responses || patient.nps_responses.length < 2) return null
    const sorted = [...patient.nps_responses].sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    )
    const diff = sorted[0].score - sorted[1].score
    if (diff > 0) return 'up'
    if (diff < 0) return 'down'
    return 'same'
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  const filteredPatients = patients.filter(p =>
    !search || (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
    (p.email && p.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/panel" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <FRLogo size="sm" variant="compact" />
            <div className="h-5 w-px bg-gray-200"></div>
            <span className="font-semibold text-gray-800">Pacientes</span>
            <span className="text-sm text-gray-400">({patients.length})</span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Añadir paciente
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Add form */}
        {showAddForm && (
          <form onSubmit={addPatient} className="card mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Nuevo paciente</h3>
            <div className="grid sm:grid-cols-3 gap-3 mb-4">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Nombre *"
                className="input-field"
                required
                autoFocus
              />
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="Email (opcional)"
                className="input-field"
              />
              <input
                type="tel"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                placeholder="Teléfono (opcional)"
                className="input-field"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={adding || !newName.trim()} className="btn-primary text-sm">
                {adding ? 'Añadiendo...' : 'Crear paciente'}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary text-sm">
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar paciente..."
            className="input-field pl-10"
          />
        </div>

        {/* Patient list */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600 mx-auto"></div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="card text-center py-12 text-gray-400">
            <User className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>{search ? 'No se encontraron pacientes' : 'No hay pacientes todavía'}</p>
            <p className="text-sm mt-1">
              {!search && 'Añade pacientes manualmente o se crearán cuando respondan la encuesta'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPatients.map(patient => {
              const lastResponse = getLastScore(patient)
              const trend = getScoreTrend(patient)
              const totalResponses = patient.nps_responses?.length || 0
              const isExpanded = expandedPatient === patient.id

              return (
                <div key={patient.id} className="card p-0 overflow-hidden">
                  {/* Main row */}
                  <div className="flex items-center gap-4 p-4">
                    {/* Score badge */}
                    <div className="flex-shrink-0">
                      {lastResponse ? (
                        <div className="relative">
                          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                            lastResponse.score <= 6 ? 'bg-red-100 text-red-700' :
                            lastResponse.score <= 8 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {lastResponse.score}
                          </span>
                          {trend && (
                            <span className="absolute -top-1 -right-1">
                              {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-green-500" />}
                              {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                              {trend === 'same' && <Minus className="w-3.5 h-3.5 text-gray-400" />}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-400 text-xs">
                          —
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{patient.name || 'Sin nombre'}</p>
                      <p className="text-xs text-gray-400">
                        {totalResponses} {totalResponses === 1 ? 'respuesta' : 'respuestas'}
                        {patient.email && ` · ${patient.email}`}
                        {patient.phone && ` · ${patient.phone}`}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => copyPatientUrl(patient.token)}
                        className="btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1"
                        title="Copiar enlace de encuesta"
                      >
                        {copiedToken === patient.token
                          ? <><Check className="w-3.5 h-3.5 text-green-600" /> Copiado</>
                          : <><Copy className="w-3.5 h-3.5" /> Enlace</>
                        }
                      </button>

                      {totalResponses > 0 && (
                        <button
                          onClick={() => setExpandedPatient(isExpanded ? null : patient.id)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          {isExpanded
                            ? <ChevronUp className="w-4 h-4" />
                            : <ChevronDown className="w-4 h-4" />
                          }
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded: Response history */}
                  {isExpanded && patient.nps_responses && patient.nps_responses.length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                      <p className="text-xs font-medium text-gray-500 mb-2">Historial de respuestas</p>
                      <div className="space-y-2">
                        {[...patient.nps_responses]
                          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                          .map(r => (
                          <div key={r.id} className="flex items-start gap-3 text-sm">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 ${
                              r.score <= 6 ? 'bg-red-100 text-red-700' :
                              r.score <= 8 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {r.score}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-500 text-xs">{formatDate(r.created_at)}</p>
                              {r.staff_members && r.staff_members.length > 0 && (
                                <p className="text-xs text-gray-400">
                                  Atendido por: {r.staff_members.join(', ')}
                                </p>
                              )}
                              {r.feedback_text && (
                                <p className="text-gray-600 text-xs mt-0.5 italic">"{r.feedback_text}"</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
