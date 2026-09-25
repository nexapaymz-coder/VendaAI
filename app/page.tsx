"use client";

import { useState } from "react";

export default function VendaAI() {
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setImage(URL.createObjectURL(file));
  }

  async function generateImage() {
    if (!product || !prompt) {
      setResult("Preencha o produto e o prompt.");
      return;
    }

    setLoading(true);
    setResult("A criar imagem...");

    try {
      const response = await fetch("/api/gerar-imagem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          price,
          prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar imagem.");
      }

      setImage(data.imageUrl);
      setResult("Imagem criada com sucesso.");
    } catch (error) {
      setResult(
        error instanceof Error
          ? error.message
          : "Não foi possível gerar a imagem."
      );
    } finally {
      setLoading(false);
    }
  }

  async function generateVideo() {
    if (!product || !prompt) {
      setResult("Preencha o produto e o prompt.");
      return;
    }

    if (!imageFile) {
      setResult("Adicione uma imagem do produto primeiro.");
      return;
    }

    setLoading(true);
    setResult("A preparar o vídeo...");

    try {
      const formData = new FormData();

      formData.append("product", product);
      formData.append("price", price);
      formData.append("prompt", prompt);
      formData.append("image", imageFile);

      const response = await fetch("/api/gerar-vídeo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar vídeo.");
      }

      setVideoUrl(data.videoUrl || "");
      setResult("Vídeo criado com sucesso.");
    } catch (error) {
      setResult(
        error instanceof Error
          ? error.message
          : "Não foi possível gerar o vídeo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050814] p-5 text-white">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-cyan-400">
            VendaAI
          </h1>

          <p className="mt-2 text-gray-400">
            Crie anúncios inteligentes para os seus produtos
          </p>
        </header>

        <section className="rounded-3xl border border-cyan-400/20 bg-white/5 p-5 backdrop-blur-xl">
          <label className="mb-2 block text-sm text-gray-300">
            Produto
          </label>

          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Ex.: Manga fresca"
            className="mb-4 w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none focus:border-cyan-400"
          />

          <label className="mb-2 block text-sm text-gray-300">
            Preço
          </label>

          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ex.: 50 MT"
            className="mb-4 w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none focus:border-cyan-400"
          />

          <label className="mb-2 block text-sm text-gray-300">
            Imagem do produto
          </label>

          <label className="mb-5 flex min-h-40 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-cyan-400/40 bg-black/20 p-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />

            {image ? (
              <img
                src={image}
                alt="Produto"
                className="max-h-64 rounded-xl object-contain"
              />
            ) : (
              <div>
                <div className="text-4xl">📷</div>

                <p className="mt-2 text-gray-400">
                  Toque para adicionar a imagem
                </p>
              </div>
            )}
          </label>

          <label className="mb-2 block text-sm text-gray-300">
            O que quer criar?
          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex.: Crie um anúncio moderno para este produto."
            rows={5}
            className="mb-5 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 outline-none focus:border-cyan-400"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={generateImage}
              disabled={loading}
              className="rounded-2xl bg-cyan-500 px-5 py-4 font-bold text-black disabled:opacity-50"
            >
              🖼️ Criar imagem
            </button>

            <button
              onClick={generateVideo}
              disabled={loading}
              className="rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-5 py-4 font-bold text-cyan-300 disabled:opacity-50"
            >
              🎬 Criar vídeo
            </button>
          </div>

          {loading && (
            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-black/30 p-4 text-center text-cyan-300">
              🤖 VendaAI está a trabalhar...
            </div>
          )}

          {result && !loading && (
            <div className="mt-5 rounded-2xl bg-white/5 p-4 text-center text-gray-300">
              {result}
            </div>
          )}

          {videoUrl && (
            <div className="mt-6">
              <video
                src={videoUrl}
                controls
                className="w-full rounded-2xl"
              />
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-gray-500">
          VendaAI — transforme produtos em conteúdo para vender.
        </p>
      </div>
    </main>
  );
}