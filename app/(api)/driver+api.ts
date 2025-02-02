import {neon} from "@neondatabase/serverless";

export async function GET(req:Request){
try{
const sql=neon(process.env.DATABASE_URL!);
const data=await sql`SELECT * FROM drivers`;
return new Response(JSON.stringify({success:true,data}));
}
catch(error){
    console.error("Error fetching drivers:",error);
    return new Response(JSON.stringify({error:"Error fetching drivers",status:500}));
}
}

