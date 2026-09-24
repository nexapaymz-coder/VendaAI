export type AIProviderResponse = {
  url?: string;
  data?: string;
  text?: string;
  raw?: unknown;
};

function getEnv(name: string) {
  return process.env[name] || "";
}

export async function generateText(prompt: string) {
  const url = getEnv("AI_API_URL");
  const key = getEnv("AI_API_KEY");
  const model = getEnv("AI_MODEL");

  if (!url || !key || !model) {
    throw new Error(
      "IA não configurada. Configure AI_API_URL, AI_API_KEY e AI_MODEL."
    );
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro da IA: ${error}`);
  }

  const data = await response.json();

  return (
    data?.choices?.[0]?.message?.content ||
    data?.output_text ||
    data?.text ||
    ""
  );
}

export async function generateImage(prompt: string) {
  const url = getEnv("IMAGE_API_URL");
  const key = getEnv("IMAGE_API_KEY");
  const model = getEnv("IMAGE_MODEL");

  if (!url || !key || !model) {
    throw new Error(
      "Imagem não configurada. Configure IMAGE_API_URL, IMAGE_API_KEY e IMAGE_MODEL."
    );
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size: "1024x1024",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro da API de imagem: ${error}`);
  }

  const data = await response.json();

  return (
    data?.data?.[0]?.url ||
    data?.images?.[0]?.url ||
    data?.output?.[0]?.url ||
    ""
  );
}

export async function generateVideo(
  image: File,
  prompt: string
) {
  const url = getEnv("VIDEO_API_URL");
  const key = getEnv("VIDEO_API_KEY");
  const model = getEnv("VIDEO_MODEL");

  if (!url || !key || !model) {
    throw new Error(
      "Vídeo não configurado. Configure VIDEO_API_URL, VIDEO_API_KEY e VIDEO_MODEL."
    );
  }

  const form = new FormData();

  form.append("model", model);
  form.append("prompt", prompt);
  form.append("image", image);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
    },
    body: form,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro da API de vídeo: ${error}`);
  }

  const data = await response.json();

  return (
    data?.video_url ||
    data?.url ||
    data?.output?.[0]?.url ||
    ""
  );
}
