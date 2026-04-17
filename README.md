# Panificadora São Paulo 🥖

Projeto de site institucional completo para padaria/panificadora, com páginas informativas, cardápio, carrinho de compras e fluxo de finalização.

## ✨ Funcionalidades

- Página inicial com destaque da marca
- Cardápio com produtos e botão de compra
- Carrinho com armazenamento em `localStorage`
- Checkout com validações de formulário
- Página de compra concluída
- Página de contato com envio via Web3Forms
- Página de confirmação de mensagem enviada
- Layout responsivo (mobile/tablet/desktop)
- Menu hambúrguer em telas menores

## 📄 Páginas

- `index.html` — Home
- `cardapio.html` — Produtos
- `compra.html` — Carrinho e checkout
- `compra_concluida.html` — Confirmação de pedido
- `fale_conosco.html` — Formulário de contato
- `mensagem_enviada.html` — Confirmação de mensagem
- `sobre.html` — Sobre a empresa
- `serviços.html` — Serviços

## 🧱 Stack utilizada

- HTML5
- CSS3
- JavaScript (Vanilla)
- `localStorage` (carrinho)
- Web3Forms (envio de formulário)

## 🚀 Como executar localmente

Como é um projeto estático, basta abrir com servidor local.

### Opção 1: Python

```powershell
python -m http.server 8000
```

Depois, abra no navegador:

- `http://localhost:8000`

### Opção 2: Extensão Live Server (VS Code)

- Abra a pasta do projeto no VS Code
- Clique com o botão direito em `index.html`
- Selecione **Open with Live Server**

## ⚙️ Configuração do formulário de contato

No arquivo `fale_conosco.html`, configure a chave do Web3Forms:

```html
<input type="hidden" name="access_key" value="COLE_SUA_ACCESS_KEY_WEB3FORMS" />
```

> Importante: para publicar no GitHub, mantenha placeholder no repositório e use sua chave real apenas em deploy/local.

## 🔐 Segurança (publicação em GitHub/LinkedIn)

- Não commitar segredos privados (senhas, tokens, secret keys)
- Chaves públicas podem aparecer no frontend, mas use restrição por domínio no provedor
- Revogue/rotacione chaves se já tiverem sido expostas

## 📁 Estrutura do projeto

```text
html_mouratech/
├── index.html
├── cardapio.html
├── compra.html
├── compra_concluida.html
├── fale_conosco.html
├── mensagem_enviada.html
├── sobre.html
├── serviços.html
├── style.css
├── script.js
└── img/
```

## 👤 Autor

Projeto desenvolvido por **Abner Barretto**.
