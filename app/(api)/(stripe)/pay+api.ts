import { Stripe } from "stripe";

const stripe = new Stripe(process.env.EXPO_PUBLIC_STRIPE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { paymentIntentId, paymentMethodId, customerId } = await req.json();
    if (!paymentIntentId || !paymentMethodId || !customerId) {
      return new Response(
        JSON.stringify({ error: "Payment intent not exists", status: 400 })
      );
    }
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
    return new Response(
      JSON.stringify({ success: true, paymentIntent, status: 200 })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Payment intent not exists", status: 400 })
    );
  }
}
