import { CartItem } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      // Parse the cart items from the request body
      const cartItems: CartItem[] = req.body.items;

      const { customer } = req.body;

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
        success_url: `http://localhost:3000/?success=true`,
        cancel_url: `http://localhost:3000/?canceled=true`,
      });

      res.status(200).json({ id: session.id });
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
