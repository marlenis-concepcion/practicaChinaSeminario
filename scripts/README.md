# Scripts de desarrollo

Este directorio centraliza comandos repetibles para los dos seminarios.

## Requisitos permanentes

- Interfaz bilingüe en chino e inglés.
- HTML5 semántico y accesible.
- Frontend con React, Vite y TypeScript.
- La aplicación uno es deliberadamente sencilla y funciona solo en el navegador.
- La aplicación dos conserva una base opcional de backend hasta definir sus requisitos.
- Menú de configuración para idioma, tema y preferencias.
- Temas estándar, alto contraste y opciones aptas para daltonismo.
- Ningún estado debe comunicarse solamente mediante color.
- La aplicación uno sigue los requisitos de `../APP-Seminario-Uno/REQUIREMENTS.md`.
- La aplicación dos no debe recibir funciones específicas hasta que el usuario las defina en `../APP-Semininario-Dos/REQUIREMENTS.md`.

## Uso

```bash
./scripts/start-app.sh uno
./scripts/start-app.sh dos
./scripts/check-all.sh
./scripts/add-feature.sh uno nombre-de-funcionalidad
```

`start-app.sh` inicia la app seleccionada y detiene sus procesos con `Ctrl+C`.

`add-feature.sh` crea una carpeta inicial en el frontend para una nueva función. Después hay que completar sus componentes, tipos, servicio y pruebas conforme a los requisitos del seminario.
