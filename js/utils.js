// utilitários compartilhados: DOM, formatação, ícones, janelas (dialog), upload
// (este arquivo é idêntico nos dois sites — cada site é independente no deploy)

export const PLACEHOLDER = 'img/placeholder.png';

// ordem em que as categorias aparecem nas abas (valores = enum TipoProduto do backend)
export const CATEGORIAS = [
  { valor: 'PRATO_FEITO', rotulo: "PF's", nome: 'Prato feito', icone: 'img/cat-pf.jpg', cor: 'laranja' },
  { valor: 'PRATO_QUILO', rotulo: 'No Quilo', nome: 'Prato no quilo', icone: 'img/cat-quilo.jpg', cor: 'rosa', comBorda: true },
  { valor: 'BEBIDA', rotulo: 'Bebidas', nome: 'Bebida', icone: 'img/cat-bebidas.png', cor: 'ambar', comBorda: true },
  { valor: 'UNITARIO', rotulo: 'Unitários', nome: 'Unitário', icone: 'img/cat-unitarios.jpg', cor: 'verde' },
];

export function nomeDaCategoria(valor) {
  return CATEGORIAS.find((c) => c.valor === valor)?.nome ?? valor;
}

// ===== DOM =====
// el('div', { class: 'x', onclick: fn, texto: 'oi' }, filho1, filho2)
export function el(tag, props = {}, ...filhos) {
  const no = document.createElement(tag);
  for (const [chave, valor] of Object.entries(props ?? {})) {
    if (valor == null || valor === false) continue;
    if (chave === 'class') no.className = valor;
    else if (chave === 'texto') no.textContent = valor;
    else if (chave.startsWith('on')) no.addEventListener(chave.slice(2).toLowerCase(), valor);
    else no.setAttribute(chave, valor === true ? '' : valor);
  }
  no.append(...filhos.flat().filter((f) => f != null && f !== false));
  return no;
}

// ===== feedback =====
export function exibirToast(tipo, mensagem) {
  const toast = el('div', { class: `toast toast-${tipo}`, role: 'status', texto: mensagem }); // 'sucesso' | 'erro'
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ===== formatação =====
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
// o Prisma devolve Decimal como string ("25.00"), por isso o Number()
export function formatarPreco(valor) {
  return moeda.format(Number(valor));
}

export function formatarData(iso) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));
}

export function estrelas(quantidade) {
  const n = Math.max(0, Math.min(5, Number(quantidade) || 0));
  return el(
    'span',
    { class: 'estrelas', role: 'img', 'aria-label': `${n} de 5 estrelas` },
    '★'.repeat(n),
    el('span', { class: 'apagada' }, '★'.repeat(5 - n)),
  );
}

// ===== ícones (traço, estilo feather) =====
const ICONES = {
  'seta-esquerda': '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  'seta-direita': '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  usuario: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  editar: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  estrela: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  lixeira: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  olho: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  menu: '<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>',
  fechar: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  mais: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  coracao: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  comentario: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  enviar: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  salvar: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
};

export function svgIcone(nome) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONES[nome] ?? ''}</svg>`;
}

export function icone(nome, extra = '') {
  const span = el('span', { class: `ico ${extra}`.trim() });
  span.innerHTML = svgIcone(nome); // markup fixo definido acima, nunca dado do usuário
  return span;
}

// <span data-icone="seta-esquerda"></span> no HTML vira o SVG correspondente
export function hidratarIcones(raiz = document) {
  raiz.querySelectorAll('[data-icone]').forEach((no) => {
    no.classList.add('ico');
    no.innerHTML = svgIcone(no.dataset.icone);
  });
}

// ===== imagens =====
// imagem que cai no placeholder se a URL quebrar (fotos vêm de URLs externas)
export function imagem(src, alt = '', classe = '') {
  const img = el('img', { alt, class: classe, loading: 'lazy', decoding: 'async' });
  img.addEventListener('error', () => {
    if (img.dataset.falhou) return;
    img.dataset.falhou = '1';
    img.src = PLACEHOLDER;
  });
  img.src = src || PLACEHOLDER;
  return img;
}

const EXT_VIDEO = /\.(mp4|webm|ogg|mov)(\?|$)/i;

// "mídia" da avaliação: foto ou vídeo (o Uploadcare entrega as duas coisas)
export function midia(url, classe = '') {
  const video = () => el('video', { src: url, controls: true, preload: 'metadata', class: classe });
  if (EXT_VIDEO.test(url)) return video();
  const img = el('img', { src: url, alt: 'Mídia enviada pelo cliente', class: classe, loading: 'lazy' });
  // URL sem extensão que não carrega como imagem: tenta como vídeo
  img.addEventListener('error', () => img.replaceWith(video()), { once: true });
  return img;
}

// ===== carrossel com troca automática =====
// Troca de foto com fade a cada `intervalo` ms. Pausa com mouse/foco em cima e com a aba oculta;
// quem prefere menos movimento (prefers-reduced-motion) só troca pelas setas.
export function criarCarrossel({ quadro, anterior, proximo, itens, criarSlide, aoMudar, intervalo = 3000 }) {
  const slides = itens.map((item, i) =>
    el('div', { class: `carrossel-slide${i === 0 ? ' ativo' : ''}`, 'aria-hidden': String(i !== 0) }, criarSlide(item)),
  );
  quadro.replaceChildren(...slides);

  let atual = 0;
  let timer = null;
  let pausado = false;
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const parar = () => {
    clearInterval(timer);
    timer = null;
  };
  const iniciar = () => {
    parar();
    if (itens.length > 1 && !pausado && !reduzirMovimento && !document.hidden) {
      timer = setInterval(() => ir(atual + 1, false), intervalo);
    }
  };

  function ir(indice, reiniciar = true) {
    slides[atual].classList.remove('ativo');
    slides[atual].setAttribute('aria-hidden', 'true');
    atual = (indice + itens.length) % itens.length;
    slides[atual].classList.add('ativo');
    slides[atual].setAttribute('aria-hidden', 'false');
    aoMudar?.(itens[atual], atual);
    if (reiniciar) iniciar(); // clique nas setas zera a contagem dos 5 segundos
  }

  anterior.addEventListener('click', () => ir(atual - 1));
  proximo.addEventListener('click', () => ir(atual + 1));
  anterior.disabled = proximo.disabled = itens.length < 2;

  const area = quadro.closest('.carrossel') ?? quadro;
  area.addEventListener('mouseenter', () => { pausado = true; parar(); });
  area.addEventListener('mouseleave', () => { pausado = false; iniciar(); });
  area.addEventListener('focusin', () => { pausado = true; parar(); });
  area.addEventListener('focusout', () => { pausado = false; iniciar(); });
  document.addEventListener('visibilitychange', () => (document.hidden ? parar() : iniciar()));

  aoMudar?.(itens[0], 0);
  iniciar();
  return { ir };
}

// ===== pílulas (botões de navegação/filtro) =====
// pill({ cor, icone, comBorda, texto, href | onclick, pressionado })
export function pill({ cor = 'laranja', icone: src, comBorda = false, texto, href, onclick, pressionado }) {
  const filhos = [];
  if (src) filhos.push(el('img', { src, alt: '', class: `pill-icone${comBorda ? ' com-borda' : ''}` }));
  filhos.push(el('span', { class: 'pill-texto', texto }));
  const props = { class: `pill pill-${cor}`, onclick };
  if (href) return el('a', { ...props, href }, filhos);
  return el('button', { ...props, type: 'button', 'aria-pressed': pressionado == null ? null : String(pressionado) }, filhos);
}

// ===== janelas =====
// cria um <dialog> (os "cartões cinza" dos wireframes) e devolve { dialog, conteudo, abrir, fechar }
export function criarModal({ titulo = '', estreito = false } = {}) {
  const idTitulo = `modal-titulo-${Math.random().toString(36).slice(2, 8)}`;
  const dialog = el('dialog', { class: `modal${estreito ? ' estreito' : ''}`, 'aria-labelledby': idTitulo });
  const conteudo = el('div', { class: 'modal-conteudo' });
  const botaoFechar = el(
    'button',
    { type: 'button', class: 'modal-fechar', 'aria-label': 'Fechar janela', onclick: () => dialog.close() },
    icone('fechar'),
  );
  const cabecalho = el('h2', { class: 'modal-titulo', id: idTitulo, texto: titulo });
  dialog.append(el('div', { class: 'modal-corpo' }, botaoFechar, cabecalho, conteudo));

  // clique no fundo escuro fecha a janela
  dialog.addEventListener('click', (evento) => {
    if (evento.target === dialog) dialog.close();
  });
  document.body.appendChild(dialog);

  return {
    dialog,
    conteudo,
    definirTitulo(texto) {
      cabecalho.textContent = texto;
      cabecalho.hidden = !texto;
    },
    abrir() {
      if (!dialog.open) dialog.showModal();
    },
    fechar() {
      dialog.close();
    },
  };
}

// confirmação própria (no lugar do confirm() do navegador) — devolve Promise<boolean>
export function confirmar({ titulo = 'Tem certeza?', mensagem = '', rotulo = 'Confirmar', perigo = true } = {}) {
  return new Promise((resolve) => {
    const modal = criarModal({ titulo, estreito: true });
    let resposta = false;
    modal.conteudo.append(
      el('p', { texto: mensagem }),
      el(
        'div',
        { class: 'acoes-form' },
        el('button', { type: 'button', class: 'btn btn-claro', onclick: () => modal.fechar(), texto: 'Cancelar' }),
        el('button', {
          type: 'button',
          class: `btn${perigo ? ' btn-perigo' : ''}`,
          onclick: () => {
            resposta = true;
            modal.fechar();
          },
          texto: rotulo,
        }),
      ),
    );
    modal.dialog.addEventListener('close', () => {
      modal.dialog.remove();
      resolve(resposta);
    });
    modal.abrir();
  });
}

// ===== upload (Uploadcare via CDN, como no projeto do professor) =====
// Se o script do Uploadcare não carregar, o upload simplesmente fica indisponível.
export function criarUploader(input, { soImagens = false } = {}) {
  if (typeof uploadcare === 'undefined') {
    return { disponivel: false, async obterUrl() { return null; }, limpar() {} };
  }
  input.dataset.clearable = 'true';
  input.dataset.locale = 'pt';
  if (soImagens) input.dataset.imagesOnly = 'true';
  const widget = uploadcare.Widget(input);

  return {
    disponivel: true,
    // espera o upload terminar e devolve a URL pública (ou null se não enviou nada)
    async obterUrl() {
      const arquivo = widget.value();
      if (!arquivo) return null;
      const info = await arquivo.promise();
      if (info.cdnUrl) return info.cdnUrl;
      if (info.uuid) return `https://ucarecdn.com/${info.uuid}/`;
      return null;
    },
    limpar() {
      widget.value(null);
    },
  };
}

// campo de formulário com o botão de upload
export function criarCampoUpload({ rotulo, dica = '', soImagens = false }) {
  const input = el('input', { type: 'hidden' });
  const campo = el('div', { class: 'campo' }, el('span', { class: 'rotulo', texto: rotulo }), input, dica && el('span', { class: 'dica', texto: dica }));
  const uploader = criarUploader(input, { soImagens });
  return { campo, uploader };
}
