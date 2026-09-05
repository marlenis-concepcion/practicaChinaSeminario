# Scripts y guía de ejecución

Este directorio documenta los comandos del proyecto. La aplicación es un frontend sencillo con React, Vite y TypeScript; no necesita backend ni base de datos.

## Primera preparación

Desde `APP-Seminario-Uno`:

```bash
npm install
```

## Ejecutar la aplicación

La página estará en `http://localhost:5173`:

```bash
npm run dev
```

## Verificar

```bash
npm run typecheck
npm run build
```

## Reglas para nuevas funcionalidades

1. Configuración, textos y límites seguros pertenecen a `apps/frontend/src/config.ts`.
2. Mantener los componentes pequeños y evitar funciones no solicitadas.
3. El audio crudo del micrófono nunca se envía ni se guarda.
4. Todo estado comunicado con color debe incluir también texto, icono o patrón.
5. Toda acción debe funcionar con teclado y conservar un foco visible.
