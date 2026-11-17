// gerenciamento do token JWT no cliente
const CHAVE = 'dona-cida-admin-token';

export function salvarToken(token) {
  localStorage.setItem(CHAVE, token);
}

export function getToken() {
  return localStorage.getItem(CHAVE);
}

export function removerToken() {
  localStorage.removeItem(CHAVE);
}

export function estaLogado() {
  return !!getToken();
}

// páginas do admin chamam isto no topo: sem token, volta para o login
export function protegerPagina() {
  if (!estaLogado()) window.location.replace('index.html');
}

export function sair() {
  removerToken();
  window.location.href = 'index.html';
}

// decodifica o payload do token (só leitura, sem validar). O backend coloca { id } nele.
export function getUsuarioLogado() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'); // base64url → base64
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}
