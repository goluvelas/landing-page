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

const getVariantImages = (product: Product, index: number) => {
  const managedImages = product.variants[index]?.images?.filter(Boolean) ?? [];
  if (managedImages.length) return managedImages;
  return product.image ? [product.image] : [];
};

const getVariantImage = (product: Product, index: number, imageIndex = 0) =>
  getVariantImages(product, index)[imageIndex] ?? getVariantImages(product, index)[0] ?? product.image;

const getVariantGalleryCount = (product: Product) =>
  product.variants.length > 1 && product.variants.some((variant) => variant.images?.some(Boolean))
    ? product.variants.length
    : 0;

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
  const [cmsLoading, setCmsLoading] = useState(true);
  const [cmsError, setCmsError] = useState(false);

  const siteProducts: Product[] = cms?.products ?? [];
  const content = (key: string) => cms?.content[key];
  const managedImage = (key: string) => cms?.images[key]?.[0]?.url || "";
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
    let refreshing = false;

    const refreshCms = async () => {
      if (refreshing) return;
      refreshing = true;

      try {
        const data = await loadGoluCms();
        if (!active) return;
        if (!data) throw new Error("Fresa CMS no está configurado");
        setCms(data);
        setCmsLoading(false);
        setCmsError(false);
      } catch (error) {
        if (!active) return;
        setCmsLoading(false);
        setCmsError(true);
        console.warn("No se pudo sincronizar el CMS de Fresa; se conserva el último estado recibido.", error);
      } finally {
        refreshing = false;
      }
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refreshCms();
    };

    void refreshCms();
    const interval = window.setInterval(() => void refreshCms(), 15_000);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("focus", refreshWhenVisible);

    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("focus", refreshWhenVisible);
    };
  }, []);

  useEffect(() => {
    if (!selectedProduct || !cms) return;

    const freshProduct = cms.products.find((product) => product.id === selectedProduct.id);
    if (!freshProduct) {
      setSelectedProduct(null);
      return;
    }

    if (freshProduct !== selectedProduct) {
      setSelectedProduct(freshProduct);
      setSelectedVariantIndex((currentIndex) => Math.min(currentIndex, freshProduct.variants.length - 1));
      setSelectedImageIndex(0);
    }
  }, [cms, selectedProduct]);

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
  const displayedVariantIndex = selectedProduct
    ? Math.min(selectedVariantIndex, Math.max(0, selectedProduct.variants.length - 1))
    : 0;
  const selectedVariant = selectedProduct?.variants[displayedVariantIndex];
  const selectedVariantImages = selectedProduct ? getVariantImages(selectedProduct, displayedVariantIndex) : [];
  const selectedImage = selectedVariantImages[selectedImageIndex] ?? selectedVariantImages[0] ?? "";

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
              {managedImage("home.hero.image.1") && (
                <img
                  src={managedImage("home.hero.image.1")}
                  alt={managedImageAlt("home.hero.image.1", "Colección de velas florales Golu en estuches")}
                />
              )}
              <figcaption>Hecho con intención</figcaption>
            </figure>
            <figure className="hero-image hero-image-small hero-image-top">
              {managedImage("home.hero.image.2") && (
                <img
                  src={managedImage("home.hero.image.2")}
                  alt={managedImageAlt("home.hero.image.2", "Ramo artesanal de flores de cera")}
                />
              )}
            </figure>
            <figure className="hero-image hero-image-small hero-image-bottom">
              {managedImage("home.hero.image.3") && (
                <img
                  src={managedImage("home.hero.image.3")}
                  alt={managedImageAlt("home.hero.image.3", "Velas artesanales en tonos rosados")}
                />
              )}
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

          {cms && (
            <div className="results-meta" aria-live="polite">
              {filteredProducts.length} {filteredProducts.length === 1 ? "referencia" : "referencias"}
            </div>
          )}

          {cmsLoading && !cms ? (
            <div className="empty-state">
              <Sparkles size={30} />
              <h3>Cargando catálogo</h3>
              <p>Estamos consultando las referencias actuales en Fresa.</p>
            </div>
          ) : cmsError && !cms ? (
            <div className="empty-state">
              <X size={30} />
              <h3>No se pudo cargar el catálogo</h3>
              <p>Vuelve a intentarlo en unos momentos para consultar Fresa.</p>
            </div>
          ) : filteredProducts.length ? catalogGroups.map((group) => {
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
                    const cardVariantIndex = hasVariantGallery
                      ? Math.min(cardVariantIndexes[product.id] ?? 0, product.variants.length - 1)
                      : 0;
                    const cardVariant = product.variants[cardVariantIndex] ?? product.variants[0];
                    const cardImage = getVariantImage(product, cardVariantIndex);

                    return (
                      <article className="product-card" key={product.id}>
                        <div className="product-image">
                          <button
                            className="product-image-open"
                            type="button"
                            onClick={() => openProduct(product, cardVariantIndex)}
                            aria-label={`Ver detalles de ${product.name}, ${cardVariant.name}`}
                          >
                            {cardImage ? (
                              <img
                                key={cardImage}
                                src={cardImage}
                                alt={`${product.name} - ${cardVariant.name}`}
                                loading="lazy"
                              />
                            ) : (
                              <span className="product-image-missing">Imagen no disponible</span>
                            )}
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
            {managedImage("customize.image") && (
              <img
                src={managedImage("customize.image")}
                alt={managedImageAlt("customize.image", "Flores y velas artesanales Golu")}
                loading="lazy"
              />
            )}
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

      {selectedProduct && selectedVariant && (
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
              {selectedImage ? (
                <img
                  key={selectedImage}
                  src={selectedImage}
                  alt={`${selectedProduct.name} - ${selectedVariant.name}`}
                />
              ) : (
                <span className="product-image-missing">Imagen no disponible</span>
              )}
              <div className="modal-image-labels">
                <span>{selectedProduct.category}</span>
                <strong>{selectedVariant.name}</strong>
              </div>
              {selectedVariantImages.length > 1 && (
                <div className="modal-image-thumbnails" aria-label="Más imágenes de esta presentación">
                  {selectedVariantImages.map((image, index) => (
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
                      className={displayedVariantIndex === index ? "variant-card active" : "variant-card"}
                      type="button"
                      key={`${selectedProduct.id}-${variant.name}`}
                      onClick={() => {
                        setSelectedVariantIndex(index);
                        setSelectedImageIndex(0);
                      }}
                      aria-pressed={displayedVariantIndex === index}
                    >
                      {getVariantImage(selectedProduct, index) ? (
                        <img src={getVariantImage(selectedProduct, index)} alt={`Presentación ${variant.name}`} loading="lazy" />
                      ) : (
                        <span className="product-image-missing">Sin imagen</span>
                      )}
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
                href={getWhatsappLink(selectedProduct, selectedVariant.name)}
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
