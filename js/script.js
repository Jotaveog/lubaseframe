'use strict';

// Links e configurações principais.
const WHATSAPP_URL = 'https://wa.me/5527992453398';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');

// Cabeçalho e menu móvel (Escape, clique fora e fechamento ao navegar).
function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu.classList.toggle('open', open);
  header.classList.toggle('menu-open', open);
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', event => { if (!header.contains(event.target)) setMenu(false); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') { setMenu(false); menuToggle.focus(); }
});
header.addEventListener('focusout', event => { if (!header.contains(event.relatedTarget)) setMenu(false); });
window.matchMedia('(min-width: 801px)').addEventListener('change', () => setMenu(false));
const navLinks = [...menu.querySelectorAll('a:not(.header-cta)')];
const navSections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
let scrollPending = false;
function updateScroll() {
  header.classList.toggle('scrolled', window.scrollY > 30);
  let current = navSections[0];
  navSections.forEach(section => { if (section.getBoundingClientRect().top <= 180) current = section; });
  navLinks.forEach(link => {
    if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollPending = false;
}
window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); } }, { passive: true });
updateScroll();

// Revelação discreta; o conteúdo permanece visível sem JavaScript.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(element => { element.classList.add('ready'); observer.observe(element); });
}

// Filtros: categorias sem projetos mostram um estado vazio explícito.
const projects = [...document.querySelectorAll('.project')];
const filters = [...document.querySelectorAll('[data-filter]')];
filters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  projects.forEach(project => { project.hidden = filter !== 'todos' && project.dataset.category !== filter; if (!project.hidden) count++; });
  document.querySelector('.portfolio-grid').classList.toggle('filtered', filter !== 'todos');
  document.querySelector('.filter-status').textContent = count ? `${count} ${count === 1 ? 'projeto demonstrativo' : 'projetos demonstrativos'}` : 'Novas histórias desta categoria serão adicionadas em breve.';
}));

// Modal: MP4 local, YouTube e Vimeo. Nenhum vídeo externo é carregado antes do clique.
const modal = document.querySelector('#video-modal');
const videoContainer = document.querySelector('#video-container');
const externalVideo = document.querySelector('#video-external');
let videoTrigger = null;
function showVideoMessage(title, message) {
  const box = document.createElement('div'); box.className = 'modal-placeholder';
  const heading = document.createElement('h3'); heading.textContent = title;
  const description = document.createElement('p'); description.textContent = message;
  box.append(heading, description); videoContainer.replaceChildren(box);
}
function getVideoSource(source) {
  const url = new URL(source, window.location.href);
  if (!['http:', 'https:', 'file:'].includes(url.protocol)) throw new Error('Protocolo não aceito');
  if (/\.mp4$/i.test(url.pathname)) return { type: 'local', url: url.href };
  const youtubeHosts = ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'youtube-nocookie.com', 'youtu.be'];
  if (youtubeHosts.includes(url.hostname)) {
    const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
    if (!id || !/^[\w-]{11}$/.test(id)) throw new Error('Link do YouTube inválido');
    return { type: 'embed', url: `https://www.youtube-nocookie.com/embed/${id}` };
  }
  if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(url.hostname)) {
    const match = url.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([\w]+))?\/?$/);
    if (!match) throw new Error('Link do Vimeo inválido');
    const privacy = url.searchParams.get('h') || match[2];
    return { type: 'embed', url: `https://player.vimeo.com/video/${match[1]}${privacy ? `?h=${encodeURIComponent(privacy)}` : ''}` };
  }
  throw new Error('Formato não suportado');
}
document.querySelectorAll('[data-video]').forEach(button => button.addEventListener('click', () => {
  videoTrigger = button;
  document.querySelector('#modal-title').textContent = button.dataset.title;
  externalVideo.hidden = true;
  externalVideo.removeAttribute('href');
  document.querySelector('#video-help-default').hidden = false;
  videoContainer.replaceChildren();
  const source = button.dataset.video.trim();
  if (!source) showVideoMessage('Uma história em breve.', 'Este é um espaço demonstrativo. O filme real ainda não foi adicionado ao portfólio.');
  else {
    try {
      const media = getVideoSource(source);
      externalVideo.href = media.url; externalVideo.hidden = false;
      document.querySelector('#video-help-default').hidden = true;
      if (media.type === 'local') {
        const video = document.createElement('video');
        video.controls = true; video.playsInline = true; video.preload = 'metadata';
        video.setAttribute('aria-label', button.dataset.title);
        video.addEventListener('error', () => showVideoMessage('Não foi possível carregar o filme.', 'Tente abrir o vídeo na origem pelo link abaixo ou fale com a Lubase Frame pelo WhatsApp.'));
        video.src = media.url; videoContainer.append(video);
      } else {
        const iframe = document.createElement('iframe');
        iframe.src = media.url; iframe.title = button.dataset.title;
        iframe.allow = 'fullscreen; picture-in-picture; encrypted-media'; iframe.allowFullscreen = true;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.addEventListener('error', () => showVideoMessage('O vídeo não carregou.', 'Use o link abaixo para tentar abrir o filme na origem.'));
        videoContainer.append(iframe);
      }
    } catch { showVideoMessage('Este filme está indisponível.', 'O link do vídeo precisa ser atualizado. Entre em contato para conhecer nosso trabalho.'); }
  }
  modal.showModal(); document.body.classList.add('modal-open');
  document.querySelector('.modal-close').focus();
}));
document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', event => {
  const rect = modal.getBoundingClientRect();
  if (event.target === modal && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) modal.close();
});
modal.addEventListener('close', () => {
  videoContainer.querySelector('video')?.pause(); videoContainer.replaceChildren();
  document.body.classList.remove('modal-open'); videoTrigger?.focus();
});

// Vídeo de abertura opcional. A imagem permanece como fallback.
const heroVideo = document.querySelector('.hero-video');
function updateHeroVideo() {
  if (reducedMotion.matches || !heroVideo.dataset.src) { heroVideo.pause(); heroVideo.hidden = true; return; }
  if (!heroVideo.getAttribute('src')) heroVideo.src = heroVideo.dataset.src;
  heroVideo.play().then(() => { heroVideo.hidden = false; }).catch(() => { heroVideo.hidden = true; });
}
heroVideo.addEventListener('error', () => { heroVideo.hidden = true; });
reducedMotion.addEventListener('change', updateHeroVideo);
updateHeroVideo();

// Depoimentos: botões, teclado e gesto horizontal, sem rotação automática.
const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('[data-slide]')];
const carousel = document.querySelector('.carousel');
let activeSlide = 0;
function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => { slide.hidden = i !== activeSlide; });
  dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === activeSlide)));
}
document.querySelectorAll('[data-slide-step]').forEach(button => button.addEventListener('click', () => showSlide(activeSlide + Number(button.dataset.slideStep))));
dots.forEach(button => button.addEventListener('click', () => showSlide(Number(button.dataset.slide))));
carousel.addEventListener('keydown', event => {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); showSlide(activeSlide + (event.key === 'ArrowRight' ? 1 : -1)); }
});
let touchStart = null;
carousel.addEventListener('touchstart', event => { touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null; }, { passive: true });
carousel.addEventListener('touchend', event => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) showSlide(activeSlide + (dx < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });
carousel.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });

// Formulário: validação amigável e mensagem codificada, sem servidor ou armazenamento.
const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const fallback = document.querySelector('#whatsapp-fallback');
const requiredFields = [...form.querySelectorAll('[required]')];
function validate(field) {
  let error = '';
  if (!field.value.trim()) error = field.tagName === 'SELECT' ? 'Selecione o tipo de evento.' : 'Preencha este campo para continuar.';
  else if (field.type === 'email' && field.validity.typeMismatch) error = 'Informe um e-mail válido, como nome@exemplo.com.';
  else if (field.name === 'phone' && !/^\+?[\d\s().-]+$/.test(field.value.trim())) error = 'Use apenas números, DDD e, se necessário, código do país.';
  else if (field.name === 'phone' && !/^\d{10,15}$/.test(field.value.replace(/\D/g, ''))) error = 'Informe o WhatsApp com DDD (10 a 15 dígitos).';
  field.setAttribute('aria-invalid', String(Boolean(error)));
  document.querySelector(`#${field.id}-error`).textContent = error;
  return !error;
}
requiredFields.forEach(field => field.addEventListener('input', () => { if (field.hasAttribute('aria-invalid')) validate(field); }));
form.addEventListener('input', () => { fallback.hidden = true; formStatus.textContent = ''; });
form.addEventListener('submit', event => {
  event.preventDefault();
  const invalid = requiredFields.filter(field => !validate(field));
  if (invalid.length) { formStatus.textContent = 'Confira os campos indicados antes de continuar.'; invalid[0].focus(); return; }
  const data = new FormData(form);
  const value = key => String(data.get(key) || '').trim();
  const date = value('date') ? value('date').split('-').reverse().join('/') : 'A definir';
  const message = [
    'Olá, Lubase Frame! Gostaria de solicitar um orçamento.', '',
    `Nome: ${value('name')}`, `WhatsApp: ${value('phone')}`, `E-mail: ${value('email')}`,
    `Tipo de evento: ${value('event')}`, `Data do evento: ${date}`, `Local do evento: ${value('location') || 'A definir'}`,
    '', 'Minha história:', value('message')
  ].join('\n');
  const url = `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
  fallback.href = url; fallback.hidden = false;
  formStatus.textContent = 'Mensagem preparada. Revise e envie no WhatsApp. Se a nova aba não abriu, use o link abaixo.';
  window.open(url, '_blank', 'noopener,noreferrer');
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
