 const baseUrl = '/api/users/';

export async function fetchProducers() {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }
    const data = await response.json();
    
    const producers = data.filter((user: { role: string }) => user.role === "producer");
    
    return producers;

  } catch (error) {
    throw new Error('Failed to fetch producers: ' + (error as Error).message);
  }
}