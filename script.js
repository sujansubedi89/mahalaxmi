(function () {
  var hdr = document.getElementById('hdr');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  window.addEventListener('scroll', function () {
    hdr.classList.toggle('stuck', window.scrollY > 20);
  }, { passive: true });

  burger.addEventListener('click', function () {
    burger.classList.toggle('on');
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      burger.classList.remove('on');
      nav.classList.remove('open');
    });
  });

  var sections = document.querySelectorAll('section[id]');
  var navLinks = nav.querySelectorAll('a[href^="#"]');
  window.addEventListener('scroll', function () {
    var pos = window.scrollY + 140;
    var cur = 'home';
    sections.forEach(function (s) {
      if (s.offsetTop <= pos) cur = s.id;
    });
    navLinks.forEach(function (l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
    });
  }, { passive: true });

  var anims = document.querySelectorAll('[data-anim]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    anims.forEach(function (el) { io.observe(el); });
  } else {
    anims.forEach(function (el) { el.classList.add('in'); });
  }

  var counters = document.querySelectorAll('[data-count]');
  var run = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var t0 = null;
    var step = function (ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / 1600, 1);
      var val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(run);
  }

  document.querySelectorAll('.tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-body').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  var form = document.getElementById('quoteForm');
  var note = document.getElementById('formNote');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      var bad = !f.value.trim();
      f.classList.toggle('bad', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      note.textContent = 'Please fill your name, phone and project details.';
      note.classList.remove('ok');
      return;
    }
    var d = new FormData(form);
    var body = [
      'Name: ' + d.get('name'),
      'Phone: ' + d.get('phone'),
      'Email: ' + (d.get('email') || '-'),
      'Service: ' + d.get('service'),
      '',
      d.get('message')
    ].join('\n');
    window.location.href = 'mailto:mahalaxmienggworks@yahoo.com?subject=' +
      encodeURIComponent('Website Enquiry - ' + d.get('service')) +
      '&body=' + encodeURIComponent(body);
    note.textContent = 'Thank you! Your enquiry is ready to send.';
    note.classList.add('ok');
    form.reset();
  });

  form.querySelectorAll('input,textarea').forEach(function (f) {
    f.addEventListener('input', function () { f.classList.remove('bad'); });
  });

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
