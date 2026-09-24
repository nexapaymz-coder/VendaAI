import { NextResponse } from "next/server";
import { generateVideo } from "@/lib/providers";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const product = String(formData.get("product") || "");
    const price = String(formData.get("price") || "");
    const prompt = String(formData.get("prompt") || "");
    const imageValue = formData.get("image");

    if (!product || !prompt) {
      return NextResponse.json(
        { error: "Produto e prompt são obrigatórios." },
        { status: 400 }
      );
    }

    if (!(imageValue instanceof File) || imageValue.size === 0) {
      return NextResponse.json(
        { error: "Para criar um vídeo, é obrigatória uma imagem do produto." },
        { status: 400 }
      );
    }

    if (!imageValue.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "O arquivo enviado precisa ser uma imagem." },
        { status: 400 }
      );
    }

    const fullPrompt = `
Crie um vídeo publicitário curto e profissional usando a imagem fornecida.

Produto: ${product}
Preço: ${price || "não informado"}

Instruções do vendedor:
${prompt}

O vídeo deve manter o produto como elemento principal.
Crie movimento visual adequado para publicidade.
Se a API suportar narração, use português.
Não altere a identidade principal do produto.
`.trim();

    const videoUrl = await generateVideo(imageValue, fullPrompt);

    if (!videoUrl) {
      throw new Error("A API de vídeo não devolveu uma URL.");
    }

    return NextResponse.json({
      success: true,
      videoUrl,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao criar vídeo.",
      },
      { status: 500 }
    );
  }
}
