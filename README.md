# Catálogo web Golú

Catálogo responsive de velas artesanales, listo para publicarse como sitio estático en GitHub Pages.

## Desarrollo

```bash
npm install
npm run dev
```

## Validación y compilación

```bash
npm run build
```

## Publicación en GitHub Pages

1. Crea un repositorio en GitHub y sube este proyecto a la rama `main`.
2. En **Settings → Pages**, selecciona **GitHub Actions** como fuente.
3. El flujo incluido en `.github/workflows/deploy.yml` construirá y publicará el sitio automáticamente.

El proyecto usa rutas relativas, por lo que funciona tanto en un dominio raíz como dentro de la ruta de un repositorio.
