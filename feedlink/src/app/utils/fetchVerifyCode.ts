const baseUrl = "/api/verifyCode";
export async function verifyCodeApi(email: string, code: string) {
 const response = await fetch(baseUrl, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
  
   body: JSON.stringify({ email, otp: code }),
 });
 const text = await response.text();
 let data;
 try {
   data = JSON.parse(text);
 } catch  {
   throw new Error("Invalid JSON response from server: " + text);
 }
 if (!response.ok) {
   throw new Error("Failed to verify OTP");
 }
 return data;
}