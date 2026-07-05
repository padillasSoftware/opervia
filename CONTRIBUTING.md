# Contribuir a Opervia

Gracias por querer contribuir a Opervia. Esta guía explica el flujo de trabajo para clonar el repositorio, validar cambios y enviar Pull Requests.

## Flujo recomendado

1. Sincroniza tu rama local con `staging`:
   ```bash
git checkout staging
git pull
```
2. Crea una rama a partir de `staging`:
   ```bash
git checkout -b feature/mi-cambio
```
3. Desarrolla tu cambio y valida localmente antes de subirlo.
4. Abre un Pull Request hacia `staging`.

## Nombres de ramas

- `feature/xxx` para nuevas funcionalidades.
- `fix/xxx` para correcciones.
- `release/xxx` para promociones mayores.

## Validación local

Antes de enviar un PR, asegúrate de que:

- `npm run lint`
- `npm run typecheck`
- `npm run test:unit`
- `npm run test:e2e`

Si ejecutas un cambio en servidor, asegúrate de que también tenga cobertura con pruebas E2E o unitarias.

## Qué revisa el CI

- `01 CI`: lint, typecheck, build y generación de Prisma Client.
- `02 Require Tests`: verifica que los cambios en código de aplicación incluyan tests relacionados.
- `03 QA PR`: ejecuta Playwright sobre el PR.
- `04 Smoke Staging`: valida staging tras el deploy.
- `05 Promote Production`: promueve a `master` cuando staging es estable.

## Pull Request

- Base: `staging`
- Incluye descripción clara del cambio.
- Indica qué pruebas se ejecutaron localmente.
- Añade capturas o notas si hay cambios de UI importantes.

## Prisma y migraciones

### Generar cliente Prisma

```bash
npm run prisma:generate
```

### Crear migración local

```bash
npx prisma migrate dev --name descripcion_del_cambio
```

### Aplicar migraciones en local

```bash
npm run prisma:migrate
```

## Documentación

Si agregas funcionalidad nueva, actualiza también:

- `README.md`
- `.env.example` si cambian variables de entorno
- `ROADMAP.md` si corresponde a una fase del proyecto

## Mantén el repo limpio

- No subas `node_modules`.
- Actualiza los cambios de configuración en `package.json` si agregas scripts nuevos.
- Usa mensajes de commit descriptivos.
