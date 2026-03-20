import { Link } from 'react-router-dom'
import { BarChart3, Star, Phone, ArrowRight, CheckCircle2, Zap } from 'lucide-react'
import FRLogo from '../components/FRLogo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <FRLogo size="lg" variant="full" />
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-800 font-medium">
              Acceder
            </Link>
            <Link to="/registro" className="btn-primary text-sm">
              Registrar mi clínica
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-brand-600 bg-brand-50 rounded-full px-4 py-1.5 mb-6">
          <Zap className="w-4 h-4" /> Un producto de FisioReferentes
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Mide la satisfacción de tus pacientes y convierte promotores en reseñas
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          Sistema NPS automatizado para clínicas de fisioterapia.
          Los insatisfechos te avisan. Los promotores van directo a Google Reviews.
        </p>
        <Link to="/registro" className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2">
          Empezar gratis <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">Así funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-7 h-7 text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">1. El paciente puntúa</h3>
              <p className="text-gray-500 text-sm">
                Escanea un QR o accede al enlace y da una nota del 0 al 10.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">2. Recuperas insatisfechos</h3>
              <p className="text-gray-500 text-sm">
                Notas 0-8: recogen feedback y teléfono para que tu equipo llame y solucione.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">3. Multiplicas reseñas</h3>
              <p className="text-gray-500 text-sm">
                Notas 9-10: se les pide reseña de 5 estrellas con redirección directa a Google Reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">Todo lo que necesitas</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Panel con métricas NPS en tiempo real',
              'Filtros por categoría y período',
              'Gestión de callbacks pendientes',
              'URL personalizada por clínica',
              'Logo y color de marca propios',
              'Redirección automática a Google Reviews',
              'Compatible con QR y enlaces',
              'Powered by FisioReferentes'
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            ¿Preparado para medir y mejorar?
          </h2>
          <p className="text-brand-100 mb-8">
            Registra tu clínica en 2 minutos y empieza a medir la satisfacción de tus pacientes hoy mismo.
          </p>
          <Link to="/registro" className="bg-white text-brand-600 font-semibold px-8 py-3 rounded-lg hover:bg-brand-50 transition-colors inline-flex items-center gap-2">
            Crear mi cuenta <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 flex flex-col items-center gap-2">
        <FRLogo size="sm" variant="compact" />
        <p className="text-xs text-gray-400">Un producto de <span className="font-medium">FisioReferentes</span></p>
      </footer>
    </div>
  )
}
