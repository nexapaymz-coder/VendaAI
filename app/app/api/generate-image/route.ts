import { NextResponse } from "next/server";
import { generateImage } from "@/lib/providers";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { product, price, prompt } = body;

    if (!product || !prompt) {
      return NextResponse.json(
        { error: "Produto e prompt são obrigatórios." },
        { status: 400 }
      );
    }

    const fullPrompt = `
Crie uma imagem publicitária profissional para este produto.

Produto: ${product}
Preço: ${price || "não informado"}

Instruções do vendedor:
${prompt}

A imagem deve destacar o produto e ser adequada para divulgação em redes sociais.
`.trim();

    const imageUrl = await generateImage(fullPrompt);

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro ao criar imagem.",
      },
      { status: 500 }
    );
  }
        }
