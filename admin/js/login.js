import { login } from './api.js';
import { estaLogado, salvarToken } from './auth.js';
import { exibirToast } from './utils.js';

// já está logado? vai direto para o painel
if (estaLogado()) window.location.replace('painel.html');

const form = document.querySelector('form');
const erro = document.getElementById('erro');
const botao = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const usuario = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value;

  if (!usuario || !senha) {
    erro.textContent = 'Preencha usuário e senha.';
    return;
  }
  erro.textContent = '';
  botao.disabled = true;
  try {
    const { token } = await login(usuario, senha);
    salvarToken(token);
    window.location.href = 'painel.html';
  } catch (e) {
    erro.textContent = e.message === 'Credenciais inválidas' ? 'Usuário ou senha incorretos.' : e.message;
    exibirToast('erro', erro.textContent);
    botao.disabled = false;
  }
});
