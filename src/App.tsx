import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  AtSign,
  Check,
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

type Category = "Recordatorios" | "Postres" | "Detalles";

type Product = {
  id: string;
  name: string;
  category: Category;
  image: string;
  description: string;
  variants: { name: string; price: number }[];
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

const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const whatsappNumber = "573118192481";

function whatsappLink(product?: Product) {
  const message = product
    ? `Hola Golú, vi el catálogo web y me interesa cotizar ${product.name}. ¿Me cuentan más?`
    : "Hola Golú, vi el catálogo web y quiero cotizar unas velas personalizadas. ¿Me ayudan?";
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function App() {
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        `${product.name} ${product.description} ${product.category}`
          .toLocaleLowerCase("es")
          .includes(normalizedQuery);
      return matchesQuery;
    });
  }, [query]);

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
      eyebrow: "Toda ocasión",
      description: "Referencias personalizables para bautizos, cumpleaños, primeras comuniones y momentos para recordar.",
    },
    {
      category: "Postres",
      eyebrow: "Dulces a la vista",
      description: "Velas con apariencia de postre, capas, toppings y aromas que despiertan los sentidos.",
    },
    {
      category: "Detalles",
      eyebrow: "Regalos especiales",
      description: "Ramos, estuches y composiciones artesanales creadas para sorprender en cualquier ocasión.",
    },
  ];

  return (
    <div className="site-shell">
      <div className="announcement">
        <span>Velas hechas a mano</span>
        <span className="announcement-dot" aria-hidden="true" />
        <span>Personaliza color, aroma y mensaje</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Golú, ir al inicio">
          <span className="brand-name">GOLÚ</span>
          <span className="brand-subtitle">velas artesanales</span>
        </a>

        <nav className="desktop-nav" aria-label="Navegación principal">
          <a href="#catalogo">Catálogo</a>
          <a href="#personaliza">Personaliza</a>
          <a href="#nosotros">Nuestra esencia</a>
        </nav>

        <a className="header-cta" href={whatsappLink()} target="_blank" rel="noreferrer">
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
          <a href={whatsappLink()} target="_blank" rel="noreferrer">Cotizar por WhatsApp</a>
        </nav>
      )}

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={15} /> Catálogo 2026</span>
            <h1>Detalles que se <em>encienden</em> y se recuerdan.</h1>
            <p className="hero-lead">
              Velas artesanales para celebrar tus momentos más bonitos. Elige la forma, el color, el aroma y cada pequeño detalle.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#catalogo">
                Ver colección <ArrowRight size={18} />
              </a>
              <a className="button button-ghost" href={whatsappLink()} target="_blank" rel="noreferrer">
                <MessageCircle size={18} /> Hablemos de tu evento
              </a>
            </div>
            <div className="hero-proof" aria-label="Características principales">
              <span><Check size={15} /> Hechas a mano</span>
              <span><Check size={15} /> A tu medida</span>
              <span><Check size={15} /> Con aroma</span>
            </div>
          </div>

          <div className="hero-gallery" aria-label="Selección de productos Golú">
            <figure className="hero-image hero-image-main">
              <img src={asset("hero-collage.jpg")} alt="Colección de velas florales Golú en estuches" />
              <figcaption>Hecho con intención</figcaption>
            </figure>
            <figure className="hero-image hero-image-small hero-image-top">
              <img src={asset("hero-bouquet.jpg")} alt="Ramo artesanal de flores de cera" />
            </figure>
            <figure className="hero-image hero-image-small hero-image-bottom">
              <img src={asset("hero-flowers.jpg")} alt="Velas artesanales en tonos rosados" />
            </figure>
            <span className="hero-stamp" aria-hidden="true">GOLÚ<br />con amor</span>
          </div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            <span>Recordatorios</span><i>✦</i><span>Momentos especiales</span><i>✦</i><span>Detalles</span><i>✦</i><span>Aromas</span><i>✦</i><span>Hecho a mano</span><i>✦</i>
            <span>Recordatorios</span><i>✦</i><span>Momentos especiales</span><i>✦</i><span>Detalles</span><i>✦</i><span>Aromas</span><i>✦</i><span>Hecho a mano</span><i>✦</i>
          </div>
        </div>

        <section className="catalog-section" id="catalogo">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Toda ocasión</span>
              <h2>Encuentra tu próximo <em>detalle.</em></h2>
            </div>
            <p>Explora las referencias del catálogo y abre cada ficha para ver sus presentaciones y precios.</p>
          </div>

          <div className="catalog-toolbar">
            <nav className="category-filters" aria-label="Colecciones del catálogo">
              {catalogGroups.map((group) => (
                <a className="filter-chip" href={`#${group.category.toLowerCase()}`} key={group.category}>
                  {group.category}
                  <span>{products.filter((product) => product.category === group.category).length}</span>
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
                  {groupProducts.map((product) => (
                    <article className="product-card" key={product.id}>
                      <button className="product-image" type="button" onClick={() => setSelectedProduct(product)} aria-label={`Ver detalles de ${product.name}`}>
                        <img src={product.image} alt={product.name} loading="lazy" />
                        {product.tag && <span className="product-tag">{product.tag}</span>}
                        <span className="product-view">Ver detalle <ArrowRight size={15} /></span>
                      </button>
                      <div className="product-info">
                        <span className="product-category">{product.category}</span>
                        <div className="product-title-row">
                          <h3>{product.name}</h3>
                          <span className="product-price">Desde {formatPrice(Math.min(...product.variants.map((variant) => variant.price)))}</span>
                        </div>
                        <p>{product.description}</p>
                        <button type="button" className="product-link" onClick={() => setSelectedProduct(product)}>
                          Presentaciones <ChevronRight size={16} />
                        </button>
                      </div>
                    </article>
                  ))}
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
            <img src={asset("hero-flowers.jpg")} alt="Flores y velas artesanales Golú" loading="lazy" />
            <div className="custom-card">
              <Heart size={22} fill="currentColor" />
              <span>Cada pedido</span>
              <strong>lleva un poquito de ti.</strong>
            </div>
          </div>
          <div className="custom-copy">
            <span className="eyebrow">Tu idea, nuestra magia</span>
            <h2>Hazlo tan único como la <em>ocasión.</em></h2>
            <p>
              No hacemos regalos en serie. Creamos cada vela para conversar con tu celebración: su paleta, su aroma, su mensaje y la forma de entregarla.
            </p>
            <ol className="steps-list">
              <li><span>01</span><div><strong>Elige tu referencia</strong><p>Encuentra la forma y presentación que más te guste.</p></div></li>
              <li><span>02</span><div><strong>Cuéntanos tu idea</strong><p>Compártenos fecha, cantidad, colores y estilo de tu evento.</p></div></li>
              <li><span>03</span><div><strong>Personalizamos</strong><p>Definimos aroma, nombre, mensaje, moño y empaque.</p></div></li>
              <li><span>04</span><div><strong>Enciende el momento</strong><p>Recibe un detalle artesanal listo para sorprender.</p></div></li>
            </ol>
            <a className="button button-primary" href={whatsappLink()} target="_blank" rel="noreferrer">
              Empezar mi pedido <MessageCircle size={18} />
            </a>
          </div>
        </section>

        <section className="brand-story" id="nosotros">
          <div className="story-mark" aria-hidden="true">G</div>
          <div className="story-copy">
            <span className="eyebrow">Nuestra esencia</span>
            <blockquote>“No es solo una vela. Es la forma más bonita de decir: pensé en ti.”</blockquote>
          </div>
          <div className="story-note">
            <PackageCheck size={25} />
            <p>Diseñamos, vertemos, decoramos y empacamos cada pieza con manos cuidadosas y mucha intención.</p>
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-copy">
            <span className="eyebrow">Hagamos algo bonito</span>
            <h2>¿Ya imaginaste tu <em>detalle?</em></h2>
            <p>Escríbenos con la referencia que te gustó y los datos de tu evento. Te ayudamos a aterrizar la idea.</p>
          </div>
          <a className="contact-action" href={whatsappLink()} target="_blank" rel="noreferrer">
            <span><MessageCircle size={24} /> WhatsApp</span>
            <strong>(57) 311 819 2481</strong>
            <ArrowRight size={22} />
          </a>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="brand-name">GOLÚ</span>
          <p>Velas artesanales para toda ocasión.</p>
        </div>
        <div className="footer-links">
          <a href="mailto:goluvelas@gmail.com"><Mail size={16} /> goluvelas@gmail.com</a>
          <a href="tel:+573118192481"><Phone size={16} /> +57 311 819 2481</a>
        </div>
        <div className="footer-social">
          <a href="https://www.instagram.com/golu_velas" target="_blank" rel="noreferrer" aria-label="Instagram de Golú"><AtSign size={18} /></a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Golú Velas</span>
          <span>Precios en pesos colombianos. Sujeto a disponibilidad.</span>
        </div>
      </footer>

      <a className="floating-whatsapp" href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="Cotizar por WhatsApp">
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
              <img src={selectedProduct.image} alt={selectedProduct.name} />
              <span>{selectedProduct.category}</span>
            </div>
            <div className="modal-content">
              <span className="eyebrow">Referencia Golú</span>
              <h2 id="modal-title">{selectedProduct.name}</h2>
              <p className="modal-description">{selectedProduct.description}</p>
              <div className="variant-list">
                <span className="variant-label">Presentaciones</span>
                {selectedProduct.variants.map((variant) => (
                  <div className="variant-row" key={`${selectedProduct.id}-${variant.name}`}>
                    <span>{variant.name}</span>
                    <strong>{formatPrice(variant.price)}</strong>
                  </div>
                ))}
              </div>
              {selectedProduct.notes && (
                <ul className="modal-notes">
                  {selectedProduct.notes.map((note) => <li key={note}><Check size={15} /> {note}</li>)}
                </ul>
              )}
              <a className="button button-primary modal-cta" href={whatsappLink(selectedProduct)} target="_blank" rel="noreferrer">
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
