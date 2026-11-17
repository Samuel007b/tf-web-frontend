// cardápio do admin: listar por categoria, criar, editar, destacar (estrela) e excluir
import { listarProdutos, buscarProduto, criarProduto, atualizarProduto, deletarProduto } from './api.js';
import { protegerPagina } from './auth.js';
import { CATEGORIAS, el, icone, pill, hidratarIcones, formatarPreco, exibirToast, criarModal, confirmar, criarCampoUpload, imagem } from './utils.js';

protegerPagina();
hidratarIcones();

const abas = document.getElementById('abas');
const lista = document.getElementById('lista');
document.getElementById('btn-novo').addEventListener('click', () => abrirFormulario(null));

let produtos = [];
let categoriaAtual = 'PRATO_FEITO';

// ===== abas e lista =====
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
          renderizarLista();
        },
      }),
    ),
  );
}

function criarLinha(p) {
  const botaoDestaque = el(
    'button',
    {
      type: 'button',
      class: 'btn-icone btn-destaque',
      'aria-pressed': String(p.destaque),
      'aria-label': p.destaque ? `Tirar ${p.nome} dos destaques` : `Destacar ${p.nome}`,
      title: p.destaque ? 'Prato em destaque (clique para retirar)' : 'Destacar este prato',
      onclick: () => alternarDestaque(p),
    },
    icone('estrela'),
  );
  return el(
    'div',
    { class: 'linha' },
    icone('menu'),
    el('span', { class: 'id', texto: p.id }),
    el('span', { class: 'nome', title: p.nome, texto: p.nome }),
    el('span', { class: 'preco', texto: formatarPreco(p.preco) }),
    el(
      'div',
      { class: 'acoes' },
      el('button', { type: 'button', class: 'btn-icone', 'aria-label': `Editar ${p.nome}`, title: 'Editar', onclick: () => abrirFormulario(p) }, icone('editar')),
      botaoDestaque,
      el('button', { type: 'button', class: 'btn-icone', 'aria-label': `Excluir ${p.nome}`, title: 'Excluir', onclick: () => excluir(p) }, icone('lixeira')),
    ),
  );
}

function renderizarLista() {
  const doGrupo = produtos.filter((p) => p.categoria === categoriaAtual);
  if (doGrupo.length === 0) {
    lista.replaceChildren(el('p', { class: 'estado-lista', texto: 'Nenhum prato nesta categoria. Use o botão + para cadastrar o primeiro.' }));
    return;
  }
  lista.replaceChildren(...doGrupo.map(criarLinha));
}

async function recarregar() {
  produtos = await listarProdutos();
  renderizarLista();
}

// ===== ações =====
async function alternarDestaque(p) {
  try {
    await atualizarProduto(p.id, { destaque: !p.destaque });
    p.destaque = !p.destaque;
    renderizarLista();
    exibirToast('sucesso', p.destaque ? `${p.nome} agora é destaque.` : `${p.nome} saiu dos destaques.`);
  } catch (e) {
    exibirToast('erro', e.message);
  }
}

async function excluir(p) {
  const ok = await confirmar({
    titulo: 'Excluir prato?',
    mensagem: `"${p.nome}" será removido do cardápio, junto com todas as avaliações dele. Isso não pode ser desfeito.`,
    rotulo: 'Excluir prato',
  });
  if (!ok) return;
  try {
    await deletarProduto(p.id);
    produtos = produtos.filter((x) => x.id !== p.id);
    renderizarLista();
    exibirToast('sucesso', 'Prato excluído.');
  } catch (e) {
    exibirToast('erro', e.message);
  }
}

// ===== janela de criar/editar prato =====
let modal;
let form;
let erro;
let botaoSalvar;
let previa;
let resumo;
let uploader;
let editando = null;

function montarFormulario() {
  modal = criarModal({ titulo: '' });

  resumo = el('p', { class: 'resumo-prato', hidden: true });
  previa = el('img', { class: 'foto-previa', alt: 'Foto atual do prato', hidden: true });
  const upload = criarCampoUpload({ rotulo: 'Foto do prato', soImagens: true });
  uploader = upload.uploader;
  const campoUrl = el(
    'div',
    { class: 'campo' },
    el('label', { for: 'foto-url', texto: 'Ou cole o link de uma imagem' }),
    el('input', { type: 'text', id: 'foto-url', name: 'fotoUrl', placeholder: 'https://…', inputmode: 'url' }),
  );

  erro = el('p', { class: 'erro', role: 'alert' });
  botaoSalvar = el('button', { type: 'submit', class: 'btn', texto: 'Salvar' });

  form = el(
    'form',
    { novalidate: true },
    resumo,
    el('div', { class: 'campo' }, el('label', { for: 'nome', texto: 'Nome do prato' }), el('input', { type: 'text', id: 'nome', name: 'nome', maxlength: 120, required: true })),
    el(
      'div',
      { class: 'campos-duplos' },
      el(
        'div',
        { class: 'campo' },
        el('label', { for: 'categoria', texto: 'Categoria' }),
        el('select', { id: 'categoria', name: 'categoria', required: true }, CATEGORIAS.map((c) => el('option', { value: c.valor, texto: c.nome }))),
      ),
      el('div', { class: 'campo' }, el('label', { for: 'preco', texto: 'Preço (R$)' }), el('input', { type: 'number', id: 'preco', name: 'preco', min: '0.01', step: '0.01', inputmode: 'decimal', required: true })),
    ),
    el('div', { class: 'campo' }, el('label', { for: 'descricao', texto: 'Descrição' }), el('textarea', { id: 'descricao', name: 'descricao', required: true })),
    previa,
    upload.campo,
    campoUrl,
    erro,
    el('div', { class: 'acoes-form' }, el('button', { type: 'button', class: 'btn btn-claro', onclick: () => modal.fechar(), texto: 'Cancelar' }), botaoSalvar),
  );
  form.addEventListener('submit', salvar);
  modal.conteudo.append(form);
}

async function abrirFormulario(produto) {
  if (!modal) montarFormulario();
  editando = produto;
  erro.textContent = '';
  form.reset();
  uploader.limpar();
  modal.definirTitulo(produto ? 'Editar prato' : 'Novo prato');

  form.elements.nome.value = produto?.nome ?? '';
  form.elements.categoria.value = produto?.categoria ?? categoriaAtual;
  form.elements.preco.value = produto ? Number(produto.preco).toFixed(2) : '';
  form.elements.descricao.value = produto?.descricao ?? '';
  previa.hidden = !produto;
  if (produto) previa.src = produto.foto;
  resumo.hidden = true;
  modal.abrir();

  if (produto) {
    // resumo das avaliações do prato (rota pública /produtos/:id traz as avaliações)
    try {
      const { avaliacoes } = await buscarProduto(produto.id);
      if (editando?.id !== produto.id) return;
      resumo.hidden = false;
      if (avaliacoes.length === 0) {
        resumo.textContent = 'Este prato ainda não recebeu avaliações.';
      } else {
        const media = avaliacoes.reduce((soma, a) => soma + a.quantEstrelas, 0) / avaliacoes.length;
        resumo.textContent = `${avaliacoes.length} ${avaliacoes.length === 1 ? 'avaliação' : 'avaliações'} · média ${media.toFixed(1).replace('.', ',')} de 5 estrelas`;
      }
    } catch {
      /* o resumo é opcional */
    }
  }
}

async function salvar(evento) {
  evento.preventDefault();
  erro.textContent = '';
  const dados = {
    nome: form.elements.nome.value.trim(),
    categoria: form.elements.categoria.value,
    preco: form.elements.preco.value,
    descricao: form.elements.descricao.value.trim(),
  };
  if (!dados.nome || !dados.descricao) return void (erro.textContent = 'Preencha nome e descrição.');
  if (!(Number(dados.preco) > 0)) return void (erro.textContent = 'Informe um preço maior que zero.');

  botaoSalvar.disabled = true;
  botaoSalvar.textContent = 'Salvando…';
  try {
    // prioridade: foto enviada agora > link colado > foto que o prato já tinha
    dados.foto = (await uploader.obterUrl()) || form.elements.fotoUrl.value.trim() || editando?.foto;
    if (!dados.foto) throw new Error('Envie uma foto do prato (ou cole o link de uma imagem).');

    if (editando) {
      await atualizarProduto(editando.id, dados);
      exibirToast('sucesso', 'Prato atualizado.');
    } else {
      await criarProduto(dados);
      exibirToast('sucesso', 'Prato cadastrado.');
    }
    categoriaAtual = dados.categoria;
    modal.fechar();
    renderizarAbas();
    await recarregar();
  } catch (e) {
    erro.textContent = e.message;
  } finally {
    botaoSalvar.disabled = false;
    botaoSalvar.textContent = 'Salvar';
  }
}

async function iniciar() {
  renderizarAbas();
  lista.replaceChildren(el('p', { class: 'estado-lista', texto: 'Carregando cardápio…' }));
  try {
    await recarregar();
  } catch (e) {
    lista.replaceChildren(el('p', { class: 'estado-lista', texto: e.message }));
  }
}

iniciar();
