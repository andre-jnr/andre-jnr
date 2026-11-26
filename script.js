(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  root.classList.add('js');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = window.gsap;
  const canAnimate = !!G && !reduce;
  if (!canAnimate) root.classList.remove('pre-build');

  /* ═══════════ AGENTES ═══════════ */
  const AGENTS = {
    layout: { name: 'Agente Layout', color: '#8b7bff' },
    dados:  { name: 'Agente Dados',  color: '#4fd1ff' },
    design: { name: 'Agente Design', color: '#ff7a90' },
    deploy: { name: 'Agente Deploy', color: '#b6f36a' },
    orq:    { name: 'orquestrador',  color: '#a0a7b8' }
  };
  const ORDER = ['layout', 'dados', 'design', 'deploy'];

  function makeCursor(key, parent) {
    const a = AGENTS[key];
    const el = document.createElement('div');
    el.className = 'agent';
    el.style.setProperty('--c', a.color);
    el.innerHTML =
      '<span class="ripple"></span>' +
      `<svg width="22" height="24" viewBox="0 0 22 24" style="margin:-2px 0 0 -2px"><path d="M2 2 L19 12 L11 13.6 L7 21.5 Z" fill="${a.color}" stroke="#07080b" stroke-width="1.6" stroke-linejoin="round"/></svg>` +
      `<span class="tag">${a.name}</span>`;
    parent.appendChild(el);
    return el;
  }

  // Clique: o ponteiro encolhe e solta uma onda
  function press(cur) {
    const svg = $('svg', cur), ring = $('.ripple', cur);
    return G.timeline()
      .to(svg, { scale: .8, duration: .08, transformOrigin: '2px 2px', ease: 'power2.out' })
      .to(svg, { scale: 1, duration: .22, ease: 'back.out(3)' })
      .fromTo(ring, { scale: .3, opacity: 1 }, { scale: 1.8, opacity: 0, duration: .5, ease: 'power2.out' }, 0);
  }

  /* ═══════════ HERO: OS AGENTES MONTAM A PÁGINA ═══════════ */
  const hero = $('.hero');
  const curLayer = $('#hero-cursors');
  const logEl = $('#agent-log');
  const cmdText = $('#cmd-text');
  const cmdStatus = $('#cmd-status');
  const FULL_CMD = cmdText.textContent;
  const chartLine = $('#chart-line');
  const B = k => $(`[data-build="${k}"]`, hero);
  let buildTl = null;
  let cursors = {};
  let t0 = 0;

  function log(key, msg) {
    const a = AGENTS[key];
    const li = document.createElement('li');
    li.innerHTML = `<b style="--c:${a.color}">[${key}]</b><span></span>`;
    li.lastChild.textContent = msg;
    logEl.appendChild(li);
    while (logEl.children.length > 6) logEl.firstChild.remove();
  }

  function typeTo(el, text, dur) {
    const o = { n: 0 };
    return G.to(o, { n: text.length, duration: dur, ease: 'none', onUpdate: () => { el.textContent = text.slice(0, Math.round(o.n)); } });
  }

  function countUp(el, dur = 1) {
    const to = +el.dataset.count, pre = el.dataset.prefix || '';
    const o = { v: 0 };
    return G.to(o, { v: to, duration: dur, ease: 'power2.out', onUpdate: () => { el.textContent = pre + Math.round(o.v); } });
  }

  function rel(el) {
    const h = hero.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { x: b.left - h.left, y: b.top - h.top, w: b.width, h: b.height };
  }

  // O agente busca o bloco fora do lugar e arrasta até a posição final
  function drag(cur, el, dx, dy, color, o = {}) {
    const t = rel(el);
    const gx = t.x + Math.min(28, t.w * .2), gy = t.y + Math.min(t.h * .5, 26);
    const travel = o.travel ?? .45, dur = o.dur ?? .5;
    return G.timeline()
      .set(el, { x: dx, y: dy, opacity: 0 })
      .to(cur, { x: gx + dx, y: gy + dy, duration: travel, ease: 'power2.inOut' })
      .call(() => { el.classList.add('held'); el.style.setProperty('--held', color); })
      .to(el, { opacity: 1, duration: .12, ease: 'none' })
      .add(press(cur), '<')
      .to(el, { x: 0, y: 0, duration: dur, ease: 'power3.inOut' }, '>-0.02')
      .to(cur, { x: gx, y: gy, duration: dur, ease: 'power3.inOut' }, '<')
      .call(() => el.classList.remove('held'));
  }

  function clickOn(cur, el, o = {}) {
    const t = rel(el);
    return G.timeline()
      .to(cur, { x: t.x + t.w * (o.fx ?? .5), y: t.y + t.h * (o.fy ?? .55), duration: o.travel ?? .5, ease: 'power2.inOut' })
      .add(press(cur));
  }

  function drawChart() {
    const len = chartLine.getTotalLength();
    return G.timeline()
      .fromTo(chartLine, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
      .fromTo('.chart-area', { opacity: 0 }, { opacity: 1, duration: .8 }, '<.3')
      .fromTo('.chart-end', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: .4, ease: 'back.out(3)' }, '>-0.1');
  }

  function finalState() {
    const all = $$('[data-build]', hero);
    G.set(all, { opacity: 1, x: 0, y: 0 });
    all.forEach(el => el.classList.remove('held'));
    cmdText.textContent = FULL_CMD;
    cmdStatus.textContent = 'publicado';
    cmdStatus.classList.remove('is-busy');
    $('#paint').classList.add('is-painted');
    $$('[data-count]', hero).forEach(el => { el.textContent = (el.dataset.prefix || '') + el.dataset.count; });
    G.set(chartLine, { strokeDashoffset: 0 });
    G.set('.chart-area', { opacity: 1 });
    G.set('.chart-end', { scale: 1 });
    root.classList.remove('pre-build');
    hero.classList.remove('is-building');
  }

  function dismissCursors() {
    Object.values(cursors).forEach((c, i) => {
      G.to(c, {
        x: `+=${(i % 2 ? 1 : -1) * (60 + Math.random() * 60)}`,
        y: `+=${40 + Math.random() * 50}`,
        opacity: 0, duration: .9, delay: i * .08, ease: 'power2.in',
        onComplete: () => c.remove()
      });
    });
    cursors = {};
  }

  function finish(skipped) {
    if (buildTl) { buildTl.kill(); buildTl = null; }
    finalState();
    if (skipped) {
      log('orq', 'montagem pulada pelo visitante');
      curLayer.innerHTML = '';
      cursors = {};
    } else {
      dismissCursors();
    }
  }

  function build() {
    if (buildTl) buildTl.kill();
    curLayer.innerHTML = '';
    logEl.innerHTML = '';
    hero.classList.add('is-building');
    t0 = performance.now();

    const all = $$('[data-build]', hero);
    G.set(all, { x: 0, y: 0, opacity: 0 });
    G.set(B('log'), { opacity: 1 });
    root.classList.remove('pre-build');
    $('#paint').classList.remove('is-painted');
    $$('[data-count]', hero).forEach(el => { el.textContent = (el.dataset.prefix || '') + '0'; });
    const len = chartLine.getTotalLength();
    G.set(chartLine, { strokeDasharray: len, strokeDashoffset: len });
    G.set('.chart-area', { opacity: 0 });
    G.set('.chart-end', { scale: 0 });
    cmdText.textContent = '';
    cmdStatus.textContent = 'montando…';
    cmdStatus.classList.add('is-busy');

    const W = hero.clientWidth, H = hero.clientHeight;
    const start = {
      layout: [-40, H * .35],
      dados:  [W + 40, H * .18],
      design: [W * .62, H + 40],
      deploy: [-40, H * .9]
    };
    ORDER.forEach(k => {
      cursors[k] = makeCursor(k, curLayer);
      G.set(cursors[k], { x: start[k][0], y: start[k][1], opacity: 0 });
    });
    const { layout: cL, dados: cD, design: cS, deploy: cP } = cursors;
    const col = k => AGENTS[k].color;

    const tl = G.timeline({ onComplete: () => finish(false) });
    buildTl = tl;

    tl.set(B('cmd'), { opacity: 1 })
      .add(typeTo(cmdText, FULL_CMD, .9), .15)
      .call(() => log('orq', 'plano criado: 4 agentes, 14 tarefas'))
      .to(Object.values(cursors), { opacity: 1, duration: .3, stagger: .06 }, '+=.05')
      .addLabel('go');

    // Layout: título e eyebrow
    const L = G.timeline()
      .call(() => log('layout', 'montando o título'))
      .add(drag(cL, B('eyebrow'), -200, -50, col('layout'), { travel: .5 }))
      .add(drag(cL, B('l1'), -280, 50, col('layout')))
      .add(drag(cL, B('l2'), -240, 110, col('layout')))
      .add(drag(cL, B('l3'), -200, 160, col('layout')))
      .call(() => log('layout', 'hierarquia tipográfica ok'));
    tl.add(L, 'go');

    // Dados: painel e KPIs
    const D = G.timeline()
      .call(() => log('dados', 'consultando 5 unidades…'))
      .add(drag(cD, B('board'), 240, -70, col('dados'), { travel: .55, dur: .65 }))
      .add(drag(cD, B('k1'), 170, -50, col('dados'), { travel: .35, dur: .4 }))
      .add(countUp($('[data-count]', B('k1'))), '-=.15')
      .add(drag(cD, B('k2'), 150, -30, col('dados'), { travel: .35, dur: .4 }), '<.1')
      .add(countUp($('[data-count]', B('k2')), .6), '-=.15')
      .add(drag(cD, B('k3'), 170, 30, col('dados'), { travel: .35, dur: .4 }), '<.1')
      .add(countUp($('[data-count]', B('k3'))), '-=.15')
      .add(drag(cD, B('k4'), 150, 40, col('dados'), { travel: .35, dur: .4 }), '<.1')
      .add(countUp($('[data-count]', B('k4')), .6), '-=.15')
      .call(() => log('dados', '4 KPIs publicados'));
    tl.add(D, 'go+=.15');

    // Design: gráfico e gradiente
    const S = G.timeline()
      .call(() => log('design', 'renderizando gráfico'))
      .add(drag(cS, B('chart'), 40, 150, col('design'), { travel: .6, dur: .55 }))
      .add(drawChart(), '-=.1')
      .add(clickOn(cS, $('#paint'), { fx: .35, travel: .7 }), '-=.6')
      .call(() => { $('#paint').classList.add('is-painted'); log('design', 'gradiente aplicado em "decisões"'); })
      .fromTo('#paint', { scale: 1 }, { scale: 1.06, duration: .14, yoyo: true, repeat: 1, ease: 'power2.out', transformOrigin: 'left center' });
    tl.add(S, 'go+=2');

    // Deploy: texto, botões e publicação
    const P = G.timeline()
      .add(drag(cP, B('sub'), -140, 120, col('deploy'), { travel: .55, dur: .55 }))
      .call(() => log('deploy', 'copy revisada'))
      .add(drag(cP, B('actions'), -100, 120, col('deploy'), { dur: .5 }))
      .call(() => log('deploy', 'links checados: GitHub, LinkedIn'))
      .add(clickOn(cP, cmdStatus, { travel: .8 }), '+=1.6')
      .call(() => {
        cmdStatus.textContent = 'publicado';
        cmdStatus.classList.remove('is-busy');
        const s = ((performance.now() - t0) / 1000).toFixed(1).replace('.', ',');
        log('deploy', `build publicado em ${s} s ✓`);
      })
      .to({}, { duration: .5 });
    tl.add(P, 'go+=1.2');
  }

  function initHero() {
    if (!canAnimate) return;
    const inView = window.scrollY < hero.offsetHeight * .4;
    if (!inView) { finalState(); return; }

    const go = () => requestAnimationFrame(() => requestAnimationFrame(build));
    if (document.fonts && document.fonts.ready) {
      Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]).then(go);
    } else go();

    // Rolar durante a montagem acelera os agentes
    addEventListener('scroll', () => {
      if (buildTl && window.scrollY > 80) buildTl.timeScale(3);
    }, { passive: true });

    // Rede de segurança: nada fica invisível se algo falhar
    setTimeout(() => { if (root.classList.contains('pre-build')) finalState(); }, 4000);
  }

  $('#skip').addEventListener('click', () => finish(true));
  $('#replay').addEventListener('click', () => {
    if (!canAnimate) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(build, window.scrollY > 10 ? 500 : 0);
  });

  /* ═══════════ SEÇÕES: UM AGENTE CHEGA E MONTA O CABEÇALHO ═══════════ */
  function agentReveal(head, key) {
    const section = head.closest('.section');
    const s = section.getBoundingClientRect(), b = head.getBoundingClientRect();
    const W = section.clientWidth;
    const cur = makeCursor(key, section);
    cur.style.zIndex = 30;
    const fromRight = key === 'dados' || key === 'design';
    const sx = fromRight ? W + 30 : -40, sy = b.top - s.top + 140;
    const tx = b.left - s.left + 16, ty = b.top - s.top + b.height * .55;
    G.set(cur, { x: sx, y: sy });
    G.timeline({ onComplete: () => cur.remove() })
      .to(cur, { x: tx, y: ty, duration: .8, ease: 'power3.out' })
      .add(press(cur))
      .call(() => head.classList.remove('is-waiting'), null, '<')
      .fromTo(head, { opacity: 0, scale: .9, x: -12 }, { opacity: 1, scale: 1, x: 0, duration: .5, ease: 'back.out(2.2)', transformOrigin: 'left center' }, '<')
      .to(cur, { x: tx + Math.min(340, W * .45), y: ty + 90, duration: .9, ease: 'power2.inOut' }, '+=.15')
      .to(cur, { opacity: 0, duration: .35 }, '-=.35');
  }

  function initSectionAgents() {
    const heads = $$('.sec-head');
    if (!canAnimate || !('IntersectionObserver' in window)) return;
    heads.forEach(h => h.classList.add('is-waiting'));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const i = heads.indexOf(e.target);
        agentReveal(e.target, ORDER[i % ORDER.length]);
      });
    }, { rootMargin: '0px 0px -18% 0px' });
    heads.forEach(h => io.observe(h));
  }

  /* ═══════════ REVEAL AO ROLAR ═══════════ */
  let revealIO = null;
  function observeReveals(els) {
    if (!('IntersectionObserver' in window) || reduce) { els.forEach(el => el.classList.add('is-in')); return; }
    if (!revealIO) {
      revealIO = new IntersectionObserver(entries => {
        const vis = entries.filter(e => e.isIntersecting).map(e => e.target);
        vis.forEach((el, i) => {
          el.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
          el.classList.add('is-in');
          revealIO.unobserve(el);
          setTimeout(() => { el.style.transitionDelay = ''; }, 1400);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: .05 });
    }
    els.forEach(el => revealIO.observe(el));
  }

  /* ═══════════ MAIS SISTEMAS ═══════════ */
  const CAT_COLORS = { 'Gestão': '#ffb86b', 'Fiscal': '#4fd1ff', 'Operação': '#b6f36a', 'Financeiro': '#ff7a90', 'IA & Ferramentas': '#8b7bff' };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function renderSystems() {
    const grid = $('#sys-grid');
    if (!grid || typeof SYSTEMS === 'undefined') return;
    grid.innerHTML = SYSTEMS.map(s => {
      const links = [
        s.demo ? `<a href="${esc(s.demo)}" target="_blank" rel="noopener">Demo ↗</a>` : '',
        s.repo ? `<a href="${esc(s.repo)}" target="_blank" rel="noopener">Código ↗</a>` : ''
      ].join('');
      return `<article class="sys reveal" data-cat="${esc(s.cat)}" style="--k:${CAT_COLORS[s.cat] || '#a0a7b8'}">
        <div class="sys-top"><span class="sys-cat">${esc(s.cat)}</span>${links ? '' : '<span class="sys-flag">uso interno</span>'}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.desc)}</p>
        <div class="sys-foot"><span class="sys-stack">${esc(s.stack)}</span><span class="sys-links">${links}</span></div>
      </article>`;
    }).join('');

    $$('.filter').forEach(btn => btn.addEventListener('click', () => {
      const f = btn.dataset.f;
      $$('.filter').forEach(b => { const on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', on); });
      const shown = [];
      $$('.sys', grid).forEach(card => {
        const show = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('is-hidden', !show);
        if (show) { card.classList.add('is-in'); shown.push(card); }
      });
      if (G && !reduce) G.fromTo(shown, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .45, stagger: .035, ease: 'power3.out', clearProps: 'transform,opacity' });
    }));
  }

  /* ═══════════ JARVIS: CONVERSA DEMONSTRATIVA ═══════════ */
  const QA = [
    { q: 'Quanto as 5 lojas faturaram ontem?', t: 'faturamento(periodo="ontem")', a: 'Somando as 5 lojas, R$ 1,24 mi, com ticket médio de R$ 86,40.' },
    { q: 'Quantas notas cada faturista lançou hoje?', t: 'notas_entrada(agrupar="faturista")', a: 'Foram 47 notas hoje, a maior parte antes das 11h.' },
    { q: 'O que vence esta semana no contas a pagar?', t: 'contas_a_pagar(vencimento="semana")', a: 'São 32 títulos nesta semana. O maior vence na quinta-feira.' }
  ];
  let jvRun = 0;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function typeText(el, text, speed, run) {
    for (let i = 1; i <= text.length; i++) {
      if (run !== jvRun) return false;
      el.textContent = text.slice(0, i);
      await sleep(speed);
    }
    return true;
  }

  async function jarvisLoop(run) {
    const q = $('#jv-q'), t = $('#jv-tool'), a = $('#jv-a');
    let i = 0;
    while (run === jvRun) {
      const item = QA[i++ % QA.length];
      q.textContent = t.textContent = a.textContent = '';
      if (!(await typeText(q, item.q, 28, run))) return;
      await sleep(450); if (run !== jvRun) return;
      t.textContent = item.t;
      await sleep(900); if (run !== jvRun) return;
      if (!(await typeText(a, item.a, 18, run))) return;
      await sleep(2800);
    }
  }

  function initJarvis() {
    const vis = $('#vis-jarvis');
    if (!vis) return;
    if (reduce) { $('#jv-q').textContent = QA[0].q; $('#jv-tool').textContent = QA[0].t; $('#jv-a').textContent = QA[0].a; return; }
    new IntersectionObserver(([e]) => {
      jvRun++;
      if (e.isIntersecting) jarvisLoop(jvRun);
    }, { threshold: .3 }).observe(vis);
  }

  /* ═══════════ VISUAIS ATIVOS SÓ QUANDO VISÍVEIS ═══════════ */
  function initLiveVisuals() {
    const els = $$('.case-visual');
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-live')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.target.classList.toggle('is-live', e.isIntersecting));
    }, { threshold: .25 });
    els.forEach(el => io.observe(el));
  }

  /* ═══════════ SPOTLIGHT NOS CARDS ═══════════ */
  function initSpotlight() {
    document.addEventListener('pointermove', e => {
      const card = e.target.closest && e.target.closest('.case, .sys');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  /* ═══════════ GIT LOG: TRILHO PREENCHE AO ROLAR ═══════════ */
  function initGitlog() {
    const log = $('#gitlog'), fill = $('#gl-fill');
    if (!log || !fill) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = log.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * .65 - r.top) / r.height));
      fill.style.transform = `scaleY(${p})`;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ═══════════ NAV ═══════════ */
  function initNav() {
    const nav = $('#nav'), burger = $('#nav-burger');
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
    });
    $$('#nav-links a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }));

    if (!('IntersectionObserver' in window)) return;
    const links = new Map($$('#nav-links a').map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.classList.remove('is-active'));
        const a = links.get(e.target.id);
        if (a) a.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('section[id]').forEach(s => io.observe(s));
  }

  /* ═══════════ INIT ═══════════ */
  renderSystems();
  observeReveals($$('.reveal'));
  initNav();
  initHero();
  initSectionAgents();
  initJarvis();
  initLiveVisuals();
  initSpotlight();
  initGitlog();
})();
