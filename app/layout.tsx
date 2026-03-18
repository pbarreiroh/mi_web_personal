import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "Pablo Barreiro",
  description: "Estudiante, builder, ciberseguridad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerif.variable} antialiased selection:bg-white/20`}
      >
        <div id="cursor" style={{
          position: 'fixed',
          pointerEvents: 'none',
          mixBlendMode: 'difference',
          zIndex: 9999,
          borderRadius: '50%',
          background: 'white',
          width: '8px',
          height: '8px',
          left: '-10px',
          top: '-10px',
          transition: 'transform 0.15s ease-out'
        }}></div>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
          let cx=0,cy=0,tx=0,ty=0;
          let isHovering = false;
          
          document.addEventListener('mousemove', e => {
            tx = e.clientX - 4;
            ty = e.clientY - 4;
            
            const target = e.target;
            const isClickable = target.closest('a, button, input, textarea, .hoverable');
            
            const el = document.getElementById('cursor');
            if (el) {
              if (isClickable && !isHovering) {
                el.style.transform = 'scale(2)';
                isHovering = true;
              } else if (!isClickable && isHovering) {
                el.style.transform = 'scale(1)';
                isHovering = false;
              }
            }
          });
          
          (function loop(){
            cx += (tx - cx) * 0.12;
            cy += (ty - cy) * 0.12;
            const el = document.getElementById('cursor');
            if(el){
              el.style.left = cx + 'px';
              el.style.top = cy + 'px';
            }
            requestAnimationFrame(loop);
          })();
        `}} />
        <div id="google_translate_element" style={{ position: 'fixed', bottom: '1rem', left: '1rem', zIndex: 9999 }}></div>
        <script dangerouslySetInnerHTML={{
          __html: `
  function googleTranslateElementInit() {
    new google.translate.TranslateElement({
      pageLanguage: 'es',
      includedLanguages: 'en,es',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element');
  }
`}} />
        <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" />
      </body>
    </html>
  );
}
