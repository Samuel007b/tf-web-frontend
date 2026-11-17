// peças de interface de avaliação usadas em mais de uma página
import { el, estrelas, formatarData, criarModal, midia } from './utils.js';

export function avatarCliente(nome, foto) {
  if (foto) {
    const img = el('img', { src: foto, alt: `Foto de ${nome}`, class: 'avatar', loading: 'lazy' });
    img.addEventListener('error', () => img.replaceWith(avatarCliente(nome, null)), { once: true });
    return img;
  }
  return el('span', { class: 'avatar-inicial', 'aria-hidden': 'true', texto: (nome?.trim()[0] ?? '?').toUpperCase() });
}

// miniatura da mídia dentro do balão (se não carregar como imagem, assume vídeo)
export function miniaturaMidia(url) {
  const img = el('img', { src: url, alt: 'Mídia enviada pelo cliente', class: 'balao-midia', loading: 'lazy' });
  img.addEventListener(
    'error',
    () => img.replaceWith(el('span', { class: 'balao-midia balao-midia-video', 'aria-label': 'Vídeo enviado pelo cliente', texto: '▶' })),
    { once: true },
  );
  return img;
}

let modal;

// janela para ver uma avaliação completa
export function abrirDetalheAvaliacao(avaliacao) {
  if (!modal) modal = criarModal({ titulo: 'Avaliação', estreito: true });
  modal.conteudo.replaceChildren(
    el(
      'div',
      { class: 'avaliacao-detalhe' },
      el(
        'div',
        { class: 'cabecalho' },
        avatarCliente(avaliacao.nomeCliente, avaliacao.fotoCliente),
        el(
          'div',
          {},
          el('strong', { texto: avaliacao.nomeCliente }),
          el('div', { class: 'meta', texto: `sobre ${avaliacao.produto.nome} · ${formatarData(avaliacao.criadoEm)}` }),
        ),
      ),
      estrelas(avaliacao.quantEstrelas),
      el('blockquote', { texto: avaliacao.descricao }),
      avaliacao.midia && midia(avaliacao.midia, 'midia-grande'),
    ),
  );
  modal.abrir();
}
