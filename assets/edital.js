/* Bolinha flutuante "Edital" em todas as páginas da LANAP.
   Ao clicar, o edital abre DENTRO do site, em tela cheia, com "Voltar ao site" sempre visível.
   Configuração única: troque os links aqui quando o edital e o formulário estiverem prontos. */
window.LANAP_SELECAO = {
  titulo: 'Processo seletivo de aspirantes 2026.2',
  prazo: 'Inscrições até 30/11/2026, às 23h59',
  itens: ['Carta de intenção', 'Currículo Lattes', '2 kg de alimento não perecível (inscrição solidária)'],
  edital: 'edital.html',   // página do edital (resumo + arquivo completo)
  editalPdf: 'assets/LANAP_Edital_Aspirantes_a_Glia_2026.pdf', // v2, Diogo, 11/11/2026 21:36
  formulario: 'https://docs.google.com/forms/d/e/1FAIpQLScwyPyIY9X1aurfkb37hT3rYy4fkyNbzZoK-0-ZRBzO2aR0QA/viewform', // dono, 11/11/2026
  pagina: 'inscricao.html?etapa=2'
};

(function () {
  var C = window.LANAP_SELECAO;
  // Links relativos à raiz do site, para funcionar também em subpastas (ex.: sinapse/).
  var base = (document.currentScript && document.currentScript.src || '').replace(/assets\/edital\.js.*$/, '');
  ['edital', 'pagina', 'editalPdf'].forEach(function (k) { if (C[k] && !/^(https?:)?\/\//.test(C[k])) C[k] = base + C[k]; });
  var css = '' +
    '.lx-fab{position:fixed;right:22px;bottom:22px;z-index:60;width:64px;height:64px;border-radius:50%;border:0;cursor:pointer;' +
    'background:#0D767D;color:#fff;font:600 11px/1.1 Inter,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;' +
    'box-shadow:0 10px 30px rgba(19,34,53,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}' +
    '.lx-fab svg{width:20px;height:20px}' +
    '.lx-fab::before{content:"";position:absolute;inset:-6px;border-radius:50%;border:1.5px solid rgba(92,196,201,.7);animation:lxpulso 2.4s ease-out infinite}' +
    '@keyframes lxpulso{0%{transform:scale(.9);opacity:1}100%{transform:scale(1.35);opacity:0}}' +
    '.lx-fab:focus-visible,.lx-voltar:focus-visible{outline:3px solid #5CC4C9;outline-offset:4px}' +
    '.lx-balao{position:fixed;right:98px;bottom:34px;z-index:60;background:#1F334C;color:#fff;font:500 13px/1.3 Inter,Arial,sans-serif;padding:10px 14px;box-shadow:0 8px 24px rgba(19,34,53,.3);max-width:220px;opacity:0;transform:translateX(8px);transition:opacity .5s,transform .5s;pointer-events:none}' +
    '.lx-balao.on{opacity:1;transform:none}' +
    '.lx-balao::after{content:"";position:absolute;right:-6px;top:50%;margin-top:-6px;border:6px solid transparent;border-right:0;border-left-color:#1F334C}' +
    /* Painel do edital em tela cheia */
    '.lx-painel{position:fixed;inset:0;z-index:70;background:#FBF9F5;display:flex;flex-direction:column;transform:translateY(100%);transition:transform .45s cubic-bezier(.2,.8,.2,1);visibility:hidden}' +
    '.lx-painel.aberto{transform:none;visibility:visible}' +
    '.lx-barra{flex:none;display:flex;align-items:center;gap:14px;padding:0 18px;height:60px;background:#132235;color:#fff;font:14px Inter,Arial,sans-serif}' +
    '.lx-voltar{display:inline-flex;align-items:center;gap:8px;background:#0D767D;color:#fff;border:0;padding:10px 16px;font:600 14px Inter,Arial,sans-serif;cursor:pointer}' +
    '.lx-barra .t{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:rgba(255,255,255,.8)}' +
    '.lx-barra a{color:#5CC4C9;font-weight:600;text-decoration:none;white-space:nowrap}' +
    '.lx-painel iframe,.lx-corpo{flex:1;width:100%;border:0;background:#FBF9F5}' +
    '.lx-corpo{overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}' +
    'html.lx-travado,html.lx-travado body{overflow:hidden}' +
    '.lx-rodape{flex:none;display:flex;gap:10px;padding:12px 18px;border-top:1px solid #D9D2C4;background:#fff}' +
    '.lx-rodape a,.lx-rodape button{flex:1;display:flex;justify-content:center;align-items:center;padding:13px;font:600 14px Inter,Arial,sans-serif;text-decoration:none;border:1px solid #0D767D;color:#1F334C;background:#fff;cursor:pointer}' +
    '.lx-rodape .cheio{background:#0D767D;color:#fff}' +
    'body.lx-travado{overflow:hidden}' +
    '@media (max-width:600px){.lx-fab{right:16px;bottom:16px;width:58px;height:58px}.lx-balao{right:86px;bottom:26px}.lx-barra .t{display:none}.lx-barra{justify-content:space-between}}' +
    '@media (prefers-reduced-motion:reduce){.lx-fab::before{animation:none}.lx-painel{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var fab = document.createElement('button');
  fab.className = 'lx-fab'; fab.type = 'button'; fab.setAttribute('aria-label', 'Abrir o edital do processo seletivo');
  fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/></svg>Edital';

  var balao = document.createElement('div');
  balao.className = 'lx-balao'; balao.setAttribute('aria-hidden', 'true');
  balao.textContent = 'Não se esqueça de ler o edital';

  var naInscricao = /inscricao\.html$/.test(location.pathname) && /etapa=/.test(location.search);
  var painel = document.createElement('div');
  painel.className = 'lx-painel'; painel.setAttribute('data-lenis-prevent', ''); painel.setAttribute('role', 'dialog'); painel.setAttribute('aria-modal', 'true'); painel.setAttribute('aria-label', 'Edital: ' + C.titulo);
  painel.innerHTML =
    '<div class="lx-barra"><button class="lx-voltar" type="button">← Voltar ao site</button>' +
    '<span class="t">Edital · ' + C.titulo + ' · ' + C.prazo + '</span>' +
    (C.editalPdf ? '<a href="' + C.editalPdf + '" target="_blank" rel="noopener">Arquivo completo ↗</a>' : '') + '</div>' +
    '<div class="lx-corpo" data-lenis-prevent tabindex="0" aria-label="Texto do edital"></div>' +
    '<div class="lx-rodape"><button type="button" data-voltar>Voltar ao site</button>' +
    (naInscricao ? '' : '<a class="cheio" href="' + C.pagina + '">Quero me inscrever</a>') + '</div>';

  var corpo = painel.querySelector('.lx-corpo'), ultimoFoco = null, carregado = false;
  function carrega() {
    if (carregado) return; carregado = true;
    var url = C.edital;
    function emIframe() { corpo.outerHTML = '<iframe title="Edital do processo seletivo" src="' + url + '"></iframe>'; }
    if (!window.fetch || location.protocol === 'file:') return emIframe();
    fetch(url).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (txt) {
      var doc = new DOMParser().parseFromString(txt, 'text/html');
      var css = Array.prototype.map.call(doc.querySelectorAll('style'), function (s) { return s.textContent; }).join('\n')
        .replace(/:root/g, ':host').replace(/(^|[\s,}])html\b/g, '$1:host').replace(/(^|[\s,}])body\b/g, '$1.raiz');
      var fontes = Array.prototype.map.call(doc.querySelectorAll('link[rel=stylesheet]'), function (l) { return '<link rel="stylesheet" href="' + l.href + '">'; }).join('');
      var raiz = corpo.attachShadow ? corpo.attachShadow({ mode: 'open' }) : corpo;
      var base = url.replace(/[^/]*$/, '');
      var html = doc.querySelector('main').outerHTML.replace(/(src|href)="(?!https?:|#|mailto:)([^"]+)"/g, function (m, a, v) { return a + '="' + base + v + '"'; });
      raiz.innerHTML = fontes + '<style>' + css + ':host{display:block}.raiz{font:16px/1.7 Inter,Arial,sans-serif;color:#2F3B48}</style><div class="raiz">' + html + '</div>';
      // Links internos (perguntas -> artigos) rolam dentro do painel, sem mexer no endereço do site.
      raiz.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
        var alvo = raiz.querySelector(a.getAttribute('href')); if (!alvo) return;
        e.preventDefault(); alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        alvo.classList.remove('alvo'); void alvo.offsetWidth; alvo.classList.add('alvo');
      });
    }).catch(emIframe);
  }
  function abre() {
    ultimoFoco = document.activeElement; carrega();
    painel.classList.add('aberto'); document.body.classList.add('lx-travado'); document.documentElement.classList.add('lx-travado'); balao.classList.remove('on');
    if (window.LANAP_lenis) window.LANAP_lenis.stop();
    if (location.hash !== '#edital') history.pushState({ lxEdital: 1 }, '', '#edital');
    painel.querySelector('.lx-voltar').focus();
  }
  function fecha(viaHistorico) {
    if (!painel.classList.contains('aberto')) return;
    painel.classList.remove('aberto'); document.body.classList.remove('lx-travado'); document.documentElement.classList.remove('lx-travado');
    if (window.LANAP_lenis) window.LANAP_lenis.start();
    if (!viaHistorico && location.hash === '#edital') history.back();
    if (ultimoFoco) ultimoFoco.focus();
  }
  window.LANAP_abreEdital = abre;
  fab.addEventListener('click', abre);
  painel.querySelector('.lx-voltar').addEventListener('click', function () { fecha(); });
  painel.querySelector('[data-voltar]').addEventListener('click', function () { fecha(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecha(); });
  // O botão "voltar" do celular também fecha o edital e mantém a pessoa no site.
  addEventListener('popstate', function () { if (location.hash !== '#edital') fecha(true); });

  function pisca() { if (!painel.classList.contains('aberto')) { balao.classList.add('on'); setTimeout(function () { balao.classList.remove('on'); }, 5000); } }
  function monta() {
    document.body.appendChild(balao); document.body.appendChild(fab); document.body.appendChild(painel);
    if (location.hash === '#edital') abre();
    setTimeout(pisca, 2500); setInterval(pisca, 45000);
  }
  if (document.body) monta(); else document.addEventListener('DOMContentLoaded', monta);
})();
