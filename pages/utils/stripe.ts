import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripeInstance: Stripe | null = null;

const getStripe = async (): Promise<Stripe | null> => {
  if (!stripeInstance) {
    stripeInstance = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripeInstance;
};

export default getStripe;
