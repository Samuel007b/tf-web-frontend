// contato: monta os links (WhatsApp/Instagram) a partir do config.js e a faixa de "posts"
import { WHATSAPP_NUMERO, WHATSAPP_MENSAGEM, INSTAGRAM_URL, POSTS_INSTAGRAM } from './config.js';
import { el, icone, hidratarIcones } from './utils.js';

hidratarIcones();

document.getElementById('link-whatsapp').href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`;
document.getElementById('link-instagram').href = INSTAGRAM_URL;

document.getElementById('posts').replaceChildren(
  ...POSTS_INSTAGRAM.map((post) =>
    el(
      'a',
      { class: 'polaroid', href: INSTAGRAM_URL, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `Ver no Instagram: ${post.alt}` },
      el('img', { src: post.img, alt: post.alt, loading: 'lazy' }),
      el('div', { class: 'polaroid-rodape' }, icone('coracao', 'coracao'), icone('comentario'), icone('enviar'), icone('salvar', 'salvar')),
    ),
  ),
);
