# VendaAI

VendaAI é uma plataforma de criação de anúncios com IA para vendedores.

## Funcionalidades
- Cadastro de produto, preço e descrição.
- Upload da imagem principal do produto.
- Geração de anúncio com IA.
- Geração de imagem a partir de prompt.
- Edição de imagem usando imagem + prompt.
- Criação de vídeo publicitário somente a partir de uma imagem + prompt.
- Histórico de trabalhos.
- Arquitetura independente de Base44.
- Chaves de API ficam no servidor através de variáveis de ambiente.

## Stack
- Next.js + TypeScript
- Tailwind CSS
- API routes
- Prisma + SQLite para começar
- Adapter de IA separado para permitir trocar o fornecedor.

## Instalação

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

Abra http://localhost:3000

## APIs

O projeto não fixa um fornecedor de IA. Configure no `.env`:

```env
AI_API_URL=
AI_API_KEY=
AI_MODEL=
IMAGE_API_URL=
IMAGE_API_KEY=
IMAGE_MODEL=
VIDEO_API_URL=
VIDEO_API_KEY=
VIDEO_MODEL=
```

O backend envia imagem + prompt para o endpoint configurado. O formato da resposta pode ser adaptado em `lib/providers.ts`.

IMPORTANTE: nunca coloque chaves secretas no frontend nem no GitHub.
