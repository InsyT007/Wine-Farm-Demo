const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.reveal');
const backToTop = document.getElementById('backToTop');
const applicationModal = document.getElementById('applicationModal');
const closeModal = document.getElementById('closeModal');
const applyButtons = document.querySelectorAll('.apply-btn');
const positionField = document.getElementById('positionField');
const cvInput = document.getElementById('cvInput');
const fileName = document.getElementById('fileName');
const applicationForm = document.getElementById('applicationForm');
const applicationStatus = document.getElementById('applicationStatus');
const feedbackForm = document.getElementById('feedbackForm');
const filterButtons = document.querySelectorAll('.filter-chip');
const vacancyCards = document.querySelectorAll('.vacancy-card');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollDuration = 1250;

const setSidebarState = (isOpen) => {
  sidebar?.classList.toggle('is-collapsed', !isOpen);
  sidebarToggle?.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('sidebar-open', window.innerWidth <= 900 && isOpen);
  sidebarOverlay?.setAttribute('aria-hidden', String(!isOpen));
};

const closeSidebar = () => setSidebarState(false);
const openSidebar = () => setSidebarState(true);

setSidebarState(window.innerWidth > 900);

const scrollToTarget = (targetY, duration = scrollDuration) => {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  if (prefersReducedMotion || duration <= 0) {
    window.scrollTo(0, targetY);
    return;
  }

  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

const handleAnchorNavigation = (event, link) => {
  const targetId = link.getAttribute('href');
  if (!targetId || targetId.charAt(0) !== '#') {
    return;
  }

  const targetElement = document.querySelector(targetId);
  if (!targetElement) {
    return;
  }

  event.preventDefault();
  const targetY = targetElement.getBoundingClientRect().top + window.scrollY - 24;
  scrollToTarget(Math.max(targetY, 0));

  if (window.innerWidth <= 900) {
    closeSidebar();
  }
};

if (sidebarToggle) {
  sidebarToggle.addEventListener('click', () => {
    const isOpen = !sidebar?.classList.contains('is-collapsed');
    setSidebarState(!isOpen);
  });
}

sidebarOverlay?.addEventListener('click', closeSidebar);

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => handleAnchorNavigation(event, link));
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  if (!link.classList.contains('nav-link')) {
    link.addEventListener('click', (event) => handleAnchorNavigation(event, link));
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    sidebarOverlay?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sidebar-open');
  } else {
    sidebarOverlay?.setAttribute('aria-hidden', String(sidebar?.classList.contains('is-collapsed')));
    document.body.classList.toggle('sidebar-open', window.innerWidth <= 900 && !sidebar?.classList.contains('is-collapsed'));
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('is-visible', window.scrollY > 500);
});

backToTop?.addEventListener('click', (event) => {
  event.preventDefault();
  scrollToTarget(0);
});

applyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const position = button.dataset.position;
    positionField.value = position;
    applicationModal.classList.add('is-open');
    applicationModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    applicationStatus.textContent = '';
  });
});

const closeModalHandler = () => {
  applicationModal.classList.remove('is-open');
  applicationModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  applicationForm.reset();
  fileName.textContent = 'No file selected';
  applicationStatus.textContent = '';
};

closeModal?.addEventListener('click', closeModalHandler);
applicationModal?.addEventListener('click', (event) => {
  if (event.target === applicationModal) {
    closeModalHandler();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && applicationModal.classList.contains('is-open')) {
    closeModalHandler();
  }
});

cvInput?.addEventListener('change', () => {
  const file = cvInput.files?.[0];
  if (!file) {
    fileName.textContent = 'No file selected';
    return;
  }
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  const sizeOk = file.size <= 5 * 1024 * 1024;
  const typeOk = allowedTypes.includes(file.type) || allowedExtensions.includes(extension);

  if (!typeOk) {
    fileName.textContent = 'Please upload a PDF or Word document.';
    cvInput.value = '';
    return;
  }

  if (!sizeOk) {
    fileName.textContent = 'File must be 5MB or smaller.';
    cvInput.value = '';
    return;
  }

  fileName.textContent = file.name;
});

applicationForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(applicationForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const cv = cvInput.files?.[0];

  if (!name || !email || !phone || !message || !cv) {
    applicationStatus.textContent = 'Please complete every field before submitting the demo application.';
    return;
  }

  const validEmail = /.+@.+\..+/i.test(email);
  if (!validEmail) {
    applicationStatus.textContent = 'Please enter a valid email address.';
    return;
  }

  applicationStatus.textContent = 'Application prepared successfully. In a production environment, your CV would now be securely submitted to the Cape Town Farm recruitment team.';
  setTimeout(closeModalHandler, 1800);
});

feedbackForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = feedbackForm.message.value.trim();
  const status = feedbackForm.querySelector('.form-status');
  if (!message) {
    status.textContent = 'Please share a short note before submitting your demo feedback.';
    return;
  }
  status.textContent = 'Thank you. This demo feedback has been prepared locally and is not sent to a real team.';
  feedbackForm.reset();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((chip) => chip.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    vacancyCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.style.display = matches ? 'block' : 'none';
    });
  });
});
