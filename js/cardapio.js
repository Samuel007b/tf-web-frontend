// cardápio: abas por categoria, grade de pratos e janela com os detalhes do prato
import { listarProdutos, listarAvaliacoesDestaque } from './api.js';
import { CATEGORIAS, el, imagem, pill, icone, hidratarIcones, formatarPreco, nomeDaCategoria, criarModal, estrelas } from './utils.js';
import { abrirAvaliar } from './avaliar.js';
import { avatarCliente } from './avaliacao-ui.js';

hidratarIcones();

const abas = document.getElementById('abas');
const grade = document.getElementById('grade-pratos');

let produtos = [];
let categoriaAtual = 'PRATO_FEITO';
let modalPrato;
let destaquesPromise; // avaliações aprovadas, buscadas uma vez só

// ===== abas e grade =====
function renderizarAbas() {
  abas.replaceChildren(
    ...CATEGORIAS.map((c) =>
      pill({
        cor: c.cor,
        icone: c.icone,
        comBorda: c.comBorda,
        texto: c.rotulo,
        pressionado: c.valor === categoriaAtual,
        onclick: () => {
          categoriaAtual = c.valor;
          renderizarAbas();
          renderizarGrade();
        },
      }),
    ),
  );
}

function renderizarGrade() {
  const doGrupo = produtos.filter((p) => p.categoria === categoriaAtual);
  if (doGrupo.length === 0) {
    grade.replaceChildren(el('div', { class: 'estado-vazio' }, el('p', { texto: 'Ainda não temos pratos nesta categoria. Volte em breve!' })));
    return;
  }
  grade.replaceChildren(
    ...doGrupo.map((p) =>
      el(
        'button',
        { type: 'button', class: 'prato-card', onclick: () => abrirPrato(p), 'aria-label': `Ver detalhes de ${p.nome}` },
        el(
          'span',
          { class: 'prato-foto' },
          imagem(p.foto, p.nome),
          p.destaque && el('span', { class: 'selo-destaque' }, icone('estrela', 'cheio'), 'Destaque'),
        ),
        el('span', { class: 'prato-nome', texto: p.nome }),
        el('span', { class: 'prato-preco', texto: formatarPreco(p.preco) }),
      ),
    ),
  );
}

// ===== janela do prato =====
function buscarDestaques() {
  destaquesPromise ??= listarAvaliacoesDestaque().catch((e) => {
    destaquesPromise = undefined; // permite tentar de novo na próxima abertura
    throw e;
  });
  return destaquesPromise;
}

function limparParametro() {
  history.replaceState(null, '', window.location.pathname);
}

async function abrirPrato(prato) {
  if (!modalPrato) {
    modalPrato = criarModal({ titulo: '' });
    modalPrato.dialog.addEventListener('close', limparParametro);
  }
  history.replaceState(null, '', `?produto=${prato.id}`);

  const secaoAvaliacoes = el(
    'section',
    { class: 'prato-avaliacoes' },
    el('h3', { texto: 'O que os clientes dizem' }),
    el('p', { texto: 'Carregando avaliações…' }),
  );

  modalPrato.definirTitulo(prato.nome);
  modalPrato.conteudo.replaceChildren(
    el(
      'div',
      { class: 'prato-detalhe' },
      el('div', { class: 'prato-foto' }, imagem(prato.foto, prato.nome)),
      el(
        'div',
        { class: 'prato-info' },
        el('span', { class: 'prato-categoria', texto: nomeDaCategoria(prato.categoria) }),
        el('p', { class: 'prato-valor', texto: formatarPreco(prato.preco) }),
        el('p', { class: 'prato-descricao', texto: prato.descricao }),
        el('button', { type: 'button', class: 'btn btn-ambar', onclick: () => abrirAvaliar(prato.id), texto: 'Avaliar este prato' }),
      ),
    ),
    secaoAvaliacoes,
  );
  modalPrato.abrir();

  try {
    const doPrato = (await buscarDestaques()).filter((a) => a.produto.id === prato.id);
    const conteudo =
      doPrato.length === 0
        ? [el('p', { texto: 'Este prato ainda não tem avaliações em destaque. Que tal ser o primeiro?' })]
        : doPrato.map((a) =>
            el(
              'article',
              { class: 'mini-avaliacao' },
              avatarCliente(a.nomeCliente, a.fotoCliente),
              el('div', {}, el('strong', { texto: a.nomeCliente }), ' ', estrelas(a.quantEstrelas), el('p', { texto: a.descricao })),
            ),
          );
    secaoAvaliacoes.replaceChildren(el('h3', { texto: 'O que os clientes dizem' }), ...conteudo);
  } catch {
    secaoAvaliacoes.replaceChildren(el('h3', { texto: 'O que os clientes dizem' }), el('p', { texto: 'Não foi possível carregar as avaliações agora.' }));
  }
}

// ===== início =====
async function iniciar() {
  renderizarAbas();
  grade.replaceChildren(el('div', { class: 'estado-vazio' }, el('p', { texto: 'Carregando o cardápio…' })));
  try {
    produtos = await listarProdutos();
  } catch (e) {
    grade.replaceChildren(el('div', { class: 'estado-vazio' }, el('p', { texto: e.message })));
    return;
  }

  // link vindo do início (?produto=ID): já abre o prato na aba certa
  const idDoLink = Number(new URLSearchParams(window.location.search).get('produto'));
  const doLink = produtos.find((p) => p.id === idDoLink);
  if (doLink) categoriaAtual = doLink.categoria;

  renderizarAbas();
  renderizarGrade();
  if (doLink) abrirPrato(doLink);
}

iniciar();
