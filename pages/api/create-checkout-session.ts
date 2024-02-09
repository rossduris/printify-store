import { CartItem } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Parse the cart items from the request body
    const cartItems: CartItem[] = req.body.items;

    // Convert the cart items to the format expected by Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects prices in cents
        },
        quantity: item.quantity,
      }));

    // Create a new Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://printify-store.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://printify-store.vercel.app/canceled`,
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    res.status(500).json(err);
  }
}

export default handler;
