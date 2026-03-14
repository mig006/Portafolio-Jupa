# Portafolio Jupa

Sitio hecho con React + Vite.

## Comandos

- npm install
- npm run dev
- npm run build

## Como funciona ahora

- El publico ve contenido publicado desde Supabase.
- El panel Admin (edicion) solo aparece si VITE_ENABLE_EDITOR=true.
- Tu amigo entra con email y contraseña de Supabase, edita cards y pulsa Publicar cambios.
- En cada card puede subir su propia imagen desde el panel (sin escribir rutas manuales).
- Lo publicado se ve en la URL publica para todos.

## Variables de entorno

Copia .env.example a .env.local y configura:

- VITE_ENABLE_EDITOR=false (publico)
- VITE_SUPABASE_URL=...
- VITE_SUPABASE_ANON_KEY=...
- VITE_SUPABASE_CONTENT_TABLE=portfolio_content
- VITE_SUPABASE_CONTENT_ID=main
- VITE_SUPABASE_IMAGE_BUCKET=portfolio-art

## Setup de Supabase

1. Crea un proyecto en Supabase.
2. En SQL Editor, ejecuta supabase/schema.sql.
3. Cambia friend@example.com por el email real de tu amigo dentro del SQL.
4. En Authentication > Users, crea usuario para tu amigo (email + password).
5. Copia URL y anon key del proyecto y colocalas en variables de entorno.

## Vercel recomendado (2 proyectos)

### 1) Proyecto publico

- VITE_ENABLE_EDITOR=false
- Mismas variables de Supabase
- Esta URL es la que compartes con todo el mundo.
- No mostrara menu Admin ni formulario de edicion.

### 2) Proyecto privado (solo tu amigo)

- VITE_ENABLE_EDITOR=true
- Mismas variables de Supabase
- Comparte esta URL solo con tu amigo.
- Tu amigo inicia sesion y publica sin tocar codigo.

## Flujo para tu amigo

1. Entra a la URL privada.
2. Va a Admin.
3. Inicia sesion.
4. Agrega/edita/elimina cards.
5. Pulsa Publicar cambios.
6. Revisa la URL publica y ya se ven los cambios.

## Fallback local

Si Supabase no responde, la app muestra el contenido base de src/data/portfolioContent.json para no romper la landing.
