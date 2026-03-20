import { Link } from 'react-router-dom'
import {
  BarChart3, Star, Phone, ArrowRight, CheckCircle2, Zap,
  Users, UserCheck, MessageSquare, TrendingUp, QrCode, Palette,
  Link2, Shield, ClipboardList
} from 'lucide-react'
import FRLogo from '../components/FRLogo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
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
          Sistema NPS completo para clínicas de fisioterapia. Encuestas personalizadas,
          trazabilidad por paciente, control por fisioterapeuta y redirección automática a Google Reviews.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/registro" className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center gap-2">
            Empezar gratis <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#como-funciona" className="text-lg px-8 py-3 inline-flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            Ver cómo funciona
          </a>
        </div>
      </section>

      {/* How it works — 4 steps */}
      <section id="como-funciona" className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Así funciona</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Desde que el paciente escanea el QR hasta que recibes la reseña en Google o el aviso para llamar
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-7 h-7 text-brand-600" />
              </div>
              <div className="text-xs font-bold text-brand-600 mb-1">PASO 1</div>
              <h3 className="font-semibold text-gray-800 mb-2">Se identifica</h3>
              <p className="text-gray-500 text-sm">
                El paciente accede al enlace o escanea el QR y escribe su nombre y email.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <div className="text-xs font-bold text-purple-600 mb-1">PASO 2</div>
              <h3 className="font-semibold text-gray-800 mb-2">Elige quién le atendió</h3>
              <p className="text-gray-500 text-sm">
                Selecciona a uno o varios fisioterapeutas del equipo que le trataron.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-7 h-7 text-yellow-600" />
              </div>
              <div className="text-xs font-bold text-yellow-600 mb-1">PASO 3</div>
              <h3 className="font-semibold text-gray-800 mb-2">Puntúa del 0 al 10</h3>
              <p className="text-gray-500 text-sm">
                Da su nota NPS. Si marca 8+, aparecen 5 estrellas animadas como sesgo psicológico.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-xs font-bold text-green-600 mb-1">PASO 4</div>
              <h3 className="font-semibold text-gray-800 mb-2">Reseña o recuperación</h3>
              <p className="text-gray-500 text-sm">
                9-10: va directo a Google Reviews. 0-8: deja feedback y teléfono para que le llames.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature blocks */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Todo lo que necesitas para controlar la satisfacción</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            Panel completo, trazabilidad de pacientes y métricas por fisioterapeuta
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Dashboard / NPS */}
            <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Dashboard NPS en tiempo real</h3>
              <p className="text-gray-500 text-sm">
                NPS global, distribución de detractores/pasivos/promotores, media de puntuación y filtros por período.
              </p>
            </div>

            {/* NPS por fisio */}
            <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">NPS por fisioterapeuta</h3>
              <p className="text-gray-500 text-sm">
                Métricas individuales de cada profesional: NPS, media, número de respuestas y barras de distribución por colores.
              </p>
            </div>

            {/* Trazabilidad */}
            <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <ClipboardList className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Trazabilidad por paciente</h3>
              <p className="text-gray-500 text-sm">
                Enlace único por paciente con historial completo de visitas, puntuaciones y tendencia de satisfacción.
              </p>
            </div>

            {/* Multi-select staff */}
            <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <UserCheck className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Multi-selección de equipo</h3>
              <p className="text-gray-500 text-sm">
                El paciente puede seleccionar a varios fisios que le atendieron en la misma visita. Datos cruzados en el dashboard.
              </p>
            </div>

            {/* Callbacks */}
            <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Sistema de callbacks</h3>
              <p className="text-gray-500 text-sm">
                Cuando un paciente puntúa bajo, deja su teléfono. Ves las llamadas pendientes en el dashboard y marcas las completadas.
              </p>
            </div>

            {/* Google Reviews redirect */}
            <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Redirección a Google Reviews</h3>
              <p className="text-gray-500 text-sm">
                Los promotores (9-10) ven 5 estrellas animadas y se les redirige a dejar reseña de 5 estrellas en Google.
              </p>
            </div>

            {/* Merge patients */}
            <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Pacientes unificados</h3>
              <p className="text-gray-500 text-sm">
                Si un paciente vuelve a rellenar la encuesta con el mismo email, se vincula automáticamente al mismo perfil.
              </p>
            </div>

            {/* Branding */}
            <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Marca propia</h3>
              <p className="text-gray-500 text-sm">
                Logo, color principal y mensaje de bienvenida personalizables. Cada clínica tiene su URL y diseño propio.
              </p>
            </div>

            {/* Multi-tenant */}
            <div className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Link2 className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Multi-clínica</h3>
              <p className="text-gray-500 text-sm">
                Cada clínica se registra y tiene su propio panel, datos aislados, slug personalizado y equipo independiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof / How clinics use it */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">Cómo lo usan las clínicas</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <QrCode className="w-5 h-5 text-brand-600" />
                <span className="font-semibold text-gray-800 text-sm">QR en recepción</span>
              </div>
              <p className="text-gray-500 text-sm">
                Imprimen un QR con el enlace de la encuesta y lo colocan en la recepción. El paciente lo escanea al salir de la consulta.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-brand-600" />
                <span className="font-semibold text-gray-800 text-sm">Enlace por WhatsApp</span>
              </div>
              <p className="text-gray-500 text-sm">
                Envían el enlace único del paciente por WhatsApp después de la sesión. Trazabilidad total sin esfuerzo.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-brand-600" />
                <span className="font-semibold text-gray-800 text-sm">Reunión de equipo</span>
              </div>
              <p className="text-gray-500 text-sm">
                Revisan las métricas por fisioterapeuta en la reunión semanal. Detectan problemas antes de que escalen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes somos */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-shrink-0">
              <img
                src="/fr-logo.png"
                alt="FisioReferentes"
                className="w-32 h-32 object-contain"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Un producto de FisioReferentes</h2>
              <p className="text-gray-500 mb-4">
                FisioReferentes es el proyecto de referencia para fisioterapeutas propietarios de clínica que quieren
                dejar de sobrevivir y empezar a disfrutar de su profesión y su vida. Fundado por Álex Vallés
                — fisioterapeuta, empresario y autor de <em>La Fórmula del Éxito en Fisioterapia</em> — y
                Jano Cabello como director estratégico y CMO.
              </p>
              <p className="text-gray-500 mb-6">
                Desde formaciones como el máster "De Fisio a Empresario" hasta herramientas como NPSFisio,
                todo lo que hacemos nace del mismo objetivo: que tu clínica funcione sin depender de ti,
                genere rentabilidad real y te permita vivir la vida que elegiste cuando estudiaste fisioterapia.
              </p>
              <a
                href="https://www.fisioreferentes.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors"
              >
                Conoce FisioReferentes <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Empieza a medir la satisfacción de tus pacientes hoy
          </h2>
          <p className="text-brand-100 mb-8">
            Registro en 2 minutos. Añade tu equipo, personaliza tu encuesta y comparte el enlace.
          </p>
          <Link to="/registro" className="bg-white text-brand-600 font-semibold px-8 py-3 rounded-lg hover:bg-brand-50 transition-colors inline-flex items-center gap-2">
            Crear mi cuenta gratis <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 flex flex-col items-center gap-3">
        <FRLogo size="md" variant="full" />
        <p className="text-xs text-gray-400">NPSFisio es un producto de <a href="https://www.fisioreferentes.com" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-gray-600">FisioReferentes</a></p>
        <div className="flex gap-4 text-xs text-gray-400">
          <Link to="/login" className="hover:text-gray-600">Acceder</Link>
          <Link to="/registro" className="hover:text-gray-600">Registrarse</Link>
          <a href="https://www.fisioreferentes.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">fisioreferentes.com</a>
        </div>
      </footer>
    </div>
  )
}
