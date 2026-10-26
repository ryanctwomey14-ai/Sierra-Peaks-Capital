/* Desert Peaks Capital — site behaviour
   Vanilla, no dependencies. Motion respects prefers-reduced-motion. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav: solidify on scroll ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var stuck = false;
    var onScroll = function () {
      var should = window.scrollY > 24;
      if (should !== stuck) {
        stuck = should;
        nav.classList.toggle('is-stuck', stuck);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Nav: mobile drawer ---------- */
    var toggle = nav.querySelector('.nav__toggle');
    var links = nav.querySelector('.nav__links');
    if (toggle && links) {
      var close = function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      };
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      links.addEventListener('click', function (e) {
        if (e.target.closest('a')) close();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          close();
          toggle.focus();
        }
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 1040) close();
      });
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealables = document.querySelectorAll('.rv');
  if (revealables.length) {
    if (!('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Count-up figures ---------- */
  function formatNumber(value, decimals) {
    return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduce || isNaN(target)) {
        el.textContent = prefix + formatNumber(target, decimals) + suffix;
        return;
      }
      var duration = 1400;
      var start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        // ease-out cubic — matches --ease-out feel
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + formatNumber(target * eased, decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- Accordion ---------- */
  function panelOf(item) { return item.querySelector('.acc__panel'); }

  function openItem(item) {
    var panel = panelOf(item);
    var inner = panel.firstElementChild;
    item.classList.add('is-open');
    item.querySelector('.acc__btn').setAttribute('aria-expanded', 'true');
    if (reduce) { panel.style.height = 'auto'; return; }
    panel.style.height = inner.offsetHeight + 'px';
    var settle = function (e) {
      if (e.target !== panel || e.propertyName !== 'height') return;
      panel.style.height = 'auto';           // stays correct if the text reflows
      panel.removeEventListener('transitionend', settle);
    };
    panel.addEventListener('transitionend', settle);
  }

  function closeItem(item) {
    var panel = panelOf(item);
    var inner = panel.firstElementChild;
    item.classList.remove('is-open');
    item.querySelector('.acc__btn').setAttribute('aria-expanded', 'false');
    if (reduce) { panel.style.height = '0px'; return; }
    panel.style.height = inner.offsetHeight + 'px';   // pin the current height first
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { panel.style.height = '0px'; });
    });
  }

  document.querySelectorAll('.acc').forEach(function (acc) {
    var single = acc.hasAttribute('data-single');
    acc.querySelectorAll('.acc__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.acc__item');
        if (item.classList.contains('is-open')) {
          closeItem(item);
          return;
        }
        if (single) {
          acc.querySelectorAll('.acc__item.is-open').forEach(closeItem);
        }
        openItem(item);
      });
    });
  });

  /* ---------- Forms: inline validation on blur, summary on submit ---------- */
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    var fields = form.querySelectorAll('input, select, textarea');

    var validate = function (input) {
      var field = input.closest('.field');
      if (!field) return true;
      var ok = input.checkValidity();
      field.classList.toggle('is-invalid', !ok);
      var err = field.querySelector('.err');
      if (err && !ok) err.textContent = input.validationMessage;
      return ok;
    };

    fields.forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('is-invalid')) validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;
      fields.forEach(function (input) {
        if (!validate(input) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      var ok = form.querySelector('.form-ok');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }
      // No backend wired yet — swap this block for your CRM / form endpoint.
      window.setTimeout(function () {
        if (ok) {
          ok.classList.add('is-shown');
          ok.setAttribute('tabindex', '-1');
          ok.focus();
        }
        form.querySelectorAll('.field, .radio-set, .btn-row').forEach(function (el) {
          el.style.display = 'none';
        });
      }, 500);
    });
  });

  /* ---------- Hero background video ---------- */
  var heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    if (reduce) {
      heroVideo.pause();
      heroVideo.removeAttribute('autoplay');
    } else {
      var reveal = function () { heroVideo.classList.add('is-ready'); };
      if (heroVideo.readyState >= 3) reveal();
      else heroVideo.addEventListener('canplay', reveal, { once: true });
      // Autoplay can still be refused (data saver, low power mode). If it is,
      // leave the SVG landscape showing rather than a frozen first frame.
      var p = heroVideo.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function () { heroVideo.classList.remove('is-ready'); });
      }
    }
  }

  /* ---------- Section background videos (lazy) ---------- */
  var sectionVids = document.querySelectorAll('.sectionvid[data-src]');
  if (sectionVids.length && !reduce) {
    var startVid = function (v) {
      if (v.dataset.started) return;
      v.dataset.started = '1';
      var src = document.createElement('source');
      src.src = v.getAttribute('data-src');
      src.type = 'video/mp4';
      v.appendChild(src);
      v.load();
      v.addEventListener('canplay', function () { v.classList.add('is-ready'); }, { once: true });
      var pr = v.play();
      if (pr && typeof pr.catch === 'function') {
        pr.catch(function () { v.classList.remove('is-ready'); });
      }
    };
    if (!('IntersectionObserver' in window)) {
      sectionVids.forEach(startVid);
    } else {
      // 400px of lead-in so the fade has finished by the time the band is on screen
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { startVid(e.target); vio.unobserve(e.target); }
        });
      }, { rootMargin: '400px 0px' });
      sectionVids.forEach(function (v) { vio.observe(v); });
    }
  }

  /* ---------- Illustrative returns calculator ----------
     Assumptions are the firm's stated targets, applied to the amount and hold
     the visitor selects. Nothing here is a projection — see the on-page note. */
  var calc = document.getElementById('calc');
  if (calc) {
    var CASH_RATE   = 0.085;   // stabilised annual cash-on-cash
    var YEAR1_RAMP  = 0.60;    // first year is partial while the asset stabilises
    var EQUITY_RATE = 0.075;   // annual growth on invested equity

    var amountEl = document.getElementById('calc-amount');
    var yearsEl  = document.getElementById('calc-years');
    var amountOut = document.getElementById('calc-amount-out');
    var yearsOut  = document.getElementById('calc-years-out');
    var plot = document.getElementById('calc-plot');
    var axis = document.getElementById('calc-axis');
    var table = document.getElementById('calc-table');

    var usd = function (n, dp) {
      return '$' + n.toLocaleString('en-US', {
        minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0
      });
    };
    var compact = function (n) {
      if (n >= 1e6) return '$' + (n / 1e6).toFixed(n >= 1e7 ? 1 : 2) + 'M';
      return '$' + Math.round(n / 1000) + 'k';
    };

    // Internal rate of return by bisection — cash flows are annual, t0 negative.
    var irr = function (flows) {
      var npv = function (r) {
        var v = 0;
        for (var t = 0; t < flows.length; t++) v += flows[t] / Math.pow(1 + r, t);
        return v;
      };
      var lo = -0.9499, hi = 2.0;
      if (npv(lo) * npv(hi) > 0) return null;
      for (var i = 0; i < 200; i++) {
        var mid = (lo + hi) / 2;
        if (npv(lo) * npv(mid) <= 0) hi = mid; else lo = mid;
      }
      return (lo + hi) / 2;
    };

    var model = function (amount, years) {
      var rows = [], cum = 0, flows = [-amount];
      for (var y = 1; y <= years; y++) {
        var cash = amount * CASH_RATE * (y === 1 ? YEAR1_RAMP : 1);
        cum += cash;
        var equity = amount * Math.pow(1 + EQUITY_RATE, y);
        var flow = cash + (y === years ? equity : 0);
        flows.push(flow);
        rows.push({ year: y, cash: cash, cumCash: cum, equity: equity, total: cum + equity });
      }
      var exit = rows[rows.length - 1];
      return {
        rows: rows,
        totalCash: cum,
        equityAtExit: exit.equity,
        totalReturned: cum + exit.equity,
        multiple: (cum + exit.equity) / amount,
        irr: irr(flows)
      };
    };

    var render = function () {
      var amount = parseInt(amountEl.value, 10);
      var years = parseInt(yearsEl.value, 10);
      var m = model(amount, years);

      amountOut.textContent = usd(amount);
      yearsOut.textContent = years + (years === 1 ? ' year' : ' years');

      var max = m.rows[m.rows.length - 1].total;
      plot.innerHTML = '';
      axis.innerHTML = '';
      m.rows.forEach(function (r, i) {
        var col = document.createElement('div');
        col.className = 'calc__col';
        var eq = document.createElement('div');
        eq.className = 'calc__seg calc__seg--equity';
        eq.style.height = (r.equity / max * 100) + '%';
        eq.title = 'Year ' + r.year + ' equity value: ' + usd(r.equity);
        var cash = document.createElement('div');
        cash.className = 'calc__seg calc__seg--cash';
        cash.style.height = (r.cumCash / max * 100) + '%';
        cash.title = 'Cash received through year ' + r.year + ': ' + usd(r.cumCash);
        col.appendChild(eq);
        col.appendChild(cash);
        plot.appendChild(col);

        var lab = document.createElement('span');
        lab.textContent = i === m.rows.length - 1 ? 'Yr ' + r.year + ' · exit' : 'Yr ' + r.year;
        if (i === m.rows.length - 1) lab.className = 'is-exit';
        axis.appendChild(lab);
      });

      document.getElementById('kpi-cash').textContent = usd(m.totalCash);
      document.getElementById('kpi-equity').textContent = usd(m.equityAtExit);
      document.getElementById('kpi-total').textContent = usd(m.totalReturned);
      document.getElementById('kpi-multiple').textContent = m.multiple.toFixed(2) + '\u00d7';
      document.getElementById('kpi-irr').textContent =
        m.irr === null ? '\u2014' : (m.irr * 100).toFixed(1) + '%';

      // accessible equivalent of the chart
      var html = '<caption>Illustrative return on ' + usd(amount) + ' over ' + years +
        ' years</caption><thead><tr><th scope="col">Year</th>' +
        '<th scope="col">Distribution</th><th scope="col">Cumulative cash</th>' +
        '<th scope="col">Equity value</th></tr></thead><tbody>';
      m.rows.forEach(function (r) {
        html += '<tr><th scope="row">' + r.year + '</th><td>' + usd(r.cash) +
          '</td><td>' + usd(r.cumCash) + '</td><td>' + usd(r.equity) + '</td></tr>';
      });
      table.innerHTML = html + '</tbody>';
    };

    amountEl.addEventListener('input', render);
    yearsEl.addEventListener('input', render);
    render();
  }

  /* ---------- Current year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
