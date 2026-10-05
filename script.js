/* رادار التاجر — interactions */
(function () {
  'use strict';

  // 1) Gentle 3D parallax tilt on the hero dashboard (desktop pointers only)
  var hero = document.getElementById('home');
  var dash = document.getElementById('dashboard-3d');
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hero && dash && fine && !reduce) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      dash.style.transform = 'rotateY(' + (x * 5).toFixed(2) + 'deg) rotateX(' + (-y * 4).toFixed(2) + 'deg)';
    });
    hero.addEventListener('mouseleave', function () {
      dash.style.transform = '';
    });
  }

  // 2) Active nav link
  var links = document.querySelectorAll('.nav-link');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      links.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    });
  });
})();
