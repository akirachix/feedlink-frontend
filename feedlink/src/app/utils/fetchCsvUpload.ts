const baseUrl = "/api/listings/upload-csv/";
export async function uploadCsvFile(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("csv_file", file);

    const response = await fetch(baseUrl, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      return "CSV file uploaded successfully!";
    } else {
      let errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch {
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    throw new Error(`An unexpected error occurred. Please try again. ${(error as Error).message}`);
  }
}