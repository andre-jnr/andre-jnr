/* ═══ HERO CANVAS ═══ */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [], animId;

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

function initNodes() {
  nodes = [];
  const count = Math.floor((W * H) / 14000);
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 1,
      type: Math.random() > 0.7 ? 'cyan' : 'blue'
    });
  }
}

function drawCanvas() {
  ctx.clearRect(0, 0, W, H);
  const maxDist = 120;
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    a.x += a.vx; a.y += a.vy;
    if (a.x < 0 || a.x > W) a.vx *= -1;
    if (a.y < 0 || a.y > H) a.vy *= -1;
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.18;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(37,99,235,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    ctx.beginPath();
    const color = a.type === 'cyan' ? '6,182,212' : '37,99,235';
    ctx.fillStyle = `rgba(${color},0.7)`;
    ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
    ctx.fill();
  }
  animId = requestAnimationFrame(drawCanvas);
}

window.addEventListener('resize', () => { resize(); initNodes(); });
resize(); initNodes(); drawCanvas();

/* ═══ KPI COUNTERS ═══ */
function animateKPI(el, target, prefix, suffix, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = prefix + Math.round(start).toLocaleString('pt-BR') + suffix;
  }, 16);
}
setTimeout(() => {
  animateKPI(document.getElementById('kpi1'), 2847000, 'R$', '', 1800);
  animateKPI(document.getElementById('kpi2'), 1243, '', '', 1400);
  animateKPI(document.getElementById('kpi3'), 99.2, '', '%', 1600);
  animateKPI(document.getElementById('kpi4'), 18, '', '', 1200);
}, 600);

/* ═══ JOURNEY ═══ */
const journeyData = [
  {
    role: 'Aprendiz Administrativo',
    company: 'Frigorífico Amazonas',
    period: 'Abr/2022 — Ago/2023',
    items: ['Processos fiscais', 'Processos administrativos', 'Controle financeiro', 'Emissão de notas fiscais', 'Apoio ao Centro de Distribuição', 'Treinamento de colaboradores']
  },
  {
    role: 'Assistente Fiscal',
    company: 'Frigorífico Amazonas',
    period: 'Ago/2023 — Dez/2024',
    items: ['DANFE', 'SUFRAMA', 'Desembaraço fiscal', 'Relatórios', 'Dashboards', 'Certidões', 'XML', 'Fechamento fiscal']
  },
  {
    role: 'Faturista',
    company: 'Frigorífico Amazonas',
    period: 'Dez/2024 — Set/2025',
    items: ['Emissão de notas fiscais', 'Entrada de notas', 'CT-e', 'Contas a pagar', 'Relatórios financeiros', 'Dashboards', 'Análise de dados', 'Controle de estoque']
  },
  {
    role: 'Analista de Faturamento Júnior',
    company: 'Frigorífico Amazonas',
    period: 'Set/2025 — Jun/2026',
    items: ['Liderança operacional', 'Relatórios gerenciais', 'Treinamento de novos faturistas', 'Conciliações financeiras', 'Controles fiscais', 'Auditorias internas']
  },
  {
    role: 'Analista de Faturamento Pleno',
    company: 'Frigorífico Amazonas',
    period: 'Jun/2026 — Atual',
    items: ['Liderança da equipe', 'DRE integrado ao SQL Server', 'Dashboards em tempo real', 'Relatórios gerenciais', 'Controle de contas', 'Análises de vendas', 'Análises de despesas', 'Manual de Faturamento Online', 'Painel de Links']
  }
];

let currentStep = 0;

function setJourneyStep(n) {
  currentStep = n;
  const steps = document.querySelectorAll('.journey-step');
  steps.forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i < n) s.classList.add('done');
    if (i === n) s.classList.add('active');
  });
  const pct = n === 0 ? 0 : (n / (steps.length - 1)) * 100;
  document.getElementById('journey-progress').style.width = pct + '%';
  const d = journeyData[n];
  document.getElementById('detail-role').textContent = d.role;
  document.getElementById('detail-company').textContent = d.company;
  document.getElementById('detail-period').textContent = d.period;
  const items = document.getElementById('detail-items');
  items.innerHTML = d.items.map(i => `<span class="detail-badge">${i}</span>`).join('');
}

function nextStep() { setJourneyStep(Math.min(currentStep + 1, journeyData.length - 1)); }
function prevStep() { setJourneyStep(Math.max(currentStep - 1, 0)); }

setJourneyStep(4);

/* ═══ STATS COUNTER ═══ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target.querySelector('.stat-number[data-target]');
      if (el && el.dataset.target) {
        const target = parseInt(el.dataset.target);
        let c = 0;
        const suffix = el.dataset.target === '87' ? '%' : (el.dataset.target === '4' ? '+' : '');
        const timer = setInterval(() => {
          c += Math.ceil(target / 40);
          if (c >= target) { c = target; clearInterval(timer); }
          el.textContent = c + suffix;
        }, 40);
        delete el.dataset.target;
      }
      const revels = entry.target.querySelectorAll('.stat-number');
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-card').forEach(c => observer.observe(c));

/* ═══ SCROLL REVEAL ═══ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ═══ FORM ═══ */
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-text');
  btn.textContent = 'Enviando...';
  setTimeout(() => { btn.textContent = 'Mensagem Enviada! ✓'; }, 1200);
}

/* ═══ MOBILE MENU ═══ */
function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

/* ═══ STATS COUNTER (alternative approach) ═══ */
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('[data-target]');
      nums.forEach(el => {
        const target = parseInt(el.dataset.target);
        const isPercent = target === 87;
        const isPlus = target === 4;
        let c = 0;
        const timer = setInterval(() => {
          c += Math.ceil(target / 40);
          if (c >= target) { c = target; clearInterval(timer); }
          el.textContent = c + (isPercent ? '%' : (isPlus ? '+' : ''));
        }, 35);
        el.removeAttribute('data-target');
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.sobre-grid').forEach(el => statObs.observe(el));