const baseUrl = "/signup"; 

export async function fetchSignup(userData: object) {
 try {
   const response = await fetch(baseUrl, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(userData),
   });


   if (!response.ok) {
     throw new Error("Signup failed: " + response.statusText);
   }


   const result = await response.json();
   return result;
 } catch (error) {
   throw new Error("Failed to signup: " + (error as Error).message);
 }
}



























































