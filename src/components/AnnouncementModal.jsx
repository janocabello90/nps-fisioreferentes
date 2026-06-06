import { useState, useEffect } from 'react'
import { X, Trash2, Sparkles } from 'lucide-react'

const CURRENT_ANNOUNCEMENT = 'announce-delete-feature-v1'

export default function AnnouncementModal() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(CURRENT_ANNOUNCEMENT)
    if (!dismissed) {
      // Small delay so it feels like it pops in after page load
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
          className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated header */}
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 px-6 pt-8 pb-6 text-center relative overflow-hidden">
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="absolute text-white/20 text-2xl"
                style={{
                  left: `${15 + i * 15}%`,
                  animation: `floatUp ${2 + i * 0.4}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`
                }}
              >
                {['✨', '🗑️', '⭐', '🎉', '✨', '🧹'][i]}
              </span>
            ))}
          </div>

          {/* Animated trash icon */}
          <div className="relative inline-block mb-4">
            <div
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm"
              style={{ animation: 'trashWiggle 1.5s ease-in-out infinite' }}
            >
              <Trash2 className="w-10 h-10 text-white" />
            </div>
            {/* Sparkle overlay */}
            <Sparkles
              className="w-6 h-6 text-yellow-300 absolute -top-1 -right-1"
              style={{ animation: 'sparkleRotate 2s linear infinite' }}
            />
          </div>

          <h2 className="text-xl font-bold text-white mb-1">
            ¡Novedad! 🎉
          </h2>
          <p className="text-brand-100 text-sm">
            Tu panel tiene nuevos superpoderes
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="space-y-3 mb-5">
            <div
              className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100"
              style={{ animation: 'slideInLeft 0.4s ease-out 0.3s both' }}
            >
              <span className="text-2xl" style={{ animation: 'bounceEmoji 1s ease-in-out infinite 1s' }}>🗑️</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">Borrar valoraciones</p>
                <p className="text-xs text-gray-500">
                  ¿Una respuesta de prueba? ¿Un error? Elimínala desde el panel con un clic.
                </p>
              </div>
            </div>

            <div
              className="flex items-start gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100"
              style={{ animation: 'slideInLeft 0.4s ease-out 0.5s both' }}
            >
              <span className="text-2xl" style={{ animation: 'bounceEmoji 1s ease-in-out infinite 1.3s' }}>👤</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">Borrar pacientes</p>
                <p className="text-xs text-gray-500">
                  Elimina pacientes duplicados o de prueba junto con todas sus valoraciones.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={dismiss}
            className="btn-primary w-full text-sm flex items-center justify-center gap-2"
            style={{ animation: 'slideInLeft 0.4s ease-out 0.7s both' }}
          >
            ¡Genial, entendido! 🚀
          </button>

          <p className="text-center text-[10px] text-gray-300 mt-3">
            Busca el icono <Trash2 className="w-3 h-3 inline" /> en la tabla de respuestas y en pacientes
          </p>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes modalBounceIn {
            0% { transform: scale(0.3) translateY(40px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          @keyframes trashWiggle {
            0%, 100% { transform: rotate(0deg); }
            20% { transform: rotate(-12deg); }
            40% { transform: rotate(12deg); }
            60% { transform: rotate(-8deg); }
            80% { transform: rotate(8deg); }
          }
          @keyframes sparkleRotate {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.3); }
            100% { transform: rotate(360deg) scale(1); }
          }
          @keyframes floatUp {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
            50% { transform: translateY(-30px) scale(1.2); opacity: 0.6; }
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
