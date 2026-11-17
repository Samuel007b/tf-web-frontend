// camada de serviço — tudo que fala com a API mora aqui
import { API_URL } from './config.js';
import { getToken, removerToken } from './auth.js';

async function pedir(caminho, { metodo = 'GET', corpo, autenticado = true } = {}) {
  const headers = {};
  if (corpo !== undefined) headers['Content-Type'] = 'application/json';
  if (autenticado) headers.Authorization = `Bearer ${getToken()}`;

  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Tente de novo em instantes.');
  }

  // 401 numa rota protegida = sessão expirada: desloga e volta para o login
  if (resposta.status === 401 && autenticado) {
    removerToken();
    window.location.href = 'index.html';
    throw new Error('Sessão expirada. Entre novamente.');
  }
  if (!resposta.ok) {
    let mensagem = 'Algo deu errado. Tente de novo.';
    try {
      mensagem = (await resposta.json()).erro ?? mensagem; // o backend responde { erro: "..." }
    } catch {
      /* corpo sem JSON */
    }
    throw new Error(mensagem);
  }
  return resposta.status === 204 ? null : resposta.json();
}

// ===== Auth =====
export function login(loginUsuario, senha) {
  return pedir('/user/login', { metodo: 'POST', corpo: { login: loginUsuario, senha }, autenticado: false });
}

// ===== Usuário administrativo =====
export const buscarUsuario = (id) => pedir(`/user/${id}`);
export const atualizarUsuario = (id, dados) => pedir(`/user/${id}`, { metodo: 'PUT', corpo: dados });

// ===== Produtos =====
export const listarProdutos = () => pedir('/produtos', { autenticado: false });
export const buscarProduto = (id) => pedir(`/produtos/${id}`, { autenticado: false });
export const criarProduto = (dados) => pedir('/produtos', { metodo: 'POST', corpo: dados });
export const atualizarProduto = (id, dados) => pedir(`/produtos/${id}`, { metodo: 'PUT', corpo: dados });
export const deletarProduto = (id) => pedir(`/produtos/${id}`, { metodo: 'DELETE' });

// ===== Avaliações =====
export const listarAvaliacoes = () => pedir('/avaliacoes');
// PUT /avaliacoes/:id não recebe corpo: o backend inverte o "destaque" (aprova/retira do site)
export const alternarDestaqueAvaliacao = (id) => pedir(`/avaliacoes/${id}`, { metodo: 'PUT' });
export const deletarAvaliacao = (id) => pedir(`/avaliacoes/${id}`, { metodo: 'DELETE' });
