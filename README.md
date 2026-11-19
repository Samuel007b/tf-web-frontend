# Site Institucional do Restaurante Dona Cida

> Front-end do Trabalho Final da disciplina **Desenvolvimento Web — IFNMG Salinas 2026**, desenvolvido pela equipe **Bergston Lovers**.

## O que é o projeto e tema da equipe

O projeto consiste no desenvolvimento do **site institucional e painel administrativo do Restaurante Dona Cida**, renomado ponto comercial localizado no município de Fruta de Leite (MG).

Desenvolvido pela equipe **Bergston Lovers**, o tema tem como objetivo expandir o alcance digital do estabelecimento — antes restrito apenas ao Instagram e WhatsApp — atraindo e convertendo novos clientes por meio de uma vitrine visualmente aconchegante, apresentação detalhada do cardápio artesanal, divulgação da história do restaurante e canal direto de avaliações e feedbacks.

### Equipe — Bergston Lovers
- **Athos Silvano Lopes** — [https://github.com/AthosMcqueen](https://github.com/AthosMcqueen)
- **Lucas Inácio Mendes** — [https://github.com/lim2-cmyk](https://github.com/lim2-cmyk)
- **Ryanderson Henzyo Souza e Moura** — [https://github.com/Ryanderson-GALO](https://github.com/Ryanderson-GALO)
- **Samuel Miranda de Carvalho** — [https://github.com/Samuel007b](https://github.com/Samuel007b)
- **Sara Augusta de Carvalho Silva** — [https://github.com/SaraAugusta-sacs2](https://github.com/SaraAugusta-sacs2)

---

## Links de Deploy (Vercel) & Design

- **Front-end (Site Institucional e Admin):** [https://restaurante-dona-cida-frontend.vercel.app](https://restaurante-dona-cida-frontend.vercel.app)
- **API Back-end:** [https://restaurante-dona-cida-backend.vercel.app](https://restaurante-dona-cida-backend.vercel.app)
- **Protótipo / Wireframe (Figma):** [https://www.figma.com/design/bcVaZHdqi5LrzrUorzMwzM/Wireframe---Site-Dona-Cida](https://www.figma.com/design/bcVaZHdqi5LrzrUorzMwzM/Wireframe---Site-Dona-Cida)

---

## Stack

- **HTML5 semântico**
- **CSS3** (identidade visual personalizada, layout responsivo e componentes dinâmicos)
- **JavaScript Vanilla (ES Modules + Fetch API)** para consumo assíncrono da API REST
- **Assets locais (`img/`)** para identidade visual, ícones e fotos de categorias/produtos
- **Deploy & CI:** Vercel (hospedagem estática) e GitHub Actions (`smoke-test.yml`)

---

## Funcionalidades

### Área Pública (Clientes)
- **Página Inicial (`index.html`):** apresentação do restaurante, pratos em destaque e chamada para ação.
- **Cardápio Digital (`cardapio.html`):** exibição dinâmica dos produtos consumidos da API com fotos, descrições, preços e filtragem por categorias (*Bebida, Unitário, Prato Feito e Prato Quilo*).
- **Avaliações (`avaliacoes.html`):** listagem de feedbacks de clientes vinculados aos pratos e formulário para envio de novas avaliações.
- **Institucional e Contato (`historia.html` e `contato.html`):** história do estabelecimento, valores regionais, localização e canais de atendimento.

### Área Administrativa (`/admin` — Proprietária/Gestão)
- **Autenticação (`admin/index.html`):** login seguro de usuários administradores com controle de sessão e proteção de rotas.
- **Painel Geral (`admin/painel.html`):** visão geral da gestão do restaurante e gerenciamento de perfil/usuário administrativo (`usuario-modal.js`).
- **Gestão de Cardápio (`admin/cardapio.html`):** CRUD completo de produtos (cadastrar, editar, marcar como destaque e excluir pratos).
- **Moderação de Avaliações (`admin/avaliacoes.html`):** visualização e gerenciamento das avaliações enviadas pelos clientes.

---

## Estrutura de Diretórios

```text
tf-web-frontend/
├── .github/workflows/
│   └── smoke-test.yml       # pipeline de verificação automatizada (CI)
├── admin/                   # área restrita (painel administrativo)
│   ├── js/
│   │   ├── api.js           # comunicação com a API autenticada
│   │   ├── auth.js          # controle de sessão e token
│   │   ├── avaliacoes.js    # moderação de avaliações
│   │   ├── cardapio.js      # CRUD de itens do cardápio
│   │   ├── config.js        # configurações e URL base da API
│   │   ├── login.js         # lógica de autenticação
│   │   ├── painel.js        # lógica da dashboard administrativa
│   │   ├── usuario-modal.js # controle do modal de usuário
│   │   └── utils.js         # funções auxiliares e feedbacks visuais
│   ├── avaliacoes.html      # gerenciamento de avaliações
│   ├── cardapio.html        # gerenciamento de cardápio
│   ├── index.html           # login administrativo
│   └── painel.html          # dashboard principal
├── css/
│   └── style.css            # estilos globais, layout e responsividade
├── img/                     # ícones, fotos de categorias, posts e identidade visual
├── js/                      # scripts da área pública
│   ├── api.js               # consumo dos endpoints públicos
│   ├── avaliacao-ui.js      # renderização de componentes de avaliação
│   ├── avaliacoes.js        # listagem de avaliações
│   ├── avaliar.js           # formulário e envio de nova avaliação
│   ├── cardapio.js          # listagem e filtragem do cardápio
│   ├── config.js            # configurações e URL base da API
│   ├── contato.js           # interações da página de contato
│   ├── index.js             # scripts da página inicial
│   └── utils.js             # funções utilitárias compartilhadas
├── index.html               # página inicial
├── cardapio.html            # cardápio público
├── avaliacoes.html          # avaliações de clientes
├── historia.html            # história do estabelecimento
└── contato.html             # localização e contato
```

---

## Como rodar localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Samuel007b/tf-web-frontend.git
   cd tf-web-frontend
   ```

2. **Configure a URL da API:**
   Abra os arquivos `js/config.js` (área pública) e `admin/js/config.js` (área administrativa) e verifique se a URL base aponta para a API em produção na Vercel ou para o seu servidor back-end local (ex.: `http://localhost:3000`).

3. **Inicie um servidor local:**
   Como o projeto utiliza **JavaScript ES Modules (`type="module"`)**, é necessário abri-lo através de um servidor HTTP local (não funciona abrindo o arquivo `.html` diretamente pelo protocolo `file://`):
   - **Via VS Code (recomendado):** instale a extensão **Live Server**, clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.
   - **Via terminal (Node/npx):**
     ```bash
     npx serve .
     ```
   - **Via Python:**
     ```bash
     python -m http.server 8080
     ```

4. **Acesse no navegador:**
   Abra `http://localhost:5500` (Live Server) ou a porta exibida no terminal. Para acessar o painel administrativo, navegue até `/admin`.