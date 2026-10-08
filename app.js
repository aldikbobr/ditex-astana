/* Di-Tex — sheer curtains follow the pointer, fabric wave, fitting room, reviews carousel */
(() => {
  'use strict';
  const M = window.Motion || { $: (s, r = document) => r.querySelector(s), $$: (s, r = document) => Array.from(r.querySelectorAll(s)), motion: false, fine: false, toast() {}, wa: (n, t) => window.open('https://wa.me/' + n + '?text=' + encodeURIComponent(t), '_blank', 'noopener') };
  const { $, $$ } = M;

  /* Sheer curtains lean toward the pointer */
  const win = $('.window');
  if (win && M.fine && M.motion) {
    const sheers = $$('.sheer', win);
    addEventListener('pointermove', (e) => {
      const r = win.getBoundingClientRect();
      const px = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)));
      sheers.forEach((s) => s.style.setProperty('--pull', (px * 3).toFixed(2) + 'deg'));
    }, { passive: true });
  }

  /* Fabric wave at the bottom of the hero */
  const wave = $('#wave-path');
  if (wave && M.motion) {
    let visible = true;
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(wave.closest('svg'));
    const t0 = performance.now();
    const draw = (now) => {
      if (visible) {
        const t = (now - t0) / 1000;
        const a = 22 + Math.sin(t * 0.7) * 10;
        const y1 = 60 - a * Math.sin(t * 0.9);
        const y2 = 60 + a * Math.sin(t * 0.9 + 1.2);
        const y3 = 60 - a * 0.8 * Math.sin(t * 0.9 + 2.1);
        wave.setAttribute('d', 'M0 60 C 240 ' + y1.toFixed(1) + ' 480 ' + y2.toFixed(1) + ' 720 60 S 1200 ' + y3.toFixed(1) + ' 1440 60 V120 H0 Z');
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  /* Fitting room */
  const room = $('#room');
  const form = $('#fit-form');
  if (room && form) {
    const val = (n) => ($('input[name="' + n + '"]:checked', form) || {}).value || '';
    const kindLabel = { 'Шторы и тюль': 'шторы + тюль', 'Плотные шторы': 'плотные шторы', 'Только тюль': 'только тюль', 'Римская штора': 'римская штора' };
    const paint = () => {
      const colorInput = $('input[name="color"]:checked', form);
      const c = colorInput ? getComputedStyle(colorInput.closest('.sw-c')).getPropertyValue('--c').trim() : '#d9c9b1';
      room.dataset.room = val('room');
      room.dataset.kind = val('kind');
      room.style.setProperty('--cur', c);
      $('#room-label').textContent = val('room') + ' · ' + kindLabel[val('kind')] + ' · ' + val('color');
      $('#color-name').textContent = val('color');
      room.classList.remove('swing');
      void room.offsetWidth;
      room.classList.add('swing');
    };
    form.addEventListener('change', paint);
    paint();
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      M.wa('77753132397', 'Здравствуйте! Собрал(а) вариант в примерочной на сайте Di-Tex:\nКомната: ' + val('room') + '\nЧто нужно: ' + val('kind') + '\nЦвет ткани: ' + val('color') + '\nХочу подобрать ткани и узнать стоимость.');
      M.toast('Открываем WhatsApp — вариант уже в сообщении');
    });
  }

  /* Reviews carousel buttons */
  const track = $('#rev-track');
  $$('.rn').forEach((b) => b.addEventListener('click', () => {
    if (!track) return;
    const card = track.querySelector('.rv');
    const step = card ? card.getBoundingClientRect().width + 16 : 300;
    track.scrollBy({ left: step * +b.dataset.dir, behavior: M.reduce ? 'auto' : 'smooth' });
  }));
})();
