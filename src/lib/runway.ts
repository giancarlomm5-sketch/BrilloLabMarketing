const RUNWAY_API_KEY = import.meta.env.VITE_RUNWAY_API_KEY;

export async function generateVideo(prompt: string, imageUrl?: string) {
  const response = await fetch('https://api.runwayml.com/v1/gen3a/text_to_video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RUNWAY_API_KEY}`,
    },
    body: JSON.stringify({
      prompt,
      ...(imageUrl && { image_url: imageUrl }),
      duration: 10,
      ratio: '16:9'
    }),
  });

  const data = await response.json();
  return data;
}

export async function checkVideoStatus(taskId: string) {
  const response = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
    headers: {
      'Authorization': `Bearer ${RUNWAY_API_KEY}`,
    },
  });

  const data = await response.json();
  return data;
}
