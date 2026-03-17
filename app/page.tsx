"use client";

import { useEffect, useRef, useState } from 'react';
import Guestbook from './components/Guestbook';
import VisitTracker from './components/VisitTracker';
import ScrollReveal from './components/ScrollReveal';

// Componente para el Hero con canvas de partículas
const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseVx: number;
      baseVy: number;
      radius: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || 0);
        this.y = Math.random() * (canvas?.height || 0);
        this.vx = 0;
        this.vy = 0;
        this.baseVx = (Math.random() - 0.5) * 0.2;
        this.baseVy = (Math.random() - 0.5) * 0.2;
        this.radius = 1 + Math.random() * 0.5; // 1 a 1.5px
        this.opacity = 0.5 + Math.random() * 0.5; // 0.2 a 0.7
      }

      update() {
        if (!canvas) return;

        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120 * 0.8;
          this.vx += (dx / dist) * force * -1;
          this.vy += (dy / dist) * force * -1;
        }

        this.vx *= 0.95;
        this.vy *= 0.95;

        this.x += this.vx + this.baseVx;
        this.y += this.vy + this.baseVy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const numParticles = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 12000));
      for (let i = 0; i < Math.max(40, numParticles); i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // Opacidad más visible y dependiente de la distancia
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 - (dist / 100) * 0.35})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-90 z-0"
    />
  );
};

export default function Home() {
  const projects = [
    {
      name: 'Sistema de Gestión Escolar',
      description: 'Plataforma integral para el manejo de alumnos y calificaciones. Sistema multirol con panel de control.',
      tags: ['React', 'Node.js', 'PostgreSQL'],
    },
    {
      name: 'Escáner de Vulnerabilidades',
      description: 'Herramienta CLI para detectar puertos abiertos y servicios vulnerables. Análisis en tiempo real de tráfico.',
      tags: ['Python', 'Nmap', 'Security'],
    },
    {
      name: 'Terminal Personal',
      description: 'Emulador de terminal en el navegador web con comandos reales ejecutables y sistema de archivos.',
      tags: ['TypeScript', 'Next.js', 'Tailwind'],
    },
  ];

  const phrases = ["Tecnología", "Curiosidad", "Ciberseguridad", "Aprendizaje"];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPhraseIndex(prev => (prev + 1) % phrases.length);
        setFade(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative font-sans text-[#e8e8e8]">
      <style>{`
        @keyframes scrollLine {
          0% { top: -100%; height: 100%; }
          50% { top: 0%; height: 100%; }
          100% { top: 100%; height: 100%; }
        }
      `}</style>
      <VisitTracker />

      {/* Nav fija */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-5 bg-[rgba(8,8,8,0.85)] backdrop-blur border-b border-white/[0.04]">
        <div className="font-mono text-[11px] tracking-widest text-white/80">
          pb.dev
        </div>
        <div className="flex gap-6 text-[10px] uppercase tracking-wider text-white/50">
          <a href="#proyectos" className="hoverable hover:text-white transition-colors">Proyectos</a>
          <a href="#galeria" className="hoverable hover:text-white transition-colors">Galería</a>
          <a href="#contacto" className="hoverable hover:text-white transition-colors">Contacto</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen w-full">
        <ParticleCanvas />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-8 md:px-16">
          <ScrollReveal>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl tracking-tight text-white mb-2 leading-none">
              Pablo <span className="text-white/40 italic">Barreiro.</span>
            </h1>
            <div className="h-10 md:h-12 mt-4">
              <p className={`text-2xl md:text-4xl text-white/40 font-serif italic transition-opacity duration-[400ms] ${fade ? 'opacity-100' : 'opacity-0'}`}>
                {phrases[phraseIndex]}
              </p>
            </div>
            <p className="text-white/[0.35] text-sm md:text-base leading-relaxed max-w-lg mt-8">
              Bienvenido a mi web. Me llamo Pablo y estudio Ingeniería Informática. Hago esta web para darme a conocer un poco más y para subir proyectos y logros que vaya consiguiendo a lo largo de la carrera.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-12 max-w-3xl">
              <a href="mailto:pablo.barreiro.cores@gmail.com" className="hoverable p-4 border border-[rgba(255,255,255,0.07)] rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex flex-col gap-2 relative overflow-hidden group">
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-xs text-white/70 font-medium">Email</div>
                  <div className="text-[10px] text-white/30 mt-1 truncate">pablo.barreiro.cores@gmail.com</div>
                </div>
              </a>

              <a href="https://instagram.com/pabloo.barreiro_" target="_blank" rel="noopener noreferrer" className="hoverable p-4 border border-[rgba(255,255,255,0.07)] rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex flex-col gap-2 relative overflow-hidden group">
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={1.5}></rect>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={1.5} strokeLinecap="round"></line>
                </svg>
                <div>
                  <div className="text-xs text-white/70 font-medium">Instagram</div>
                  <div className="text-[10px] text-white/30 mt-1 truncate">@pabloo.barreiro_</div>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/pablo-barreiro-cores-93199a2b5/" target="_blank" rel="noopener noreferrer" className="hoverable p-4 border border-[rgba(255,255,255,0.07)] rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex flex-col gap-2 relative overflow-hidden group">
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                  <circle cx="4" cy="4" r="2" stroke="none" fill="currentColor"></circle>
                </svg>
                <div>
                  <div className="text-xs text-white/70 font-medium">LinkedIn</div>
                  <div className="text-[10px] text-white/30 mt-1 truncate">linkedin.com/in/pablo...</div>
                </div>
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a href="#proyectos" className="hoverable px-5 py-2.5 border border-[rgba(255,255,255,0.15)] text-white/80 text-xs tracking-wide text-center rounded-md hover:bg-white/5 transition-colors">
                Ver proyectos
              </a>
              <a href="#contacto" className="hoverable px-5 py-2.5 border border-transparent text-white/50 text-xs tracking-wide text-center rounded-md hover:text-white hover:bg-white/5 transition-colors">
                Conectar
              </a>
            </div>
          </ScrollReveal>
        </div>



        {/* Otras secciones */}
        <main className="max-w-4xl mx-auto px-8 md:px-16 py-20 space-y-32">

          {/* Últimamente */}
          <ScrollReveal>
            <section className="space-y-6">
              <div className="font-mono uppercase text-xs md:text-sm tracking-widest text-white/30 mb-6">
                Últimamente
              </div>
              <div className="p-6 border border-[rgba(255,255,255,0.08)] rounded-xl bg-gradient-to-b from-[#111] to-[#0a0a0a]">
                <div className="flex items-center gap-3 mb-5">
                  <img
                    src="/HACK UDC-128.jpg"
                    className="w-10 h-10 rounded-full object-cover"
                    alt="Pablo Barreiro"
                  />
                  <div>
                    <div className="text-sm text-white/90">Pablo Barreiro</div>
                    <div className="text-[11px] text-white/40">Estudiante de Ciberseguridad & Maker</div>
                  </div>
                  <div className="ml-auto text-white/20">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-white/60 leading-relaxed mb-5">
                  Hace dos semanas tuve la oportunidad de participar en mi primer hackathon en HackUDC, una experiencia intensa de 36 horas construyendo una solución de inteligencia artificial desde cero.

                  El reto consistía en desarrollar un sistema capaz de identificar, a partir de la imagen de una modelo, las prendas que lleva puestas y asociarlas con su referencia exacta dentro de un catálogo de productos. Para ello se nos proporcionaba un dataset con imágenes etiquetadas, el catálogo completo de artículos y un conjunto de imágenes de prueba con el que se evaluaba la precisión del sistema frente a otros equipos en una plataforma con métricas en tiempo real.

                  Nuestro enfoque se basó en un pequeño pipeline de visión por computador. Utilizamos Segment Anything Model (SAM) para segmentar las prendas en la imagen, generamos embeddings visuales con CLIP (ViT-L/14) y realizamos la búsqueda de productos similares mediante búsqueda vectorial con FAISS. Todo esto lo integramos en una aplicación web sencilla con FastAPI, que permitía subir una imagen y devolver las coincidencias detectadas en el catálogo.
                  Durante el desarrollo fuimos iterando varias veces intentando mejorar el rendimiento. Al final descubrimos que una configuración incorrecta en el formato de un CSV del dataset estaba afectando a parte del pipeline de evaluación, algo que detectamos demasiado tarde y que limitó bastante el porcentaje de acierto obtenido.

                  Aun así, fue una experiencia muy valiosa. Desde esperar horas a que los modelos terminaran de entrenar hasta probar distintas estrategias de segmentación y recuperación visual, el hackathon fue un recordatorio de lo rápido que se aprende cuando tienes que construir algo real en muy poco tiempo.

                  Me quedo especialmente con haber aprendido sobre desarrollo de IA, y con la oportunidad de compartir 36 horas de trabajo con gente con muchísimo talento y ganas de construir cosas interesantes.

                  Sin duda, una primera experiencia en hackathons que me deja con ganas de repetir.

                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-white/[0.03] border border-white/5 text-white/40 text-[10px] font-mono rounded-full uppercase">#hackathon</span>
                  <span className="px-2.5 py-1 bg-white/[0.03] border border-white/5 text-white/40 text-[10px] font-mono rounded-full uppercase">#ciberseguridad</span>
                  <span className="px-2.5 py-1 bg-white/[0.03] border border-white/5 text-white/40 text-[10px] font-mono rounded-full uppercase">#learning</span>
                </div>
              </div>
            </section>
          </ScrollReveal>

          {/* Galería */}
          <ScrollReveal id="galeria">
            <section className="space-y-6">
              <div className="font-mono uppercase text-xs md:text-sm tracking-widest text-white/30">
                Galería
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="hoverable aspect-square bg-[#111] rounded-md border border-white/5 overflow-hidden">
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Proyectos */}
          <ScrollReveal id="proyectos">
            <section className="space-y-6">
              <div className="font-mono uppercase text-xs md:text-sm tracking-widest text-white/30">
                Proyectos
              </div>
              <div className="flex flex-col border-t border-white/5">
                {projects.map((project, idx) => (
                  <div key={idx} className="group flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors hoverable px-2 -mx-2">
                    <div className="space-y-1 sm:w-2/3 group-hover:translate-x-2 transition-transform duration-300">
                      <h3 className="text-white/70 text-base md:text-lg font-medium">{project.name}</h3>
                      <p className="text-white/25 text-xs tracking-wide">{project.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 border border-white/10 text-white/30 text-[9px] font-mono rounded-full uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* Guestbook */}
          <ScrollReveal id="contacto">
            <section className="space-y-6">
              <div className="font-mono uppercase text-xs md:text-sm tracking-widest text-white/30">
                Guestbook
              </div>
              <Guestbook />
            </section>
          </ScrollReveal>
        </main>

        {/* Footer */}
        <footer className="py-12 text-center text-white/15 text-xs font-mono">
          pb.dev © {new Date().getFullYear()}
        </footer>
    </div>
  );
}
