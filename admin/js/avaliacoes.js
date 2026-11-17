// avaliações no admin: listar, filtrar, ver detalhes, aprovar (destaque) e excluir
import { listarAvaliacoes, alternarDestaqueAvaliacao, deletarAvaliacao } from './api.js';
import { protegerPagina } from './auth.js';
import { el, icone, pill, estrelas, hidratarIcones, exibirToast, criarModal, confirmar, midia, formatarData, nomeDaCategoria } from './utils.js';

protegerPagina();
hidratarIcones();

const filtros = document.getElementById('filtros');
const painelEstrelas = document.getElementById('filtro-estrelas');
const lista = document.getElementById('lista');

let avaliacoes = [];
const estado = { comMidia: false, estrelas: null, mostrandoEstrelas: false };

// ===== filtros =====
function renderizarFiltros() {
  const semFiltro = !estado.comMidia && estado.estrelas == null;
  filtros.replaceChildren(
    pill({
      cor: 'laranja',
      icone: '../img/icone-tudo.png',
      texto: 'Tudo',
      pressionado: semFiltro,
      onclick: () => {
        Object.assign(estado, { comMidia: false, estrelas: null, mostrandoEstrelas: false });
        atualizar();
      },
    }),
    pill({
      cor: 'marrom',
      icone: '../img/icone-midia.png',
      comBorda: true,
      texto: 'Com mídia',
      pressionado: estado.comMidia,
      onclick: () => {
        estado.comMidia = !estado.comMidia;
        atualizar();
      },
    }),
    pill({
      cor: 'ambar',
      icone: '../img/icone-estrela.png',
      comBorda: true,
      texto: estado.estrelas ? `${estado.estrelas} estrelas` : 'Estrelas',
      pressionado: estado.estrelas != null || estado.mostrandoEstrelas,
      onclick: () => {
        estado.mostrandoEstrelas = !estado.mostrandoEstrelas;
        atualizar();
      },
    }),
  );

  painelEstrelas.hidden = !estado.mostrandoEstrelas;
  painelEstrelas.replaceChildren(
    ...[5, 4, 3, 2, 1].map((n) =>
      el(
        'button',
        {
          type: 'button',
          class: 'chip-estrela',
          'aria-pressed': String(estado.estrelas === n),
          'aria-label': `${n} ${n === 1 ? 'estrela' : 'estrelas'}`,
          onclick: () => {
            estado.estrelas = estado.estrelas === n ? null : n;
            atualizar();
          },
        },
        el('span', { class: 'estrelas', 'aria-hidden': 'true', texto: '★'.repeat(n) }),
      ),
    ),
  );
}

// ===== lista =====
function criarLinha(a) {
  return el(
    'div',
    { class: 'linha linha-avaliacao' },
    icone('menu'),
    el('span', { class: 'id', texto: a.id }),
    el('span', { class: 'nome', title: a.nomeCliente, texto: a.nomeCliente }),
    el('span', { class: 'descricao', title: a.descricao, texto: a.descricao }),
    el(
      'div',
      { class: 'nota-e-selo' },
      a.destaque && el('span', { class: 'selo-site', texto: 'No site' }),
      el('span', { class: 'nota' }, `${a.quantEstrelas}`, icone('estrela')),
      el('button', { type: 'button', class: 'btn-icone', 'aria-label': `Ver avaliação de ${a.nomeCliente}`, title: 'Ver avaliação', onclick: () => abrirDetalhe(a) }, icone('olho')),
    ),
  );
}

function renderizarLista() {
  const visiveis = avaliacoes.filter((a) => (!estado.comMidia || a.midia) && (estado.estrelas == null || a.quantEstrelas === estado.estrelas));
  if (visiveis.length === 0) {
    lista.replaceChildren(el('p', { class: 'estado-lista', texto: avaliacoes.length === 0 ? 'Ainda não há avaliações.' : 'Nenhuma avaliação com esses filtros.' }));
    return;
  }
  lista.replaceChildren(...visiveis.map(criarLinha));
}

function atualizar() {
  renderizarFiltros();
  renderizarLista();
}

// ===== janela de detalhes =====
let modal;

function abrirDetalhe(a) {
  if (!modal) modal = criarModal({ titulo: 'Avaliação', estreito: true });

  const avatar = a.fotoCliente
    ? el('img', { class: 'avatar', src: a.fotoCliente, alt: `Foto de ${a.nomeCliente}` })
    : el('span', { class: 'avatar-inicial', 'aria-hidden': 'true', texto: (a.nomeCliente.trim()[0] ?? '?').toUpperCase() });
  avatar.addEventListener?.('error', () => avatar.replaceWith(el('span', { class: 'avatar-inicial', 'aria-hidden': 'true', texto: (a.nomeCliente.trim()[0] ?? '?').toUpperCase() })), { once: true });

  const botaoDestaque = el('button', {
    type: 'button',
    class: `btn ${a.destaque ? 'btn-claro' : 'btn-ambar'}`,
    texto: a.destaque ? 'Retirar do site' : 'Exibir no site',
    onclick: async () => {
      botaoDestaque.disabled = true;
      try {
        const atualizada = await alternarDestaqueAvaliacao(a.id);
        a.destaque = atualizada.destaque;
        exibirToast('sucesso', a.destaque ? 'Avaliação publicada no site.' : 'Avaliação retirada do site.');
        modal.fechar();
        atualizar();
      } catch (e) {
        exibirToast('erro', e.message);
        botaoDestaque.disabled = false;
      }
    },
  });

  modal.conteudo.replaceChildren(
    el(
      'div',
      { class: 'avaliacao-detalhe' },
      el(
        'div',
        { class: 'cabecalho' },
        avatar,
        el('div', {}, el('strong', { texto: a.nomeCliente }), el('div', { class: 'meta', texto: `${formatarData(a.criadoEm)} · avaliação nº ${a.id}` })),
      ),
      el('div', { class: 'meta', texto: `Prato: ${a.produto.nome} (${nomeDaCategoria(a.produto.categoria)})` }),
      estrelas(a.quantEstrelas),
      el('blockquote', { texto: a.descricao }),
      a.midia && midia(a.midia, 'midia-grande'),
      el('p', { class: 'meta', texto: a.destaque ? 'Esta avaliação aparece no site.' : 'Esta avaliação ainda não aparece no site.' }),
      el(
        'div',
        { class: 'acoes-form' },
        el('button', { type: 'button', class: 'btn btn-perigo', onclick: () => excluir(a), texto: 'Excluir' }),
        botaoDestaque,
      ),
    ),
  );
  modal.abrir();
}

async function excluir(a) {
  const ok = await confirmar({
    titulo: 'Excluir avaliação?',
    mensagem: `A avaliação de ${a.nomeCliente} será apagada de vez. Isso não pode ser desfeito.`,
    rotulo: 'Excluir avaliação',
  });
  if (!ok) return;
  try {
    await deletarAvaliacao(a.id);
    avaliacoes = avaliacoes.filter((x) => x.id !== a.id);
    modal.fechar();
    renderizarLista();
    exibirToast('sucesso', 'Avaliação excluída.');
  } catch (e) {
    exibirToast('erro', e.message);
  }
}

async function iniciar() {
  atualizar();
  lista.replaceChildren(el('p', { class: 'estado-lista', texto: 'Carregando avaliações…' }));
  try {
    avaliacoes = await listarAvaliacoes();
    renderizarLista();
  } catch (e) {
    lista.replaceChildren(el('p', { class: 'estado-lista', texto: e.message }));
  }
}

iniciar();
