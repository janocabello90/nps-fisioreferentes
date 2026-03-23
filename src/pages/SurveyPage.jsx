import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Star, Phone, MessageSquare, ExternalLink, CheckCircle2, AlertCircle, User, BarChart3 } from 'lucide-react'

const STEPS = {
  STAFF: 'staff',
  SCORE: 'score',
  FEEDBACK: 'feedback',
  PHONE: 'phone',
  THANK_YOU: 'thank_you',
  REDIRECT_REVIEW: 'redirect_review'
}

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

  const [step, setStep] = useState(null)
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

      const hasTeam = clinicData.team_members && clinicData.team_members.length > 0
      const firstStep = hasTeam ? STEPS.STAFF : STEPS.SCORE

      if (patientToken) {
        const { data: patientData } = await supabase
          .from('patients')
          .select('*')
          .eq('token', patientToken)
          .eq('clinic_id', clinicData.id)
          .single()

        if (patientData) {
          setPatient(patientData)
        }
      }

      setStep(firstStep)
    } catch (err) {
      setError('Error al cargar la encuesta.')
    }
    setLoading(false)
  }

  function getScoreCategory
