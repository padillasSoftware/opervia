# Roadmap de mejora de Opervia

Este documento convierte la evaluación del proyecto en un plan concreto y priorizado para mejorar estabilidad, seguridad, calidad y preparación para producción.

## Objetivo general

Convertir Opervia en una base más robusta, mantenible y segura para crecer como producto SaaS.

---

## Fase 1 — Estabilizar CI/CD (prioridad alta)

**Estado: ✅ Completado**

### Objetivo
Hacer que los workflows de GitHub Actions sean confiables y no fallen por problemas transitorios de base de datos o despliegue.

### Tareas
- Mantener los workflows de CI, QA y smoke tests con ejecuciones determinísticas.
- Separar mejor los jobs que requieren base de datos de los que solo validan código.
- Añadir reintentos y manejo explícito de errores para migraciones y despliegues.
- Revisar el uso compartido de la base de datos entre workflows.

### Criterios de aceptación
- Los checks de PR se ejecutan de forma consistente.
- Los workflows de staging no colisionan entre sí.
- Los fallos temporales de Prisma no rompen el pipeline.

---

## Fase 2 — Fortalecer seguridad (prioridad alta)

**Estado: ✅ Completado**

### Objetivo
Reducir riesgos de acceso, autenticación y exposición de datos.

### Tareas
- Añadir pruebas de autorización por rol y permiso.
- Revisar y reforzar la validación de entradas en APIs y formularios.
- Revisar la gestión de sesiones y expiración.
- Definir políticas claras de contraseñas y secretos.
- Revisar manejo de errores para no filtrar información sensible.

### Criterios de aceptación
- Las rutas sensibles están protegidas por pruebas automatizadas.
- No se exponen datos innecesarios en errores o respuestas.
- Los secretos se manejan exclusivamente mediante variables de entorno y GitHub Secrets.

---

## Fase 3 — Mejorar calidad de código (prioridad media)

### Objetivo
Hacer el proyecto más mantenible a medida que crezca.

### Tareas
- Añadir pruebas unitarias para lógica de negocio y utilidades.
- Añadir pruebas de integración para servicios y base de datos.
- Definir una guía interna de arquitectura para servicios, composables y validaciones.
- Centralizar manejo de errores y respuestas de API.

### Criterios de aceptación
- Hay cobertura básica para flujos críticos como autenticación, usuarios y empleados.
- El código tiene patrones consistentes.
- Cambios pequeños no introducen regresiones rápidas.

---

## Fase 4 — Observabilidad y operaciones (prioridad media)

### Objetivo
Preparar el proyecto para monitoreo real y diagnóstico de incidentes.

### Tareas
- Añadir logging estructurado en eventos importantes.
- Integrar herramientas de monitoreo como Sentry o similar si se considera necesario.
- Crear health checks o endpoints de estado.
- Definir políticas de backup y restauración de base de datos.

### Criterios de aceptación
- Se puede identificar rápidamente el origen de fallos.
- Los despliegues y errores quedan trazables.
- Existen pasos claros para recuperar el sistema si algo falla.

---

## Fase 5 — Preparar documentación y onboarding (prioridad media)

### Objetivo
Facilitar que otras personas puedan trabajar y operar el proyecto sin ambigüedades.

### Tareas
- Mejorar el README con instrucciones exactas para setup local, pruebas y despliegue.
- Documentar variables de entorno necesarias por ambiente.
- Añadir una guía de contribución y flujo de trabajo GitHub.
- Documentar los procesos de migración de Prisma y despliegue.

### Criterios de aceptación
- Un desarrollador nuevo puede levantar el proyecto sin ayuda adicional.
- Los pasos para probar y desplegar quedan claros.
- La arquitectura y flujos principales están documentados.

---

## Orden recomendado de ejecución

1. Estabilizar CI/CD.
2. Fortalecer seguridad.
3. Añadir pruebas de integración y unitarias.
4. Implementar observabilidad.
5. Completar documentación y preparación para producción.

---

## Próximo paso inmediato

Comenzar por:
- dejar los workflows completamente estables,
- añadir pruebas mínimas de seguridad y autorización,
- y preparar una base de tests más sólida para el core del producto.
