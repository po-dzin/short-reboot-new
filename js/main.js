document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link || link.getAttribute('href') === '#') return;
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  }
});

document.querySelectorAll('.acc-head').forEach((head) => {
  const toggle = () => {
    const item = head.parentElement;
    item.classList.toggle('active');
  };

  head.addEventListener('click', toggle);
  head.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
});

document.querySelectorAll('.video-box').forEach((box) => {
  box.addEventListener('click', () => {
    const url = box.dataset.yt;
    if (!url) return;
    box.innerHTML = `<iframe src="${url}" title="Відгук" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
  });
});

const bar = document.querySelector('.mobile-cta');
if (bar) {
  const pad = () => {
    const height = bar.getBoundingClientRect().height + 12;
    document.body.style.paddingBottom = window.innerWidth < 768 ? `${height}px` : '0';
  };

  pad();
  window.addEventListener('resize', pad);
  window.addEventListener('focusin', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      bar.style.display = 'none';
      document.body.style.paddingBottom = '0';
    }
  });
  window.addEventListener('focusout', () => {
    if (window.innerWidth < 768) {
      bar.style.display = 'flex';
      pad();
    }
  });
}
