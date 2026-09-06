export type GoluCategory = "Recordatorios" | "Postres" | "Detalles";

export type GoluCmsProduct = {
  id: string;
  name: string;
  category: GoluCategory;
  image: string;
  description: string;
  variants: Array<{ name: string; price: number; images: string[] }>;
  notes?: string[];
  tag?: string;
};

export type GoluContentBlock = {
  key: string;
  section: string;
  eyebrow: string;
  title: string;
  highlight: string;
  body: string;
  items: string[];
  ctaLabel: string;
  ctaUrl: string;
  order: number;
};

export type GoluCmsData = {
  products: GoluCmsProduct[];
  content: Record<string, GoluContentBlock>;
  images: Record<string, Array<{ url: string; alt: string }>>;
  version: number;
};

type ApiField = {
  key?: unknown;
  value?: unknown;
};

type ApiTask = {
  task_id?: unknown;
  parent_task_id?: unknown;
  name?: unknown;
  position?: unknown;
  custom_fields?: Record<string, ApiField>;
};

type ApiTaskPage = {
  offset?: unknown;
  limit?: unknown;
  count?: unknown;
  hasMore?: unknown;
  nextOffset?: unknown;
};

const DEFAULT_API_URL = "https://fresaai.app/api/public/v1/tasks";
const DEFAULT_CATALOG_LIST_ID = "d84c5513-68e9-4a6e-8e38-8813aaf517eb";
const DEFAULT_CONTENT_LIST_ID = "f2543253-1054-454b-a73d-66f56c6bc818";
const CMS_PAGE_SIZE = 50;
const CMS_MAX_PAGES = 20;
const FRESA_IMAGE_WIDTH = 900;
const FRESA_IMAGE_QUALITY = 72;
const IMAGE_TOKEN_REFRESH_MARGIN_MS = 60_000;
const optimizedImageCache = new Map<string, { url: string; expiresAt: number | null }>();
let imageCacheRevision = 0;

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const number = (value: unknown, fallback = 0) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

const boolean = (value: unknown, fallback = true) =>
  typeof value === "boolean" ? value : fallback;

function values(task: ApiTask): Record<string, unknown> {
  return Object.values(task.custom_fields || {}).reduce<Record<string, unknown>>((result, field) => {
    const key = text(field?.key);
    if (key) result[key] = field.value;
    return result;
  }, {});
}

function optimizedImageUrl(url: string): string {
  const identity = imageIdentity(url);
  const cached = optimizedImageCache.get(identity);
  if (cached && (!cached.expiresAt || cached.expiresAt - Date.now() > IMAGE_TOKEN_REFRESH_MARGIN_MS)) {
    return cached.url;
  }

  let optimizedUrl = url;
  try {
    const imageUrl = new URL(url);
    if (imageUrl.pathname.includes("/storage/v1/object/sign/")) {
      imageUrl.pathname = imageUrl.pathname.replace(
        "/storage/v1/object/sign/",
        "/storage/v1/render/image/sign/",
      );
      imageUrl.searchParams.set("width", String(FRESA_IMAGE_WIDTH));
      imageUrl.searchParams.set("quality", String(FRESA_IMAGE_QUALITY));
      optimizedUrl = imageUrl.toString();
    }
  } catch {
    optimizedUrl = url;
  }

  optimizedImageCache.set(identity, {
    url: optimizedUrl,
    expiresAt: signedUrlExpiresAt(url),
  });
  imageCacheRevision += 1;
  return optimizedUrl;
}

function imageIdentity(url: string): string {
  try {
    const imageUrl = new URL(url);
    if (
      !imageUrl.pathname.includes("/storage/v1/object/sign/")
      && !imageUrl.pathname.includes("/storage/v1/render/image/sign/")
    ) return url;
    imageUrl.search = "";
    imageUrl.hash = "";
    return imageUrl.toString();
  } catch {
    return url;
  }
}

function signedUrlExpiresAt(url: string): number | null {
  try {
    const token = new URL(url).searchParams.get("token");
    const payload = token?.split(".")[1];
    if (!payload) return null;
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "="));
    const expiresAt = JSON.parse(decodedPayload).exp;
    return typeof expiresAt === "number" ? expiresAt * 1000 : null;
  } catch {
    return null;
  }
}

function normalizeForVersion(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeForVersion);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      key === "url" && typeof item === "string" ? imageIdentity(item) : normalizeForVersion(item),
    ]),
  );
}

function imageUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (item && typeof item === "object" ? text((item as { url?: unknown }).url) : ""))
    .filter(Boolean)
    .map(optimizedImageUrl);
}

function category(value: unknown): GoluCategory | null {
  const normalized = text(value).toLocaleLowerCase("es");
  if (normalized === "recordatorios") return "Recordatorios";
  if (normalized === "postres") return "Postres";
  if (normalized === "detalles") return "Detalles";
  return null;
}

async function fetchTasks(apiUrl: string, apiKey: string, listId: string, cacheVersion: number): Promise<ApiTask[]> {
  const tasks: ApiTask[] = [];
  let offset = 0;

  for (let pageIndex = 0; pageIndex < CMS_MAX_PAGES; pageIndex += 1) {
    const url = new URL(apiUrl);
    url.searchParams.set("listId", listId);
    url.searchParams.set("limit", String(CMS_PAGE_SIZE));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("_golu_refresh", String(cacheVersion));

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Fresa CMS responded with ${response.status}`);
      const payload = (await response.json()) as {
        success?: boolean;
        tasks?: ApiTask[];
        page?: ApiTaskPage;
      };
      if (!payload.success || !Array.isArray(payload.tasks)) {
        throw new Error("Fresa CMS returned an invalid response");
      }

      tasks.push(...payload.tasks);
      const hasMore = payload.page?.hasMore === true;
      if (!hasMore) return tasks;

      const nextOffset = number(payload.page?.nextOffset, offset + payload.tasks.length);
      if (nextOffset <= offset) {
        throw new Error("Fresa CMS returned invalid pagination metadata");
      }
      offset = nextOffset;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  throw new Error(`Fresa CMS exceeded the ${CMS_MAX_PAGES}-page safety limit`);
}

function parseProducts(tasks: ApiTask[]): GoluCmsProduct[] {
  const taskValues = new Map(tasks.map((task) => [text(task.task_id), values(task)]));
  const presentationsByParent = new Map<string, ApiTask[]>();

  for (const task of tasks) {
    const fields = taskValues.get(text(task.task_id)) || {};
    if (text(fields.golu_record_type) !== "presentacion" || !boolean(fields.golu_visible)) continue;
    const parentId = text(task.parent_task_id);
    if (!parentId) continue;
    const bucket = presentationsByParent.get(parentId) || [];
    bucket.push(task);
    presentationsByParent.set(parentId, bucket);
  }

  return tasks
    .flatMap<GoluCmsProduct>((task) => {
      const taskId = text(task.task_id);
      const fields = taskValues.get(taskId) || {};
      if (text(fields.golu_record_type) !== "producto" || !boolean(fields.golu_visible)) return [];
      const productCategory = category(fields.golu_category);
      const productImages = imageUrls(fields.golu_images);
      if (!productCategory || !text(fields.golu_product_slug)) return [];

      const variants = (presentationsByParent.get(taskId) || [])
        .sort((left, right) => {
          const leftFields = taskValues.get(text(left.task_id)) || {};
          const rightFields = taskValues.get(text(right.task_id)) || {};
          return number(leftFields.golu_display_order, number(left.position))
            - number(rightFields.golu_display_order, number(right.position));
        })
        .flatMap((variant) => {
          const variantFields = taskValues.get(text(variant.task_id)) || {};
          const name = text(variantFields.golu_packaging) || text(variant.name);
          if (!name) return [];
          return [{
            name,
            price: number(variantFields.golu_price),
            images: imageUrls(variantFields.golu_images),
          }];
        });
      return [{
        id: text(fields.golu_product_slug),
        name: text(task.name),
        category: productCategory,
        image: productImages[0] || variants[0]?.images[0] || "",
        description: text(fields.golu_description),
        variants,
        notes: text(fields.golu_notes).split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
        tag: text(fields.golu_tag) || undefined,
      }];
    })
    .sort((left, right) => {
      const leftTask = tasks.find((task) => text(values(task).golu_product_slug) === left.id);
      const rightTask = tasks.find((task) => text(values(task).golu_product_slug) === right.id);
      return number(values(leftTask || {}).golu_display_order, number(leftTask?.position))
        - number(values(rightTask || {}).golu_display_order, number(rightTask?.position));
    });
}

function parseImages(tasks: ApiTask[]): GoluCmsData["images"] {
  return Object.fromEntries(
    tasks.flatMap((task) => {
      const fields = values(task);
      const recordType = text(fields.golu_record_type);
      const key = text(fields.golu_cms_key);
      if (!["hero", "seccion"].includes(recordType) || !key || !boolean(fields.golu_visible)) return [];
      const alt = text(fields.golu_alt_text);
      return [[key, imageUrls(fields.golu_images).map((url) => ({ url, alt }))]];
    }),
  );
}

function parseContent(tasks: ApiTask[]): GoluCmsData["content"] {
  return Object.fromEntries(
    tasks.flatMap((task) => {
      const fields = values(task);
      const key = text(fields.golu_content_key);
      if (!key || !boolean(fields.golu_content_visible)) return [];
      return [[key, {
        key,
        section: text(fields.golu_content_section),
        eyebrow: text(fields.golu_eyebrow),
        title: text(fields.golu_title),
        highlight: text(fields.golu_highlight),
        body: text(fields.golu_body),
        items: text(fields.golu_items).split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
        ctaLabel: text(fields.golu_cta_label),
        ctaUrl: text(fields.golu_cta_url),
        order: number(fields.golu_content_order, number(task.position)),
      } satisfies GoluContentBlock]];
    }),
  );
}

export async function loadGoluCms(): Promise<GoluCmsData | null> {
  const apiKey = text(import.meta.env.VITE_FRESA_API_KEY);
  if (!apiKey) return null;

  const requestCacheVersion = Date.now();
  const apiUrl = text(import.meta.env.VITE_FRESA_API_URL) || DEFAULT_API_URL;
  const catalogListId = text(import.meta.env.VITE_FRESA_CATALOG_LIST_ID) || DEFAULT_CATALOG_LIST_ID;
  const contentListId = text(import.meta.env.VITE_FRESA_CONTENT_LIST_ID) || DEFAULT_CONTENT_LIST_ID;
  const [catalogTasks, contentTasks] = await Promise.all([
    fetchTasks(apiUrl, apiKey, catalogListId, requestCacheVersion),
    fetchTasks(apiUrl, apiKey, contentListId, requestCacheVersion),
  ]);
  const products = parseProducts(catalogTasks);
  const images = parseImages(catalogTasks);
  const content = parseContent(contentTasks);
  const version = hash(JSON.stringify({
    data: normalizeForVersion({ catalogTasks, contentTasks }),
    imageCacheRevision,
  }));

  return {
    products,
    images,
    content,
    version,
  };
}
