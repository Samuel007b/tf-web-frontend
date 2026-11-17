// painel inicial: prato em destaque, atalhos e janela do usuário
import { listarProdutos } from './api.js';
import { protegerPagina } from './auth.js';
import { el, imagem, hidratarIcones, formatarPreco, criarCarrossel } from './utils.js';
import { abrirModalUsuario, carregarUsuario } from './usuario-modal.js';
import { SITE_PRINCIPAL_URL } from './config.js';

protegerPagina();
hidratarIcones();

document.getElementById('link-site').href = SITE_PRINCIPAL_URL;

const quadro = document.getElementById('carrossel-quadro');
const legenda = document.getElementById('carrossel-legenda');
const anterior = document.getElementById('carrossel-anterior');
const proximo = document.getElementById('carrossel-proximo');
const nomeUsuario = document.getElementById('usuario-nome');

function mostrarNome(usuario) {
  nomeUsuario.textContent = usuario?.nome?.split(' ')[0] ?? 'Usuário';
}

document.getElementById('btn-usuario').addEventListener('click', () => abrirModalUsuario(mostrarNome));
carregarUsuario().then(mostrarNome).catch(() => {});

async function iniciar() {
  let itens;
  try {
    itens = (await listarProdutos()).filter((p) => p.destaque);
  } catch (e) {
    legenda.textContent = e.message;
    quadro.replaceChildren(imagem(null, ''));
    return;
  }
  if (itens.length === 0) {
    legenda.textContent = 'Nenhum prato em destaque. Marque a estrela de um prato no cardápio.';
    quadro.replaceChildren(imagem(null, ''));
    anterior.disabled = proximo.disabled = true;
    return;
  }

  criarCarrossel({
    quadro,
    anterior,
    proximo,
    itens,
    criarSlide: (prato) => imagem(prato.foto, prato.nome),
    aoMudar: (prato) => {
      legenda.replaceChildren(`Prato Destaque: ${prato.nome}`, el('br'), el('small', { texto: formatarPreco(prato.preco) }));
    },
  });
}

iniciar();
