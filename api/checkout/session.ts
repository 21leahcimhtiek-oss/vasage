import Stripe from "stripe";

type JsonObject = Record<string, unknown>;

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  setHeader: (name: string, value: string) => void;
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
}

interface ProductConfig {
  id: string;
  name: string;
  unitAmount: number;
  currency: "usd";
}

const DEFAULT_PRODUCT_ID = "vasage_pro";

const PRODUCTS: Record<string, ProductConfig> = {
  vasage_pro: {
    id: "vasage_pro",
    name: "Vasage Pro",
    unitAmount: 2000,
    currency: "usd",
  },
};

function sendError(res: ApiResponse, statusCode: number, error: string) {
  return res.status(statusCode).json({ error });
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonBody(body: unknown): { ok: true; value: JsonObject } | { ok: false; message: string } {
  if (body === null || body === undefined || body === "") {
    return { ok: false, message: "Missing JSON request body." };
  }

  if (isJsonObject(body)) {
    return { ok: true, value: body };
  }

  const rawBody = Buffer.isBuffer(body) ? body.toString("utf8") : body;
  if (typeof rawBody !== "string") {
    return { ok: false, message: "Request body must be valid JSON." };
  }

  try {
    const parsed = JSON.parse(rawBody) as unknown;
    if (!isJsonObject(parsed)) {
      return { ok: false, message: "JSON body must be an object." };
    }
    return { ok: true, value: parsed };
  } catch {
    return { ok: false, message: "Invalid JSON payload." };
  }
}

function getEnv() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const appUrl = process.env.APP_URL?.trim();

  if (!stripeSecretKey || !appUrl) {
    return {
      ok: false as const,
      message: "Missing required server environment variables: STRIPE_SECRET_KEY and APP_URL.",
    };
  }

  try {
    return {
      ok: true as const,
      stripeSecretKey,
      appUrl: new URL(appUrl),
    };
  } catch {
    return {
      ok: false as const,
      message: "Invalid APP_URL environment variable. Expected an absolute URL.",
    };
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendError(res, 405, "Method not allowed. Use POST.");
  }

  const env = getEnv();
  if (!env.ok) {
    return sendError(res, 500, env.message);
  }

  const parsedBody = parseJsonBody(req.body);
  if (!parsedBody.ok) {
    return sendError(res, 400, parsedBody.message);
  }

  const rawProductId = parsedBody.value.productId;
  if (rawProductId !== undefined && typeof rawProductId !== "string") {
    return sendError(res, 422, "Invalid productId. Expected a string.");
  }

  const requestedProductId = rawProductId?.trim();
  if (rawProductId !== undefined && !requestedProductId) {
    return sendError(res, 422, "Invalid productId. Expected a non-empty string.");
  }

  const product = PRODUCTS[requestedProductId ?? DEFAULT_PRODUCT_ID] ?? PRODUCTS[DEFAULT_PRODUCT_ID];
  const stripe = new Stripe(env.stripeSecretKey);
  const returnUrl = new URL("/checkout/complete?session_id={CHECKOUT_SESSION_ID}", env.appUrl).toString();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      redirect_on_completion: "never",
      return_url: returnUrl,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency,
            unit_amount: product.unitAmount,
            product_data: {
              name: product.name,
            },
          },
        },
      ],
      metadata: {
        productId: product.id,
      },
    });

    if (!session.client_secret) {
      return sendError(res, 502, "Stripe did not return a checkout client secret.");
    }

    return res.status(200).json({ clientSecret: session.client_secret });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Stripe error.";
    return sendError(res, 502, `Failed to create Stripe checkout session: ${message}`);
  }
}
