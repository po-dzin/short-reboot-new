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
  const HIDDEN_CLASS = 'is-hidden';
  const INPUT_CLASS = 'is-input-hidden';
  const ORDER_CLASS = 'is-order-hidden';

  const setPadding = () => {
    const shouldPad = window.innerWidth < 768 && !bar.classList.contains(HIDDEN_CLASS);
    document.body.style.paddingBottom = shouldPad
      ? `${bar.getBoundingClientRect().height + 12}px`
      : '0';
  };

  const updateBarState = () => {
    const shouldHide =
      window.innerWidth >= 768 ||
      bar.classList.contains(INPUT_CLASS) ||
      bar.classList.contains(ORDER_CLASS);

    bar.classList.toggle(HIDDEN_CLASS, shouldHide);
    bar.setAttribute('aria-hidden', shouldHide ? 'true' : 'false');
    setPadding();
  };

  updateBarState();
  window.addEventListener('resize', updateBarState);

  window.addEventListener('focusin', (event) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
      bar.classList.add(INPUT_CLASS);
      updateBarState();
    }
  });

  window.addEventListener('focusout', () => {
    setTimeout(() => {
      const active = document.activeElement;
      if (!active || !['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) {
        bar.classList.remove(INPUT_CLASS);
        updateBarState();
      }
    }, 0);
  });

  const orderSection = document.querySelector('#order');
  if (orderSection) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            bar.classList.toggle(ORDER_CLASS, entry.isIntersecting);
            updateBarState();
          });
        },
        { threshold: 0.4 }
      );
      observer.observe(orderSection);
    } else {
      window.addEventListener('scroll', () => {
        const rect = orderSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        bar.classList.toggle(ORDER_CLASS, isVisible);
        updateBarState();
      });
    }
  }
}
