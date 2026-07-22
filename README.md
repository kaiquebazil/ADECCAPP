# Vida Plena — aplicativo web da igreja

Aplicação SPA feita somente com HTML5, CSS3 e JavaScript puro. Perfil, pedidos, inscrições, favoritos, notas e preferências de demonstração ficam no `localStorage`.

## Como executar

Abra a pasta em um servidor local (como Live Server) e acesse `index.html`. Um servidor é necessário para que o PWA funcione. Em celular, use a opção **Instalar aplicativo** do navegador.

## Bíblia e API

`js/bible-api.js` isola a comunicação com a Bíblia. A implementação usa a API pública [Bible API](https://bible-api.com/) para a tradução WEB, sem chave no navegador, e tem conteúdo demonstrativo para quando não houver conexão.

Para ARC, ARA, NVI ou versões licenciadas, crie uma função serverless, como `/api/bible`, que guarda a chave de um provedor autorizado (por exemplo, [API.Bible](https://docs.api.bible/)). Altere o adaptador para chamar essa função; nunca coloque chaves privadas no front-end. Respeite as licenças de cada tradução. O PWA não persiste respostas externas da Bíblia por padrão.

## Publicar no GitHub Pages

1. Crie um repositório e envie os arquivos para `main`.
2. Em **Settings → Pages**, selecione **Deploy from a branch**, `main` e `/ (root)`.
3. Aguarde a URL publicada. Os caminhos relativos já funcionam em um repositório de projeto.

## Integrações exigidas em produção

- Autenticação, perfis e permissões administrativas: identidade + banco de dados.
- Pedidos, eventos, inscrições, conteúdos e notificações: API protegida e banco de dados.
- PIX/pagamentos: gateway de pagamento no backend; não gere cobranças nem use segredos no navegador.
- Vídeos e notificações push: CMS/API e serviço de push com consentimento do usuário.

O painel administrativo é uma demonstração visual pronta para conectar a esses serviços.
