/*
 * CFDE chat assistant + CFDE wheel button.
 * 1) Loads the Copilot.live CFDE chatbot (skipped if the page already has it).
 * 2) Adds a floating button above the chat bubble that opens the CFDE ecosystem
 *    wheel in a dialog. Images load from the CFDE asset bucket.
 * Lives at the site root, not /assets/, which vercel.json caches for a year.
 */

/* 1. Chat assistant */
if (!window.copilot && !document.querySelector('script[src*="script.copilot.live"]')) {
  (function (w, d, s, o, f, js, fjs) {
    w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments); };
    (js = d.createElement(s)), (fjs = d.getElementsByTagName(s)[0]);
    js.id = o; js.src = f; js.async = 1; js.referrerPolicy = "origin";
    fjs.parentNode.insertBefore(js, fjs);
  })(window, document, "script", "copilot", "https://script.copilot.live/v1/copilot.min.js?tkn=cat-72vvn6q3");
  copilot("init", {});
}

/* 2. CFDE wheel button */
(function () {
  if (window.__cfdeWheel) return;           // safe if pasted twice
  window.__cfdeWheel = true;

  var IMG ='https://cfde-drc.s3.us-east-2.amazonaws.com/assets/img/';
  var DCC = 'https://cfde.cloud/info/dcc/';
  var CTR = 'https://cfde.cloud/info/centers/';

  // [label, icon file, page slug, description]
  var PROGRAMS = [
    ['Kids First', 'Kids%20First.png', 'Kids%20First', 'Data, tools, and resources empowering pediatric research'],
    ['A2CPS', 'A2CPS.png', 'A2CPS', 'Understanding the complex biological processes underlying chronic pain'],
    ['HuBMAP', 'HuBMAP.png', 'HuBMAP', 'Cellular spatial atlas of the human body'],
    ['4DN', '4DN.png', '4DN', 'Nuclear organization in space and time'],
    ['LINCS', 'LINCS-logo.png', 'LINCS', 'Omics signatures for drug & target discovery'],
    ['IDG', 'IDG.png', 'IDG', 'Illuminating GPCRs, kinases, ion channels, & other drug targets'],
    ['NPH', 'nph.png', 'NPH', 'Predictive algorithms to advance nutrition research'],
    ['GlyGen', 'glygen.png', 'GlyGen', 'Computational and informatics resources for glycoscience'],
    ['Bridge2AI', 'Bridge2AI.png', 'Bridge2AI', 'Biomedical AI ↔ people, data & ethics'],
    ['MoTrPAC', 'MoTrPAC.png', 'MoTrPAC', 'The molecular map of exercise'],
    ['KOMP2', 'KOMP2.svg', 'KOMP2', 'Knocking out and characterizing every protein-coding gene in the mouse genome, with IMPC'],
    ['Metabolomics', 'Metabolomics.png', 'Metabolomics', 'Metabolomics'],
    ['SCGE', 'scge.png', 'SCGE', 'Reducing the burden of diseases caused by genetic changes'],
    ['SPARC', 'SPARC.svg', 'SPARC', 'Bridging the body and brain'],
    ['SMaHT', 'smath.png', 'SMaHT', "Mapping somatic mutations' health implications"],
    ['HMP', 'HMP.png', 'HMP', 'Human microbiome in health and disease'],
    ['GTEx', 'GTEx.png', 'GTEx', 'Gene expression and regulation across human tissues'],
    ['SenNet', 'SenNet.png', 'SenNet', 'Mapping senescent cells'],
    ['ExRNA', 'exRNA.png', 'ExRNA', 'Extracellular RNA communication']
  ];
  // [label, center slug, left, top, rotate, textTop, textLeft, iconTop, iconLeft] in a 700px frame
  var PETALS = [
    ['cloud', 'CWIC', 390, 215, -72, 80, '50%', 90, '20%'],
    ['knowledge', 'KC', 363, 354, 0, 125, '10%', 53, '13%'],
    ['training', 'TC', 222, 372, 72, 105, '15%', 35, '45%'],
    ['data', 'DRC', 162, 243, 144, 50, '25%', 65, '55%'],
    ['coordination', 'ICC', 266, 145, 216, 60, '23%', 100, '47%']
  ];

  var CSS =
    '.cfdew-btn{position:fixed;right:20px;bottom:90px;z-index:2147483000;width:56px;height:56px;margin:0;padding:0;box-sizing:border-box;border-radius:50%;display:grid;place-items:center;cursor:pointer;background:#fff;border:1px solid #dde6ee;box-shadow:0 6px 20px rgba(19,42,68,.22);transition:transform .18s}' +
    '.cfdew-btn:hover{transform:scale(1.06)}.cfdew-btn.is-open{box-shadow:0 0 0 3px #5fd0d8,0 6px 20px rgba(19,42,68,.22)}' +
    '.cfdew-btn img{width:44px;height:44px;max-width:none}' +
    '.cfdew-modal{position:fixed;inset:0;z-index:2147482000;display:grid;place-items:center;background:rgba(13,31,51,.74);font-family:Inter,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}' +
    '.cfdew-modal[hidden]{display:none}.cfdew-frame{position:relative;pointer-events:none}.cfdew-frame a{pointer-events:auto}' +
    '.cfdew-wheel{position:absolute;left:0;top:0;width:700px;height:700px;transform-origin:top left}' +
    '.cfdew-dcc{position:absolute;width:90px;height:90px;box-sizing:border-box;border-radius:50%;background:#fff;border:1px solid #dde6ee;display:grid;place-items:center;transition:transform .18s}' +
    '.cfdew-dcc:hover{transform:scale(1.12);z-index:2}.cfdew-dcc img{width:60px;height:60px;max-width:none;object-fit:contain}' +
    '.cfdew-petal{position:absolute;width:170px;height:170px;display:block}.cfdew-petal:hover{filter:brightness(1.1)}' +
    '.cfdew-petal .p{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:contain}' +
    '.cfdew-petal b{position:absolute;z-index:1;color:#fff;font-size:16px;font-weight:700;text-transform:uppercase;line-height:1.2}' +
    '.cfdew-petal .i{position:absolute;z-index:1;width:40px;height:40px;max-width:none}' +
    '.cfdew-hub{position:absolute;left:285px;top:285px;width:130px;height:130px;box-sizing:border-box;border-radius:50%;background:#fff;display:grid;place-items:center;z-index:3;box-shadow:0 10px 34px rgba(19,42,68,.2)}' +
    '.cfdew-hub img{width:96px;height:96px;max-width:none;object-fit:contain}' +
    '.cfdew-close{position:fixed;top:16px;right:16px;width:44px;height:44px;margin:0;padding:0;box-sizing:border-box;border-radius:50%;cursor:pointer;color:#fff;font-size:24px;line-height:1;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.3)}' +
    '@media print{.cfdew-btn,.cfdew-modal{display:none}}';

  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  function wheelHTML() {
    var h = '';
    PROGRAMS.forEach(function (p, i) {
      var a = 2 * Math.PI * i / PROGRAMS.length;
      var x = 350 + 280 * Math.cos(a) - 45, y = 350 + 280 * Math.sin(a) - 45;
      h += '<a class="cfdew-dcc" style="left:' + x + 'px;top:' + y + 'px" href="' + DCC + p[2] + '" target="_blank" rel="noopener"' +
           ' title="' + esc(p[0] + ' — ' + p[3]) + '" aria-label="' + esc(p[0] + ' — ' + p[3]) + '"><img src="' + IMG + p[1] + '" alt=""></a>';
    });
    PETALS.forEach(function (p) {
      h += '<a class="cfdew-petal" style="left:' + p[2] + 'px;top:' + p[3] + 'px" href="' + CTR + p[1] + '" target="_blank" rel="noopener" aria-label="CFDE ' + p[0] + ' center">' +
           '<img class="p" src="' + IMG + p[0] + '.png" alt="" style="transform:rotate(' + p[4] + 'deg)">' +
           '<b style="top:' + p[5] + 'px;left:' + p[6] + '">' + p[0] + '</b>' +
           '<img class="i" src="' + IMG + p[0] + '%201.png" alt="" style="top:' + p[7] + 'px;left:' + p[8] + '"></a>';
    });
    h += '<a class="cfdew-hub" href="https://info.cfde.cloud/" target="_blank" rel="noopener" aria-label="Common Fund Data Ecosystem"><img src="' + IMG + 'CFDE_logo.png" alt="CFDE"></a>';
    return h;
  }

  function build() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cfdew-btn';
    btn.setAttribute('aria-label', 'Explore the CFDE ecosystem');
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', 'false');
    btn.title = 'Explore the CFDE';
    btn.innerHTML = '<img src="' + IMG + 'cfde_unified_icon.svg" alt="">';

    var modal = document.createElement('div');
    modal.className = 'cfdew-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'CFDE ecosystem wheel');
    modal.innerHTML = '<button type="button" class="cfdew-close" aria-label="Close">×</button>' +
                      '<div class="cfdew-frame"><div class="cfdew-wheel"></div></div>';
    var frame = modal.querySelector('.cfdew-frame');
    var wheel = modal.querySelector('.cfdew-wheel');
    var close = modal.querySelector('.cfdew-close');
    var built = false, prevOverflow = '';

    function fit() {
      var s = Math.min(1, (innerWidth - 48) / 700, (innerHeight - 48) / 700);
      frame.style.width = frame.style.height = (700 * s) + 'px';
      wheel.style.transform = 'scale(' + s + ')';
    }
    function onKey(e) { if (e.key === 'Escape') hide(); }
    function show() {
      if (!built) { wheel.innerHTML = wheelHTML(); built = true; }   // load images on first open only
      fit();
      modal.hidden = false;
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      addEventListener('resize', fit);
      document.addEventListener('keydown', onKey);
      close.focus();
    }
    function hide() {
      if (modal.hidden) return;
      modal.hidden = true;
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = prevOverflow;
      removeEventListener('resize', fit);
      document.removeEventListener('keydown', onKey);
      btn.focus();
    }

    btn.addEventListener('click', function () { modal.hidden ? show() : hide(); });
    close.addEventListener('click', hide);
    modal.addEventListener('click', function (e) { if (e.target === modal) hide(); });

    document.body.appendChild(modal);
    document.body.appendChild(btn);

    // Stack the button 14px above the chat bubble, wherever the chat puts it.
    // The bubble lives in a shadow root and loads late, so poll briefly; with
    // no chat on the page the button settles into the corner instead.
    function findChat(root) {
      if (!root) return null;
      var els = root.querySelectorAll('*');
      for (var i = 0; i < els.length; i++) {
        if (els[i].id === 'copilotWidget') return els[i];
        var f = els[i].shadowRoot && findChat(els[i].shadowRoot);
        if (f) return f;
      }
      return null;
    }
    function place() {
      var host = document.getElementById('widget-copilot');
      var chat = host && (findChat(host.shadowRoot) || findChat(host));
      var r = chat && chat.getBoundingClientRect();
      if (!r || !r.width || r.width > 80) return false;   // missing, or the chat panel is open
      // Fixed-position right/bottom are measured from the inside of the scrollbar,
      // so use clientWidth/Height. innerWidth/Height include the scrollbar and
      // would shift the button left of the bubble by the scrollbar's width.
      var vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
      btn.style.right = Math.round(vw - r.right + (r.width - btn.offsetWidth) / 2) + 'px';
      btn.style.bottom = Math.round(vh - r.top + 14) + 'px';
      return true;
    }
    var tries = 0, poll = setInterval(function () {
      if (place() || ++tries > 30) {
        clearInterval(poll);
        if (tries > 30) { btn.style.right = '20px'; btn.style.bottom = '20px'; }
      }
    }, 500);
    addEventListener('resize', place);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
