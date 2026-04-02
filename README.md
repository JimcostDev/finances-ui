# finances-ui (MyFinances)

Frontend web para gestionar finanzas personales: reportes mensuales y anuales, balance general, categorías de ingresos y gastos, perfil de usuario y autenticación por sesión (cookies HttpOnly).

## Stack

| Tecnología | Uso |
|------------|-----|
| [Astro](https://astro.build/) 6 | Páginas `.astro`, modo `server` (SSR) |
| [React](https://react.dev/) 19 | Formularios y vistas interactivas (islas) |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Estilos (`@tailwindcss/vite`) |
| TypeScript 5 | Tipado estricto (`astro/tsconfigs/strict`) |
| [@astrojs/vercel](https://docs.astro.build/en/guides/integrations-guide/vercel/) | Despliegue en Vercel |

Las peticiones al backend usan `fetch` con `credentials: "include"` para enviar la cookie de sesión.

## Requisitos

- Node.js compatible con Astro 6 (recomendado: LTS actual)
- Backend API disponible (ver configuración de URL abajo)

## Instalación y comandos

Desde la carpeta `finances-ui`:

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # salida en ./dist/
npm run preview  # vista previa del build
```

## Configuración del API

La URL base del backend está en `src/config/apiUrl.ts` (`API_BASE_URL`). Para desarrollo local, apunta al servidor que expongas (por ejemplo el puerto de tu API) y ajusta según tu entorno.

## Estructura principal

```text
src/
├── components/     # React: auth, dashboard, reports, user, layout, icons
├── config/         # p. ej. apiUrl
├── interfaces/     # Tipos compartidos (IUser, IReport, …)
├── layouts/        # Layouts Astro
├── pages/          # Rutas (login, register, dashboard, reportes, …)
├── services/       # Llamadas HTTP a /api (auth, reportes, usuario)
└── utils/          # Utilidades (p. ej. manejo de errores)
```

Alias TypeScript (ver `tsconfig.json`): `@components/*`, `@layouts/*`, `@services`, `@interfaces`, `@utils/*`, `@styles/*`.

## Rutas de páginas (resumen)

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio |
| `/login`, `/register` | Autenticación |
| `/dashboard` | Panel con navegación a reportes, crear reporte, anual, balance, perfil |
| `/reports`, `/create-report`, `/annual-report`, `/general-balance` | Vistas de reportes |
| `/edit-report/[id]`, `/delete-report/[id]` | Edición y borrado |
| `/edit-profile`, `/delete-user` | Perfil y baja de cuenta |

## Desarrollo

- Los componentes React viven bajo `src/components/` y se importan en las páginas `.astro` con `client:load` u otras directivas según necesidad.
- Para comprobar tipos: `npx astro check` (si está disponible en tu entorno) o el análisis del IDE con la configuración del proyecto.
