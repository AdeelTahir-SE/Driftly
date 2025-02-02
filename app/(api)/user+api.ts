import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL as string);

export async function POST(request: Request) {
  try {
    const { name, email, clerkId, password } = await request.json();
    if (!name || !email || !clerkId || !password) {
      return new Response("Missing fields");
    }
    const res =
      await sql`INSERT INTO users (name, email, clerk_id,password) VALUES (${name}, ${email}, ${clerkId},${password})`;
    return new Response(
      JSON.stringify({ message: "user registered successfully" })
    );
  } catch (err: any) {
    return new Response(err.message);
  }
}

export async function PUT(request: Request) {
  try {
    const { name, password, userId } = await request.json();
    console.log(name, password, userId);
    const res =
      await sql`UPDATE users SET name=${name}, password=${password} WHERE clerk_id=${userId}`;
    return new Response(
      JSON.stringify({ message: "user updated successfully" })
    );
  } catch (err: any) {
    return new Response(err.message);
  }
}
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const res = await sql`SELECT * FROM users WHERE clerk_id=${userId}`;
    return new Response(
      JSON.stringify({response:res[0], message: "user fetched successfully" })
    );
  } catch (err: any) {
    return new Response(err.message);
  }
}
