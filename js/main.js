/**
 * Cape Town Farm — Master Application & Experience Orchestrator
 * Integrates global navigation, portal switcher, simulated email center,
 * toast notifications, public page interactions, and smooth animations.
 */

import { farmState } from './state.js';
import './careers.js';
import './hr.js';
import './operations.js';

class AppOrchestrator {
  constructor() {
    this.currentPortal = 'public'; // 'public' | 'hr' | 'operations'
    this.initElements();
    this.bindEvents();
    this.initIntersectionObservers();
    this.updateEmailBadge();

    // Listen to state changes
    farmState.subscribe(() => {
      this.updateEmailBadge();
      this.renderEmailInbox();
    });
  }

  initElements() {
    this.sidebar = document.getElementById('sidebar');
    this.sidebarToggle = document.getElementById('sidebarToggle');
    this.sidebarOverlay = document.getElementById('sidebarOverlay');
    this.backToTop = document.getElementById('backToTop');
    this.publicView = document.getElementById('publicWebsiteView');
    this.hrPortalView = document.getElementById('hrPortal');
    this.opsPortalView = document.getElementById('opsPortal');
    this.emailDrawer = document.getElementById('emailCenterDrawer');
    this.emailBadge = document.getElementById('simulatedEmailBadge');
    this.toastContainer = document.getElementById('toastContainer');
  }

  bindEvents() {
    // Mobile Sidebar Drawer Toggle
    this.sidebarToggle?.addEventListener('click', () => {
      const isCollapsed = this.sidebar?.classList.contains('is-collapsed');
      this.setSidebarState(isCollapsed);
    });

    this.sidebarOverlay?.addEventListener('click', () => this.setSidebarState(false));

    // Handle Window Resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        this.sidebarOverlay?.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('sidebar-open');
      } else {
        this.sidebarOverlay?.setAttribute('aria-hidden', String(this.sidebar?.classList.contains('is-collapsed')));
        document.body.classList.toggle('sidebar-open', !this.sidebar?.classList.contains('is-collapsed'));
      }
    });

    // Initial sidebar state on load
    this.setSidebarState(window.innerWidth > 900);

    // Global Portal Switchers (Sidebar & Footer Links)
    document.querySelectorAll('[data-portal-target]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPortal = el.dataset.portalTarget;
        this.switchPortal(targetPortal);
        if (window.innerWidth <= 900) {
          this.setSidebarState(false);
        }
      });
    });

    // Public Section Navigation
    document.querySelectorAll('.sidebar__nav .nav-link, a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        // If we are currently in HR or Operations portal, switch back to public first
        if (this.currentPortal !== 'public' && href.startsWith('#')) {
          this.switchPortal('public');
          setTimeout(() => this.scrollToSection(href), 100);
        } else if (href.startsWith('#')) {
          e.preventDefault();
          this.scrollToSection(href);
        }

        if (window.innerWidth <= 900) {
          this.setSidebarState(false);
        }
      });
    });

    // Back to top button
    window.addEventListener('scroll', () => {
      this.backToTop?.classList.toggle('is-visible', window.scrollY > 500);
    });

    this.backToTop?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Simulated Email Center Toggle
    document.querySelectorAll('.btn-open-email-center').forEach((btn) => {
      btn.addEventListener('click', () => this.openEmailDrawer());
    });

    document.getElementById('closeEmailDrawer')?.addEventListener('click', () => this.closeEmailDrawer());
    document.getElementById('emailDrawerBackdrop')?.addEventListener('click', () => this.closeEmailDrawer());

    // Listen for custom simulated email event to trigger toast
    window.addEventListener('ctf-simulated-email', (e) => {
      const email = e.detail;
      this.showToast({
        title: `📧 ${email.badge}`,
        message: email.subject,
        actionText: 'View Email',
        onAction: () => {
          this.openEmailDrawer();
          this.inspectEmail(email.id);
        }
      });
    });

    // Contact Form submission
    const contactForm = document.getElementById('estateContactForm');
    contactForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusEl = document.getElementById('contactFormStatus');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting Enquiry...';
      }

      setTimeout(() => {
        if (statusEl) {
          statusEl.innerHTML = `
            <div class="form-status-alert success">
              <strong>✓ Enquiry Received:</strong> Thank you for reaching out to Cape Town Farm. Our estate team has logged your correspondence and will respond shortly.
            </div>
          `;
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Estate Enquiry';
        }
      }, 750);
    });

    // Footer Feedback Form
    const feedbackForm = document.getElementById('feedbackForm');
    feedbackForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = feedbackForm.querySelector('.form-status');
      if (status) {
        status.textContent = 'Thank you for your feedback. Logged in demonstration session.';
      }
      feedbackForm.reset();
    });
  }

  setSidebarState(isOpen) {
    this.sidebar?.classList.toggle('is-collapsed', !isOpen);
    this.sidebarToggle?.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('sidebar-open', window.innerWidth <= 900 && isOpen);
    this.sidebarOverlay?.setAttribute('aria-hidden', String(!isOpen));
  }

  switchPortal(portalName) {
    this.currentPortal = portalName;

    // Toggle view containers
    if (this.publicView) this.publicView.style.display = portalName === 'public' ? 'block' : 'none';
    if (this.hrPortalView) this.hrPortalView.style.display = portalName === 'hr' ? 'block' : 'none';
    if (this.opsPortalView) this.opsPortalView.style.display = portalName === 'operations' ? 'block' : 'none';

    // Update portal switcher buttons in sidebar
    document.querySelectorAll('[data-portal-target]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.portalTarget === portalName);
    });

    // Update sidebar navigation mode
    const publicNav = document.getElementById('publicNavGroup');
    const hrNav = document.getElementById('hrNavGroup');
    const opsNav = document.getElementById('opsNavGroup');

    if (publicNav) publicNav.style.display = portalName === 'public' ? 'grid' : 'none';
    if (hrNav) hrNav.style.display = portalName === 'hr' ? 'grid' : 'none';
    if (opsNav) opsNav.style.display = portalName === 'operations' ? 'grid' : 'none';

    // Scroll to top of view
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  scrollToSection(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    const targetY = target.getBoundingClientRect().top + window.scrollY - 30;
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });

    // Update active nav link
    document.querySelectorAll('.sidebar__nav .nav-link').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });
  }

  initIntersectionObservers() {
    // Reveal animations
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

    // Section scroll spy for sidebar nav
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        if (this.currentPortal !== 'public') return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            document.querySelectorAll('.sidebar__nav .nav-link').forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('main section[id]').forEach((sec) => sectionObserver.observe(sec));
  }

  // --- SIMULATED EMAIL CENTER ---

  updateEmailBadge() {
    const emails = farmState.getEmails();
    if (this.emailBadge) {
      this.emailBadge.textContent = emails.length;
      this.emailBadge.style.display = emails.length > 0 ? 'inline-flex' : 'none';
    }
  }

  openEmailDrawer() {
    this.renderEmailInbox();
    this.emailDrawer?.classList.add('is-open');
    this.emailDrawer?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeEmailDrawer() {
    this.emailDrawer?.classList.remove('is-open');
    this.emailDrawer?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  renderEmailInbox() {
    const listContainer = document.getElementById('emailListContainer');
    const detailContainer = document.getElementById('emailDetailContainer');
    if (!listContainer) return;

    const emails = farmState.getEmails();

    if (emails.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state-card py-6">
          <p class="text-muted">No simulated emails dispatched yet.</p>
        </div>
      `;
      if (detailContainer) detailContainer.innerHTML = '<p class="text-muted text-center py-6">Select an email to view full template preview.</p>';
      return;
    }

    listContainer.innerHTML = emails
      .map(
        (email, idx) => `
        <div class="email-inbox-item ${idx === 0 ? 'active' : ''}" data-id="${email.id}">
          <div class="email-item-header">
            <span class="email-badge">${email.badge}</span>
            <span class="email-date">${email.timestamp}</span>
          </div>
          <h4 class="email-subject">${email.subject}</h4>
          <p class="email-preview">${email.preview}</p>
          <span class="email-recipient">To: <strong>${email.to}</strong></span>
        </div>
      `
      )
      .join('');

    // Attach click to inspect
    listContainer.querySelectorAll('.email-inbox-item').forEach((item) => {
      item.addEventListener('click', () => {
        listContainer.querySelectorAll('.email-inbox-item').forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
        this.inspectEmail(item.dataset.id);
      });
    });

    // Default inspect first email
    if (emails.length > 0) {
      this.inspectEmail(emails[0].id);
    }
  }

  inspectEmail(id) {
    const detailContainer = document.getElementById('emailDetailContainer');
    if (!detailContainer) return;

    const email = farmState.getEmails().find((e) => e.id === id);
    if (!email) return;

    detailContainer.innerHTML = `
      <div class="email-detail-card">
        <div class="email-detail-meta">
          <div class="meta-row"><strong>From:</strong> <span>${email.from}</span></div>
          <div class="meta-row"><strong>To:</strong> <span>${email.to}</span></div>
          <div class="meta-row"><strong>Subject:</strong> <span>${email.subject}</span></div>
          <div class="meta-row"><strong>Timestamp:</strong> <span>${email.timestamp}</span></div>
          <div class="meta-row"><strong>Type:</strong> <span class="email-badge">${email.badge}</span></div>
        </div>
        <div class="email-detail-body">
          ${email.bodyHtml}
        </div>
      </div>
    `;
  }

  // --- TOAST NOTIFICATIONS ---

  showToast({ title, message, actionText, onAction }) {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast-alert';
    toast.innerHTML = `
      <div class="toast-content">
        <strong class="toast-title">${title}</strong>
        <p class="toast-msg">${message}</p>
      </div>
      ${actionText ? `<button type="button" class="btn-toast-action">${actionText}</button>` : ''}
      <button type="button" class="btn-toast-close">✕</button>
    `;

    if (actionText && onAction) {
      toast.querySelector('.btn-toast-action')?.addEventListener('click', () => {
        onAction();
        toast.remove();
      });
    }

    toast.querySelector('.btn-toast-close')?.addEventListener('click', () => toast.remove());

    this.toastContainer.appendChild(toast);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 6000);
  }
}

// Instantiate master app
document.addEventListener('DOMContentLoaded', () => {
  window.farmApp = new AppOrchestrator();
});
