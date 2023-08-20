# Typer

> Bem-vindo ao Typer, uma plataforma dinâmica de rede social construída com o poder do Svelte. Junte-se a nós para explorar o futuro de experiências interativas na web.

## Features

- 🔥 Comunicação em tempo real. 
- ✨ Interface amigável com estética neobrutalista. 
- 🌊 Experiência do usuário fluida com elementos arrastáveis. 
- 🌐 Navegação suave com o sistema de roteamento do SvelteKit.

## Stack Utilizada

- Typescript
- SvelteKit v1
- Supabase
- Pusher.js
- Tailwind
- Prisma ORM
- Auth.js

## Uso

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Configure seu `.env`

```env
DATABASE_URL=********

# Para auth com Github https://authjs.dev/reference/core/providers_github
GITHUB_ID=********
GITHUB_SECRET=********

# Para auth com Google https://authjs.dev/reference/core/providers_google
GOOGLE_ID=********
GOOGLE_SECRET=********

# Supabase Docs https://supabase.com/docs
SUPABASE_SERVICE_ROLE=********
SUPABASE_URL=********

# Pusher docs https://pusher.com/docs
PUSHER_APP_ID=********
PUBLIC_PUSHER_APP_KEY=********
PUSHER_APP_SECRET=********

Auth.js docs (para sveltekit) https://authjs.dev/reference/sveltekit
AUTH_SECRET=********
AUTH_URL="http://localhost:5173"
```

4. Execute com `npm run dev`