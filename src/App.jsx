import { useEffect, useState } from 'react'
import './App.css'
import portfolioContent from './data/portfolioContent.json'
import {
  hasSupabaseConfig,
  supabase,
  supabaseContentId,
  supabaseContentTable,
} from './lib/supabaseClient'

const editorEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_EDITOR === 'true'

const toneOptions = ['acid', 'storm', 'ember', 'lava', 'toxic', 'violet', 'bubble', 'sky']

const emptyWork = {
  title: '',
  year: '',
  format: '',
  note: '',
  image: '',
  tone: toneOptions[0],
}

function normalizeWork(work, index) {
  const title = typeof work?.title === 'string' ? work.title.trim() : ''
  const year = typeof work?.year === 'string' ? work.year.trim() : String(work?.year ?? '')
  const format = typeof work?.format === 'string' ? work.format.trim() : ''
  const note = typeof work?.note === 'string' ? work.note.trim() : ''
  const image = typeof work?.image === 'string' ? work.image.trim() : ''
  const tone = toneOptions.includes(work?.tone) ? work.tone : toneOptions[0]

  return {
    title: title || `Obra ${index + 1}`,
    year,
    format,
    note,
    image,
    tone,
  }
}

function normalizeContent(content) {
  const fallback = portfolioContent

  const worksSource =
    Array.isArray(content?.featuredWorks) && content.featuredWorks.length > 0
      ? content.featuredWorks
      : fallback.featuredWorks

  const capabilities = Array.isArray(content?.capabilities)
    ? content.capabilities.filter((item) => typeof item === 'string' && item.trim())
    : fallback.capabilities

  const process = Array.isArray(content?.process)
    ? content.process.filter((item) => typeof item === 'string' && item.trim())
    : fallback.process

  const youtubeChannel = {
    name:
      typeof content?.youtubeChannel?.name === 'string'
        ? content.youtubeChannel.name
        : fallback.youtubeChannel.name,
    handle:
      typeof content?.youtubeChannel?.handle === 'string'
        ? content.youtubeChannel.handle
        : fallback.youtubeChannel.handle,
    url:
      typeof content?.youtubeChannel?.url === 'string'
        ? content.youtubeChannel.url
        : fallback.youtubeChannel.url,
  }

  const youtubeVideos = Array.isArray(content?.youtubeVideos)
    ? content.youtubeVideos
    : fallback.youtubeVideos

  return {
    featuredWorks: worksSource.map(normalizeWork),
    capabilities,
    process,
    youtubeChannel,
    youtubeVideos,
  }
}

const defaultContent = normalizeContent(portfolioContent)

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
  const [content, setContent] = useState(defaultContent)
  const [featuredWorks, setFeaturedWorks] = useState(defaultContent.featuredWorks)
  const [isLoadingContent, setIsLoadingContent] = useState(hasSupabaseConfig)
  const [contentMessage, setContentMessage] = useState('')

  const [session, setSession] = useState(null)
  const [authValues, setAuthValues] = useState({ email: '', password: '' })
  const [authMessage, setAuthMessage] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  const [newWork, setNewWork] = useState(emptyWork)
  const [editingIndex, setEditingIndex] = useState(null)
  const [draftWork, setDraftWork] = useState(emptyWork)
  const [editorMessage, setEditorMessage] = useState('')

  useEffect(() => {
    let ignore = false

    const loadPublishedContent = async () => {
      if (!hasSupabaseConfig || !supabase) {
        setIsLoadingContent(false)
        return
      }

      setIsLoadingContent(true)

      const { data, error } = await supabase
        .from(supabaseContentTable)
        .select('content')
        .eq('id', supabaseContentId)
        .maybeSingle()

      if (ignore) {
        return
      }

      if (error) {
        setContentMessage('No se pudo leer Supabase. Se muestra el contenido local.')
        setIsLoadingContent(false)
        return
      }

      const normalized = data?.content ? normalizeContent(data.content) : defaultContent
      setContent(normalized)
      setFeaturedWorks(normalized.featuredWorks)
      setIsLoadingContent(false)
    }

    loadPublishedContent()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!editorEnabled || !hasSupabaseConfig || !supabase) {
      return
    }

    let ignore = false

    const loadSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      if (!ignore) {
        setSession(currentSession)
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => {
      ignore = true
      subscription.unsubscribe()
    }
  }, [])

  const isRequiredFieldMissing = (work) => {
    return !work.title.trim() || !work.year.trim() || !work.format.trim() || !work.image.trim()
  }

  const handleNewWorkChange = (event) => {
    const { name, value } = event.target
    setNewWork((prev) => ({ ...prev, [name]: value }))
  }

  const handleDraftChange = (event) => {
    const { name, value } = event.target
    setDraftWork((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddWork = (event) => {
    event.preventDefault()

    if (isRequiredFieldMissing(newWork)) {
      setEditorMessage('Completa titulo, año, formato e imagen para crear el card.')
      return
    }

    const normalizedWork = normalizeWork(newWork, featuredWorks.length)
    setFeaturedWorks((prev) => [...prev, normalizedWork])
    setNewWork(emptyWork)
    setEditorMessage(`Card agregado al borrador: ${normalizedWork.title}.`)
  }

  const startEditingWork = (index) => {
    setEditingIndex(index)
    setDraftWork(featuredWorks[index])
    setEditorMessage('')
  }

  const cancelEditingWork = () => {
    setEditingIndex(null)
    setDraftWork(emptyWork)
  }

  const saveEditedWork = (event, index) => {
    event.preventDefault()

    if (isRequiredFieldMissing(draftWork)) {
      setEditorMessage('Completa titulo, año, formato e imagen para guardar cambios.')
      return
    }

    const normalizedWork = normalizeWork(draftWork, index)
    setFeaturedWorks((prev) => prev.map((work, currentIndex) => (currentIndex === index ? normalizedWork : work)))
    setEditingIndex(null)
    setDraftWork(emptyWork)
    setEditorMessage(`Card editado en borrador: ${normalizedWork.title}.`)
  }

  const deleteWork = (index) => {
    const selectedWork = featuredWorks[index]

    if (!selectedWork) {
      return
    }

    const confirmed = window.confirm(`Eliminar el card "${selectedWork.title}"?`)

    if (!confirmed) {
      return
    }

    setFeaturedWorks((prev) => prev.filter((_, currentIndex) => currentIndex !== index))

    if (editingIndex === index) {
      setEditingIndex(null)
      setDraftWork(emptyWork)
    }

    if (editingIndex !== null && editingIndex > index) {
      setEditingIndex((prev) => prev - 1)
    }

    setEditorMessage(`Card eliminado del borrador: ${selectedWork.title}.`)
  }

  const resetDraftToPublished = () => {
    setFeaturedWorks(content.featuredWorks.map(normalizeWork))
    setEditingIndex(null)
    setDraftWork(emptyWork)
    setEditorMessage('Borrador restablecido al contenido publicado.')
  }

  const loadBaseWorks = () => {
    const confirmed = window.confirm('Reemplazar el borrador por las obras base del JSON local?')

    if (!confirmed) {
      return
    }

    setFeaturedWorks(defaultContent.featuredWorks.map(normalizeWork))
    setEditingIndex(null)
    setDraftWork(emptyWork)
    setEditorMessage('Borrador cargado desde el JSON base.')
  }

  const handleAuthFieldChange = (event) => {
    const { name, value } = event.target
    setAuthValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignIn = async (event) => {
    event.preventDefault()

    if (!supabase) {
      return
    }

    setIsAuthenticating(true)
    setAuthMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email: authValues.email,
      password: authValues.password,
    })

    setIsAuthenticating(false)

    if (error) {
      setAuthMessage(error.message)
      return
    }

    setFeaturedWorks(content.featuredWorks.map(normalizeWork))
    setAuthMessage('Sesion iniciada. Ya puedes editar y publicar.')
  }

  const handleSignOut = async () => {
    if (!supabase) {
      return
    }

    await supabase.auth.signOut()
    setFeaturedWorks(content.featuredWorks.map(normalizeWork))
    setEditingIndex(null)
    setDraftWork(emptyWork)
    setEditorMessage('')
    setAuthMessage('Sesion cerrada.')
  }

  const handlePublishChanges = async () => {
    if (!supabase || !session) {
      return
    }

    setIsPublishing(true)

    const nextContent = {
      ...content,
      featuredWorks: featuredWorks.map(normalizeWork),
    }

    const { error } = await supabase
      .from(supabaseContentTable)
      .upsert({ id: supabaseContentId, content: nextContent }, { onConflict: 'id' })

    setIsPublishing(false)

    if (error) {
      setEditorMessage(`No se pudo publicar: ${error.message}`)
      return
    }

    setContent(nextContent)
    setEditorMessage('Cambios publicados para todos los visitantes.')
  }

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
          {editorEnabled && <a href="#editor">Admin</a>}
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
                {content.capabilities.map((item) => (
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
            {isLoadingContent && <p className="sync-note">Cargando contenido publicado...</p>}
            {contentMessage && <p className="sync-note sync-note--warning">{contentMessage}</p>}
          </div>

          <div className="gallery-grid">
            {featuredWorks.map((work, index) => (
              <WorkCard key={`${work.title}-${index}`} work={work} index={index} />
            ))}
          </div>
        </section>

        {editorEnabled && (
          <section className="editor-section" id="editor">
            <div className="section-heading">
              <p className="eyebrow">Admin</p>
              <h2>Panel privado para publicar cambios</h2>
              <p>
                Solo usuarios con cuenta en Supabase pueden entrar y publicar.
                Lo publicado aqui se refleja en la web publica.
              </p>
            </div>

            {!hasSupabaseConfig && (
              <div className="editor-warning">
                Faltan variables de Supabase en el entorno. Configura VITE_SUPABASE_URL y
                VITE_SUPABASE_ANON_KEY.
              </div>
            )}

            {hasSupabaseConfig && !session && (
              <form className="auth-form" onSubmit={handleSignIn}>
                <h3>Iniciar sesion</h3>
                <p>Usa el usuario de tu amigo para abrir el editor.</p>

                <label className="editor-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    value={authValues.email}
                    onChange={handleAuthFieldChange}
                    required
                  />
                </label>

                <label className="editor-field">
                  <span>Contraseña</span>
                  <input
                    type="password"
                    name="password"
                    value={authValues.password}
                    onChange={handleAuthFieldChange}
                    required
                  />
                </label>

                <div className="editor-actions">
                  <button type="submit" className="button button--primary" disabled={isAuthenticating}>
                    {isAuthenticating ? 'Entrando...' : 'Entrar al panel'}
                  </button>
                </div>

                {authMessage && <p className="editor-message">{authMessage}</p>}
              </form>
            )}

            {hasSupabaseConfig && session && (
              <>
                <div className="editor-toolbar">
                  <p>
                    Sesion activa: <strong>{session.user?.email || 'usuario'}</strong>
                  </p>

                  <div className="editor-toolbar-actions">
                    <button
                      type="button"
                      className="button button--primary"
                      onClick={handlePublishChanges}
                      disabled={isPublishing}
                    >
                      {isPublishing ? 'Publicando...' : 'Publicar cambios'}
                    </button>
                    <button type="button" className="button button--ghost" onClick={resetDraftToPublished}>
                      Descartar borrador
                    </button>
                    <button type="button" className="button button--ghost" onClick={handleSignOut}>
                      Cerrar sesion
                    </button>
                  </div>
                </div>

                <div className="editor-layout">
                  <form className="editor-form" onSubmit={handleAddWork}>
                    <h3>Agregar nueva obra</h3>

                    <div className="editor-fields">
                      <label className="editor-field">
                        <span>Titulo</span>
                        <input name="title" value={newWork.title} onChange={handleNewWorkChange} />
                      </label>

                      <label className="editor-field">
                        <span>Año</span>
                        <input name="year" value={newWork.year} onChange={handleNewWorkChange} />
                      </label>

                      <label className="editor-field">
                        <span>Formato</span>
                        <input name="format" value={newWork.format} onChange={handleNewWorkChange} />
                      </label>

                      <label className="editor-field">
                        <span>Tone</span>
                        <select name="tone" value={newWork.tone} onChange={handleNewWorkChange}>
                          {toneOptions.map((tone) => (
                            <option key={tone} value={tone}>
                              {tone}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="editor-field editor-field--full">
                        <span>Imagen</span>
                        <input
                          name="image"
                          placeholder="/art/nueva-obra.png"
                          value={newWork.image}
                          onChange={handleNewWorkChange}
                        />
                      </label>

                      <label className="editor-field editor-field--full">
                        <span>Descripcion</span>
                        <textarea
                          name="note"
                          rows={3}
                          value={newWork.note}
                          onChange={handleNewWorkChange}
                        />
                      </label>
                    </div>

                    <div className="editor-actions">
                      <button type="submit" className="button button--primary">
                        Agregar card al borrador
                      </button>

                      <button type="button" className="button button--ghost" onClick={loadBaseWorks}>
                        Cargar obras base (JSON)
                      </button>
                    </div>

                    {editorMessage && <p className="editor-message">{editorMessage}</p>}
                  </form>

                  <div className="editor-list">
                    <h3>Borrador actual ({featuredWorks.length})</h3>

                    <ul>
                      {featuredWorks.map((work, index) => (
                        <li key={`${work.title}-${index}`} className="editor-item">
                          {editingIndex === index ? (
                            <form className="editor-edit-form" onSubmit={(event) => saveEditedWork(event, index)}>
                              <div className="editor-edit-grid">
                                <label className="editor-field">
                                  <span>Titulo</span>
                                  <input name="title" value={draftWork.title} onChange={handleDraftChange} />
                                </label>

                                <label className="editor-field">
                                  <span>Año</span>
                                  <input name="year" value={draftWork.year} onChange={handleDraftChange} />
                                </label>

                                <label className="editor-field">
                                  <span>Formato</span>
                                  <input name="format" value={draftWork.format} onChange={handleDraftChange} />
                                </label>

                                <label className="editor-field">
                                  <span>Tone</span>
                                  <select name="tone" value={draftWork.tone} onChange={handleDraftChange}>
                                    {toneOptions.map((tone) => (
                                      <option key={tone} value={tone}>
                                        {tone}
                                      </option>
                                    ))}
                                  </select>
                                </label>

                                <label className="editor-field editor-field--full">
                                  <span>Imagen</span>
                                  <input name="image" value={draftWork.image} onChange={handleDraftChange} />
                                </label>

                                <label className="editor-field editor-field--full">
                                  <span>Descripcion</span>
                                  <textarea
                                    name="note"
                                    rows={3}
                                    value={draftWork.note}
                                    onChange={handleDraftChange}
                                  />
                                </label>
                              </div>

                              <div className="editor-edit-actions">
                                <button type="submit" className="editor-mini-button">
                                  Guardar
                                </button>
                                <button type="button" className="editor-mini-button" onClick={cancelEditingWork}>
                                  Cancelar
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="editor-item-view">
                              <div>
                                <strong>{work.title}</strong>
                                <p>
                                  {work.year} - {work.format}
                                </p>
                              </div>

                              <div className="editor-item-actions">
                                <button
                                  type="button"
                                  className="editor-mini-button"
                                  onClick={() => startEditingWork(index)}
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  className="editor-mini-button editor-mini-button--danger"
                                  onClick={() => deleteWork(index)}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

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
              {content.process.map((item) => (
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
              <h2>YouTube de {content.youtubeChannel.name}</h2>
              <p>
                Una muestra de 3 videos del canal de YouTube, donde se documenta el proceso creativo, la vida diaria y los proyectos en curso con un estilo directo y sin filtros.
              </p>
            </div>

            <a className="channel-pill" href={content.youtubeChannel.url} target="_blank" rel="noreferrer">
              <span>{content.youtubeChannel.name}</span>
              <small>{content.youtubeChannel.handle}</small>
            </a>
          </div>

          <div className="youtube-grid">
            {content.youtubeVideos.map((video) => (
              <YouTubeCard key={video.title} video={video} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
