// janela "Avaliar um prato" — usada no cardápio e na página de avaliações
import { listarProdutos, criarAvaliacao } from './api.js';
import { CATEGORIAS, el, exibirToast, criarModal, criarCampoUpload } from './utils.js';

let modal;
let formulario;
let selectPrato;
let erro;
let botaoEnviar;
let uploadFoto;
let uploadMidia;
let pratosCarregados = false;

function montar() {
  modal = criarModal({ titulo: 'Avalie um prato' });

  selectPrato = el('select', { id: 'av-prato', name: 'produtoId', required: true });
  const campoPrato = el('div', { class: 'campo' }, el('label', { for: 'av-prato', texto: 'Qual prato você quer avaliar?' }), selectPrato);

  // estrelas: radios invertidos (5 → 1) para o CSS pintar "da esquerda até a escolhida"
  const opcoes = el('div', { class: 'nota-opcoes' });
  for (const n of [5, 4, 3, 2, 1]) {
    opcoes.append(
      el('input', { type: 'radio', name: 'nota', id: `av-nota-${n}`, value: n }),
      el('label', { for: `av-nota-${n}`, title: `${n} ${n === 1 ? 'estrela' : 'estrelas'}` }, '★', el('span', { class: 'so-leitor', texto: `${n} ${n === 1 ? 'estrela' : 'estrelas'}` })),
    );
  }
  const campoNota = el('fieldset', { class: 'campo' }, el('legend', { texto: 'Sua nota' }), opcoes);

  const campoComentario = el(
    'div',
    { class: 'campo' },
    el('label', { for: 'av-comentario', texto: 'Conte como foi' }),
    el('textarea', { id: 'av-comentario', name: 'descricao', maxlength: 500, required: true, placeholder: 'O tempero, o atendimento, o que você mais gostou…' }),
  );

  const campoNome = el(
    'div',
    { class: 'campo' },
    el('label', { for: 'av-nome', texto: 'Seu nome' }),
    el('input', { type: 'text', id: 'av-nome', name: 'nomeCliente', maxlength: 80, required: true, autocomplete: 'name' }),
  );

  const foto = criarCampoUpload({ rotulo: 'Sua foto (opcional)', soImagens: true });
  const midiaCampo = criarCampoUpload({ rotulo: 'Foto ou vídeo do prato (opcional)' });
  uploadFoto = foto.uploader;
  uploadMidia = midiaCampo.uploader;

  erro = el('p', { class: 'erro', role: 'alert' });
  botaoEnviar = el('button', { type: 'submit', class: 'btn', texto: 'Publicar avaliação' });

  formulario = el(
    'form',
    { novalidate: true },
    campoPrato,
    campoNota,
    campoComentario,
    campoNome,
    foto.campo,
    midiaCampo.campo,
    erro,
    el(
      'div',
      { class: 'acoes-form' },
      el('button', { type: 'button', class: 'btn btn-claro', onclick: () => modal.fechar(), texto: 'Cancelar' }),
      botaoEnviar,
    ),
  );
  formulario.addEventListener('submit', enviar);
  modal.conteudo.append(formulario);
}

async function carregarPratos() {
  if (pratosCarregados) return;
  const produtos = await listarProdutos();
  selectPrato.append(el('option', { value: '', texto: 'Escolha um prato…' }));
  for (const categoria of CATEGORIAS) {
    const doGrupo = produtos.filter((p) => p.categoria === categoria.valor);
    if (doGrupo.length === 0) continue;
    selectPrato.append(
      el('optgroup', { label: categoria.nome }, doGrupo.map((p) => el('option', { value: p.id, texto: p.nome }))),
    );
  }
  pratosCarregados = true;
}

async function enviar(evento) {
  evento.preventDefault();
  erro.textContent = '';

  const produtoId = Number(selectPrato.value);
  const nota = formulario.querySelector('input[name="nota"]:checked')?.value;
  const descricao = formulario.elements.descricao.value.trim();
  const nomeCliente = formulario.elements.nomeCliente.value.trim();

  if (!produtoId) return void (erro.textContent = 'Escolha o prato que você quer avaliar.');
  if (!nota) return void (erro.textContent = 'Escolha de 1 a 5 estrelas.');
  if (!descricao) return void (erro.textContent = 'Conte como foi a sua experiência.');
  if (!nomeCliente) return void (erro.textContent = 'Informe o seu nome.');

  botaoEnviar.disabled = true;
  botaoEnviar.textContent = 'Enviando…';
  try {
    const [fotoCliente, midia] = await Promise.all([uploadFoto.obterUrl(), uploadMidia.obterUrl()]);
    await criarAvaliacao({
      produtoId,
      quantEstrelas: Number(nota),
      descricao,
      nomeCliente,
      fotoCliente: fotoCliente ?? undefined,
      midia: midia ?? undefined,
    });
    formulario.reset();
    uploadFoto.limpar();
    uploadMidia.limpar();
    modal.fechar();
    exibirToast('sucesso', 'Obrigado! Sua avaliação foi enviada e aparece aqui assim que a Dona Cida aprovar.');
  } catch (e) {
    erro.textContent = e.message;
  } finally {
    botaoEnviar.disabled = false;
    botaoEnviar.textContent = 'Publicar avaliação';
  }
}

// produtoId opcional: já deixa o prato selecionado (ex.: vindo da janela do prato)
export async function abrirAvaliar(produtoId) {
  if (!modal) montar();
  try {
    await carregarPratos();
  } catch (e) {
    exibirToast('erro', e.message);
    return;
  }
  selectPrato.value = produtoId ? String(produtoId) : '';
  erro.textContent = '';
  modal.abrir();
}
