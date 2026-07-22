(function () {
  function starPoints(cx, cy, outerR, innerR, rotationDeg) {
    var points = [];
    for (var i = 0; i < 10; i++) {
      var r = i % 2 === 0 ? outerR : innerR;
      var angle = (Math.PI / 5) * i - Math.PI / 2 + (rotationDeg * Math.PI) / 180;
      points.push((cx + r * Math.cos(angle)).toFixed(2) + ',' + (cy + r * Math.sin(angle)).toFixed(2));
    }
    return points.join(' ');
  }

  function gbFlagSvg() {
    return (
      '<svg viewBox="0 0 32 32" width="18" height="18" style="display:block">' +
      '<defs><clipPath id="flag-clip-gb"><circle cx="16" cy="16" r="16"/></clipPath></defs>' +
      '<g clip-path="url(#flag-clip-gb)">' +
      '<rect width="32" height="32" fill="#00247d"/>' +
      '<path d="M0 0L32 32M32 0L0 32" stroke="#fff" stroke-width="6.4"/>' +
      '<path d="M0 0L14.2 12.8M32 0L17.8 12.8M0 32L14.2 19.2M32 32L17.8 19.2" stroke="#cf142b" stroke-width="2.4"/>' +
      '<path d="M16 0V32M0 16H32" stroke="#fff" stroke-width="11"/>' +
      '<path d="M16 0V32M0 16H32" stroke="#cf142b" stroke-width="6.4"/>' +
      '</g></svg>'
    );
  }

  function cnFlagSvg() {
    var stars = [
      { cx: 9.5, cy: 8, outerR: 3.7, innerR: 1.42, rot: 0 },
      { cx: 15.7, cy: 4.9, outerR: 1.5, innerR: 0.58, rot: 34 },
      { cx: 18, cy: 8.7, outerR: 1.5, innerR: 0.58, rot: 350 },
      { cx: 17.4, cy: 13, outerR: 1.5, innerR: 0.58, rot: 296 },
      { cx: 14.4, cy: 15.3, outerR: 1.5, innerR: 0.58, rot: 262 },
    ];
    var starEls = stars
      .map(function (s) {
        return '<polygon points="' + starPoints(s.cx, s.cy, s.outerR, s.innerR, s.rot) + '" fill="#ffde00"/>';
      })
      .join('');
    return (
      '<svg viewBox="0 0 32 32" width="18" height="18" style="display:block">' +
      '<defs><clipPath id="flag-clip-cn"><circle cx="16" cy="16" r="16"/></clipPath></defs>' +
      '<g clip-path="url(#flag-clip-cn)">' +
      '<rect width="32" height="32" fill="#de2910"/>' +
      starEls +
      '</g></svg>'
    );
  }

  var FLAG_SVG = { en: gbFlagSvg(), zh: cnFlagSvg() };

  function makeBadge(code) {
    var span = document.createElement('span');
    span.className = 'lang-flag-badge';
    span.style.cssText =
      'display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;' +
      'border-radius:9999px;overflow:hidden;flex-shrink:0;box-shadow:0 0 0 1px rgba(0,0,0,0.12)';
    span.innerHTML = FLAG_SVG[code] || '';
    return span;
  }

  function addFlag(el, code) {
    if (!el || el.dataset.flagAdded || !FLAG_SVG[code]) return;
    el.dataset.flagAdded = 'true';
    el.insertAdjacentElement('beforebegin', makeBadge(code));
    el.style.marginLeft = '6px';
  }

  function decorate() {
    var triggerLabel = document.querySelector('#localization-select-trigger span');
    if (triggerLabel) {
      var text = triggerLabel.textContent.trim();
      var code = text === '简体中文' ? 'zh' : text === 'English' ? 'en' : null;
      if (code) addFlag(triggerLabel, code);
    }
    document.querySelectorAll('[id^="localization-select-item-"]').forEach(function (item) {
      var code = item.id.replace('localization-select-item-', '');
      addFlag(item.querySelector('p'), code);
    });
  }

  new MutationObserver(decorate).observe(document.body, { childList: true, subtree: true, characterData: true });
  decorate();
})();
