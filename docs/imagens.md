# Imagens do site

Todas opcionais: quando o arquivo não existe, o componente cai num
placeholder listrado e o layout continua de pé.

## Por projeto — 2 imagens

Em `projects/<slug>/`, onde `<slug>` vem de `lib/projects.ts`:

| arquivo | proporção | tamanho sugerido | onde aparece |
|---|---|---|---|
| `cover.png` | 21:9 | 2100×900 | topo da página do projeto |
| `main.png` | 2:1 | 1920×960 | corpo da página do projeto |

## Home

| arquivo | proporção | tamanho sugerido | onde aparece |
|---|---|---|---|
| `work/<slug>.png` | 3:4 (retrato) | 900×1200 | lista de trabalhos |
| `featured/sgs-panel.png` | 4:3 | 900×675 | seção em destaque |
| `manifesto/campo.png` | — | — | seção manifesto |

## Regras que evitam retrabalho

**Largura mínima.** O container da lista de trabalhos exibe ~460px CSS, que em
tela retina vira ~920px reais. Exportar abaixo disso borra — não há como
recuperar resolução depois.

**Fundo transparente** nos mockups de `work/` e `featured/`: eles são
compostos sobre o papel bege da seção. Um fundo opaco aparece como retângulo
recortado.

**Qualidade.** Screenshots de UI com texto miúdo usam `quality={95}`; o padrão
75 do Next borra. Valores permitidos ficam em `next.config.ts` →
`images.qualities` (Next 16 rejeita silenciosamente o que não estiver lá).
