// janela do administrador logado: editar os próprios dados e sair
import { buscarUsuario, atualizarUsuario } from './api.js';
import { getUsuarioLogado, sair } from './auth.js';
import { el, criarModal, exibirToast } from './utils.js';

let modal;
let form;
let erro;
let botaoSalvar;
let usuario;

function campo(id, rotulo, tipo, valor = '', extra = {}) {
  return el('div', { class: 'campo' }, el('label', { for: id, texto: rotulo }), el('input', { id, name: id, type: tipo, value: valor, ...extra }));
}

function montar() {
  modal = criarModal({ titulo: 'Meus dados', estreito: true });
  erro = el('p', { class: 'erro', role: 'alert' });
  botaoSalvar = el('button', { type: 'submit', class: 'btn', texto: 'Salvar' });
  form = el('form', { novalidate: true });
  form.addEventListener('submit', salvar);
  modal.conteudo.append(form);
}

function preencher() {
  form.replaceChildren(
    campo('login', 'Usuário (login)', 'text', usuario.login, { required: true, autocomplete: 'username' }),
    campo('nome', 'Nome', 'text', usuario.nome, { required: true, autocomplete: 'name' }),
    campo('email', 'E-mail', 'email', usuario.email, { required: true, autocomplete: 'email' }),
    campo('senha', 'Nova senha', 'password', '', { autocomplete: 'new-password', minlength: 6, placeholder: 'Deixe em branco para manter a atual' }),
    erro,
    el(
      'div',
      { class: 'acoes-form' },
      el('button', { type: 'button', class: 'btn btn-claro', onclick: sair, texto: 'Sair da conta' }),
      botaoSalvar,
    ),
  );
}

async function salvar(evento) {
  evento.preventDefault();
  erro.textContent = '';
  const dados = {
    login: form.elements.login.value.trim(),
    nome: form.elements.nome.value.trim(),
    email: form.elements.email.value.trim(),
  };
  const senha = form.elements.senha.value;
  if (senha) {
    if (senha.length < 6) return void (erro.textContent = 'A nova senha precisa ter pelo menos 6 caracteres.');
    dados.senha = senha;
  }
  if (!dados.login || !dados.nome || !dados.email) return void (erro.textContent = 'Preencha usuário, nome e e-mail.');

  botaoSalvar.disabled = true;
  try {
    usuario = await atualizarUsuario(usuario.id, dados);
    exibirToast('sucesso', 'Dados atualizados.');
    modal.fechar();
    aoAtualizar?.(usuario);
  } catch (e) {
    erro.textContent = e.message;
  } finally {
    botaoSalvar.disabled = false;
  }
}

let aoAtualizar;

// devolve os dados do usuário (ou null se não conseguiu carregar)
export async function carregarUsuario() {
  const id = getUsuarioLogado()?.id;
  if (!id) return null;
  usuario = await buscarUsuario(id);
  return usuario;
}

export async function abrirModalUsuario(callback) {
  aoAtualizar = callback;
  if (!modal) montar();
  try {
    if (!usuario) await carregarUsuario();
  } catch (e) {
    exibirToast('erro', e.message);
    return;
  }
  if (!usuario) return exibirToast('erro', 'Não foi possível identificar o usuário. Entre novamente.');
  preencher();
  modal.abrir();
}
