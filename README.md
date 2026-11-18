# Los Andantes Terraza — Diseño editorial negro + dorado

Propuesta web estática creada en HTML, CSS y JavaScript desde cero. Inspirada en la atmósfera visual de una referencia de restaurante: encabezado oscuro, botón de reserva dorado, grandes titulares con serif itálica, cartas deslizables, visor de carta, reseñas, fotografías grandes y secciones de ubicación y reservaciones.

## Cómo ejecutarla

1. Descomprime el ZIP.
2. Abre la carpeta en Visual Studio Code.
3. Con la extensión **Live Server**, abre `index.html` o ábrelo directamente en el navegador.
4. Para publicar: sube los archivos a GitHub Pages o Cloudflare Pages. No requiere PHP ni base de datos.

## Archivos

- `index.html`: estructura y enlaces a CDN de GSAP y ScrollTrigger.
- `css/styles.css`: paleta, tipografías, portada, componentes, diseño responsive.
- `js/main.js`: menú, carruseles, visor de carta, reseñas, reserva por WhatsApp y animaciones GSAP.
- `assets/menu/carta-01.svg` a `carta-06.svg`: **menús de ejemplo, NO oficiales**. Puedes reemplazarlos por fotos autorizadas del menú real.
- `assets/illustrations/`: ilustraciones propias que cargan si fallan las fotografías de ejemplo en Unsplash.

## Animación parallax solicitada

En `js/main.js`, dentro de la sección **SOLICITUD ORIGINAL**, se aplica exactamente a tres imágenes con `[data-parallax]`: 

- Escala: `0.7 → 1.2`
- Opacidad: `0 → 1`
- Recorrido de scroll: `600px` para cada imagen
- Desaceleración: `ease: 'power2.out'`
- Desplazamiento vertical de la imagen: `120px` positivos por `600px` de desplazamiento. El movimiento neto es un 20% más lento que el scroll.
- Plugin: GSAP 3.12.5 + ScrollTrigger desde cdnjs.

## Personalización

- **Marca y títulos**: cambia `LOS ANDANTES` y `TERRAZA` en `index.html`.
- **Colores**: variables en `css/styles.css`, selector `:root`.
- **Fotos**: reemplaza `src` de cada `<img>` por fotografías autorizadas. Actualmente son imágenes ilustrativas y requieren internet para cargar desde Unsplash.
- **Carta real**: reemplaza los SVG de `assets/menu/` por las páginas reales autorizadas, y ajusta `menuImages` en `js/main.js` si modificas el número de páginas.
- **WhatsApp**: en `js/main.js`, busca `529511144481` (dato proporcionado para Los Andantes).
- **Dirección**: cambia la sección `#ubicacion` en `index.html`.
- **Horarios y precios**: no se muestran para no inventar condiciones comerciales.

## Importante

Esta es una demostración visual **no oficial**. El formulario solo genera un mensaje de WhatsApp; no confirma mesas ni comprueba disponibilidad. Los menús son ficticios y las reseñas son extractos de demostración. La estructura, los estilos y los scripts fueron escritos independientemente y no son copia del código fuente ni de los recursos originales de la página de referencia.
