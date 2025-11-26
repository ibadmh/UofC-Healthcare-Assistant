export async function sendMessage(message: string) {

    if (!import.meta.env.VITE_API_URL) {
    // Local mock for early UI development
    return {
      text: "Mock response: backend not running yet.",
      resources: []
    };
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    return await res.json();
  } catch (err) {
    return {
      text: "Mock response: backend not running yet.",
      resources: []
    };
  }
}
  