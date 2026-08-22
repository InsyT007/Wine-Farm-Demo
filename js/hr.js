/**
 * Cape Town Farm — Internal HR Recruitment Dashboard
 * Manages recruitment KPIs, candidate pipeline (Kanban & Table),
 * candidate dossier review, private notes, audit history, job creator wizard, and job closures.
 */

import { farmState } from './state.js';

class HRController {
  constructor() {
    this.currentTab = 'pipeline'; // 'pipeline' | 'table' | 'jobs'
    this.selectedApplicant = null;
    this.appSearch = '';
    this.appDeptFilter = 'all';
    this.appStatusFilter = 'all';
    this.appSort = 'newest';

    this.initElements();
    this.bindEvents();
    this.renderAll();

    farmState.subscribe(() => this.renderAll());
  }

  initElements() {
    this.kpiContainer = document.getElementById('hrKpiGrid');
    this.pipelineContainer = document.getElementById('hrPipelineBoard');
    this.tableContainer = document.getElementById('hrApplicantTableBody');
    this.jobsTableContainer = document.getElementById('hrJobsTableBody');
    this.dossierModal = document.getElementById('candidateDossierModal');
    this.jobCreatorModal = document.getElementById('jobCreatorModal');
    this.closureModal = document.getElementById('jobClosureModal');
    this.docViewerModal = document.getElementById('docViewerModal');
  }

  bindEvents() {
    // Tab switching within HR Portal
    document.querySelectorAll('.hr-subnav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.hr-subnav-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTab = btn.dataset.tab;
        this.updateTabVisibility();
      });
    });

    // Filtering & Search
    document.getElementById('hrSearchInput')?.addEventListener('input', (e) => {
      this.appSearch = e.target.value.trim();
      this.renderApplicants();
    });

    document.getElementById('hrDeptFilter')?.addEventListener('change', (e) => {
      this.appDeptFilter = e.target.value;
      this.renderApplicants();
    });

    document.getElementById('hrStatusFilter')?.addEventListener('change', (e) => {
      this.appStatusFilter = e.target.value;
      this.renderApplicants();
    });

    document.getElementById('hrSortSelect')?.addEventListener('change', (e) => {
      this.appSort = e.target.value;
      this.renderApplicants();
    });

    // Close Modals
    document.getElementById('closeDossierModal')?.addEventListener('click', () => this.closeDossier());
    this.dossierModal?.addEventListener('click', (e) => {
      if (e.target === this.dossierModal) this.closeDossier();
    });

    document.getElementById('closeJobCreatorModal')?.addEventListener('click', () => this.closeJobCreator());
    this.jobCreatorModal?.addEventListener('click', (e) => {
      if (e.target === this.jobCreatorModal) this.closeJobCreator();
    });

    document.getElementById('closeClosureModal')?.addEventListener('click', () => this.closeJobClosure());
    this.closureModal?.addEventListener('click', (e) => {
      if (e.target === this.closureModal) this.closeJobClosure();
    });

    document.getElementById('closeDocViewerModal')?.addEventListener('click', () => this.closeDocViewer());
    this.docViewerModal?.addEventListener('click', (e) => {
      if (e.target === this.docViewerModal) this.closeDocViewer();
    });

    // Add Internal Note form in Dossier
    document.getElementById('addInternalNoteForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const textInput = document.getElementById('hrNewNoteText');
      const authorInput = document.getElementById('hrNoteAuthor');
      const text = textInput?.value.trim();
      const author = authorInput?.value.trim() || 'Helena van der Merwe (HR Lead)';

      if (text && this.selectedApplicant) {
        farmState.addApplicationNote(this.selectedApplicant.id, text, author);
        textInput.value = '';
        this.openDossier(farmState.getApplicationById(this.selectedApplicant.id));
      }
    });

    // Status transition dropdown in Dossier
    document.getElementById('dossierStatusSelect')?.addEventListener('change', (e) => {
      const newStatus = e.target.value;
      if (newStatus && this.selectedApplicant) {
        const note = prompt(`Optional note for transitioning status to "${newStatus}":`) || '';
        farmState.updateApplicationStatus(this.selectedApplicant.id, newStatus, 'Helena van der Merwe (HR Lead)', note);
        this.openDossier(farmState.getApplicationById(this.selectedApplicant.id));
      }
    });

    // Job Creator Trigger
    document.getElementById('btnOpenJobCreator')?.addEventListener('click', () => this.openJobCreator());
    document.getElementById('jobCreatorForm')?.addEventListener('submit', (e) => this.handleSaveJob(e));
    document.getElementById('btnAddCustomQuestion')?.addEventListener('click', () => this.addCustomQuestionField());

    // Job Closure Form
    document.getElementById('jobClosureForm')?.addEventListener('submit', (e) => this.handleConfirmJobClosure(e));

    // Reset Demo State button
    document.getElementById('btnResetDemoData')?.addEventListener('click', () => {
      if (confirm('Reset prototype data back to initial seed dataset? This will clear locally submitted applications and created jobs.')) {
        farmState.resetAll();
        alert('Prototype data reset to initial seed state.');
      }
    });
  }

  renderAll() {
    this.renderKPIs();
    this.renderApplicants();
    this.renderJobsManagement();
    this.updateTabVisibility();
  }

  updateTabVisibility() {
    const pipelineView = document.getElementById('hrPipelineView');
    const tableView = document.getElementById('hrTableView');
    const jobsView = document.getElementById('hrJobsView');

    if (pipelineView) pipelineView.style.display = this.currentTab === 'pipeline' ? 'block' : 'none';
    if (tableView) tableView.style.display = this.currentTab === 'table' ? 'block' : 'none';
    if (jobsView) jobsView.style.display = this.currentTab === 'jobs' ? 'block' : 'none';
  }

  // --- KPIS ---

  renderKPIs() {
    if (!this.kpiContainer) return;

    const allJobs = farmState.jobs;
    const allApps = farmState.applications;

    const activeJobs = allJobs.filter((j) => j.status === 'published').length;
    const pendingOps = allJobs.filter((j) => j.status === 'pending_approval').length;
    const newApps = allApps.filter((a) => a.status === 'New Application').length;
    const underReview = allApps.filter((a) => a.status === 'Under Review').length;
    const shortlisted = allApps.filter((a) => a.status === 'Shortlisted').length;
    const interviews = allApps.filter((a) => a.status === 'Interview').length;
    const hired = allApps.filter((a) => a.status === 'Hired').length;
    const closed = allJobs.filter((j) => j.status === 'closed').length;

    this.kpiContainer.innerHTML = `
      <div class="kpi-card">
        <span class="kpi-label">Active Published Jobs</span>
        <strong class="kpi-value text-green">${activeJobs}</strong>
        <span class="kpi-subtext">Live on public portal</span>
      </div>
      <div class="kpi-card ${pendingOps > 0 ? 'highlight-gold' : ''}">
        <span class="kpi-label">Pending Ops Approvals</span>
        <strong class="kpi-value text-gold">${pendingOps}</strong>
        <span class="kpi-subtext">Awaiting Operations sign-off</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">New Applications</span>
        <strong class="kpi-value text-green">${newApps}</strong>
        <span class="kpi-subtext">Unreviewed submissions</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">In Review / Shortlist</span>
        <strong class="kpi-value">${underReview + shortlisted}</strong>
        <span class="kpi-subtext">${underReview} review · ${shortlisted} shortlisted</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Interviews & Offers</span>
        <strong class="kpi-value">${interviews}</strong>
        <span class="kpi-subtext">Active recruitment pipeline</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Hired Candidates</span>
        <strong class="kpi-value text-green">${hired}</strong>
        <span class="kpi-subtext">Successfully onboarded</span>
      </div>
    `;
  }

  // --- APPLICANT PIPELINE & TABLE ---

  renderApplicants() {
    const apps = farmState.getApplications({
      department: this.appDeptFilter,
      status: this.appStatusFilter,
      search: this.appSearch,
      sort: this.appSort
    });

    this.renderKanbanPipeline(apps);
    this.renderApplicantTable(apps);
  }

  renderKanbanPipeline(apps) {
    if (!this.pipelineContainer) return;

    const stages = [
      { key: 'New Application', label: 'New Submissions', icon: '📥' },
      { key: 'Under Review', label: 'Under Review', icon: '🔍' },
      { key: 'Shortlisted', label: 'Shortlisted', icon: '⭐' },
      { key: 'Interview', label: 'Interviews', icon: '🗓' },
      { key: 'Offer', label: 'Offer Extended', icon: '💼' },
      { key: 'Hired', label: 'Hired', icon: '🎉' },
      { key: 'Rejected', label: 'Archived / Rejected', icon: '📁' }
    ];

    this.pipelineContainer.innerHTML = stages
      .map((stage) => {
        const stageApps = apps.filter((a) => a.status === stage.key);
        return `
          <div class="kanban-column" data-stage="${stage.key}">
            <div class="kanban-column-header">
              <div class="column-title">
                <span>${stage.icon}</span>
                <strong>${stage.label}</strong>
              </div>
              <span class="column-count">${stageApps.length}</span>
            </div>
            <div class="kanban-cards-container">
              ${
                stageApps.length > 0
                  ? stageApps
                      .map(
                        (app) => `
                    <div class="candidate-card" data-id="${app.id}">
                      <div class="candidate-card-head">
                        <span class="card-ref">${app.refNumber}</span>
                        <span class="card-date">${app.appliedAt.split(' ')[0]}</span>
                      </div>
                      <h4 class="candidate-name">${app.applicantName}</h4>
                      <p class="candidate-job">🎯 ${app.jobTitle}</p>
                      <div class="candidate-tags">
                        <span class="card-tag dept">${app.department}</span>
                        ${app.documents?.length ? `<span class="card-tag docs">📄 ${app.documents.length} Docs</span>` : ''}
                        ${app.talentPoolConsent ? '<span class="card-tag consent" title="Consented to talent pool">💾 Pool</span>' : ''}
                      </div>
                      <div class="candidate-card-footer">
                        <button type="button" class="btn-dossier-link" data-id="${app.id}">View Dossier →</button>
                      </div>
                    </div>
                  `
                      )
                      .join('')
                  : '<div class="kanban-empty-slot">No candidates in this stage</div>'
              }
            </div>
          </div>
        `;
      })
      .join('');

    // Attach card click handlers
    this.pipelineContainer.querySelectorAll('.btn-dossier-link, .candidate-card').forEach((el) => {
      el.addEventListener('click', (e) => {
        const id = el.dataset.id || el.closest('.candidate-card')?.dataset.id;
        const app = farmState.getApplicationById(id);
        if (app) this.openDossier(app);
      });
    });
  }

  renderApplicantTable(apps) {
    if (!this.tableContainer) return;

    if (apps.length === 0) {
      this.tableContainer.innerHTML = `
        <tr>
          <td colspan="7" class="text-center py-6">
            <p class="text-muted">No applicants found matching the selected filters.</p>
          </td>
        </tr>
      `;
      return;
    }

    this.tableContainer.innerHTML = apps
      .map(
        (app) => `
        <tr>
          <td><strong class="ref-code">${app.refNumber}</strong></td>
          <td>
            <strong>${app.applicantName}</strong><br>
            <span class="subtext-email">${app.email}</span>
          </td>
          <td>${app.jobTitle}</td>
          <td><span class="dept-badge">${app.department}</span></td>
          <td>${app.appliedAt.split(' ')[0]}</td>
          <td><span class="status-pill status-${app.status.toLowerCase().replace(/\s+/g, '-')}">${app.status}</span></td>
          <td>
            <button class="button button--small button--secondary btn-table-dossier" data-id="${app.id}">Review Dossier</button>
          </td>
        </tr>
      `
      )
      .join('');

    this.tableContainer.querySelectorAll('.btn-table-dossier').forEach((btn) => {
      btn.addEventListener('click', () => {
        const app = farmState.getApplicationById(btn.dataset.id);
        if (app) this.openDossier(app);
      });
    });
  }

  // --- CANDIDATE DOSSIER MODAL ---

  openDossier(app) {
    this.selectedApplicant = app;
    const body = document.getElementById('candidateDossierContent');
    const title = document.getElementById('dossierApplicantTitle');
    const subtitle = document.getElementById('dossierApplicantMeta');
    const statusSelect = document.getElementById('dossierStatusSelect');

    if (title) title.textContent = `${app.applicantName} — Dossier`;
    if (subtitle) subtitle.textContent = `${app.jobTitle} · ${app.department} · Ref: ${app.refNumber} · Applied: ${app.appliedAt}`;
    if (statusSelect) statusSelect.value = app.status;

    if (body) {
      body.innerHTML = `
        <div class="dossier-split-layout">
          <!-- LEFT PANEL: Candidate Details & Responses -->
          <div class="dossier-left-panel">
            <div class="dossier-box">
              <h4>Personal Details</h4>
              <div class="dossier-keyvalue-grid">
                <div><strong>Full Name:</strong> <span>${app.applicantName}</span></div>
                <div><strong>Email:</strong> <span><a href="mailto:${app.email}">${app.email}</a></span></div>
                <div><strong>Phone:</strong> <span>${app.phone}</span></div>
                <div><strong>ID / Passport:</strong> <span>${app.idNumber}</span></div>
                <div><strong>Date of Birth:</strong> <span>${app.dob || '—'}</span></div>
                <div style="grid-column: 1 / -1;"><strong>Address:</strong> <span>${app.address || '—'}</span></div>
              </div>
            </div>

            <div class="dossier-box">
              <h4>Role-Specific Assessment Responses</h4>
              ${
                app.questionResponses && app.questionResponses.length > 0
                  ? `<div class="dossier-q-list">
                      ${app.questionResponses
                        .map(
                          (q) => `
                        <div class="dossier-q-item">
                          <p class="q-title"><strong>${q.label}</strong></p>
                          <p class="q-body">${Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}</p>
                        </div>
                      `
                        )
                        .join('')}
                    </div>`
                  : '<p class="text-muted">No custom questionnaire responses recorded.</p>'
              }
            </div>

            <div class="dossier-box">
              <h4>Qualifications & Practical Experience</h4>
              <p><strong>Education:</strong> ${app.education?.highestLevel || '—'} — ${app.education?.institution || ''} (${app.education?.yearCompleted || ''})</p>
              <p><strong>Skills:</strong> ${app.skills || '—'}</p>
              ${
                app.workExperience && app.workExperience.length > 0
                  ? `<div class="experience-list">
                      <strong>Work History:</strong>
                      ${app.workExperience
                        .map(
                          (w) => `
                        <div class="work-exp-item">
                          <p><strong>${w.role}</strong> at <em>${w.company}</em> (${w.duration})</p>
                          <p class="subtext">${w.responsibilities}</p>
                        </div>
                      `
                        )
                        .join('')}
                    </div>`
                  : ''
              }
            </div>

            <div class="dossier-box">
              <h4>Privacy & Data Retention</h4>
              <p>
                <strong>Status:</strong> ${
                  app.talentPoolConsent
                    ? '<span class="text-green">✅ Retained in Talent Pool (Consented for future vacancies)</span>'
                    : '<span class="text-gold">🔒 Single-application only (Schedule post-process purge)</span>'
                }
              </p>
            </div>
          </div>

          <!-- RIGHT PANEL: Documents Dossier & Private Notes -->
          <div class="dossier-right-panel">
            <div class="dossier-box">
              <h4>Submitted Application Documents</h4>
              <div class="dossier-docs-list">
                ${
                  app.documents && app.documents.length > 0
                    ? app.documents
                        .map(
                          (doc) => `
                      <div class="dossier-doc-card">
                        <div class="doc-meta">
                          <span class="doc-icon">📄</span>
                          <div>
                            <strong>${doc.name}</strong>
                            <span class="subtext">${doc.type} · ${doc.size || 'Verified'}</span>
                          </div>
                        </div>
                        <div class="doc-btns">
                          <button type="button" class="btn-preview-doc" data-name="${doc.name}" data-type="${doc.type}">Preview</button>
                        </div>
                      </div>
                    `
                        )
                        .join('')
                    : '<p class="text-muted">No uploaded documents attached.</p>'
                }
              </div>
            </div>

            <div class="dossier-box">
              <h4>Internal HR Notes <span class="badge-private">Private / Internal Only</span></h4>
              <div class="internal-notes-stream">
                ${
                  app.internalNotes && app.internalNotes.length > 0
                    ? app.internalNotes
                        .map(
                          (n) => `
                      <div class="note-card">
                        <div class="note-head">
                          <strong>${n.author}</strong>
                          <span class="note-time">${n.timestamp}</span>
                        </div>
                        <p class="note-body">${n.text}</p>
                      </div>
                    `
                        )
                        .join('')
                    : '<p class="text-muted">No internal notes added yet.</p>'
                }
              </div>
            </div>

            <div class="dossier-box">
              <h4>Audit Trail & Status History</h4>
              <div class="audit-timeline">
                ${
                  app.auditTrail && app.auditTrail.length > 0
                    ? app.auditTrail
                        .map(
                          (a) => `
                      <div class="audit-event">
                        <div class="audit-dot"></div>
                        <div class="audit-content">
                          <span class="audit-time">${a.timestamp} · <em>${a.user}</em></span>
                          <p class="audit-text">${a.event}</p>
                        </div>
                      </div>
                    `
                        )
                        .join('')
                    : '<p class="text-muted">Audit history is empty.</p>'
                }
              </div>
            </div>
          </div>
        </div>
      `;

      // Attach doc preview clicks
      body.querySelectorAll('.btn-preview-doc').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.openDocViewer(btn.dataset.name, btn.dataset.type);
        });
      });
    }

    this.dossierModal.classList.add('is-open');
    this.dossierModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeDossier() {
    this.dossierModal?.classList.remove('is-open');
    this.dossierModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // --- DOCUMENT VIEWER MODAL ---

  openDocViewer(fileName, fileType) {
    const title = document.getElementById('docViewerTitle');
    const frame = document.getElementById('docViewerFrame');

    if (title) title.textContent = `Document Preview — ${fileName}`;
    if (frame) {
      frame.innerHTML = `
        <div class="simulated-document-page">
          <div class="doc-header">
            <h3>CAPE TOWN FARM — APPLICANT DOSSIER FILE</h3>
            <p>File: <strong>${fileName}</strong> &nbsp;|&nbsp; Verified Document Type: <strong>${fileType}</strong></p>
          </div>
          <div class="doc-body-placeholder">
            <p><strong>[DEMONSTRATION DOCUMENT VIEWER]</strong></p>
            <p>This interactive viewer simulates secure enterprise document inspection (e.g. PDF / High-res scan) directly in the HR console without leaving the candidate profile.</p>
            <div class="doc-stamp">VERIFIED APPLICANT SUBMISSION</div>
            <p>Candidate: <strong>${this.selectedApplicant?.applicantName || 'Applicant'}</strong><br>
            Reference: <strong>${this.selectedApplicant?.refNumber || 'N/A'}</strong><br>
            Timestamp: <strong>${this.selectedApplicant?.appliedAt || 'N/A'}</strong></p>
          </div>
        </div>
      `;
    }

    this.docViewerModal.classList.add('is-open');
    this.docViewerModal.setAttribute('aria-hidden', 'false');
  }

  closeDocViewer() {
    this.docViewerModal?.classList.remove('is-open');
    this.docViewerModal?.setAttribute('aria-hidden', 'true');
  }

  // --- HR JOB MANAGEMENT & CREATOR ---

  renderJobsManagement() {
    if (!this.jobsTableContainer) return;

    const allJobs = farmState.jobs;
    this.jobsTableContainer.innerHTML = allJobs
      .map(
        (job) => `
        <tr class="job-row status-${job.status}">
          <td><strong>${job.title}</strong></td>
          <td><span class="dept-badge">${job.department}</span></td>
          <td>${job.closingDate || 'No Deadline'}</td>
          <td>
            <span class="status-pill status-${job.status}">${job.status.replace('_', ' ').toUpperCase()}</span>
            ${
              job.rejectionReason
                ? `<div class="rejection-alert">
                    ⚠️ <strong>Operations Feedback:</strong> "${job.rejectionReason}"
                  </div>`
                : ''
            }
            ${job.closureReason ? `<div class="subtext">Reason: ${job.closureReason}</div>` : ''}
          </td>
          <td>
            <div class="table-action-group">
              ${
                job.status === 'draft' || job.rejectionReason
                  ? `<button class="button button--small button--primary btn-resubmit-job" data-id="${job.id}">Submit to Ops</button>`
                  : ''
              }
              ${
                job.status === 'published'
                  ? `<button class="button button--small button--secondary btn-close-job-modal" data-id="${job.id}">Close Position</button>`
                  : ''
              }
            </div>
          </td>
        </tr>
      `
      )
      .join('');

    // Attach job management actions
    this.jobsTableContainer.querySelectorAll('.btn-resubmit-job').forEach((btn) => {
      btn.addEventListener('click', () => {
        farmState.submitJobForApproval(btn.dataset.id);
        alert('Job requisition resubmitted to Operations Director for approval.');
      });
    });

    this.jobsTableContainer.querySelectorAll('.btn-close-job-modal').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.openJobClosure(btn.dataset.id);
      });
    });
  }

  openJobCreator() {
    this.customQuestionCount = 0;
    const questionsContainer = document.getElementById('jobCreatorQuestionsList');
    if (questionsContainer) questionsContainer.innerHTML = '';

    // Populate Department dropdown
    const deptSelect = document.getElementById('newJobDept');
    if (deptSelect) {
      deptSelect.innerHTML = farmState.departments.map((d) => `<option value="${d}">${d}</option>`).join('');
    }

    this.jobCreatorModal.classList.add('is-open');
    this.jobCreatorModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeJobCreator() {
    this.jobCreatorModal?.classList.remove('is-open');
    this.jobCreatorModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  addCustomQuestionField() {
    this.customQuestionCount = (this.customQuestionCount || 0) + 1;
    const qId = `q_${Date.now()}`;
    const container = document.getElementById('jobCreatorQuestionsList');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'custom-q-builder-item';
    div.dataset.qid = qId;
    div.innerHTML = `
      <div class="builder-head">
        <strong>Custom Question #${this.customQuestionCount}</strong>
        <button type="button" class="btn-remove-q">✕ Remove</button>
      </div>
      <div class="form-group">
        <label class="form-label">Question Text *</label>
        <input type="text" class="form-input q-builder-label" required placeholder="E.g. Do you hold a valid Code 14 Driver's License?" />
      </div>
      <div class="form-grid-2">
        <div class="form-group">
          <label class="form-label">Field Type</label>
          <select class="form-input q-builder-type">
            <option value="select">Dropdown Select</option>
            <option value="radio">Radio Buttons (Single Choice)</option>
            <option value="checkbox">Checkboxes (Multiple Choice)</option>
            <option value="textarea">Textarea (Long Text)</option>
            <option value="text">Text Field (Short)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Requirement</label>
          <label class="checkbox-option">
            <input type="checkbox" class="q-builder-required" checked />
            <span>Mandatory for applicant</span>
          </label>
        </div>
      </div>
      <div class="form-group q-options-group">
        <label class="form-label">Options (Comma-separated for select / radio / checkbox)</label>
        <input type="text" class="form-input q-builder-options" placeholder="Option 1, Option 2, Option 3" value="Yes, No" />
      </div>
    `;

    div.querySelector('.btn-remove-q').addEventListener('click', () => div.remove());
    container.appendChild(div);
  }

  handleSaveJob(e) {
    e.preventDefault();

    const title = document.getElementById('newJobTitle')?.value.trim();
    const department = document.getElementById('newJobDept')?.value;
    const location = document.getElementById('newJobLocation')?.value.trim();
    const type = document.getElementById('newJobType')?.value;
    const salary = document.getElementById('newJobSalary')?.value.trim();
    const closingDate = document.getElementById('newJobClosingDate')?.value;
    const description = document.getElementById('newJobDesc')?.value.trim();
    const responsibilitiesRaw = document.getElementById('newJobResponsibilities')?.value.trim();
    const requirementsRaw = document.getElementById('newJobRequirements')?.value.trim();
    const isDraft = e.submitter?.dataset.action === 'draft';

    const customQuestions = [];
    document.querySelectorAll('.custom-q-builder-item').forEach((item, idx) => {
      const label = item.querySelector('.q-builder-label')?.value.trim();
      const type = item.querySelector('.q-builder-type')?.value;
      const required = item.querySelector('.q-builder-required')?.checked;
      const optionsRaw = item.querySelector('.q-builder-options')?.value.trim();
      const options = optionsRaw ? optionsRaw.split(',').map((o) => o.trim()).filter(Boolean) : [];

      if (label) {
        customQuestions.push({
          id: `q${idx + 1}`,
          label,
          type,
          options,
          required
        });
      }
    });

    const newJob = farmState.createJob({
      title,
      department,
      location,
      type,
      salary,
      closingDate,
      description,
      responsibilities: responsibilitiesRaw ? responsibilitiesRaw.split('\n').filter(Boolean) : [],
      requirements: requirementsRaw ? requirementsRaw.split('\n').filter(Boolean) : [],
      customQuestions,
      status: isDraft ? 'draft' : 'pending_approval'
    });

    this.closeJobCreator();
    alert(
      isDraft
        ? `Job saved as draft: "${newJob.title}".`
        : `Job requisition submitted to Operations Director for approval: "${newJob.title}".`
    );
  }

  // --- JOB CLOSURE ---

  openJobClosure(jobId) {
    this.jobToCloseId = jobId;
    const job = farmState.getJobById(jobId);
    const titleEl = document.getElementById('jobClosureTargetTitle');
    if (titleEl && job) titleEl.textContent = `Close Vacancy: ${job.title}`;

    this.closureModal.classList.add('is-open');
    this.closureModal.setAttribute('aria-hidden', 'false');
  }

  closeJobClosure() {
    this.closureModal?.classList.remove('is-open');
    this.closureModal?.setAttribute('aria-hidden', 'true');
    this.jobToCloseId = null;
  }

  handleConfirmJobClosure(e) {
    e.preventDefault();
    if (!this.jobToCloseId) return;

    const reasonSelect = document.getElementById('jobClosureReasonSelect')?.value;
    const customNotes = document.getElementById('jobClosureNotes')?.value.trim();
    const finalReason = customNotes ? `${reasonSelect} — ${customNotes}` : reasonSelect;

    farmState.closeJob(this.jobToCloseId, finalReason, 'Helena van der Merwe (HR Lead)');
    this.closeJobClosure();
    alert('Job position has been closed and removed from public listings.');
  }
}

export const hrController = new HRController();

