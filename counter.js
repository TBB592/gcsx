(function () {
  'use strict';
  var status = document.getElementById('counter-status');
  if (!status || window.__viewCounterStarted) return;
  window.__viewCounterStarted = true;
  status.hidden = false;
  // Count only the fixed production frame URL, so shared-link query strings,
  // homepage anchors and local previews cannot create separate counters.
  if (location.hostname !== 'tbb592.github.io' || location.pathname !== '/gcsx/counter.html') {
    status.textContent = '累计阅览：仅线上统计';
    return;
  }
  var callback = 'EngineeringMathViews_' + Math.floor(Math.random() * 1e12);
  var request = document.createElement('script');
  var completed = false;
  function failure() {
    status.textContent = '统计暂不可用';
  }
  var timer = setTimeout(failure, 15000);
  window[callback] = function (data) {
    if (completed) return;
    completed = true;
    clearTimeout(timer);
    var count = data && data.page_pv;
    if (typeof count !== 'number' || !isFinite(count) || count < 1 || count > 9007199254740991 || Math.floor(count) !== count) {
      failure();
    } else {
      status.textContent = '累计阅览：' + count.toLocaleString('zh-CN') + ' 次';
    }
    request.remove();
    window[callback] = function () {};
  };
  request.async = true;
  // The service keys page_pv by the Referer path. This canonical same-origin
  // iframe has no query string and is dedicated to this website alone.
  request.referrerPolicy = 'no-referrer-when-downgrade';
  request.src = 'https://busuanzi.ibruce.info/busuanzi?jsonpCallback=' + callback;
  request.onerror = function () {
    completed = true;
    clearTimeout(timer);
    failure();
    request.remove();
    window[callback] = function () {};
  };
  document.head.appendChild(request);
}());
