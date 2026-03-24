import StripeEmbeddedCheckout from "@/components/StripeEmbeddedCheckout";

export default function Checkout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-10">
      <div className="container mx-auto max-w-4xl px-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete your Vasage Pro purchase securely with Stripe.
          </p>
        </header>

        <StripeEmbeddedCheckout productId="vasage_pro" />
      </div>
    </div>
  );
}
