# Jupa Portfolio

Plataforma de portafolio visual con gestión administrable de contenido y publicación centralizada en Supabase.

## Descripción del proyecto

Jupa Portfolio es una aplicación moderna construida con **React + Vite** que separa completamente la experiencia pública de visualización del contenido de la interfaz de administración privada. La plataforma permite a creadores visuales publicar sus obras sin depender de cambios en código.

### Características

- **Lectura pública del contenido**: Los visitantes ven obra publicada sincronizada desde Supabase en tiempo real.
- **Panel de administración privado**: Editor visual para gestionar cards de obras, con contraseñas seguras almacenadas en Supabase Auth.
- **Carga de imágenes integrada**: Los administradores pueden subir imágenes directamente desde el panel sin manejar rutas manuales.
- **Publicación controlada**: Los cambios se guardan en borrador y se publican de forma consciente, dejando la URL pública con versiones estables.
- **Fallback resiliente**: Si Supabase no responde, la app carga el contenido base local para no interrumpir la visualización.
- **Diseño responsive**: Interfaz optimizada para desktop y móvil, incluyendo navegación desplegable en pantallas pequeñas.

## Arquitectura

La aplicación sigue un patrón de **arquitectura desacoplada**:

- **Capa de presentación**: React renderiza contenido de forma dinámica según el estado de autenticación.
- **Capa de datos**: Supabase almacena contenido publicado, credenciales de administradores e imágenes en Storage.
- **Seguridad**: Row-Level Security (RLS) en bases de datos y políticas de almacenamiento restringen operaciones a administradores autenticados.
- **CI/CD flexible**: Se soportan dos deployments independientes: una instancia pública (editor deshabilitado) y otra privada (editor habilitado).

## Tecnologías

- **Frontend**: React 19, Vite, CSS sin framework
- **Backend & Base de datos**: Supabase (PostgreSQL, Auth, Storage)
- **Scripting de infraestructura**: SQL para RLS y esquema

## Configuración

Copia `.env.example` a `.env.local` y configura:

```
VITE_ENABLE_EDITOR=false                    # Activa/desactiva panel admin
VITE_SUPABASE_URL=https://...               # URL del proyecto Supabase
VITE_SUPABASE_ANON_KEY=...                  # Clave anónima publicable
VITE_SUPABASE_CONTENT_TABLE=portfolio_content
VITE_SUPABASE_CONTENT_ID=main
VITE_SUPABASE_IMAGE_BUCKET=portfolio-art
```

## Instalación

```bash
npm install
npm run dev      # Desarrollo con hot reload
npm run build    # Build para producción
npm run preview  # Vista previa del build
```

## Desarrollo

Durante el desarrollo, se recomienda:
- Fijar `VITE_ENABLE_EDITOR=true` en `.env.local` para acceder al panel.
- Ejecutar `npm run dev` para trabajar con hot reload.
- Testear una instancia pública sin el editor para validar fallback.

## Despliegue

Se recomienda mantener dos proyectos en producción:

| Propósito | Editor | Audiencia | Nota |
|-----------|--------|-----------|------|
| Pública | Deshabilitado | Visitantes | URL principal, visible para todos |
| Administración | Habilitado | Admin | URL privada, compartida solo con editor |

Ambas comparten la misma base de datos de Supabase, lo que permite cambios inmediatos entre las dos instancias.

## Base de datos

El esquema SQL (`supabase/schema.sql`) crea tablas para contenido, administradores e imágenes, con políticas RLS que garantizan:
- Lectura pública del contenido publicado.
- Operaciones de escritura solo para administradores autenticados.
- Almacenamiento seguro de imágenes en bucket público con control de carga.

Ejecuta el script completo en el SQL Editor de Supabase después de crear el proyecto.
