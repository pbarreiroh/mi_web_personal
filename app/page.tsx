import Guestbook from './components/Guestbook';
import VisitTracker from './components/VisitTracker';

export default function Home() {
  const projects = [
    {
      name: 'Sistema de Gestión Escolar',
      description: 'Plataforma integral para el manejo de alumnos y calificaciones.',
      tags: ['React', 'Node.js', 'PostgreSQL'],
    },
    {
      name: 'Escáner de Vulnerabilidades',
      description: 'Herramienta CLI para detectar puertos abiertos y servicios vulnerables.',
      tags: ['Python', 'Nmap', 'Security'],
    },
    {
      name: 'Portfolio Personal',
      description: 'Mi sitio web personal diseñado con estética minimalista.',
      tags: ['Next.js', 'Tailwind', 'Supabase'],
    },
  ];

  return (
    <main className="max-w-[680px] mx-auto px-6 py-20 space-y-24 bg-white text-gray-900 font-sans">
      <VisitTracker />

      {/* Hero */}
      <section className="space-y-4">
        <h1 className="font-serif text-4xl font-medium tracking-tight">Pablo Barreiro</h1>
        <p className="text-gray-500 leading-relaxed text-lg">
          Primer año de carrera. Fui a mi primera hackathon. Me obsesiona la ciberseguridad.
        </p>
      </section>

      {/* Links */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a 
          href="mailto:pablo.barreiro.cores@gmail.com" 
          className="flex flex-col items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-2"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div>
            <div className="text-sm font-medium">Email</div>
            <div className="text-xs text-gray-500 truncate">Contactar</div>
          </div>
        </a>
        
        <a 
          href="https://instagram.com/pabloo.barreiro_" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex flex-col items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-2"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={1.5}></rect>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={1.5} strokeLinecap="round"></line>
          </svg>
          <div>
            <div className="text-sm font-medium">Instagram</div>
            <div className="text-xs text-gray-500 truncate">@pabloo.barreiro_</div>
          </div>
        </a>
        
        <a 
          href="https://www.linkedin.com/in/pablo-barreiro-cores-93199a2b5/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex flex-col items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-2"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
            <circle cx="4" cy="4" r="2" stroke="none" fill="currentColor"></circle>
          </svg>
          <div>
            <div className="text-sm font-medium">LinkedIn</div>
            <div className="text-xs text-gray-500 truncate">Conectar</div>
          </div>
        </a>
      </section>

      {/* Proyectos */}
      <section className="space-y-8">
        <h2 className="text-xl font-medium tracking-tight">Proyectos</h2>
        <div className="space-y-6">
          {projects.map((project, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="font-medium">{project.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{project.description}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-mono rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Galería */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium tracking-tight">Galería</h2>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-50 rounded-lg"></div>
          ))}
        </div>
      </section>

      {/* Guestbook */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium tracking-tight">Guestbook</h2>
        <Guestbook />
      </section>

      {/* Footer */}
      <footer className="pt-8 pb-12 text-center text-xs text-gray-400">
        hecho con next.js · supabase · vercel
      </footer>
    </main>
  );
}
