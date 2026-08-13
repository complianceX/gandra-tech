# Gandra Tecnologia

Site institucional e vitrine de produtos da **Gandra Tecnologia**, construído com foco em direção visual, motion design, interação e apresentação de soluções digitais.

O projeto utiliza **Next.js 16**, **React 19** e **TypeScript**, com animações baseadas em **GSAP** e navegação/scroll refinados com **Lenis**.

## Estrutura da experiência

A página principal é organizada em blocos independentes e reutilizáveis:

- `Hero` — apresentação principal da marca;
- `FeaturedProduct` — destaque para o SGS — Sistema de Gestão de Segurança;
- `WorkList` — trabalhos e soluções em evidência;
- `Manifesto` — posicionamento e visão da marca;
- `Contact` — contato e conversão;
- `Marquee`, `ScrollThread` e `CardStack` — camadas de movimento e narrativa visual.

O produto em destaque atualmente é o **SGS**, apresentado com mockup, conteúdo institucional e animações acionadas por scroll.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 |
| UI | React 19 |
| Linguagem | TypeScript 5 |
| Motion | GSAP 3 |
| Smooth scroll | Lenis |
| Testes de navegador | Playwright |

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Next.js no terminal.

## Build de produção

```bash
npm run build
npm run start
```

## Estrutura principal

```text
app/          rotas e composição da aplicação
components/   seções, componentes e sistema de motion
docs/         documentação do projeto
lib/          utilitários e código compartilhado
public/       imagens e assets estáticos
```

## Projeto em destaque

**SGS — Sistema de Gestão de Segurança**  
Plataforma SaaS B2B multi-tenant para gestão de Saúde e Segurança do Trabalho.

- Produto: https://app.sgsseguranca.com.br
- Repositório: https://github.com/wandersongandra/sgsseguranca

---

**Gandra Tecnologia** — software, produtos digitais e experiências tecnológicas.