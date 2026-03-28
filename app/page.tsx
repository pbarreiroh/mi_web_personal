"use client";

import { useEffect, useRef, useState } from 'react';
import VisitTracker from './components/VisitTracker';
import ScrollReveal from './components/ScrollReveal';
import { useLanguage } from '@/app/contexts/LanguageContext';
import LanguageToggle from '@/app/components/LanguageToggle';
import ContactModal from './components/ContactModal';
import GalleryLightbox from './components/GalleryLightbox';

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
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-90"
    />
  );
};

function AnimatedDots() {
  const [dots, setDots] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => (d + 1) % 4)
    }, 500)
    return () => clearInterval(interval)
  }, [])
  return <span className="inline-block w-6 text-left">{'.'.repeat(dots)}</span>
}

export default function Home() {
  const { t } = useLanguage();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => window.scrollTo(0, 0), 100);
    return () => clearTimeout(timeout);
  }, []);

  const galleryImages = [
    { src: '/IMG-20220816-WA0010_Original.jpg', alt: 'Agosto 2022' },
    { src: '/IMG_2662.jpeg', alt: 'Junio 2025' },
    { src: '/IMG_6866.jpg', alt: 'Octubre 2023' },
    { src: '/enero23.jpg', alt: 'Enero 2023' },
    { src: '/IMG-20231006-WA0043_Original.jpg', alt: 'Octubre 2023' },
    { src: '/IMG_6790.jpeg', alt: 'Marzo 2026' },
  ]

  const phrases = [t('hero.phrase.0'), t('hero.phrase.1'), t('hero.phrase.2'), t('hero.phrase.3')];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPhraseIndex(prev => (prev + 1) % phrases.length);
        setFade(true);
      }, 800);
    }, 4800);
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
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
      <VisitTracker />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleCanvas />
      </div>

      {/* Nav fija */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-5 bg-[rgba(8,8,8,0.85)] backdrop-blur border-b border-white/[0.04]">
        <div className="relative flex justify-end items-center w-full">
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 font-serif italic text-white text-sm tracking-wide pointer-events-none select-none">
            {t('nav.welcome')}
          </div>
          <div className="flex gap-6 text-[10px] uppercase tracking-wider text-white">
            <a href="#proyectos" className="hoverable hover:text-white transition-colors">{t('nav.projects')}</a>
            <a href="#galeria" className="hoverable hover:text-white transition-colors">{t('nav.gallery')}</a>
            <button onClick={() => setContactOpen(true)} className="hoverable hover:text-white transition-colors text-[10px] uppercase tracking-wider">{t('nav.contact')}</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen w-full flex items-center">


        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 md:px-16 pt-24 md:pt-32 pb-20">
          <ScrollReveal delay={0}>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight text-white mb-2 leading-none">
              Pablo <span className="text-white/40 italic">Barreiro.</span>
            </h1>
            <div className="h-10 md:h-12 mt-4">
              <p className={`text-2xl md:text-4xl text-white/60 font-serif italic transition-opacity duration-[400ms] ${fade ? 'opacity-100' : 'opacity-0'}`}>
                {phrases[phraseIndex]}
              </p>
            </div>
            <p className="font-sans text-white/55 text-sm md:text-base leading-relaxed max-w-lg mt-8">
              {t('hero.bio')}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-12 max-w-3xl">
              <a href="mailto:pbarreirocor@gmail.com" className="hoverable p-4 border border-[rgba(255,255,255,0.07)] rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex flex-col gap-2 relative overflow-hidden group">
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="font-sans text-xs text-white font-medium">Email</div>
                  <div className="font-sans text-[10px] text-white/45 mt-1 truncate">pbarreirocor@gmail.com</div>
                </div>
              </a>

              <a href="https://instagram.com/pabloo.barreiro_" target="_blank" rel="noopener noreferrer" className="hoverable p-4 border border-[rgba(255,255,255,0.07)] rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex flex-col gap-2 relative overflow-hidden group">
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={1.5}></rect>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={1.5} strokeLinecap="round"></line>
                </svg>
                <div>
                  <div className="font-sans text-xs text-white font-medium">Instagram</div>
                  <div className="font-sans text-[10px] text-white/45 mt-1 truncate">@pabloo.barreiro_</div>
                </div>
              </a>

              <a href="https://www.linkedin.com/posts/pablo-barreiro-cores-93199a2b5_hace-dos-semanas-tuve-la-oportunidad-de-participar-activity-7438267951851626496-IS8G?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEvJXbUBo-opj8ZNh35LQf3_uH5MQJFXcUc" target="_blank" rel="noopener noreferrer" className="hoverable p-4 border border-[rgba(255,255,255,0.07)] rounded-lg bg-white/[0.01] hover:bg-white/[0.03] transition-colors flex flex-col gap-2 relative overflow-hidden group">
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                  <circle cx="4" cy="4" r="2" stroke="none" fill="currentColor"></circle>
                </svg>
                <div>
                  <div className="font-sans text-xs text-white font-medium">LinkedIn</div>
                  <div className="font-sans text-[10px] text-white/45 mt-1 truncate">linkedin.com/in/pablo...</div>
                </div>
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-row justify-center w-full mt-25">
              <button onClick={() => setContactOpen(true)} className="relative overflow-hidden group bg-white text-[#080808] font-medium px-10 py-4 text-sm tracking-wide rounded-md hover:bg-white/90 transition-all active:scale-95 active:brightness-90 hoverable text-center">
                <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-black/10 transition-transform duration-500 ease-out group-hover:translate-x-[200%]" aria-hidden="true" />
                <span className="relative z-10">{t('hero.btn.contact')}</span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Otras secciones */}
      <main className="max-w-4xl mx-auto px-8 md:px-16 py-20 space-y-32">



        {/* Proyectos */}
        <ScrollReveal>
          <section id="proyectos" className="space-y-6">
            <div className="font-mono uppercase text-xs md:text-sm tracking-widest text-white/45">
              {t('section.projects')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Card 1 — pbfocus */}
              <div className="p-7 border border-white rounded-xl bg-white/[0.02] flex flex-col gap-4 min-h-[270px]">
                <p
                  className="text-white/55 text-base italic leading-loose"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0.4) 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmer 3s linear infinite',
                  }}
                >
                  {t('project.pbfocus.desc1')}
                  <br />
                  <span className="font-bold">{t('project.pbfocus.desc2')}</span>
                </p>
                <div className="mt-auto">
                  <a
                    href="https://pbfocus.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hoverable block mx-auto w-3/4 bg-white text-black font-medium py-2 rounded-xl text-base text-center hover:bg-white/90 transition-colors"
                  >
                    {t('project.pbfocus.btn')}
                  </a>
                </div>
              </div>

              {/* Card 2 — En desarrollo */}
              <div className="p-7 border border-white rounded-xl bg-white/[0.02] flex flex-col gap-4 min-h-[200px]">
                <div className="flex flex-col items-center justify-center flex-1">
                  <div
                    className="text-white text-xl font-medium italic flex items-center gap-0.5"
                    style={{
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,0.4) 100%)',
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'shimmer 3s linear infinite',
                    }}
                  >
                    {t('project.wip.title')}<AnimatedDots />
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="mx-auto w-3/4 border border-white/40 text-white/60 font-medium py-4 rounded-xl text-sm text-center">
                    {t('project.wip.btn')}
                  </div>
                </div>
              </div>

            </div>
          </section>
        </ScrollReveal>

        {/* Galería */}
        <ScrollReveal id="galeria">
          <section className="space-y-6">
            <div className="font-mono uppercase text-xs md:text-sm tracking-widest text-white/45">
              {t('section.gallery')}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div
                className="hoverable aspect-square bg-[#111] rounded-md border border-white/5 overflow-hidden cursor-pointer"
                onClick={() => { setLightboxIndex(0); setLightboxOpen(true) }}
              >
                <img src="/IMG-20220816-WA0010_Original.jpg" alt="Agosto 2022" className="w-full h-full object-cover" />
              </div>
              <div
                className="hoverable aspect-square bg-[#111] rounded-md border border-white/5 overflow-hidden cursor-pointer"
                onClick={() => { setLightboxIndex(1); setLightboxOpen(true) }}
              >
                <img src="/IMG_2662.jpeg" alt="Junio 2025" className="w-full h-full object-cover" />
              </div>
              <div
                className="hoverable aspect-square bg-[#111] rounded-md border border-white/5 overflow-hidden cursor-pointer"
                onClick={() => { setLightboxIndex(2); setLightboxOpen(true) }}
              >
                <img src="/IMG_6866.jpg" alt="Abril 2026" className="w-full h-full object-cover" />
              </div>
              <div
                className="hoverable aspect-square bg-[#111] rounded-md border border-white/5 overflow-hidden cursor-pointer"
                onClick={() => { setLightboxIndex(3); setLightboxOpen(true) }}
              >
                <img src="/enero23.jpg" alt="Enero 2023" className="w-full h-full object-cover" />
              </div>
              <div
                className="hoverable aspect-square bg-[#111] rounded-md border border-white/5 overflow-hidden cursor-pointer"
                onClick={() => { setLightboxIndex(4); setLightboxOpen(true) }}
              >
                <img src="/IMG-20231006-WA0043_Original.jpg" alt="Octubre 2023" className="w-full h-full object-cover" />
              </div>
              <div
                className="hoverable aspect-square bg-[#111] rounded-md border border-white/5 overflow-hidden cursor-pointer"
                onClick={() => { setLightboxIndex(5); setLightboxOpen(true) }}
              >
                <img src="/IMG_6790.jpeg" alt="Marzo 2026" className="w-full h-full object-cover" />
              </div>
            </div>
          </section>
        </ScrollReveal>


      </main>

      {/* Footer */}
      <footer className="py-12 text-center text-white/15 text-xs font-mono">
        {t('footer.copy')} © {new Date().getFullYear()}
      </footer>
      <LanguageToggle />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      {lightboxOpen && (
        <GalleryLightbox
          images={galleryImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
