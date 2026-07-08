import { useState, useEffect } from 'react'
import { X, Globe, Sparkles, Settings } from 'lucide-react'
import LangFlag from './LangFlag'

const CURRENT_ANNOUNCEMENT = 'announce-languages-v1'

export default function AnnouncementModal() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(CURRENT_ANNOUNCEMENT)
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  function dismiss() {
    setShow(false)
    localStorage.setItem(CURRENT_ANNOUNCEMENT, 'true')
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={dismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 animate-fadeIn" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'modalBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-white/60 hover:text-white z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated header */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-700 px-6 pt-8 pb-6 text-center relative overflow-hidden">
          {/* Floating elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${10 + i * 15}%`,
                  opacity: 0.25,
                  animation: `floatUp ${2 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.25}s`
                }}
              >
                {['🌍', '💬', '🗣️', '🌐', '✨', '💬'][i]}
              </span>
            ))}
          </div>

          {/* Animated globe icon */}
          <div className="relative inline-block mb-4">
            <div
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm"
              style={{ animation: 'globeSpin 3s ease-in-out infinite' }}
            >
              <Globe className="w-10 h-10 text-white" />
            </div>
            <Sparkles
              className="w-6 h-6 text-yellow-300 absolute -top-1 -right-1"
              style={{ animation: 'sparkleRotate 2s linear infinite' }}
            />
          </div>

          <h2 className="text-xl font-bold text-white mb-1">
            Encuestas multilingues
          </h2>
          <p className="text-emerald-100 text-sm">
            Tus pacientes, su idioma
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="space-y-3 mb-5">
            {/* Language flags card */}
            <div
              className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100"
              style={{ animation: 'slideInLeft 0.4s ease-out 0.3s both' }}
            >
              <div className="flex gap-1.5">
                {['es', 'ca', 'eu', 'gl'].map((code, i) => (
                  <span
                    key={code}
                    style={{ animation: `bounceEmoji 1s ease-in-out infinite ${1 + i * 0.15}s` }}
                  >
                    <LangFlag code={code} size={22} />
                  </span>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">4 idiomas disponibles</p>
                <p className="text-xs text-gray-500">
                  Espanol, Catalan, Euskera y Gallego
                </p>
              </div>
            </div>

            <div
              className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100"
              style={{ animation: 'slideInLeft 0.4s ease-out 0.5s both' }}
            >
              <span style={{ animation: 'bounceEmoji 1s ease-in-out infinite 1.3s' }}>
                <Settings className="w-6 h-6 text-blue-500 mt-0.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-800">Tu eliges el predefinido</p>
                <p className="text-xs text-gray-500">
                  Ve a <strong>Ajustes</strong> y elige el idioma principal de tu clinica.
                </p>
              </div>
            </div>

            <div
              className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100"
              style={{ animation: 'slideInLeft 0.4s ease-out 0.7s both' }}
            >
              <span className="text-2xl" style={{ animation: 'bounceEmoji 1s ease-in-out infinite 1.6s' }}>🔄</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">El paciente puede cambiar</p>
                <p className="text-xs text-gray-500">
                  Si prefiere otro idioma, puede cambiarlo directamente en la encuesta.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={dismiss}
            className="btn-primary w-full text-sm flex items-center justify-center gap-2"
            style={{ animation: 'slideInLeft 0.4s ease-out 0.9s both' }}
          >
            ¡Genial, voy a probarlo!
          </button>

          <p className="text-center text-[10px] text-gray-300 mt-3">
            Ajustes → Idioma de la encuesta
          </p>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes modalBounceIn {
            0% { transform: scale(0.3) translateY(40px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          @keyframes globeSpin {
            0%, 100% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(10deg) scale(1.05); }
            50% { transform: rotate(0deg) scale(1.1); }
            75% { transform: rotate(-10deg) scale(1.05); }
          }
          @keyframes sparkleRotate {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.3); }
            100% { transform: rotate(360deg) scale(1); }
          }
          @keyframes floatUp {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
            50% { transform: translateY(-30px) scale(1.2); opacity: 0.4; }
          }
          @keyframes slideInLeft {
            0% { transform: translateX(-20px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes bounceEmoji {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.25); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        `}</style>
      </div>
    </div>
  )
}
