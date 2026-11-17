// início: carrossel dos pratos em destaque (GET /produtos → destaque === true)
import { listarProdutos } from './api.js';
import { el, imagem, hidratarIcones, criarCarrossel } from './utils.js';

hidratarIcones();

const quadro = document.getElementById('carrossel-quadro');
const legenda = document.getElementById('carrossel-legenda');
const anterior = document.getElementById('carrossel-anterior');
const proximo = document.getElementById('carrossel-proximo');

async function iniciar() {
  let itens;
  try {
    const produtos = await listarProdutos();
    itens = produtos.filter((p) => p.destaque);
    if (itens.length === 0) itens = produtos.slice(0, 6); // ainda sem destaques: mostra os primeiros
  } catch {
    legenda.textContent = 'Não foi possível carregar os pratos agora.';
    quadro.replaceChildren(imagem(null, ''));
    return;
  }

  if (itens.length === 0) {
    legenda.textContent = 'O cardápio está sendo preparado.';
    quadro.replaceChildren(imagem(null, ''));
    return;
  }

  criarCarrossel({
    quadro,
    anterior,
    proximo,
    itens,
    // cada slide leva ao prato no cardápio
    criarSlide: (prato) =>
      el('a', { href: `cardapio.html?produto=${prato.id}`, 'aria-label': `Ver ${prato.nome} no cardápio` }, imagem(prato.foto, prato.nome)),
    aoMudar: (prato) => {
      legenda.textContent = prato.nome;
    },
  });
}

iniciar();
