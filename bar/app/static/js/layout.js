const toggleBtn = document.getElementById('menu-toggle');
const toggleIcon = document.getElementById('toggle-icon');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

toggleBtn.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  toggleIcon.textContent = isOpen ? 'close' : 'menu';
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    navLinks.forEach(l => l.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    if (window.innerWidth <= 1024) {
      navMenu.classList.remove('is-open');
      toggleIcon.textContent = 'menu';
      document.body.style.overflow = '';
    }
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1024 && navMenu.classList.contains('is-open')) {
    navMenu.classList.remove('is-open');
    toggleIcon.textContent = 'menu';
    document.body.style.overflow = '';
  }
});