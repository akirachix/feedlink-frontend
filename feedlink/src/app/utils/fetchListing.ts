export async function fetchListings() {
try {
    const response = await fetch('/api/listings/');

    if (!response.ok) {
      throw new Error("Something went wrong: " + response.statusText);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    throw new Error('Failed to fetch waste claims: ' + (error as Error).message);
  }
}


