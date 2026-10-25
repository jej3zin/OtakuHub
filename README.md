# OtakuHub

Plataforma de descoberta de animes com interface responsiva e catálogo alimentado pela API pública [Jikan](https://jikan.moe/), que disponibiliza dados do MyAnimeList.

## Stack

- React 18
- TypeScript
- Vite
- React Router
- Lucide React
- Jikan API v4

## Funcionalidades

- Página inicial com animes populares e temporada atual
- Busca com sugestões
- Catálogo de populares e lançamentos
- Exploração por gênero
- Detalhes, sinopse, avaliação e trailer quando disponível
- Lista pessoal salva no navegador
- Perfil local
- Layout responsivo e estados de carregamento

## Requisitos

Node.js 20.19+ ou 22.12+.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Validar e gerar build

```bash
npm run typecheck
npm run build
npm run preview
```

## Observações

A API Jikan é pública e pode limitar consultas em períodos de alto tráfego. A lista e o perfil são armazenados localmente no navegador; não há autenticação nem sincronização entre dispositivos neste momento.

Os arquivos da versão anterior foram mantidos em `public/pages` e `public/js` durante a migração, para referência. A nova aplicação é iniciada pelo `index.html` na raiz e pelo código em `src/`.
