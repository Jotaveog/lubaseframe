# Lubase Frame

Portfólio em HTML, CSS e JavaScript puro, sem instalação, bibliotecas ou etapa de compilação. Abra `index.html` no navegador ou use a extensão Live Server do VS Code. As fontes do Google são opcionais: há fontes locais de fallback.

## Estrutura

- `index.html`: conteúdo, projetos, formulário, links e SEO.
- `css/style.css`: visual e responsividade; cores, fontes e medidas em `:root`.
- `js/script.js`: menu, filtros, vídeos, carrossel, formulário e ano automático.
- `assets/images/`: ilustrações SVG locais provisórias e futuras fotografias.
- `assets/videos/`: futuros vídeos MP4.
- `assets/icons/favicon.svg`: ícone provisório.

O repositório tinha uma versão anterior no histórico Git, mas os arquivos estavam excluídos na pasta ao iniciar esta implementação. A organização editorial, a identidade textual e os contatos úteis foram mantidos; as imagens externas foram substituídas por ilustrações locais. As exclusões anteriores de `style.css`, `script.js` e `.vscode/settings.json` não foram revertidas; a página usa os novos caminhos solicitados.

## Substituir conteúdo

Todos os textos ficam no HTML, com comentários por seção. Não há nomes, qualificações ou depoimentos de clientes reais inventados. Os seis projetos e três relatos são demonstrativos. Substitua os relatos e nomes somente por depoimentos autorizados; depois remova as respectivas indicações de exemplo.

### Fotografias

Salve imagens autorizadas em `assets/images/`, preferencialmente WebP/JPEG otimizadas. No HTML, altere `src`, `alt`, `width` e `height` de cada imagem. Há comentários para início, apresentação, cada projeto, filme em destaque, sobre e Instagram. Troque também o `poster` do vídeo inicial. Os SVGs existentes são ilustrações abstratas, não fotografias de trabalhos. Remova as etiquetas “provisório”, avisos e legendas correspondentes somente após a troca. Os filtros de cor `.tone-*` no CSS são opcionais.

### Vídeos

Cada botão com `data-video=""` abre um estado demonstrativo. Preencha esse atributo sem alterar o JavaScript:

```html
data-video="assets/videos/casamento-m-n.mp4"
data-video="https://www.youtube.com/embed/ID_DO_VIDEO"
data-video="https://player.vimeo.com/video/ID_NUMERICO"
```

Use o ID real: YouTube requer 11 caracteres; Vimeo, um ID numérico. Também são aceitos links `youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/shorts/...` e `vimeo.com/...`. Vídeos privados do Vimeo aceitam `?h=HASH`. Autorize a incorporação na plataforma. Falhas de MP4 mostram uma mensagem; vídeos incorporados oferecem um link alternativo, pois erros internos de terceiros nem sempre são detectáveis pelo navegador. O modal fecha por botão, Escape ou clique fora e devolve o foco ao botão original.

Para o fundo inicial, preencha `data-src="assets/videos/inicio.mp4"` no elemento `.hero-video`. O vídeo usa reprodução sem som; se ela falhar ou houver preferência por movimento reduzido, a capa permanece. Use vídeo curto e comprimido. Para filmes com fala, adicione legendas na plataforma ou um `<track kind="captions" srclang="pt-BR" src="assets/videos/legendas.vtt">` ao vídeo criado no JavaScript.

### Projetos e filtros

Duplique um `<article class="project">`, atualize título, capa, `data-title`, `aria-label` e `data-video`. Categorias de `data-category`: `casamentos`, `prewedding`, `eventos` e `storymaker`. Eventos e Storymaker exibem um estado vazio até receberem projetos; não há trabalhos fictícios nessas categorias. O contador se atualiza ao filtrar.

### Contato e links

Instagram e WhatsApp aparecem no HTML, inclusive rodapé, botão flutuante e dados estruturados. O número usado pelo formulário fica na constante `WHATSAPP_URL` de `js/script.js`. Ao trocar o contato, atualize todas as ocorrências de `5527992453398` e `lubaseframe`.

Nome, WhatsApp, e-mail, tipo e mensagem são obrigatórios. Data e local são opcionais. O formulário valida, prepara os sete campos e abre uma mensagem no WhatsApp; o visitante precisa enviá-la. Nenhum dado é salvo pelo site. Se o navegador bloquear a nova aba, um link com a mensagem fica disponível. Sem JavaScript, use os links diretos de WhatsApp.

## Publicação e revisão

Hospede os arquivos em qualquer serviço estático com HTTPS. Em `index.html`, complete `og:url` e `og:image` com URLs absolutas quando houver domínio e fotografia reais; não foi inventado um domínio. O título, descrição, Open Graph básico, favicon e dados LocalBusiness já estão definidos.

Verifique em 320, 375, 768, 1024 e 1440 pixels: menu e Escape, links de seção, filtros (6/5/1/0/0), modal e retorno do foco, três depoimentos com setas/indicadores/gestos, erros do formulário e mensagem do WhatsApp com acentos. Teste também com movimento reduzido. Após inserir vídeos reais, confira reprodução, som, legendas e permissões de incorporação. Nenhum filme ou depoimento real acompanha esta versão.

## Verificação realizada

Foram aprovadas 22 verificações em Chrome headless: execução do JavaScript, cinco filtros, modal demonstrativo e retorno do foco, setas e indicadores do carrossel, campos obrigatórios, mensagem do WhatsApp com os sete campos e acentos, menu móvel e Escape, ausência de rolagem horizontal em 320/375/768/1024/1440 pixels, imagens locais, IDs únicos e destinos das âncoras. O WhatsApp foi interceptado no teste: nenhuma mensagem foi enviada. Reprodução de filmes reais e gesto de deslizar em dispositivo físico ainda dependem de verificação com o material e aparelho reais.
