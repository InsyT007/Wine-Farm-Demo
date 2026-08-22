/**
 * Cape Town Farm — Operations Governance & Approval Dashboard
 * Allows agricultural operations leadership to review job requisitions,
 * inspect role specifications, approve vacancies for public posting,
 * or return requisitions to HR with mandatory feedback.
 */

import { farmState } from './state.js';

class OperationsController {
  constructor() {
    this.pendingQueueContainer = document.getElementById('opsPendingList');
    this.approvedListContainer = document.getElementById('opsApprovedList');
    this.rejectionModal = document.getElementById('opsRejectionModal');
    this.jobToRejectId = null;

    this.bindEvents();
    this.render();

    farmState.subscribe(() => this.render());
  }

  bindEvents() {
    // Rejection modal close
    document.getElementById('closeOpsRejectionModal')?.addEventListener('click', () => this.closeRejectionModal());
    this.rejectionModal?.addEventListener('click', (e) => {
      if (e.target === this.rejectionModal) this.closeRejectionModal();
    });

    // Rejection submission form
    document.getElementById('opsRejectionForm')?.addEventListener('submit', (e) => this.handleConfirmRejection(e));
  }

  render() {
    this.renderPendingApprovals();
    this.renderApprovedAndActiveJobs();
    this.renderGovernanceMetrics();
  }

  renderGovernanceMetrics() {
    const allJobs = farmState.jobs;
    const pending = allJobs.filter((j) => j.status === 'pending_approval').length;
    const active = allJobs.filter((j) => j.status === 'published').length;
    const rejected = allJobs.filter((j) => j.rejectionReason && j.status === 'draft').length;
    const closed = allJobs.filter((j) => j.status === 'closed').length;

    const kpiEl = document.getElementById('opsKpiSummary');
    if (!kpiEl) return;

    kpiEl.innerHTML = `
      <div class="kpi-card ${pending > 0 ? 'highlight-gold' : ''}">
        <span class="kpi-label">Requisitions Awaiting Approval</span>
        <strong class="kpi-value text-gold">${pending}</strong>
        <span class="kpi-subtext">Immediate sign-off required</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Active Field Requisitions</span>
        <strong class="kpi-value text-green">${active}</strong>
        <span class="kpi-subtext">Published on public portal</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Returned for HR Revision</span>
        <strong class="kpi-value">${rejected}</strong>
        <span class="kpi-subtext">With operational feedback</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Total Closed / Filled</span>
        <strong class="kpi-value text-muted">${closed}</strong>
        <span class="kpi-subtext">Archived vacancies</span>
      </div>
    `;
  }

  renderPendingApprovals() {
    if (!this.pendingQueueContainer) return;

    const pendingJobs = farmState.jobs.filter((j) => j.status === 'pending_approval');

    if (pendingJobs.length === 0) {
      this.pendingQueueContainer.innerHTML = `
        <div class="empty-state-card py-6">
          <div class="empty-state-icon">✅</div>
          <h3>All Requisitions Cleared</h3>
          <p>There are currently no outstanding job requisitions awaiting operational approval.</p>
        </div>
      `;
      return;
    }

    this.pendingQueueContainer.innerHTML = pendingJobs
      .map(
        (job) => `
        <div class="ops-review-card" data-id="${job.id}">
          <div class="ops-card-header">
            <div>
              <span class="dept-badge">${job.department}</span>
              <span class="type-badge">${job.type}</span>
              <h3>${job.title}</h3>
            </div>
            <div class="ops-card-meta">
              <span>👤 Submitted by: <strong>${job.createdBy || 'HR Lead'}</strong></span>
              <span>🗓 Date: <strong>${job.submittedAt || job.createdAt}</strong></span>
              <span>💰 Proposed: <strong>${job.salary || 'Standard Band'}</strong></span>
              <span>⏳ Proposed Deadline: <strong>${job.closingDate || 'None'}</strong></span>
            </div>
          </div>

          <div class="ops-card-body">
            <div class="ops-info-box">
              <h4>Role Purpose & Description</h4>
              <p>${job.description}</p>
            </div>

            <div class="ops-grid-2">
              <div class="ops-info-box">
                <h4>Responsibilities</h4>
                <ul class="dossier-list">
                  ${job.responsibilities?.map((r) => `<li>${r}</li>`).join('') || '<li>General duties</li>'}
                </ul>
              </div>
              <div class="ops-info-box">
                <h4>Requirements & Criteria</h4>
                <ul class="dossier-list">
                  ${job.requirements?.map((req) => `<li>${req}</li>`).join('') || '<li>Standard criteria</li>'}
                </ul>
              </div>
            </div>

            ${
              job.customQuestions && job.customQuestions.length > 0
                ? `
              <div class="ops-info-box">
                <h4>Configured Assessment Questions (${job.customQuestions.length})</h4>
                <ul class="question-preview-list">
                  ${job.customQuestions.map((q) => `<li><strong>${q.label}</strong> <em>(${q.type}, ${q.required ? 'Mandatory' : 'Optional'})</em></li>`).join('')}
                </ul>
              </div>
            `
                : ''
            }
          </div>

          <div class="ops-card-actions">
            <button class="button button--secondary btn-ops-reject" data-id="${job.id}">✕ Reject / Request Revisions</button>
            <button class="button button--primary btn-ops-approve" data-id="${job.id}">✓ Approve & Publish Vacancy</button>
          </div>
        </div>
      `
      )
      .join('');

    // Attach Approve & Reject events
    this.pendingQueueContainer.querySelectorAll('.btn-ops-approve').forEach((btn) => {
      btn.addEventListener('click', () => {
        const jobId = btn.dataset.id;
        const job = farmState.approveJob(jobId, 'Kobus Malan (Operations Director)');
        if (job) {
          alert(`Success: "${job.title}" has been approved and is now live on the public Careers portal.`);
        }
      });
    });

    this.pendingQueueContainer.querySelectorAll('.btn-ops-reject').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.openRejectionModal(btn.dataset.id);
      });
    });
  }

  renderApprovedAndActiveJobs() {
    if (!this.approvedListContainer) return;

    const publishedJobs = farmState.jobs.filter((j) => j.status === 'published');
    const closedJobs = farmState.jobs.filter((j) => j.status === 'closed');
    const combined = [...publishedJobs, ...closedJobs];

    if (combined.length === 0) {
      this.approvedListContainer.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-6 text-muted">No historical or active approved jobs found.</td>
        </tr>
      `;
      return;
    }

    this.approvedListContainer.innerHTML = combined
      .map(
        (job) => `
        <tr>
          <td><strong>${job.title}</strong></td>
          <td><span class="dept-badge">${job.department}</span></td>
          <td>${job.salary || 'Standard Package'}</td>
          <td>${job.closingDate || 'No Deadline'}</td>
          <td>
            <span class="status-pill status-${job.status}">${job.status.toUpperCase()}</span>
          </td>
          <td>
            <span class="subtext">Approved by: ${job.approvedBy || 'Operations'} (${job.approvedAt || '—'})</span>
          </td>
        </tr>
      `
      )
      .join('');
  }

  // --- REJECTION MODAL ---

  openRejectionModal(jobId) {
    this.jobToRejectId = jobId;
    const job = farmState.getJobById(jobId);
    const titleEl = document.getElementById('opsRejectionJobTitle');
    if (titleEl && job) titleEl.textContent = `Return Requisition: ${job.title}`;

    const textarea = document.getElementById('opsRejectionReasonInput');
    if (textarea) textarea.value = '';

    this.rejectionModal.classList.add('is-open');
    this.rejectionModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeRejectionModal() {
    this.rejectionModal?.classList.remove('is-open');
    this.rejectionModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.jobToRejectId = null;
  }

  handleConfirmRejection(e) {
    e.preventDefault();
    if (!this.jobToRejectId) return;

    const reason = document.getElementById('opsRejectionReasonInput')?.value.trim();
    if (!reason) {
      alert('A rejection reason or revision instruction is mandatory.');
      return;
    }

    const job = farmState.rejectJob(this.jobToRejectId, reason, 'Kobus Malan (Operations Director)');
    this.closeRejectionModal();
    if (job) {
      alert(`Requisition for "${job.title}" returned to HR Lead Helena van der Merwe with revision feedback.`);
    }
  }
}

export const operationsController = new OperationsController();

