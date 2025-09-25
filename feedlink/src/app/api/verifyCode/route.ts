
export async function POST(request: Request) {
   const baseUrl = process.env.BASE_URL;
   try {
     const { email, otp } = await request.json();
      if (!email || !otp) {
       return new Response(
         JSON.stringify({ error: "Email and OTP are required." }),
         { status: 400 }
       );
     }
     const response = await fetch(`${baseUrl}/verification/`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ email, otp }),
     });
     const data = await response.json();
     return new Response(JSON.stringify(data), {
       status: 201,
       statusText: "OTP verified successfully",
   });
   }catch (error) {
    return new Response((error as Error).message, {
     status: 500,
   });
 }
} 
