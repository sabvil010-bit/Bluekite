(function () {

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  document.querySelectorAll('.more-btn').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
      btn.textContent = open ? 'More facts' : 'Fewer facts';
    });
  });

  var quiz = document.getElementById('quiz-form');
  var result = document.getElementById('quiz-result');
  if (quiz && result) {
    var questions = quiz.querySelectorAll('.q');

    var clearMarks = function () {
      questions.forEach(function (q) {
        q.classList.remove('correct', 'wrong');
        q.querySelector('.q-explain').hidden = true;
        q.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('is-correct', 'is-wrong'); });
      });
      result.textContent = '';
    };

    quiz.addEventListener('submit', function (e) {
      e.preventDefault();
      clearMarks();
      var score = 0;
      var unanswered = 0;
      questions.forEach(function (q) {
        var answer = q.getAttribute('data-answer');
        var chosen = q.querySelector('input:checked');
        var explain = q.querySelector('.q-explain');
        var correctInput = q.querySelector('input[value="' + answer + '"]');
        if (!chosen) {
          unanswered++;
          return;
        }
        if (chosen.value === answer) {
          score++;
          q.classList.add('correct');
          chosen.closest('.opt').classList.add('is-correct');
          explain.innerHTML = '<b>Correct!</b> ' + explain.getAttribute('data-text');
        } else {
          q.classList.add('wrong');
          chosen.closest('.opt').classList.add('is-wrong');
          correctInput.closest('.opt').classList.add('is-correct');
          explain.innerHTML = '<b>Not quite.</b> ' + explain.getAttribute('data-text');
        }
        explain.hidden = false;
      });

      if (unanswered === questions.length) {
        result.textContent = 'Pick an answer for each question, then check again.';
        return;
      }
      var msg = 'You scored ' + score + ' out of ' + questions.length + '. ';
      if (unanswered) msg += unanswered + (unanswered === 1 ? ' question was' : ' questions were') + ' left blank. ';
      if (score === questions.length) msg += 'Perfect — you’re flying high!';
      else if (score >= 3) msg += 'Great work. Read the notes above to learn the rest.';
      else msg += 'Good start. Have a look at the planets and lessons, then try again.';
      result.textContent = msg;
    });

    quiz.addEventListener('reset', function () {
      setTimeout(clearMarks, 0);
    });

    questions.forEach(function (q) {
      var ex = q.querySelector('.q-explain');
      ex.setAttribute('data-text', ex.textContent);
    });
  }

  var filter = document.getElementById('g-filter');
  var empty = document.getElementById('g-empty');
  if (filter) {
    var items = document.querySelectorAll('.g-item');
    filter.addEventListener('input', function () {
      var term = filter.value.trim().toLowerCase();
      var shown = 0;
      items.forEach(function (item) {
        var match = !term || item.textContent.toLowerCase().indexOf(term) !== -1;
        item.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    });
  }

  document.querySelectorAll('[data-print]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var section = document.getElementById(btn.getAttribute('data-print'));
      if (!section) return;
      document.querySelectorAll('.print-target').forEach(function (s) { s.classList.remove('print-target'); });
      section.classList.add('print-target');
      document.body.classList.add('printing-section');
      window.print();
    });
  });
  window.addEventListener('afterprint', function () {
    document.body.classList.remove('printing-section');
    document.querySelectorAll('.print-target').forEach(function (s) { s.classList.remove('print-target'); });
  });

  var form = document.getElementById('contact-form');
  var note = document.getElementById('form-note');
  if (form && note) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.elements.email;
      var msg = form.elements.message;
      var bad = [];
      [email, msg].forEach(function (f) { f.classList.remove('is-invalid'); });
      if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) bad.push(email);
      if (!msg.value.trim()) bad.push(msg);

      if (bad.length) {
        bad.forEach(function (f) { f.classList.add('is-invalid'); });
        note.className = 'form-note err';
        note.textContent = 'Please add an email address for our reply and a short message.';
        bad[0].focus();
        return;
      }

      var first = form.elements.name.value.trim().split(/\s+/)[0];
      note.className = 'form-note ok';
      note.textContent = 'Thanks' + (first ? ', ' + first : '') + '! Your message is noted. If you don’t hear back within a few school days, email hello@bluekite.space.';
      form.reset();
    });
  }
})();
