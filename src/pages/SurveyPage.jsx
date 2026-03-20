import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Star, Phone, MessageSquare, ExternalLink, CheckCircle2, AlertCircle, User } from 'lucide-react'

const STEPS = {
  IDENTIFY: 'identify',
  STAFF: 'staff',
  SCORE: 'score',
  FEEDBACK: 'feedback',
  PHONE: 'phone',
  THANK_YOU: 'thank_you',
  REDIRECT_REVIEW: 'redirect_review'
}

// Animated 5-star component (psychological bias for 8-10 scores)
function FiveStars() {
  return (
    <div className="flex justify-center gap-1 mb-4">
      {[0, 1, 2, 3, 4].map(i => (
        <Star
          key={i}
          className="w-8 h-8 text-yellow-400 fill-yellow-400"
          style={{
            animation: `starPop 0.4s ease-out ${i * 0.12}s both`
          }}
        />
      ))}
      <style>{`
        @keyframes starPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default function SurveyPage() {
  const { clinicSlug, patientToken } = useParams()
  const [clinic, setClinic] = useState(null)
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Identify step (for anonymous surveys)
  const [patientName, setPatientName] = useState('')
  const [patientEmail, setPatientEmail] = useState('')

  const [step, setStep] = useState(STEPS.IDENTIFY)
  const [staffMembers, setStaffMembers] = useState([])
  const [score, setScore] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [responseId, setResponseId] = useState(null)

  useEffect(() => {
    fetchClinicAndPatient()
  }, [clinicSlug, patientToken])

  async function fetchClinicAndPatient() {
    try {
      // 1. Fetch clinic
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .select('id, name, slug, logo_url, google_review_url, primary_color, welcome_message, team_members')
        .eq('slug', clinicSlug)
        .single()

      if (clinicError || !clinicData) {
        setError('No se ha encontrado esta clínica.')
        setLoading(false)
        return
      }
      setClinic(clinicData)

      // 2. If there's a patient token, fetch the patient
      if (patientToken) {
        const { data: patientData } = await supabase
          .from('patients')
          .select('*')
          .eq('token', patientToken)
          .eq('clinic_id', clinicData.id)
          .single()

        if (patientData) {
          setPatient(patientData)
          setPatientName(patientData.name || '')
          setPatientEmail(patientData.email || '')
          // Known patient: skip identify, go to staff or score
          const hasTeam = clinicData.team_members && clinicData.team_members.length > 0
          setStep(hasTeam ? STEPS.STAFF : STEPS.SCORE)
        } else {
          // Invalid token, treat as anonymous
          setStep(STEPS.IDENTIFY)
        }
      } else {
        // Anonymous survey, ask for identification
        setStep(STEPS.IDENTIFY)
      }
    } catch (err) {
      setError('Error al cargar la encuesta.')
    }
    setLoading(false)
  }

  function getScoreCategory(s) {
    if (s <= 6) return 'detractor'
    if (s <= 8) return 'passive'
    return 'promoter'
  }

  function getScoreColorClass(s) {
    if (s <= 6) return 'detractor'
    if (s <= 8) return 'passive'
    return 'promoter'
  }

  function toggleStaffMember(name) {
    setStaffMembers(prev =>
      prev.includes(name)
        ? prev.filter(m => m !== name)
        : [...prev, name]
    )
  }

  async function handleIdentifySubmit() {
    if (!patientName.trim()) return
    setSubmitting(true)

    try {
      // Create or find patient
      const { data: newPatient, error: patientError } = await supabase
        .from('patients')
        .insert({
          clinic_id: clinic.id,
          name: patientName.trim(),
          email: patientEmail.trim() || null
        })
        .select()
        .single()

      if (patientError) throw patientError
      setPatient(newPatient)
    } catch (err) {
      console.error('Error creating patient:', err)
      // Continue anyway, response will just not have patient_id
    }

    const hasTeam = clinic?.team_members && clinic.team_members.length > 0
    setStep(hasTeam ? STEPS.STAFF : STEPS.SCORE)
    setSubmitting(false)
  }

  function handleSkipIdentify() {
    const hasTeam = clinic?.team_members && clinic.team_members.length > 0
    setStep(hasTeam ? STEPS.STAFF : STEPS.SCORE)
  }

  function handleStaffSubmit() {
    setStep(STEPS.SCORE)
  }

  async function handleScoreSelect(selectedScore) {
    setScore(selectedScore)
  }

  async function handleScoreSubmit() {
    if (score === null) return
    setSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('nps_responses')
        .insert({
          clinic_id: clinic.id,
          score: score,
          category: getScoreCategory(score),
          staff_members: staffMembers.length > 0 ? staffMembers : null,
          patient_id: patient?.id || null
        })
        .select('id')
        .single()

      if (error) throw error
      setResponseId(data.id)

      const category = getScoreCategory(score)
      if (category === 'promoter') {
        setStep(STEPS.REDIRECT_REVIEW)
      } else {
        setStep(STEPS.FEEDBACK)
      }
    } catch (err) {
      console.error('Error saving score:', err)
      const category = getScoreCategory(score)
      if (category === 'promoter') {
        setStep(STEPS.REDIRECT_REVIEW)
      } else {
        setStep(STEPS.FEEDBACK)
      }
    }
    setSubmitting(false)
  }

  async function handleFeedbackSubmit() {
    setSubmitting(true)
    try {
      if (responseId) {
        await supabase
          .from('nps_responses')
          .update({ feedback_text: feedback })
          .eq('id', responseId)
      }
    } catch (err) {
      console.error('Error saving feedback:', err)
    }
    setStep(STEPS.PHONE)
    setSubmitting(false)
  }

  async function handlePhoneSubmit(skipPhone = false) {
    setSubmitting(true)
    try {
      if (responseId && !skipPhone && phone.trim()) {
        await supabase
          .from('nps_responses')
          .update({ phone_number: phone.trim(), wants_callback: true })
          .eq('id', responseId)

        // Also save phone to patient profile if they don't have one
        if (patient && !patient.phone) {
          await supabase
            .from('patients')
            .update({ phone: phone.trim() })
            .eq('id', patient.id)
        }
      }
    } catch (err) {
      console.error('Error saving phone:', err)
    }
    setStep(STEPS.THANK_YOU)
    setSubmitting(false)
  }

  function handleGoogleReviewRedirect() {
    if (clinic?.google_review_url) {
      window.open(clinic.google_review_url, '_blank')
    }
  }

  // --- LOADING & ERROR STATES ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="card text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const brandColor = clinic?.primary_color || '#0074c5'
  const hasTeam = clinic?.team_members && clinic.team_members.length > 0
  const showStars = score !== null && score >= 8

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg">
        {/* Clinic header */}
        <div className="text-center mb-6">
          {clinic?.logo_url && (
            <img src={clinic.logo_url} alt={clinic.name} className="h-16 mx-auto mb-3 object-contain" />
          )}
          <h1 className="text-xl font-semibold text-gray-800">{clinic?.name}</h1>
          {patient && (
            <p className="text-sm text-gray-400 mt-1">Hola, {patient.name}</p>
          )}
        </div>

        {/* --- STEP: IDENTIFY (anonymous surveys only) --- */}
        {step === STEPS.IDENTIFY && (
          <div className="card animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-7 h-7 text-brand-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                ¿Cómo te llamas?
              </h2>
              <p className="text-gray-400 text-sm">
                Para poder hacer un seguimiento de tu experiencia
              </p>
            </div>

            <div className="mb-3">
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Tu nombre"
                className="input-field"
                autoFocus
              />
            </div>

            <div className="mb-4">
              <input
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="Email (opcional)"
                className="input-field"
              />
            </div>

            <button
              onClick={handleIdentifySubmit}
              disabled={!patientName.trim() || submitting}
              className="btn-primary w-full"
              style={{ backgroundColor: patientName.trim() ? brandColor : undefined }}
            >
              {submitting ? 'Guardando...' : 'Continuar'}
            </button>

            <button
              onClick={handleSkipIdentify}
              className="w-full text-center text-sm text-gray-400 mt-3 hover:text-gray-600"
            >
              Prefiero no identificarme
            </button>
          </div>
        )}

        {/* --- STEP: STAFF MEMBER (multi-select) --- */}
        {step === STEPS.STAFF && hasTeam && (
          <div className="card animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-7 h-7 text-brand-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                ¿Quién del equipo te ha atendido?
              </h2>
              <p className="text-gray-400 text-sm">Puedes seleccionar más de uno</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {clinic.team_members.map(name => (
                <button
                  key={name}
                  onClick={() => toggleStaffMember(name)}
                  className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                    staffMembers.includes(name)
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {staffMembers.includes(name) && '✓ '}{name}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setStaffMembers([]); handleStaffSubmit() }}
              className="w-full text-center text-sm text-gray-400 mb-4 hover:text-gray-600"
            >
              No lo recuerdo
            </button>

            <button
              onClick={handleStaffSubmit}
              disabled={staffMembers.length === 0}
              className="btn-primary w-full"
              style={{ backgroundColor: staffMembers.length > 0 ? brandColor : undefined }}
            >
              Continuar
            </button>
          </div>
        )}

        {/* --- STEP: SCORE --- */}
        {step === STEPS.SCORE && (
          <div className="card animate-fadeIn">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {clinic?.welcome_message || '¿Cómo ha sido tu experiencia?'}
              </h2>
              <p className="text-gray-500 text-sm">
                Del 0 al 10, ¿cuánto recomendarías nuestra clínica a un amigo o familiar?
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <button
                  key={n}
                  onClick={() => handleScoreSelect(n)}
                  className={`nps-score-btn ${getScoreColorClass(n)} ${score === n ? 'selected' : ''}`}
                >
                  {n}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-xs text-gray-400 mb-6 px-1">
              <span>Nada probable</span>
              <span>Muy probable</span>
            </div>

            <button
              onClick={handleScoreSubmit}
              disabled={score === null || submitting}
              className="btn-primary w-full"
              style={{ backgroundColor: score !== null ? brandColor : undefined }}
            >
              {submitting ? 'Enviando...' : 'Continuar'}
            </button>
          </div>
        )}

        {/* --- STEP: FEEDBACK (Detractors 0-6 & Passives 7-8) --- */}
        {step === STEPS.FEEDBACK && (
          <div className="card animate-fadeIn">
            <div className="text-center mb-6">
              {score === 8 && <FiveStars />}

              {getScoreCategory(score) === 'detractor' ? (
                <>
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-7 h-7 text-red-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Vaya, parece que algo ha ido mal
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Lamentamos lo sucedido. ¿Podría contarnos más cuál ha sido el problema?
                  </p>
                </>
              ) : (
                <>
                  {score !== 8 && (
                    <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-7 h-7 text-yellow-600" />
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Muchas gracias por su opinión
                  </h2>
                  <p className="text-gray-500 text-sm">
                    ¿Podría decirnos qué tendríamos que mejorar para que nuestra próxima nota sea un 10?
                  </p>
                </>
              )}
            </div>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Escribe aquí tu comentario..."
              rows={4}
              className="input-field resize-none mb-4"
              autoFocus
            />

            <button
              onClick={handleFeedbackSubmit}
              disabled={submitting}
              className="btn-primary w-full"
              style={{ backgroundColor: brandColor }}
            >
              {submitting ? 'Enviando...' : 'Continuar'}
            </button>

            <button
              onClick={() => { setStep(STEPS.PHONE) }}
              className="w-full text-center text-sm text-gray-400 mt-3 hover:text-gray-600"
            >
              Prefiero no comentar
            </button>
          </div>
        )}

        {/* --- STEP: PHONE (Detractors & Passives) --- */}
        {step === STEPS.PHONE && (
          <div className="card animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-brand-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                ¿Querría que le llamemos?
              </h2>
              <p className="text-gray-500 text-sm">
                Deje su número de teléfono y alguien del equipo le llamará para tratar de solucionar el problema.
              </p>
            </div>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: 612 345 678"
              className="input-field mb-4"
              autoFocus
            />

            <button
              onClick={() => handlePhoneSubmit(false)}
              disabled={submitting || !phone.trim()}
              className="btn-primary w-full"
              style={{ backgroundColor: brandColor }}
            >
              {submitting ? 'Enviando...' : 'Enviar'}
            </button>

            <button
              onClick={() => handlePhoneSubmit(true)}
              className="w-full text-center text-sm text-gray-400 mt-3 hover:text-gray-600"
            >
              No, gracias
            </button>
          </div>
        )}

        {/* --- STEP: THANK YOU --- */}
        {step === STEPS.THANK_YOU && (
          <div className="card animate-fadeIn text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              ¡Muchas gracias!
            </h2>
            <p className="text-gray-500 text-sm">
              Su opinión es muy valiosa para nosotros. Nos ayuda a mejorar cada día.
            </p>
          </div>
        )}

        {/* --- STEP: REDIRECT TO GOOGLE REVIEWS (Promoters 9-10) --- */}
        {step === STEPS.REDIRECT_REVIEW && (
          <div className="card animate-fadeIn text-center">
            <FiveStars />

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              ¡Muchísimas gracias!
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Nos alegra saber que ha tenido una buena experiencia.
              Nos ayudan mucho sus reseñas de 5 estrellas. ¿Podría dejarnos una reseña en Google?
            </p>

            {clinic?.google_review_url ? (
              <button
                onClick={handleGoogleReviewRedirect}
                className="btn-primary w-full flex items-center justify-center gap-2"
                style={{ backgroundColor: brandColor }}
              >
                <Star className="w-5 h-5" />
                Dejar reseña en Google
                <ExternalLink className="w-4 h-4" />
              </button>
            ) : (
              <p className="text-gray-400 text-sm">Enlace de reseñas no configurado.</p>
            )}

            <button
              onClick={() => setStep(STEPS.THANK_YOU)}
              className="w-full text-center text-sm text-gray-400 mt-3 hover:text-gray-600"
            >
              Prefiero no hacerlo ahora
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-300 mt-6">
          Powered by <span className="font-medium">FisioReferentes</span>
        </p>
      </div>
    </div>
  )
}
