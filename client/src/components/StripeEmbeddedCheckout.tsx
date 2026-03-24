import { Button } from "@/components/ui/button";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useMemo, useState } from "react";

type StripeEmbeddedCheckoutProps = {
  productId: string;
};

type CheckoutSessionResponse = {
  clientSecret?: string;
  client_secret?: string;
  error?: string;
  message?: string;
};

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as
  | string
  | undefined;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

export default function StripeEmbeddedCheckout({
  productId,
}: StripeEmbeddedCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchAttempt, setFetchAttempt] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    const loadClientSecret = async () => {
      if (!stripePromise) {
        setError(
          "Checkout is unavailable right now. Missing Stripe publishable key."
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setClientSecret(null);

      try {
        const response = await globalThis.fetch("/api/checkout/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });

        const result = (await response.json()) as CheckoutSessionResponse;
        const secret = result.clientSecret ?? result.client_secret;

        if (!response.ok || !secret) {
          throw new Error(
            result.error ??
              result.message ??
              "Unable to create a checkout session."
          );
        }

        if (cancelled) {
          return;
        }

        setClientSecret(secret);
      } catch (err: unknown) {
        if (cancelled) {
          return;
        }

        const message =
          err instanceof Error
            ? err.message
            : "Unable to create a checkout session.";
        setError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadClientSecret();

    return () => {
      cancelled = true;
    };
  }, [productId, fetchAttempt]);

  const embeddedCheckoutOptions = useMemo(
    () => ({ clientSecret }),
    [clientSecret]
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-lg border bg-card p-6">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">
            Preparing your secure checkout…
          </p>
        </div>
      </div>
    );
  }

  if (error || !clientSecret || !stripePromise) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="text-lg font-semibold text-destructive">
          Checkout failed to load
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {error ?? "Unable to initialize checkout."}
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setFetchAttempt((attempt) => attempt + 1)}
          type="button"
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={embeddedCheckoutOptions}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
