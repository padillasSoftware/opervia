<div align="center">

# 🩺 Maelmar

### Plataforma SaaS moderna para gestión clínica

Maelmar es una plataforma web construida con Nuxt, Prisma y PostgreSQL para administrar operaciones clínicas: empleados, pacientes, roles, permisos, citas y flujos internos.

![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt)
![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-E2E-45ba63?logo=playwright)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?logo=githubactions)

</div>

---

## 🚀 Resumen

Maelmar está diseñado como una base SaaS profesional para clínicas. El proyecto incluye autenticación, control de roles, administración de empleados, pruebas automatizadas y un pipeline CI/CD con staging.

```txt
Feature Branch
      ↓
Pull Request → staging
      ↓
01 CI
      ↓
02 Require Tests
      ↓
03 Playwright QA
      ↓
Auto Merge
      ↓
Deploy Staging
      ↓
04 Smoke Staging
      ↓
Promotion → master
```

---

## ✨ Funcionalidades

- Autenticación con sesiones.
- Control de acceso por roles.
- Administración de empleados.
- Alta y edición de empleados.
- Middleware de protección por permisos.
- Interfaz moderna con Nuxt UI.
- Validaciones con TypeScript y Zod.
- Base de datos PostgreSQL con Prisma.
- Pruebas E2E con Playwright.
- Smoke tests automáticos en staging.
- Pipeline CI/CD con GitHub Actions.
- Deploy en Netlify.

---

## 🧱 Stack

| Área | Tecnología |
|---|---|
| Framework | Nuxt 4 |
| UI | Nuxt UI + Tailwind CSS |
| Lenguaje | TypeScript |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| Auth | nuxt-auth-utils |
| Testing | Playwright |
| Deploy | Netlify |
| CI/CD | GitHub Actions |

---

## 📁 Estructura del proyecto

```txt
.
├── .github
│   ├── actions
│   │   └── setup-project
│   ├── scripts
│   │   └── require-tests.mjs
│   └── workflows
│       ├── 01-ci.yml
│       ├── 02-require-tests.yml
│       ├── 03-qa-pr.yml
│       ├── 04-smoke-staging.yml
│       └── 05-promote-production.yml
│
├── app
│   ├── components
│   ├── composables
│   ├── layouts
│   ├── middleware
│   └── pages
│
├── prisma
│   ├── schema.prisma
│   └── migrations
│
├── seed
│   └── seed.ts
│
├── server
│   ├── api
│   ├── services
│   └── utils
│
├── scripts
│   ├── clean.sh
│   ├── release.sh
│   ├── setup.sh
│   └── sync-branches.sh
│
└── tests
    ├── e2e
    ├── helpers
    └── smoke
```

---

## ⚙️ Instalación

```bash
git clone https://github.com/padillasSoftware/opervia.git
cd opervia
npm install
```

Generar Prisma Client:

```bash
npm run prisma:generate
```

Ejecutar seed:

```bash
npm run seed
```

Levantar en local:

```bash
npm run dev
```

---

## 🔐 Variables de entorno

Crea un archivo `.env` basado en tus variables del ambiente:

```env
DATABASE_URL=
NUXT_SESSION_PASSWORD=

SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
SMTP_FROM_EMAIL=
SMTP_FROM_NAME=

APP_URL=
STAGE=
```

---

## 🧪 Testing

### Ejecutar todos los E2E

```bash
npm run test:e2e
```

### Modo UI

```bash
npm run test:e2e:ui
```

### Ver reporte

```bash
npm run test:e2e:report
```

### Smoke tests

```bash
npx playwright test tests/smoke --project=authenticated
```

---

## 🧠 Estrategia de pruebas

Maelmar usa dos niveles principales de pruebas:

### E2E

Validan flujos completos del sistema.

```txt
tests/e2e
├── public
│   └── auth
└── authenticated
    └── employees
```

### Smoke

Validan que staging siga vivo después de cada deploy.

```txt
tests/smoke
├── dashboard.spec.ts
└── employees.spec.ts
```

---

## 🚦 CI/CD

### 01 CI

Valida calidad base del código:

```txt
npm ci
prisma generate
lint
typecheck
build
```

### 02 Require Tests

Bloquea PRs que modifican comportamiento de la app sin actualizar pruebas.

Ejemplo:

```txt
app/pages/**
app/components/**
server/api/**
server/services/**
```

requiere cambios en:

```txt
tests/**
```

### 03 QA PR

Corre Playwright en cada PR hacia `staging`.

Si todo pasa:

```txt
Auto Merge → staging
```

### 04 Smoke Staging

Después del deploy a staging:

```txt
espera Netlify
corre smoke tests
valida rutas críticas
```

### 05 Promote Production

Después de smoke staging exitoso:

```txt
prepara promoción hacia master
```

---

## 🌳 Flujo de ramas

```txt
feature/*
    ↓
staging
    ↓
master
```

| Rama | Uso |
|---|---|
| `master` | Producción |
| `staging` | Pre-producción |
| `feature/*` | Desarrollo de funcionalidades |
| `fix/*` | Correcciones |
| `release/*` | Promociones |

---

## 🧰 Scripts del proyecto

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta Nuxt en local |
| `npm run build` | Build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run typecheck` | Valida TypeScript |
| `npm run prisma:generate` | Genera Prisma Client |
| `npm run prisma:migrate` | Aplica migraciones |
| `npm run seed` | Ejecuta seed |
| `npm run test:e2e` | Corre Playwright |
| `npm run setup` | Instala y prepara el proyecto |
| `npm run clean` | Limpia dependencias/builds locales |
| `npm run sync` | Actualiza `master` y `staging` |
| `npm run release` | Validación previa a release |

---

## 🛠 Scripts locales

### Sincronizar ramas

```bash
npm run sync
```

Actualiza:

```txt
master
staging
```

### Limpiar proyecto

```bash
npm run clean
```

Elimina:

```txt
node_modules
.nuxt
.output
playwright-report
test-results
```

y reinstala dependencias.

### Setup inicial

```bash
npm run setup
```

Ideal para después de clonar el repo.

---

## 🗄 Prisma

Generar cliente:

```bash
npm run prisma:generate
```

Aplicar migraciones:

```bash
npm run prisma:migrate
```

Ejecutar seed:

```bash
npm run seed
```

> Las migraciones se ejecutan manualmente por ambiente para evitar conflictos en deploy.

---

## 🚀 Deploy

El proyecto se despliega en Netlify.

### Build command recomendado

```bash
npm run prisma:generate && npm run build
```

### Publish directory

```txt
dist
```

---

## 🧭 Roadmap

### Core

- [x] Autenticación
- [x] Roles
- [x] Middleware RBAC
- [x] Empleados
- [x] Crear empleado
- [x] Editar empleado
- [ ] Pacientes
- [ ] Citas
- [ ] Calendario
- [ ] Reportes

### Plataforma

- [x] CI base
- [x] Require Tests
- [x] QA PR
- [x] Auto Merge a staging
- [x] Smoke Staging
- [ ] Smoke Production
- [ ] Rollback
- [ ] Release automation

---

## 🧑‍💻 Flujo recomendado de desarrollo

Actualizar ramas:

```bash
npm run sync
```

Crear branch:

```bash
git checkout -b feature/my-feature
```

Desarrollar y validar:

```bash
npm run lint
npm run typecheck
npm run test:e2e
```

Subir cambios:

```bash
git push -u origin feature/my-feature
```

Abrir PR hacia:

```txt
staging
```

El pipeline se encarga del resto.

---

## ✅ Definition of Done

Una tarea se considera lista cuando:

- El código compila.
- TypeScript pasa.
- ESLint pasa.
- Tiene pruebas cuando modifica comportamiento.
- Playwright pasa.
- El PR pasa CI.
- Staging pasa smoke tests.

---

## 🏢 Autor

Desarrollado por **Padillas Software**.

<div align="center">

### Maelmar

Software clínico moderno, automatizado y preparado para crecer.

</div>