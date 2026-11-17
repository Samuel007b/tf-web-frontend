// avaliações aprovadas (GET /avaliacoes/destaque) com filtros "Tudo / Com mídia / Estrelas"
import { listarAvaliacoesDestaque } from './api.js';
import { el, pill, estrelas, hidratarIcones, exibirToast } from './utils.js';
import { abrirAvaliar } from './avaliar.js';
import { avatarCliente, miniaturaMidia, abrirDetalheAvaliacao } from './avaliacao-ui.js';

hidratarIcones();

const filtros = document.getElementById('filtros');
const painelEstrelas = document.getElementById('filtro-estrelas');
const lista = document.getElementById('lista-avaliacoes');
document.getElementById('btn-avaliar').addEventListener('click', () => abrirAvaliar());

let avaliacoes = [];
const estado = { comMidia: false, estrelas: null, mostrandoEstrelas: false };

// ===== filtros =====
function renderizarFiltros() {
  const semFiltro = !estado.comMidia && estado.estrelas == null;
  filtros.replaceChildren(
    pill({
      cor: 'laranja',
      icone: 'img/icone-tudo.png',
      texto: 'Tudo',
      pressionado: semFiltro,
      onclick: () => {
        Object.assign(estado, { comMidia: false, estrelas: null, mostrandoEstrelas: false });
        atualizar();
      },
    }),
    pill({
      cor: 'marrom',
      icone: 'img/icone-midia.png',
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
      icone: 'img/icone-estrela.png',
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
function criarAvaliacao(a) {
  return el(
    'article',
    { class: 'avaliacao' },
    el(
      'button',
      { type: 'button', class: 'balao', onclick: () => abrirDetalheAvaliacao(a), 'aria-label': `Abrir a avaliação de ${a.nomeCliente}` },
      el('p', { class: 'balao-texto', texto: a.descricao }),
      el('div', { class: 'balao-lado' }, a.midia && miniaturaMidia(a.midia), estrelas(a.quantEstrelas)),
    ),
    el('div', { class: 'avaliacao-autor' }, avatarCliente(a.nomeCliente, a.fotoCliente), el('span', { class: 'quem', texto: `${a.nomeCliente} · ${a.produto.nome}` })),
  );
}

function renderizarLista() {
  const visiveis = avaliacoes.filter((a) => (!estado.comMidia || a.midia) && (estado.estrelas == null || a.quantEstrelas === estado.estrelas));
  if (visiveis.length === 0) {
    const vazio = avaliacoes.length === 0 ? 'Ainda não há avaliações por aqui. Seja o primeiro a avaliar!' : 'Nenhuma avaliação com esses filtros.';
    lista.replaceChildren(el('div', { class: 'estado-vazio' }, el('p', { texto: vazio })));
    return;
  }
  lista.replaceChildren(...visiveis.map(criarAvaliacao));
}

function atualizar() {
  renderizarFiltros();
  renderizarLista();
}

async function iniciar() {
  atualizar();
  lista.replaceChildren(el('div', { class: 'estado-vazio' }, el('p', { texto: 'Carregando avaliações…' })));
  try {
    avaliacoes = await listarAvaliacoesDestaque();
    renderizarLista();
  } catch (e) {
    lista.replaceChildren(el('div', { class: 'estado-vazio' }, el('p', { texto: e.message })));
    exibirToast('erro', e.message);
  }
}

iniciar();
