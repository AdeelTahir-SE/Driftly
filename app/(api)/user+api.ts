import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL as string);

export async function POST(request:Request){
    try{
    const {name, email,clerkId} = await request.json();
    if(!name||!email||!clerkId){
        return new Response("Missing fields");
    }
    const res= await sql`INSERT INTO users (name, email, clerk_id) VALUES (${name}, ${email}, ${clerkId})`;
    return new Response(JSON.stringify({message:"user registered successfully"}));

    }catch(err:any){
        return new Response(err.message);

    }
    
}