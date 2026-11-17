// camada de serviço — tudo que fala com a API mora aqui (rotas públicas do backend)
import { API_URL } from './config.js';

async function pedir(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, opcoes);
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Tente de novo em instantes.');
  }
  if (!resposta.ok) {
    let mensagem = 'Algo deu errado. Tente de novo.';
    try {
      mensagem = (await resposta.json()).erro ?? mensagem; // o backend responde { erro: "..." }
    } catch {
      /* corpo sem JSON: mantém a mensagem padrão */
    }
    throw new Error(mensagem);
  }
  return resposta.status === 204 ? null : resposta.json();
}

// ===== Produtos (GET /produtos é público) =====
export function listarProdutos() {
  return pedir('/produtos');
}

// ===== Avaliações =====
// GET /avaliacoes/destaque é público: só traz as avaliações que a Dona Cida aprovou
export function listarAvaliacoesDestaque() {
  return pedir('/avaliacoes/destaque');
}

// POST /avaliacoes é público; a avaliação nasce sem destaque e só aparece no site depois de aprovada
export function criarAvaliacao(dados) {
  return pedir('/avaliacoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
}
