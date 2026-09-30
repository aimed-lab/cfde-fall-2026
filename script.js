/* CFDE Fall 2026 — mobile nav, agenda tabs and accordions, sticky header state */
(function () {
  var toggle = document.getElementById('navtoggle');
  var nav = document.getElementById('nav');
  var topbar = document.getElementById('topbar');

  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close after tapping a link on mobile.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    // Reset state when growing past the mobile breakpoint.
    window.matchMedia('(min-width: 761px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  // Agenda sessions (accordion). Without JS every session stays expanded;
  // with it, sessions start collapsed and open on click.
  var sessionToggles = Array.prototype.slice.call(document.querySelectorAll('.slot__toggle'));
  var expandAll = document.querySelector('.expand-all');
  var syncExpandAll = function () {};

  if (sessionToggles.length) {
    var setSession = function (btn, open) {
      btn.setAttribute('aria-expanded', String(open));
      document.getElementById(btn.getAttribute('aria-controls')).hidden = !open;
      btn.closest('.slot').classList.toggle('is-open', open);
    };

    sessionToggles.forEach(function (btn) {
      setSession(btn, false);
      btn.addEventListener('click', function (e) {
        e.stopPropagation(); // the row handler below would toggle it back
        setSession(btn, btn.getAttribute('aria-expanded') !== 'true');
        syncExpandAll();
      });
    });

    // The whole row is a click target, except inside the opened details
    // (so people can select demo titles or names to copy them).
    Array.prototype.forEach.call(document.querySelectorAll('.slot--expandable'), function (row) {
      row.addEventListener('click', function (e) {
        if (e.target.closest('.slot__more, a, button')) return;
        if (window.getSelection && String(window.getSelection())) return;
        row.querySelector('.slot__toggle').click();
      });
    });

    if (expandAll) {
      var visibleToggles = function () {
        var panel = document.querySelector('.agenda:not([hidden])');
        return panel ? Array.prototype.slice.call(panel.querySelectorAll('.slot__toggle')) : [];
      };
      syncExpandAll = function () {
        var all = visibleToggles().every(function (b) { return b.getAttribute('aria-expanded') === 'true'; });
        expandAll.setAttribute('aria-expanded', String(all));
        expandAll.querySelector('span').textContent = all ? 'Collapse all' : 'Expand all';
      };
      expandAll.addEventListener('click', function () {
        var open = expandAll.getAttribute('aria-expanded') !== 'true';
        visibleToggles().forEach(function (b) { setSession(b, open); });
        syncExpandAll();
      });
      expandAll.closest('.agenda__tools').hidden = false;
      syncExpandAll();
    }
  }

  // Agenda day tabs (WAI-ARIA tabs pattern: arrows move between tabs).
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  if (tabs.length) {
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      syncExpandAll(); // "Expand all" acts on the visible day
      if (focus) tab.focus();
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });

    // During the meeting, open on the current day automatically.
    var today = new Date();
    var ymd = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    if (ymd === 20261014) select(tabs[1]);
  }

  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
