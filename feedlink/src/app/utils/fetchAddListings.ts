const baseUrl = "/api/listings/";
export async function addListing(formData: FormData) {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();
    if (response.ok) {
      return "Product added successfully!";
    } else {
      const errorMessage = responseData.detail || "Failed to add item. Please try again.";
      throw new Error(errorMessage);
    }
  } catch (error) {
    throw new Error(`An unexpected error occurred. Please try again. ${(error as Error).message}`);
  }
}