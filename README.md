# Catálogo web Golu

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

## Contenido administrado desde Fresa

La landing consulta dos listas de Fresa al cargar: **Catálogo e imágenes** y **Contenido Landing**. Si la API no está disponible, conserva el catálogo local actual como fallback y nunca deja la página vacía.

Para desarrollo local, copia `.env.example` como `.env.local` y configura `VITE_FRESA_API_KEY` con la credencial de solo lectura `Landing GOLU (solo lectura)`.

Para GitHub Pages, crea el secret de Actions `FRESA_API_KEY` con esa misma credencial. El build ya recibe el endpoint y los IDs de las dos listas. La key termina visible en el bundle del navegador por tratarse de un sitio estático, pero está limitada en Fresa a lectura de esas dos listas y sus campos públicos.

En **Catálogo e imágenes**, cada producto es un registro padre y sus presentaciones/empaques son subtareas. Se pueden adjuntar varias imágenes por presentación; la ficha del producto las muestra como miniaturas. No cambies el valor de **Clave CMS**, porque es el identificador estable usado por la landing.
