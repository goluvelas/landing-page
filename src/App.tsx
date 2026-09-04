import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  AtSign,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Mail,
  Menu,
  MessageCircle,
  PackageCheck,
  Phone,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { loadGoluCms, type GoluCmsData } from "./goluCms";

type Category = "Recordatorios" | "Postres" | "Detalles";

type Product = {
  id: string;
  name: string;
  category: Category;
  image: string;
  description: string;
  variants: { name: string; price: number; images?: string[] }[];
  notes?: string[];
  tag?: string;
};

const asset = (name: string) => `./assets/catalog/${name}`;

const products: Product[] = [
  {
    id: "elefante",
    name: "Elefante",
    category: "Recordatorios",
    image: asset("elefante.jpg"),
    description: "Un recuerdo tierno y totalmente personalizable para celebrar nuevas historias.",
    tag: "Favorito",
    variants: [
      { name: "Empaque acetato + base tipo postre", price: 8500 },
      { name: "Hablador personalizado + base", price: 8300 },
      { name: "Empaque acetato", price: 7200 },
      { name: "Empaque tull", price: 5200 },
    ],
    notes: ["Color a elección", "Nombre o mensaje personalizado", "Incluye moño y aroma"],
  },
  {
    id: "conejito",
    name: "Conejito",
    category: "Recordatorios",
    image: asset("conejito.jpg"),
    description: "Suave, delicado y listo para acompañar bautizos, baby showers y cumpleaños.",
    variants: [
      { name: "Empaque acetato + base tipo postre", price: 8300 },
      { name: "Empaque acetato", price: 7200 },
      { name: "Hablador personalizado", price: 6700 },
      { name: "Empaque tull", price: 5200 },
    ],
    notes: ["Color a elección", "Personalización por ambas caras", "Incluye moño y aroma"],
  },
  {
    id: "osito-peluche",
    name: "Osito de peluche",
    category: "Recordatorios",
    image: asset("osito-peluche.jpg"),
    description: "Un osito de cera con acabado dulce y empaque pensado para regalar.",
    variants: [
      { name: "Empaque acetato + base", price: 8300 },
      { name: "Empaque acetato", price: 7200 },
      { name: "Hablador personalizado", price: 6700 },
      { name: "Empaque tull", price: 5300 },
    ],
    notes: ["Color del osito a elección", "Tarjeta o base personalizada", "Incluye aroma"],
  },
  {
    id: "oso-mini",
    name: "Oso Mini",
    category: "Recordatorios",
    image: asset("oso-mini.jpg"),
    description: "Formato compacto con frasco de policarbonato y nombre en vinilo.",
    variants: [
      { name: "Acetato + base tipo postre", price: 8300 },
      { name: "Empaque tull", price: 7900 },
    ],
    notes: ["Mensaje en tarjeta", "Nombre en vinilo", "Incluye moño y aroma"],
  },
  {
    id: "oso-mono",
    name: "Oso Moño",
    category: "Recordatorios",
    image: asset("oso-mono.jpg"),
    description: "Pequeño, expresivo y vestido con un moño del color que elijas.",
    variants: [
      { name: "Cajita hablador", price: 8000 },
      { name: "Empaque tull", price: 7000 },
    ],
    notes: ["Color y moño a elección", "Tarjeta opcional desde 6 unidades", "Incluye aroma"],
  },
  {
    id: "winnie-pooh",
    name: "Winnie Pooh",
    category: "Recordatorios",
    image: asset("winnie-pooh.jpg"),
    description: "Una referencia alegre para celebraciones infantiles llenas de color.",
    variants: [
      { name: "Empaque acetato", price: 7200 },
      { name: "Hablador personalizado", price: 6700 },
      { name: "Empaque tull", price: 5500 },
    ],
    notes: ["Color a elección", "Base, caja o tarjeta personalizada", "Incluye moño y aroma"],
  },
  {
    id: "leoncito",
    name: "Leoncito",
    category: "Recordatorios",
    image: asset("leoncito.jpg"),
    description: "Un detalle con mucha personalidad para pequeños protagonistas.",
    variants: [
      { name: "Empaque acetato + base", price: 8300 },
      { name: "Hablador personalizado", price: 6700 },
      { name: "Empaque tull", price: 5200 },
    ],
    notes: ["Hablador y tull desde 12 unidades", "Color y nombre personalizados", "Incluye aroma"],
  },
  {
    id: "leoncito-3d",
    name: "Leoncito 3D",
    category: "Recordatorios",
    image: asset("leoncito-3d.jpg"),
    description: "Volumen y textura para un recuerdo que llama la atención desde cualquier ángulo.",
    tag: "Nuevo",
    variants: [
      { name: "Empaque acetato + base", price: 8300 },
      { name: "Hablador personalizado", price: 6700 },
      { name: "Empaque tull", price: 5300 },
    ],
    notes: ["Hablador y tull desde 12 unidades", "Color a elección", "Incluye moño y aroma"],
  },
  {
    id: "piecitos",
    name: "Piecitos",
    category: "Recordatorios",
    image: asset("piecitos.jpg"),
    description: "Una vela entrañable para anunciar, recibir y celebrar una nueva vida.",
    variants: [
      { name: "Empaque acetato + base", price: 8000 },
      { name: "Hablador personalizado", price: 7000 },
      { name: "Empaque tull", price: 6600 },
    ],
    notes: ["Color y base personalizados", "Mensaje en reverso o tarjeta", "Incluye moño y aroma"],
  },
  {
    id: "virgencita",
    name: "Virgencita",
    category: "Recordatorios",
    image: asset("virgencita.jpg"),
    description: "Una referencia serena para primeras comuniones, bautizos y celebraciones de fe.",
    variants: [
      { name: "Acetato + base postre", price: 8500 },
      { name: "Cajita con ventana", price: 7000 },
      { name: "Empaque tull", price: 5500 },
    ],
    notes: ["Color a elección", "Nombre o mensaje personalizado", "Incluye moño y aroma"],
  },
  {
    id: "angelito",
    name: "Angelito",
    category: "Recordatorios",
    image: asset("angelito.jpg"),
    description: "Una pieza luminosa y simbólica, hecha para momentos muy especiales.",
    variants: [
      { name: "Acetato + base postre", price: 8300 },
      { name: "Cajita con ventana", price: 7000 },
      { name: "Empaque tull", price: 5200 },
    ],
    notes: ["Color a elección", "Nombre o mensaje personalizado", "Incluye moño y aroma"],
  },
  {
    id: "crucecita",
    name: "Crucecita",
    category: "Recordatorios",
    image: asset("crucecita.jpg"),
    description: "Minimalista y significativa, con presentación lista para entregar.",
    variants: [
      { name: "Cajita personalizada", price: 5900 },
      { name: "Empaque tull", price: 4500 },
    ],
    notes: ["Disponible desde 12 unidades", "Color y mensaje a elección", "Incluye moño y aroma"],
  },
  {
    id: "perrito",
    name: "Perrito",
    category: "Recordatorios",
    image: asset("perrito.jpg"),
    description: "Un compañero adorable en versión vela, ideal para celebraciones infantiles.",
    variants: [
      { name: "Hablador personalizado + base", price: 8300 },
      { name: "Empaque acetato", price: 7000 },
      { name: "Empaque tull", price: 5200 },
    ],
    notes: ["Color y nombre personalizados", "Incluye moño y aroma"],
  },
  {
    id: "mini-burbuja",
    name: "Mini Burbuja",
    category: "Recordatorios",
    image: asset("mini-burbuja.jpg"),
    description: "Diseño contemporáneo y versátil que se adapta a cualquier temática.",
    variants: [
      { name: "Empaque acetato", price: 7000 },
      { name: "Hablador personalizado", price: 6100 },
      { name: "Empaque tull", price: 5500 },
    ],
    notes: ["Color a elección", "Base, caja o tarjeta personalizada", "Incluye aroma"],
  },
  {
    id: "mini-compota",
    name: "Mini Compota",
    category: "Recordatorios",
    image: asset("mini-compota.jpg"),
    description: "Una velita práctica con sticker temático y mucha capacidad de personalización.",
    variants: [{ name: "Mini compota personalizada", price: 6200 }],
    notes: ["Disponible desde 12 unidades", "Sticker, tarjeta o base personalizada", "Aroma incluido"],
  },
  {
    id: "concha",
    name: "Concha",
    category: "Recordatorios",
    image: asset("concha.jpg"),
    description: "Textura marina y acabado elegante para eventos frescos y delicados.",
    variants: [
      { name: "Hablador personalizado", price: 8300 },
      { name: "Empaque acetato", price: 7000 },
      { name: "Empaque tull", price: 5200 },
    ],
    notes: ["Color a elección", "Caja o tarjeta personalizada", "Incluye moño y aroma"],
  },
  {
    id: "postre-mariposa",
    name: "Postre Mariposa",
    category: "Recordatorios",
    image: asset("postre-mariposa.jpg"),
    description: "Una mini vela tipo postre rematada con una mariposa delicada.",
    variants: [
      { name: "Acetato + base tipo postre", price: 8200 },
      { name: "Empaque tull", price: 7500 },
    ],
    notes: ["Base, mariposa y nombre personalizados", "Incluye moño y aroma"],
  },
  {
    id: "postre-marino",
    name: "Postre Marino",
    category: "Recordatorios",
    image: asset("postre-marino.jpg"),
    description: "Capas, color y detalles inspirados en el mar para una celebración especial.",
    variants: [
      { name: "Acetato + base tipo postre", price: 8200 },
      { name: "Empaque tull", price: 7500 },
    ],
    notes: ["Color y nombre personalizados", "Incluye moño y aroma"],
  },
  {
    id: "mini-postre",
    name: "Mini Postre",
    category: "Recordatorios",
    image: asset("mini-postre.jpg"),
    description: "Pequeño en tamaño, abundante en detalles y perfecto para regalar.",
    variants: [
      { name: "Empaque acetato", price: 8300 },
      { name: "Hablador personalizado", price: 7800 },
    ],
    notes: ["Color y nombre de la base a elección", "Incluye moño y aroma"],
  },
  {
    id: "maceta",
    name: "Maceta",
    category: "Recordatorios",
    image: asset("maceta.jpg"),
    description: "Una flor que no se marchita, presentada como un detalle dulce y artesanal.",
    variants: [
      { name: "Cajita", price: 9000 },
      { name: "Empaque tull", price: 7900 },
    ],
    notes: ["Color a elección", "Mensaje personalizado", "Incluye moño y aroma"],
  },
  {
    id: "mini-suculentas",
    name: "Mini Suculentas",
    category: "Recordatorios",
    image: asset("mini-suculentas.jpg"),
    description: "Una pequeña maceta de cera con estética botánica y nombre personalizado.",
    variants: [{ name: "Empaque acetato", price: 8300 }],
    notes: ["Color de base y suculenta a elección", "Incluye moño y aroma"],
  },
  {
    id: "margarita",
    name: "Margarita",
    category: "Recordatorios",
    image: asset("margarita.jpg"),
    description: "Una flor limpia y alegre, disponible en tres presentaciones.",
    variants: [
      { name: "Cajita", price: 6000 },
      { name: "Domo", price: 5500 },
      { name: "Empaque tull", price: 4500 },
    ],
    notes: ["Color a elección", "Mensaje personalizado según empaque", "Incluye aroma"],
  },
  {
    id: "peonia",
    name: "Peonía",
    category: "Recordatorios",
    image: asset("peonia.jpg"),
    description: "Volumen floral y una presencia elegante para regalar en cualquier ocasión.",
    variants: [{ name: "Cajita", price: 10000 }],
    notes: ["Color a elección", "Tarjeta personalizada desde 6 unidades", "Incluye moño y aroma"],
  },
  {
    id: "cocho",
    name: "Cocho corazón o estrella",
    category: "Recordatorios",
    image: asset("cocho.jpg"),
    description: "Frasco personalizado con pequeñas figuras de cera y nombre en vinilo.",
    variants: [
      { name: "Envase 100 ml", price: 8500 },
      { name: "Envase 200 ml", price: 11500 },
    ],
    notes: ["Corazones o estrellas", "Color y nombre a elección", "Incluye aroma"],
  },
  {
    id: "bomboneras",
    name: "Bomboneras",
    category: "Recordatorios",
    image: asset("bombonera.jpg"),
    description: "Una presentación generosa, decorativa y lista para convertirse en el centro de atención.",
    variants: [
      { name: "Bombonera", price: 25000 },
      { name: "Bombonera con caja", price: 28500 },
    ],
    notes: ["Color a elección", "Decoración incluida", "Nombre en caja disponible"],
  },
  {
    id: "tentacion-chocolate",
    name: "Tentación de Chocolate",
    category: "Postres",
    image: asset("tentacion-chocolate.png"),
    description: "Una vela de 350 g con apariencia de postre, toppings variados y aroma a chocolate.",
    tag: "Aroma irresistible",
    variants: [{ name: "Vela postre en envase de vidrio", price: 32500 }],
    notes: ["350 g de cera", "Etiqueta personalizada con nombre", "Aroma chocolate"],
  },
  {
    id: "brisa-arena",
    name: "Brisa en la Arena",
    category: "Postres",
    image: asset("brisa-arena.jpg"),
    description: "Un postre de cera inspirado en días tropicales, con textura, toppings y capas.",
    variants: [{ name: "Vela postre en envase de vidrio", price: 32500 }],
    notes: ["350 g de cera", "Aroma a elección", "Etiqueta personalizada con nombre"],
  },
  {
    id: "mini-waffle",
    name: "Mini Waffle + Helado",
    category: "Postres",
    image: asset("mini-waffle.png"),
    description: "Un mini postre divertido con waffle, helado y acabados en tonos pastel.",
    variants: [
      { name: "Empaque cajita", price: 8000 },
      { name: "Empaque tull", price: 7000 },
    ],
    notes: ["Color a elección", "Incluye moño y aroma"],
  },
  {
    id: "torta-chorreada",
    name: "Torta chorreada",
    category: "Postres",
    image: asset("torta-chorreada.jpg"),
    description: "Una vela cremosa con efecto chorreado, flores y detalles para celebrar a lo grande.",
    variants: [{ name: "Torta chorreada", price: 25000 }],
    notes: ["Color a elección", "Incluye moño, aroma y caja"],
  },
  {
    id: "torta-cremosa",
    name: "Torta cremosa",
    category: "Postres",
    image: asset("torta-cremosa.jpg"),
    description: "Texturas de crema y pequeños detalles de cera en una torta completamente artesanal.",
    variants: [{ name: "Torta cremosa", price: 25000 }],
    notes: ["Color a elección", "Incluye moño, aroma y caja"],
  },
  {
    id: "cupcake",
    name: "Cupcake",
    category: "Postres",
    image: asset("cupcake.png"),
    description: "Un cupcake de cera con acabado cremoso, perfecto para regalar o decorar.",
    variants: [{ name: "Cupcake", price: 20000 }],
    notes: ["Color a elección", "Incluye moño, aroma y caja"],
  },
  {
    id: "estuche-bolso",
    name: "Estuche tipo bolso",
    category: "Detalles",
    image: asset("estuche-bolso.jpg"),
    description: "Entre 13 y 15 velas personalizadas en un bolso rígido con lazo metálico.",
    tag: "Regalo especial",
    variants: [
      { name: "Sin aroma", price: 75000 },
      { name: "Con aroma", price: 85000 },
    ],
    notes: ["Colores negro, blanco y palo de rosa", "Color de las velas a elección", "Acabado premium"],
  },
  {
    id: "ramo-redondo",
    name: "Ramo redondo pequeño",
    category: "Detalles",
    image: asset("ramo-redondo.jpg"),
    description: "Un ramo de cera con flores grandes y pequeñas, montado sobre una base rígida.",
    variants: [
      { name: "Sin aroma", price: 45000 },
      { name: "Con aroma", price: 55000 },
    ],
    notes: ["2 a 3 velas grandes y 10 pequeñas", "Color a elección", "Base con papel coreano"],
  },
  {
    id: "caja-madera",
    name: "Caja en madera",
    category: "Detalles",
    image: asset("caja-madera.jpg"),
    description: "Una composición elegante de 14 a 17 velas en caja de madera con tapa de vidrio.",
    tag: "Premium",
    variants: [
      { name: "Sin aroma", price: 82000 },
      { name: "Con aroma", price: 92000 },
    ],
    notes: ["Color a elección", "Incluye moño y tarjeta", "Caja reutilizable"],
  },
  {
    id: "mini-ramito",
    name: "Mini ramito",
    category: "Detalles",
    image: asset("mini-ramito.jpg"),
    description: "Ocho flores surtidas con base en cera, listas para sorprender.",
    variants: [{ name: "Mini ramito con 8 flores", price: 30000 }],
  },
  {
    id: "caja-peonias",
    name: "Caja Peonías & Oso",
    category: "Detalles",
    image: asset("caja-peonias.jpg"),
    description: "Una caja abundante con dos peonías, un oso y diez flores de cera.",
    variants: [{ name: "Caja completa", price: 40000 }],
  },
  {
    id: "estuche-oso",
    name: "Estuche Oso & Flores",
    category: "Detalles",
    image: asset("estuche-oso.jpg"),
    description: "Osito pequeño acompañado por siete flores en un estuche con ventana.",
    variants: [{ name: "Estuche completo", price: 37000 }],
  },
  {
    id: "macarrones",
    name: "Macarrones",
    category: "Detalles",
    image: asset("macarrones.jpg"),
    description: "Una caja dulce a la vista; elige entre formato vela o wax melts.",
    variants: [{ name: "Caja de macarrones", price: 32000 }],
  },
  {
    id: "peonia-individual",
    name: "Peonía individual",
    category: "Detalles",
    image: asset("peonia-individual.jpg"),
    description: "Una flor protagonista con presentación sencilla y elegante.",
    variants: [{ name: "Peonía", price: 10000 }],
  },
  {
    id: "margarita-domo",
    name: "Margarita en domo",
    category: "Detalles",
    image: asset("margarita-domo.jpg"),
    description: "Margarita o corazón de cera en una presentación transparente.",
    variants: [{ name: "Domo", price: 5500 }],
  },
  {
    id: "mini-estuche-oso",
    name: "Mini estuche con oso",
    category: "Detalles",
    image: asset("mini-estuche-oso.jpg"),
    description: "Un osito con tres velitas surtidas en una caja compacta.",
    variants: [{ name: "Mini estuche", price: 18000 }],
  },
  {
    id: "estuche-flores",
    name: "Estuche 8 flores",
    category: "Detalles",
    image: asset("estuche-flores.jpg"),
    description: "Ocho flores surtidas en formato vela o wax melts.",
    variants: [{ name: "Estuche con 8 flores", price: 28000 }],
  },
  {
    id: "estuche-peonia",
    name: "Estuche Peonía",
    category: "Detalles",
    image: asset("estuche-peonia.jpg"),
    description: "Caja gruesa de cartón con una peonía y cinco velitas surtidas.",
    variants: [{ name: "Estuche completo", price: 35000 }],
  },
];

const variantAsset = (name: string) => asset(`variants/${name}`);

// Each image follows the same order as the product's presentation list.
const variantImageSets: Record<string, string[]> = {
  elefante: ["p03-02.jpg", "p03-01.jpg", "p03-04.jpg", "p03-03.jpg"].map(variantAsset),
  conejito: ["p04-02.jpg", "p04-01.jpg", "p04-04.jpg", "p04-03.jpg"].map(variantAsset),
  "osito-peluche": ["p05-01.jpg", "p05-03.jpg", "p05-04.jpg", "p05-02.jpg"].map(variantAsset),
  "oso-mini": ["p06-02.jpg", "p06-01.jpg"].map(variantAsset),
  "oso-mono": ["p07-02.jpg", "p07-01.jpg"].map(variantAsset),
  "winnie-pooh": ["p08-01.jpg", "p08-02.jpg", "p08-03.jpg"].map(variantAsset),
  leoncito: ["p09-01.jpg", "p09-02.jpg", "p09-03.jpg"].map(variantAsset),
  "leoncito-3d": ["p10-01.jpg", "p10-02.jpg", "p10-03.jpg"].map(variantAsset),
  piecitos: ["p11-01.jpg", "p11-02.jpg", "p11-03.jpg"].map(variantAsset),
  virgencita: ["p12-02.jpg", "p12-01.jpg", "p12-03.jpg"].map(variantAsset),
  angelito: ["p13-02.jpg", "p13-01.jpg", "p13-03.jpg"].map(variantAsset),
  crucecita: ["p14-01.jpg", "p14-02.jpg"].map(variantAsset),
  perrito: ["p15-01.jpg", "p15-02.jpg", "p15-03.jpg"].map(variantAsset),
  "mini-burbuja": ["p16-02.jpg", "p16-01.jpg", "p16-03.jpg"].map(variantAsset),
  concha: [variantAsset("p18-01.jpg"), variantAsset("concha-acetato.png"), variantAsset("p18-02.jpg")],
  "postre-mariposa": ["p19-01.jpg", "p19-02.jpg"].map(variantAsset),
  "postre-marino": ["p20-01.jpg", "p20-02.jpg"].map(variantAsset),
  "mini-postre": ["p21-01.jpg", "p21-02.jpg"].map(variantAsset),
  maceta: ["p22-02.jpg", "p22-01.jpg"].map(variantAsset),
  margarita: ["p24-01.jpg", "p24-02.jpg", "p24-03.jpg"].map(variantAsset),
  cocho: ["p26-01.jpg", "p26-02.jpg"].map(variantAsset),
  bomboneras: ["p27-01.jpg", "p27-02.jpg"].map(variantAsset),
  "mini-waffle": [variantAsset("mini-waffle-cajita.png"), variantAsset("mini-waffle-tull.png")],
};

const getVariantImages = (product: Product, index: number) => {
  const managedImages = product.variants[index]?.images?.filter(Boolean) ?? [];
  if (managedImages.length) return managedImages;
  return [variantImageSets[product.id]?.[index] ?? product.image];
};

const getVariantImage = (product: Product, index: number, imageIndex = 0) =>
  getVariantImages(product, index)[imageIndex] ?? getVariantImages(product, index)[0] ?? product.image;

const getVariantGalleryCount = (product: Product) =>
  product.variants.some((variant) => variant.images?.length)
    ? product.variants.length
    : variantImageSets[product.id]?.length ?? 0;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const fallbackWhatsappNumber = "573118192481";

const marqueeItems = [
  "Bodas",
  "Bautizos",
  "Primeras comuniones",
  "Confirmaciones",
  "Baby showers",
  "Cumpleaños",
  "Quince años",
  "Grados",
  "Aniversarios",
  "Eventos empresariales",
  "Recordatorios personalizados",
  "Detalles hechos a mano",
  "Aromas que dejan huella",
  "Momentos que merecen luz",
  "Pequeñas velas, grandes recuerdos",
  "Un detalle para cada historia",
];

function whatsappLink(number: string, defaultMessage: string, product?: Product, variantName?: string) {
  const message = product
    ? `Hola Golu, vi el catálogo web y me interesa cotizar ${product.name}${variantName ? ` en presentación ${variantName}` : ""}. ¿Me cuentan más?`
    : defaultMessage;
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

function highlightedTitle(text: string, highlight: string) {
  if (!highlight) return text;
  const start = text.toLocaleLowerCase("es").indexOf(highlight.toLocaleLowerCase("es"));
  if (start < 0) return text;
  return (
    <>
      {text.slice(0, start)}
      <em>{text.slice(start, start + highlight.length)}</em>
      {text.slice(start + highlight.length)}
    </>
  );
}

function App() {
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [cardVariantIndexes, setCardVariantIndexes] = useState<Record<string, number>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [cms, setCms] = useState<GoluCmsData | null>(null);

  const siteProducts: Product[] = cms?.products.length ? cms.products : products;
  const content = (key: string) => cms?.content[key];
  const managedImage = (key: string, fallback: string) => cms?.images[key]?.[0]?.url || fallback;
  const managedImageAlt = (key: string, fallback: string) => cms?.images[key]?.[0]?.alt || fallback;
  const whatsappNumber = content("contact.whatsapp")?.body || fallbackWhatsappNumber;
  const defaultWhatsappMessage = content("contact.whatsapp_message")?.body
    || "Hola Golu, vi el catálogo web y quiero cotizar unas velas personalizadas. ¿Me ayudan?";
  const getWhatsappLink = (product?: Product, variantName?: string) =>
    whatsappLink(whatsappNumber, defaultWhatsappMessage, product, variantName);

  const openProduct = (product: Product, variantIndex = 0) => {
    setSelectedVariantIndex(variantIndex);
    setSelectedImageIndex(0);
    setSelectedProduct(product);
  };

  const moveCardVariant = (product: Product, direction: -1 | 1) => {
    const imageCount = getVariantGalleryCount(product);
    if (imageCount < 2) return;

    setCardVariantIndexes((currentIndexes) => {
      const currentIndex = currentIndexes[product.id] ?? 0;
      return {
        ...currentIndexes,
        [product.id]: (currentIndex + direction + imageCount) % imageCount,
      };
    });
  };

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return siteProducts.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.description} ${product.category}`
          .toLocaleLowerCase("es")
          .includes(normalizedQuery);
      return matchesQuery;
    });
  }, [query, siteProducts]);

  useEffect(() => {
    let active = true;
    loadGoluCms()
      .then((data) => {
        if (active && data) setCms(data);
      })
      .catch((error) => {
        console.warn("No se pudo cargar el CMS de Fresa; se conserva el catálogo local.", error);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProduct(null);
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedProduct]);

  const catalogGroups: Array<{
    category: Category;
    eyebrow: string;
    description: string;
  }> = [
    {
      category: "Recordatorios",
      eyebrow: content("catalog.group.recordatorios")?.eyebrow || "Toda ocasión",
      description: content("catalog.group.recordatorios")?.body || "Referencias personalizables para bautizos, cumpleaños, primeras comuniones y momentos para recordar.",
    },
    {
      category: "Postres",
      eyebrow: content("catalog.group.postres")?.eyebrow || "Dulces a la vista",
      description: content("catalog.group.postres")?.body || "Velas con apariencia de postre, capas, toppings y aromas que despiertan los sentidos.",
    },
    {
      category: "Detalles",
      eyebrow: content("catalog.group.detalles")?.eyebrow || "Regalos especiales",
      description: content("catalog.group.detalles")?.body || "Ramos, estuches y composiciones artesanales creadas para sorprender en cualquier ocasión.",
    },
  ];

  const announcement = content("global.announcement");
  const hero = content("home.hero");
  const heroSecondaryCta = content("home.hero.secondary_cta");
  const heroProof = hero?.items.length ? hero.items : ["Hechas a mano", "A tu medida", "Con aroma"];
  const managedMarqueeItems = content("home.marquee")?.items;
  const visibleMarqueeItems = managedMarqueeItems?.length ? managedMarqueeItems : marqueeItems;
  const catalogIntro = content("catalog.intro");
  const customize = content("customize.intro");
  const customizeSteps = customize?.items.length
    ? customize.items.map((item) => {
        const [title, ...description] = item.split("|");
        return { title, description: description.join("|") };
      })
    : [
        { title: "Elige tu referencia", description: "Encuentra la forma y presentación que más te guste." },
        { title: "Cuéntanos tu idea", description: "Compártenos fecha, cantidad, colores y estilo de tu evento." },
        { title: "Personalizamos", description: "Definimos aroma, nombre, mensaje, moño y empaque." },
        { title: "Enciende el momento", description: "Recibe un detalle artesanal listo para sorprender." },
      ];
  const story = content("story.main");
  const contact = content("contact.main");
  const contactWhatsapp = content("contact.whatsapp");
  const contactEmail = content("contact.email");
  const contactInstagram = content("contact.instagram");
  const footer = content("footer.main");

  return (
    <div className="site-shell">
      <div className="announcement">
        <span>{announcement?.title || "Velas hechas a mano"}</span>
        <span className="announcement-dot" aria-hidden="true" />
        <span>{announcement?.body || "Personaliza color, aroma y mensaje"}</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Golu, ir al inicio">
          <span className="brand-name">GOLU</span>
          <span className="brand-subtitle">velas artesanales</span>
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#catalogo">Catálogo</a>
          <a href="#personaliza">Personaliza</a>
          <a href="#nosotros">Nuestra esencia</a>
        </nav>

        <a className="header-cta" href={getWhatsappLink()} target="_blank" rel="noreferrer">
          Cotizar
          <ArrowRight size={16} strokeWidth={1.8} />
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Navegación móvil">
          <a href="#catalogo" onClick={() => setMenuOpen(false)}>Catálogo</a>
          <a href="#personaliza" onClick={() => setMenuOpen(false)}>Personaliza</a>
          <a href="#nosotros" onClick={() => setMenuOpen(false)}>Nuestra esencia</a>
          <a href={getWhatsappLink()} target="_blank" rel="noreferrer">Cotizar por WhatsApp</a>
        </nav>
      )}

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={15} /> {hero?.eyebrow || "Catálogo 2026"}</span>
            <h1>{highlightedTitle(hero?.title || "Detalles que se encienden y se recuerdan.", hero?.highlight || "encienden")}</h1>
            <p className="hero-lead">
              {hero?.body || "Velas artesanales para celebrar tus momentos más bonitos. Elige la forma, el color, el aroma y cada pequeño detalle."}
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href={hero?.ctaUrl || "#catalogo"}>
                {hero?.ctaLabel || "Ver colección"} <ArrowRight size={18} />
              </a>
              <a className="button button-ghost" href={heroSecondaryCta?.ctaUrl || getWhatsappLink()} target="_blank" rel="noreferrer">
                <MessageCircle size={18} /> {heroSecondaryCta?.ctaLabel || "Hablemos de tu evento"}
              </a>
            </div>
            <div className="hero-proof" aria-label="Características principales">
              {heroProof.map((item) => <span key={item}><Check size={15} /> {item}</span>)}
            </div>
          </div>

          <div className="hero-gallery" aria-label="Selección de productos Golu">
            <figure className="hero-image hero-image-main">
              <img
                src={managedImage("home.hero.image.1", asset("hero-collage.jpg"))}
                alt={managedImageAlt("home.hero.image.1", "Colección de velas florales Golu en estuches")}
              />
              <figcaption>Hecho con intención</figcaption>
            </figure>
            <figure className="hero-image hero-image-small hero-image-top">
              <img
                src={managedImage("home.hero.image.2", asset("hero-bouquet.jpg"))}
                alt={managedImageAlt("home.hero.image.2", "Ramo artesanal de flores de cera")}
              />
            </figure>
            <figure className="hero-image hero-image-small hero-image-bottom">
              <img
                src={managedImage("home.hero.image.3", asset("hero-flowers.jpg"))}
                alt={managedImageAlt("home.hero.image.3", "Velas artesanales en tonos rosados")}
              />
            </figure>
            <span className="hero-stamp" aria-hidden="true">GOLU<br />con amor</span>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...visibleMarqueeItems, ...visibleMarqueeItems].flatMap((item, index) => [
              <span key={`${item}-${index}`}>{item}</span>,
              <i key={`separator-${index}`}>✦</i>,
            ])}
          </div>
        </div>

        <section className="catalog-section" id="catalogo">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{catalogIntro?.eyebrow || "Toda ocasión"}</span>
              <h2>{highlightedTitle(catalogIntro?.title || "Encuentra tu próximo detalle.", catalogIntro?.highlight || "detalle")}</h2>
            </div>
            <p>{catalogIntro?.body || "Explora las referencias del catálogo y abre cada ficha para ver sus presentaciones y precios."}</p>
          </div>

          <div className="catalog-toolbar">
            <nav className="category-filters" aria-label="Colecciones del catálogo">
              {catalogGroups.map((group) => (
                <a className="filter-chip" href={`#${group.category.toLowerCase()}`} key={group.category}>
                  {group.category}
                  <span>{siteProducts.filter((product) => product.category === group.category).length}</span>
                </a>
              ))}
            </nav>

            <label className="search-box">
              <Search size={18} aria-hidden="true" />
              <span className="sr-only">Buscar en el catálogo</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Busca una referencia..."
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda">
                  <X size={16} />
                </button>
              )}
            </label>
          </div>

          <div className="results-meta" aria-live="polite">
            {filteredProducts.length} {filteredProducts.length === 1 ? "referencia" : "referencias"}
          </div>

          {filteredProducts.length ? catalogGroups.map((group) => {
            const groupProducts = filteredProducts.filter((product) => product.category === group.category);
            if (!groupProducts.length) return null;

            return (
              <section className="catalog-group" id={group.category.toLowerCase()} key={group.category}>
                <header className="catalog-group-header">
                  <div>
                    <span className="eyebrow">{group.eyebrow}</span>
                    <h3>{group.category}</h3>
                  </div>
                  <div className="catalog-group-summary">
                    <span>{groupProducts.length.toString().padStart(2, "0")} referencias</span>
                    <p>{group.description}</p>
                  </div>
                </header>

                <div className="product-grid">
                  {groupProducts.map((product) => {
                    const galleryCount = getVariantGalleryCount(product);
                    const hasVariantGallery = galleryCount > 1;
                    const cardVariantIndex = hasVariantGallery ? (cardVariantIndexes[product.id] ?? 0) : 0;
                    const cardVariant = product.variants[cardVariantIndex] ?? product.variants[0];

                    return (
                      <article className="product-card" key={product.id}>
                        <div className="product-image">
                          <button
                            className="product-image-open"
                            type="button"
                            onClick={() => openProduct(product, cardVariantIndex)}
                            aria-label={`Ver detalles de ${product.name}, ${cardVariant.name}`}
                          >
                            <img
                              key={getVariantImage(product, cardVariantIndex)}
                              src={getVariantImage(product, cardVariantIndex)}
                              alt={`${product.name} - ${cardVariant.name}`}
                              loading="lazy"
                            />
                            {product.tag && <span className="product-tag">{product.tag}</span>}
                            <span className="product-view">Ver detalle <ArrowRight size={15} /></span>
                          </button>

                          {hasVariantGallery && (
                            <>
                              <button
                                className="card-gallery-arrow card-gallery-prev"
                                type="button"
                                onClick={() => moveCardVariant(product, -1)}
                                aria-label={`Ver presentación anterior de ${product.name}`}
                              >
                                <ChevronLeft size={19} aria-hidden="true" />
                              </button>
                              <button
                                className="card-gallery-arrow card-gallery-next"
                                type="button"
                                onClick={() => moveCardVariant(product, 1)}
                                aria-label={`Ver siguiente presentación de ${product.name}`}
                              >
                                <ChevronRight size={19} aria-hidden="true" />
                              </button>
                              <div className="card-variant-caption" aria-live="polite">
                                <span>{cardVariant.name}</span>
                                <strong>{cardVariantIndex + 1}/{galleryCount}</strong>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="product-info">
                          <span className="product-category">{product.category}</span>
                          <div className="product-title-row">
                            <h3>{product.name}</h3>
                            <span className="product-price">Desde {formatPrice(Math.min(...product.variants.map((variant) => variant.price)))}</span>
                          </div>
                          <p>{product.description}</p>
                          <button type="button" className="product-link" onClick={() => openProduct(product, cardVariantIndex)}>
                            Presentaciones <ChevronRight size={16} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          }) : (
            <div className="empty-state">
              <Search size={30} />
              <h3>No encontramos esa referencia</h3>
              <p>Prueba con otro nombre o vuelve a ver todo el catálogo.</p>
              <button type="button" className="button button-primary" onClick={() => setQuery("")}>
                Ver todas
              </button>
            </div>
          )}
        </section>

        <section className="custom-section" id="personaliza">
          <div className="custom-visual">
            <img
              src={managedImage("customize.image", asset("hero-flowers.jpg"))}
              alt={managedImageAlt("customize.image", "Flores y velas artesanales Golu")}
              loading="lazy"
            />
            <div className="custom-card">
              <Heart size={22} fill="currentColor" />
              <span>Cada pedido</span>
              <strong>lleva un poquito de ti.</strong>
            </div>
          </div>
          <div className="custom-copy">
            <span className="eyebrow">{customize?.eyebrow || "Tu idea, nuestra magia"}</span>
            <h2>{highlightedTitle(customize?.title || "Hazlo tan único como la ocasión.", customize?.highlight || "ocasión")}</h2>
            <p>
              {customize?.body || "No hacemos regalos en serie. Creamos cada vela para conversar con tu celebración: su paleta, su aroma, su mensaje y la forma de entregarla."}
            </p>
            <ol className="steps-list">
              {customizeSteps.map((step, index) => (
                <li key={`${step.title}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{step.title}</strong><p>{step.description}</p></div>
                </li>
              ))}
            </ol>
            <a className="button button-primary" href={customize?.ctaUrl || getWhatsappLink()} target="_blank" rel="noreferrer">
              {customize?.ctaLabel || "Empezar mi pedido"} <MessageCircle size={18} />
            </a>
          </div>
        </section>

        <section className="brand-story" id="nosotros">
          <div className="story-mark" aria-hidden="true">G</div>
          <div className="story-copy">
            <span className="eyebrow">{story?.eyebrow || "Nuestra esencia"}</span>
            <blockquote>“{story?.title || "No es solo una vela. Es la forma más bonita de decir: pensé en ti."}”</blockquote>
          </div>
          <div className="story-note">
            <PackageCheck size={25} />
            <p>{story?.body || "Diseñamos, vertemos, decoramos y empacamos cada pieza con manos cuidadosas y mucha intención."}</p>
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-copy">
            <span className="eyebrow">{contact?.eyebrow || "Hagamos algo bonito"}</span>
            <h2>{highlightedTitle(contact?.title || "¿Ya imaginaste tu detalle?", contact?.highlight || "detalle")}</h2>
            <p>{contact?.body || "Escríbenos con la referencia que te gustó y los datos de tu evento. Te ayudamos a aterrizar la idea."}</p>
          </div>
          <a className="contact-action" href={contactWhatsapp?.ctaUrl || getWhatsappLink()} target="_blank" rel="noreferrer">
            <span><MessageCircle size={24} /> {contact?.ctaLabel || "WhatsApp"}</span>
            <strong>{contactWhatsapp?.title || "(57) 311 819 2481"}</strong>
            <ArrowRight size={22} />
          </a>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="brand-name">GOLU</span>
          <p>{footer?.body || "Velas artesanales para toda ocasión."}</p>
        </div>
        <div className="footer-links">
          <a href={contactEmail?.ctaUrl || "mailto:goluvelas@gmail.com"}><Mail size={16} /> {contactEmail?.body || "goluvelas@gmail.com"}</a>
          <a href={`tel:+${whatsappNumber.replace(/\D/g, "")}`}><Phone size={16} /> {contactWhatsapp?.title || "+57 311 819 2481"}</a>
        </div>
        <div className="footer-social">
          <a href={contactInstagram?.ctaUrl || "https://www.instagram.com/golu_velas"} target="_blank" rel="noreferrer" aria-label="Instagram de Golu"><AtSign size={18} /></a>
        </div>
        <div className="footer-bottom">
          <span>{footer?.items[0] || "© 2026 Golu Velas"}</span>
          <span>{footer?.items[1] || "Precios en pesos colombianos. Sujeto a disponibilidad."}</span>
        </div>
      </footer>

      <a className="floating-whatsapp" href={getWhatsappLink()} target="_blank" rel="noreferrer" aria-label="Cotizar por WhatsApp">
        <MessageCircle size={23} />
        <span>Cotiza aquí</span>
      </a>

      {selectedProduct && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedProduct(null)}>
          <section
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" onClick={() => setSelectedProduct(null)} aria-label="Cerrar detalle">
              <X size={20} />
            </button>
            <div className="modal-image">
              <img
                key={getVariantImage(selectedProduct, selectedVariantIndex, selectedImageIndex)}
                src={getVariantImage(selectedProduct, selectedVariantIndex, selectedImageIndex)}
                alt={`${selectedProduct.name} - ${selectedProduct.variants[selectedVariantIndex].name}`}
              />
              <div className="modal-image-labels">
                <span>{selectedProduct.category}</span>
                <strong>{selectedProduct.variants[selectedVariantIndex].name}</strong>
              </div>
              {getVariantImages(selectedProduct, selectedVariantIndex).length > 1 && (
                <div className="modal-image-thumbnails" aria-label="Más imágenes de esta presentación">
                  {getVariantImages(selectedProduct, selectedVariantIndex).map((image, index) => (
                    <button
                      className={selectedImageIndex === index ? "active" : ""}
                      type="button"
                      key={`${image}-${index}`}
                      onClick={() => setSelectedImageIndex(index)}
                      aria-label={`Ver imagen ${index + 1}`}
                      aria-pressed={selectedImageIndex === index}
                    >
                      <img src={image} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-content">
              <span className="eyebrow">Referencia Golu</span>
              <h2 id="modal-title">{selectedProduct.name}</h2>
              <p className="modal-description">{selectedProduct.description}</p>
              <div className="variant-list">
                <div className="variant-heading">
                  <span className="variant-label">Elige una presentación</span>
                  <small>Selecciona una foto para verla en detalle</small>
                </div>
                <div className="variant-cards">
                  {selectedProduct.variants.map((variant, index) => (
                    <button
                      className={selectedVariantIndex === index ? "variant-card active" : "variant-card"}
                      type="button"
                      key={`${selectedProduct.id}-${variant.name}`}
                      onClick={() => {
                        setSelectedVariantIndex(index);
                        setSelectedImageIndex(0);
                      }}
                      aria-pressed={selectedVariantIndex === index}
                    >
                      <img src={getVariantImage(selectedProduct, index)} alt={`Presentación ${variant.name}`} loading="lazy" />
                      <span className="variant-card-copy">
                        <span>{variant.name}</span>
                        <strong>{formatPrice(variant.price)}</strong>
                      </span>
                      <span className="variant-check" aria-hidden="true"><Check size={13} /></span>
                    </button>
                  ))}
                </div>
              </div>
              {selectedProduct.notes && (
                <ul className="modal-notes">
                  {selectedProduct.notes.map((note) => <li key={note}><Check size={15} /> {note}</li>)}
                </ul>
              )}
              <a
                className="button button-primary modal-cta"
                href={getWhatsappLink(selectedProduct, selectedProduct.variants[selectedVariantIndex].name)}
                target="_blank"
                rel="noreferrer"
              >
                Cotizar esta referencia <MessageCircle size={18} />
              </a>
              <small>El valor final puede variar según cantidad y personalización.</small>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
