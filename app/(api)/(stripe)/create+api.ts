import { Stripe } from "stripe";

const stripe = new Stripe(process.env.EXPO_PUBLIC_STRIPE_API_KEY!);

export async function POST(req: any) {
  const {name,email, amount } = await req.json();
 if(!name || !email || !amount) {
  return new Response(JSON.stringify({ error: "Email not exists", status: 400 }));
 }
 let customer;
 customer=await stripe.customers.list({email});
 if(customer.data.length===0){
  customer=await stripe.customers.create({name,email});
 }
 else{
    customer=customer.data[0];
 }

 const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2025-01-27.acacia'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount) * 100,
    currency: 'usd',
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never',
    },
  });

  return new   Response(JSON.stringify({
    paymentIntent: paymentIntent,
    ephemeralKey: ephemeralKey,
    customer: customer.id,
  }));
}
