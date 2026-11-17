// ===== configurações do site principal =====
// Troque aqui o que muda de ambiente para ambiente (nada disso está espalhado pelo código).

// API do backend (tf-web-backend). Para testar com o backend local: 'http://localhost:3000'
export const API_URL = 'https://restaurante-dona-cida-backend.vercel.app';

// TODO: preencher com os dados reais da Dona Cida
// WhatsApp no formato internacional, só dígitos: 55 + DDD + número
export const WHATSAPP_NUMERO = '5538999040009';
export const WHATSAPP_MENSAGEM = 'Olá! Gostaria de fazer um pedido.';
export const INSTAGRAM_URL = 'https://www.instagram.com/';

// Fotos da seção "Conheça nossa página" (contato.html).
// Por enquanto são imagens de exemplo; troque pelos prints/fotos reais do Instagram.
export const POSTS_INSTAGRAM = [
  { img: 'img/post-1.png', alt: 'Feijoada, couve e farofa' },
  { img: 'img/post-2.png', alt: 'Coxinhas douradas' },
  { img: 'img/post-3.png', alt: 'Dona Cida' },
  { img: 'img/post-4.png', alt: 'Feijoada e vinagrete' },
];
