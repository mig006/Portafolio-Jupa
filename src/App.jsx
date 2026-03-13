import { useState } from 'react'
import './App.css'

const featuredWorks = [
  {
    title: 'Nacido verde',
    year: '2026',
    format: 'Afiche / collage',
    note: 'Devoción popular, tipografía comprimida y color de estadio.',
    image: '/art/nacido-verde.png',
    tone: 'acid',
  },
  {
    title: 'Figura en ventana',
    year: '2025',
    format: 'Pintura',
    note: 'Silencio tenso, gesto suspendido y escena de barrio.',
    image: '/art/figura-ventana.png',
    tone: 'storm',
  },
  {
    title: 'Bestiario calabaza',
    year: '2025',
    format: 'Ilustración',
    note: 'Línea negra, humor siniestro y personaje de feria.',
    image: '/art/bestiario-calabaza.png',
    tone: 'ember',
  },
  {
    title: 'Ritual de ceniza',
    year: '2025',
    format: 'Print',
    note: 'Figura cadavérica, símbolos totémicos y contraste brutal.',
    image: '/art/ritual-ceniza.png',
    tone: 'lava',
  },
  {
    title: 'Hike demon',
    year: '2025',
    format: 'Sticker / character',
    note: 'Bestia magenta con acentos tóxicos y postura torcida.',
    image: '/art/hike-demon.png',
    tone: 'toxic',
  },
  {
    title: 'Mirada violeta',
    year: '2024',
    format: 'Retrato digital',
    note: 'Brillo espectral, piel nocturna y expresión cerrada.',
    image: '/art/mirada-violeta.png',
    tone: 'violet',
  },
  {
    title: 'Gemelos ciegos',
    year: '2024',
    format: 'Serie de personajes',
    note: 'Infancia inquietante con color plano y gestos afilados.',
    image: '/art/gemelos-ciegos.png',
    tone: 'bubble',
  },
  {
    title: 'Intervención urbana',
    year: '2024',
    format: 'Mural / objeto',
    note: 'Escala pública, distorsión monstruosa y presencia callejera.',
    image: '/art/intervencion-urbana.png',
    tone: 'sky',
  },
]

const capabilities = [
  'Ilustración editorial',
  'Personajes y monstruos',
  'Stickers, prints y afiches',
]

const process = [
  'Concepto rápido con referencias, ritmo visual y paleta.',
  'Bocetos y dirección de personaje o composición.',
  'Entrega lista para red, print o montaje físico.',
]

const youtubeChannel = {
  name: 'Pablito',
  handle: '@pablito.d0cx',
  url: 'https://www.youtube.com/@pablito.d0cx/videos',
}

const youtubeVideos = [
  {
    title: 'mi vida durante Enero',
    duration: '6:37',
    meta: 'Video mensual',
    image: '/art/yt-enero.jpg',
    month: 'enero',
    url: 'https://www.youtube.com/watch?v=1aFqYiFUD28&t=6s',
  },
  {
    title: 'mi vida durante Febrero',
    duration: '14:08',
    meta: 'Video mensual',
    image: '/art/yt-febrero.jpg',
    month: 'febrero',
    url: 'https://www.youtube.com/watch?v=dYTlKRXqU1E&t=312s',
  },
  {
    title: 'mi vida durante Marzo',
    duration: '40:52',
    meta: 'Video mensual',
    image: '/art/yt-marzo.jpg',
    month: 'marzo',
    url: 'https://www.youtube.com/watch?v=_o5l8CGg0xs&t=1601s',
  },
]

function BrandAsset() {
  const [fallback, setFallback] = useState(false)

  return (
    <div className="brand-asset">
      {!fallback && (
        <img
          src="/art/logo-jupa.png"
          alt="Logo de Jupa"
          onError={() => setFallback(true)}
        />
      )}
      {fallback && (
        <div className="brand-fallback" aria-label="Espacio para logo">
          <span>J</span>
        </div>
      )}
    </div>
  )
}

function WorkCard({ work, index }) {
  const [fallback, setFallback] = useState(false)

  return (
    <article className={`work-card work-card--${work.tone}`}>
      <div className="work-media">
        {!fallback && (
          <img
            src={work.image}
            alt={work.title}
            loading="lazy"
            onError={() => setFallback(true)}
          />
        )}
        {fallback && (
          <div className="work-placeholder" aria-label={`Placeholder de ${work.title}`}>
            <span className="work-index">{String(index + 1).padStart(2, '0')}</span>
            <strong>{work.title}</strong>
            <p>{work.format}</p>
          </div>
        )}
      </div>

      <div className="work-copy">
        <div className="work-meta">
          <span>{work.year}</span>
          <span>{work.format}</span>
        </div>
        <h3>{work.title}</h3>
        <p>{work.note}</p>
      </div>
    </article>
  )
}

function YouTubeCard({ video }) {
  const [fallback, setFallback] = useState(false)

  return (
    <article className="youtube-card">
      <a href={video.url} target="_blank" rel="noreferrer" aria-label={`Abrir ${video.title}`}>
        <div className="youtube-thumb">
          {!fallback && (
            <img
              src={video.image}
              alt={video.title}
              loading="lazy"
              onError={() => setFallback(true)}
            />
          )}

          {fallback && (
            <div className={`youtube-placeholder youtube-placeholder--${video.month}`}>
              <span className="yt-year">2025</span>
              <strong>{video.title}</strong>
            </div>
          )}

          <span className="yt-duration">{video.duration}</span>
        </div>
      </a>

      <div className="youtube-copy">
        <h3>{video.title}</h3>
        <p>{video.meta}</p>
      </div>
    </article>
  )
}

function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <BrandAsset />
          <div>
            <strong>Jupa</strong>
            <span>@jupa.png</span>
          </div>
        </a>

        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#obras">Obras</a>
          <a href="#sobre">Perfil</a>
          <a href="#contacto">Contacto</a>
          <a href="#youtube">YouTube</a>
        </nav>
      </header>

      <main>
        <section className="hero-section" id="inicio">
          <div className="hero-copy">
            <div>
              <p className="eyebrow">Portafolio visual</p>
              <h1>Arte crudo con personajes tensos.</h1>
              <p className="hero-text">
                Ilustración, pintura y piezas gráficas con energía callejera,
                humor oscuro y una identidad que mezcla devoción popular,
                monstruos y color agresivo.
              </p>

              <div className="hero-actions">
                <a className="button button--primary" href="#obras">
                  Ver obras
                </a>
                <a
                  className="button button--ghost"
                  href="https://www.instagram.com/jupa.png/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </div>
            </div>

            <div className="hero-foot">
              <p>
                Disponible para afiches, portadas, identidad visual, stickers,
                comisiones y colaboraciones.
              </p>
              <div className="capability-row">
                {capabilities.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="glow glow--lime"></div>
            <div className="glow glow--orange"></div>
            <div className="visual-panel visual-panel--logo">
              <BrandAsset />
              <p>Logo / avatar</p>
            </div>
            <div className="visual-panel visual-panel--quote">
              <span>50+</span>
              <p>Piezas con identidad propia listas para crecer en mural, print o feed.</p>
            </div>
            <div className="visual-panel visual-panel--note">
              <p>
                Oscuro, irónico y visceral. Una mezcla de personaje, textura y
                gráfica popular.
              </p>
            </div>
          </div>
        </section>

        <section className="manifesto-strip">
          <p>
            Un lenguaje visual que cruza ilustración, cultura popular, terror,
            ternura rara y composición editorial.
          </p>
          <span>Disponible para 2026</span>
        </section>

        <section className="gallery-section" id="obras">
          <div className="section-heading">
            <p className="eyebrow">Seleccionada</p>
            <h2>Obras recientes</h2>
          </div>

          <div className="gallery-grid">
            {featuredWorks.map((work, index) => (
              <WorkCard key={work.title} work={work} index={index} />
            ))}
          </div>
        </section>

        <section className="story-section" id="sobre">
          <article className="story-card story-card--large">
            <p className="eyebrow">Perfil</p>
            <h2>Una voz visual que no busca verse limpia.</h2>
            <p>
              Jupa trabaja desde el personaje, la deformación y el choque entre
              lo infantil y lo siniestro. El resultado no intenta agradar a
              todo el mundo: intenta dejar huella.
            </p>
            <p>
              Este sitio está planteado como una portada viva: texto directo,
              piezas protagonistas y una atmósfera que acompaña el universo de
              la obra sin maquillarlo.
            </p>
          </article>

          <article className="story-card">
            <p className="eyebrow">Proceso</p>
            <h2>Cómo se desarrolla una pieza</h2>
            <ul className="stack-list">
              {process.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="story-card">
            <p className="eyebrow">Enfoque</p>
            <h2>Formatos que encajan bien</h2>
            <ul className="stack-list">
              <li>Campañas visuales con mucho carácter.</li>
              <li>Merch, sticker packs, posters y covers.</li>
              <li>Murales, objetos intervenidos y piezas para exposición.</li>
            </ul>
          </article>
        </section>

        <section className="contact-section" id="contacto">
          <div>
            <p className="eyebrow">Contacto</p>
            <h2>Si quieres una pieza con filo, aquí empieza la conversación.</h2>
          </div>

          <div className="contact-actions">
            <a
              className="button button--primary"
              href="https://www.instagram.com/jupa.png/"
              target="_blank"
              rel="noreferrer"
            >
              Escribir por Instagram
            </a>
            <a className="button button--ghost" href="#inicio">
              Volver arriba
            </a>
          </div>
        </section>

        <section className="youtube-section" id="youtube">
          <div className="youtube-head">
            <div>
              <p className="eyebrow">Canal</p>
              <h2>YouTube de {youtubeChannel.name}</h2>
              <p>
                Una muestra de 3 videos del canal de YouTube, donde se documenta el proceso creativo, la vida diaria y los proyectos en curso con un estilo directo y sin filtros.
              </p>
            </div>

            <a className="channel-pill" href={youtubeChannel.url} target="_blank" rel="noreferrer">
              <span>{youtubeChannel.name}</span>
              <small>{youtubeChannel.handle}</small>
            </a>
          </div>

          <div className="youtube-grid">
            {youtubeVideos.map((video) => (
              <YouTubeCard key={video.title} video={video} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
