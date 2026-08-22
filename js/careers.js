/**
 * Cape Town Farm — Public Careers & Multi-Step Application Wizard
 * Manages job filtering, job details modal, dynamic role questionnaires,
 * file upload simulations, privacy consent, and multi-step validation.
 */

import { farmState } from './state.js';

class CareersController {
  constructor() {
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.selectedJob = null;
    this.currentStep = 1;
    this.totalSteps = 6;
    this.applicationData = {};
    this.uploadedFiles = {};

    this.initElements();
    this.bindEvents();
    this.renderJobs();

    // Subscribe to state updates (e.g. when Operations approves a job or HR creates one)
    farmState.subscribe(() => this.renderJobs());
  }

  initElements() {
    this.jobGrid = document.getElementById('publicVacancyGrid');
    this.filterContainer = document.getElementById('careerFilters');
    this.searchInput = document.getElementById('jobSearchInput');
    this.jobDetailsModal = document.getElementById('jobDetailsModal');
    this.applicationWizard = document.getElementById('applicationWizard');
  }

  bindEvents() {
    if (this.filterContainer) {
      this.filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-chip');
        if (!btn) return;
        this.filterContainer.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter || 'all';
        this.renderJobs();
      });
    }

    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderJobs();
      });
    }

    // Close details modal listeners
    document.getElementById('closeJobDetailsModal')?.addEventListener('click', () => this.closeJobDetails());
    this.jobDetailsModal?.addEventListener('click', (e) => {
      if (e.target === this.jobDetailsModal) this.closeJobDetails();
    });

    // Apply Now trigger inside Details Modal
    document.getElementById('applyFromDetailsBtn')?.addEventListener('click', () => {
      if (this.selectedJob) {
        this.closeJobDetails();
        this.openApplicationWizard(this.selectedJob);
      }
    });

    // Close / Exit Application Wizard
    document.getElementById('closeWizardBtn')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to exit the application? Entered details for this session will be discarded.')) {
        this.closeApplicationWizard();
      }
    });

    // Wizard navigation buttons
    document.getElementById('wizardPrevBtn')?.addEventListener('click', () => this.prevStep());
    document.getElementById('wizardNextBtn')?.addEventListener('click', () => this.nextStep());
    document.getElementById('wizardSubmitBtn')?.addEventListener('click', () => this.submitApplication());
    document.getElementById('wizardReturnCareersBtn')?.addEventListener('click', () => this.closeApplicationWizard());
  }

  renderJobs() {
    if (!this.jobGrid) return;

    const jobs = farmState.getJobs({
      department: this.currentFilter,
      status: 'published',
      search: this.searchQuery
    });

    if (jobs.length === 0) {
      this.jobGrid.innerHTML = `
        <div class="empty-state-card" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🌾</div>
          <h3>No Open Positions Found</h3>
          <p>There are currently no active vacancies matching your selected criteria ("${this.currentFilter === 'all' ? 'All Departments' : this.currentFilter}").</p>
          <button class="button button--small button--secondary" id="resetJobFiltersBtn">Reset Filters</button>
        </div>
      `;
      document.getElementById('resetJobFiltersBtn')?.addEventListener('click', () => {
        this.currentFilter = 'all';
        this.searchQuery = '';
        if (this.searchInput) this.searchInput.value = '';
        this.filterContainer?.querySelectorAll('.filter-chip').forEach((c) => {
          c.classList.toggle('active', c.dataset.filter === 'all');
        });
        this.renderJobs();
      });
      return;
    }

    this.jobGrid.innerHTML = jobs
      .map(
        (job) => `
        <article class="vacancy-card" data-category="${job.department.toLowerCase()}">
          <div class="vacancy-card__head">
            <span class="dept-badge">${job.department}</span>
            <span class="employment-type">${job.type}</span>
          </div>
          <h3 class="vacancy-title">${job.title}</h3>
          <p class="vacancy-desc">${job.description}</p>
          <div class="vacancy-meta">
            <div class="meta-item">
              <strong>Location:</strong>
              <span>${job.location}</span>
            </div>
            <div class="meta-item">
              <strong>Est. Compensation:</strong>
              <span>${job.salary || 'Competitive Estate Package'}</span>
            </div>
            <div class="meta-item">
              <strong>Application Deadline:</strong>
              <span class="deadline-tag">${job.closingDate || 'Open until filled'}</span>
            </div>
          </div>
          <div class="vacancy-actions">
            <button class="button button--secondary button--small view-details-btn" data-job-id="${job.id}">View Full Job Details</button>
            <button class="button button--primary button--small apply-direct-btn" data-job-id="${job.id}">Apply Now</button>
          </div>
        </article>
      `
      )
      .join('');

    // Attach click events
    this.jobGrid.querySelectorAll('.view-details-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const job = farmState.getJobById(btn.dataset.jobId);
        if (job) this.openJobDetails(job);
      });
    });

    this.jobGrid.querySelectorAll('.apply-direct-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const job = farmState.getJobById(btn.dataset.jobId);
        if (job) this.openApplicationWizard(job);
      });
    });
  }

  // --- JOB DETAILS MODAL ---

  openJobDetails(job) {
    this.selectedJob = job;
    const modalBody = document.getElementById('jobDetailsModalContent');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="job-dossier-header">
        <div class="pill-group">
          <span class="dept-badge">${job.department}</span>
          <span class="type-badge">${job.type}</span>
        </div>
        <h2>${job.title}</h2>
        <p class="lead-location">📍 ${job.location} &nbsp;|&nbsp; 🗓 Deadline: <strong>${job.closingDate}</strong></p>
        <div class="salary-box">
          <strong>Compensation:</strong> ${job.salary || 'Industry competitive in line with agricultural benchmarks.'}
        </div>
      </div>

      <div class="job-dossier-section">
        <h3>Role Overview</h3>
        <p>${job.description}</p>
      </div>

      <div class="job-dossier-section">
        <h3>Primary Responsibilities</h3>
        <ul class="dossier-list">
          ${job.responsibilities?.map((r) => `<li>${r}</li>`).join('') || '<li>Standard departmental operational duties.</li>'}
        </ul>
      </div>

      <div class="job-dossier-section">
        <h3>Candidate Requirements & Qualifications</h3>
        <ul class="dossier-list">
          ${job.requirements?.map((req) => `<li>${req}</li>`).join('') || '<li>Relevant agricultural or technical experience.</li>'}
        </ul>
      </div>

      ${
        job.customQuestions && job.customQuestions.length > 0
          ? `
        <div class="job-dossier-section">
          <h3>Role-Specific Assessment Overview</h3>
          <p class="subtext">Applicants for this position will be asked to complete brief role-specific questions during the application process:</p>
          <ul class="question-preview-list">
            ${job.customQuestions.map((q) => `<li><strong>${q.label}</strong> (${q.type})</li>`).join('')}
          </ul>
        </div>
      `
          : ''
      }

      <div class="job-dossier-section">
        <h3>Required Documentation</h3>
        <p class="subtext">Please have the following digital files prepared before initiating your application:</p>
        <div class="doc-pill-list">
          <span class="doc-badge required">📄 Curriculum Vitae (CV)</span>
          <span class="doc-badge required">🪪 ID / Passport</span>
          ${job.requiredDocuments?.includes('license') ? '<span class="doc-badge required">🚗 Valid Driver\'s License</span>' : ''}
          ${job.requiredDocuments?.includes('qualifications') ? '<span class="doc-badge required">🎓 Academic / Trade Certificates</span>' : ''}
        </div>
      </div>
    `;

    this.jobDetailsModal.classList.add('is-open');
    this.jobDetailsModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeJobDetails() {
    this.jobDetailsModal?.classList.remove('is-open');
    this.jobDetailsModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // --- FULL-SCREEN APPLICATION WIZARD ---

  openApplicationWizard(job) {
    this.selectedJob = job;
    this.currentStep = 1;
    this.applicationData = {
      jobId: job.id,
      jobTitle: job.title,
      department: job.department,
      workExperience: [],
      questionResponses: {},
      documents: []
    };
    this.uploadedFiles = {};

    // Populate Job header in wizard
    document.getElementById('wizardJobTitle').textContent = job.title;
    document.getElementById('wizardJobMeta').textContent = `${job.department} · ${job.location} · Ref: ${job.id}`;

    // Render step 2 questions dynamically based on job config
    this.renderRoleQuestions(job);
    this.renderDocumentDropzones(job);

    this.showStep(1);
    this.applicationWizard.classList.add('is-active');
    this.applicationWizard.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeApplicationWizard() {
    this.applicationWizard?.classList.remove('is-active');
    this.applicationWizard?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    this.currentStep = 1;
  }

  showStep(stepNumber) {
    this.currentStep = stepNumber;

    // Update Progress Stepper
    document.querySelectorAll('.wizard-step').forEach((step, idx) => {
      const stepIdx = idx + 1;
      step.classList.toggle('active', stepIdx === stepNumber);
      step.classList.toggle('completed', stepIdx < stepNumber);
    });

    // Update Panels
    document.querySelectorAll('.wizard-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.step === String(stepNumber));
    });

    // Button visibility
    const prevBtn = document.getElementById('wizardPrevBtn');
    const nextBtn = document.getElementById('wizardNextBtn');
    const submitBtn = document.getElementById('wizardSubmitBtn');
    const wizardActions = document.getElementById('wizardActions');

    if (stepNumber === 7) {
      // Confirmation step
      if (wizardActions) wizardActions.style.display = 'none';
      return;
    }

    if (wizardActions) wizardActions.style.display = 'flex';
    if (prevBtn) prevBtn.style.display = stepNumber === 1 ? 'none' : 'inline-flex';
    if (nextBtn) nextBtn.style.display = stepNumber === 6 ? 'none' : 'inline-flex';
    if (submitBtn) submitBtn.style.display = stepNumber === 6 ? 'inline-flex' : 'none';

    // If on review step (Step 6), build review summary
    if (stepNumber === 6) {
      this.buildReviewSummary();
    }

    // Scroll top inside wizard body
    document.querySelector('.wizard-content-body')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  validateStep(stepNumber) {
    let isValid = true;
    const currentPanel = document.querySelector(`.wizard-panel[data-step="${stepNumber}"]`);
    if (!currentPanel) return true;

    // Clear previous errors
    currentPanel.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
    currentPanel.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));

    if (stepNumber === 1) {
      // Validate Personal Information
      const name = document.getElementById('applicantName')?.value.trim();
      const email = document.getElementById('applicantEmail')?.value.trim();
      const phone = document.getElementById('applicantPhone')?.value.trim();
      const idNumber = document.getElementById('applicantIdNumber')?.value.trim();
      const dob = document.getElementById('applicantDob')?.value.trim();
      const address = document.getElementById('applicantAddress')?.value.trim();

      if (!name) {
        this.setError('applicantName', 'Full name is required.');
        isValid = false;
      }
      if (!email || !/.+@.+\..+/.test(email)) {
        this.setError('applicantEmail', 'A valid email address is required.');
        isValid = false;
      }
      if (!phone || phone.length < 8) {
        this.setError('applicantPhone', 'A valid contact phone number is required.');
        isValid = false;
      }
      if (!idNumber) {
        this.setError('applicantIdNumber', 'National ID or Passport number is required.');
        isValid = false;
      }
      if (!dob) {
        this.setError('applicantDob', 'Date of birth is required.');
        isValid = false;
      }
      if (!address) {
        this.setError('applicantAddress', 'Residential address is required.');
        isValid = false;
      }

      if (isValid) {
        this.applicationData.applicantName = name;
        this.applicationData.email = email;
        this.applicationData.phone = phone;
        this.applicationData.idNumber = idNumber;
        this.applicationData.dob = dob;
        this.applicationData.address = address;
      }
    } else if (stepNumber === 2) {
      // Validate Role-Specific Questions
      if (this.selectedJob.customQuestions) {
        for (const q of this.selectedJob.customQuestions) {
          if (!q.required) continue;

          if (q.type === 'select' || q.type === 'text' || q.type === 'textarea') {
            const input = document.getElementById(`question_${q.id}`);
            if (!input || !input.value.trim()) {
              this.setError(`question_${q.id}`, 'Please provide an answer to this question.');
              isValid = false;
            } else {
              this.applicationData.questionResponses[q.id] = {
                questionId: q.id,
                label: q.label,
                answer: input.value.trim()
              };
            }
          } else if (q.type === 'radio') {
            const checked = document.querySelector(`input[name="question_${q.id}"]:checked`);
            if (!checked) {
              const container = document.getElementById(`q_group_${q.id}`);
              container?.querySelector('.field-error')?.setAttribute('style', 'display:block');
              if (container) container.querySelector('.field-error').textContent = 'Please select an option.';
              isValid = false;
            } else {
              this.applicationData.questionResponses[q.id] = {
                questionId: q.id,
                label: q.label,
                answer: checked.value
              };
            }
          } else if (q.type === 'checkbox') {
            const checkedBoxes = Array.from(document.querySelectorAll(`input[name="question_${q.id}"]:checked`)).map((c) => c.value);
            if (checkedBoxes.length === 0) {
              const container = document.getElementById(`q_group_${q.id}`);
              container?.querySelector('.field-error')?.setAttribute('style', 'display:block');
              if (container) container.querySelector('.field-error').textContent = 'Please select at least one applicable option.';
              isValid = false;
            } else {
              this.applicationData.questionResponses[q.id] = {
                questionId: q.id,
                label: q.label,
                answer: checkedBoxes
              };
            }
          }
        }
      }
    } else if (stepNumber === 3) {
      // Validate Qualifications & Experience
      const highestLevel = document.getElementById('applicantHighestEdu')?.value.trim();
      const institution = document.getElementById('applicantInstitution')?.value.trim();
      const yearCompleted = document.getElementById('applicantGradYear')?.value.trim();
      const prevRole = document.getElementById('applicantPrevRole')?.value.trim();
      const prevCompany = document.getElementById('applicantPrevCompany')?.value.trim();
      const skills = document.getElementById('applicantSkills')?.value.trim();

      if (!highestLevel) {
        this.setError('applicantHighestEdu', 'Please state your highest level of education or training.');
        isValid = false;
      }
      if (!skills) {
        this.setError('applicantSkills', 'Please list your key agricultural, technical, or practical skills.');
        isValid = false;
      }

      if (isValid) {
        this.applicationData.education = {
          highestLevel,
          institution: institution || 'Self-directed / Practical Field Training',
          yearCompleted: yearCompleted || 'N/A'
        };
        this.applicationData.skills = skills;
        this.applicationData.workExperience = [
          {
            role: prevRole || 'Agricultural Practitioner',
            company: prevCompany || 'Previous Agricultural Employer',
            duration: document.getElementById('applicantPrevYears')?.value || 'Relevant Experience',
            responsibilities: document.getElementById('applicantPrevDuties')?.value || 'Demonstrated practical agricultural capabilities.'
          }
        ];
      }
    } else if (stepNumber === 4) {
      // Validate Documents Upload
      const hasCV = !!this.uploadedFiles['cv'];
      const hasID = !!this.uploadedFiles['id'];

      if (!hasCV) {
        const err = document.getElementById('error_doc_cv');
        if (err) err.textContent = 'Curriculum Vitae (CV) is mandatory.';
        isValid = false;
      }
      if (!hasID) {
        const err = document.getElementById('error_doc_id');
        if (err) err.textContent = 'Identity Document (ID / Passport) is mandatory.';
        isValid = false;
      }

      if (isValid) {
        this.applicationData.documents = Object.values(this.uploadedFiles);
      }
    } else if (stepNumber === 5) {
      // Validate Consent & Retention
      const consentChecked = document.querySelector('input[name="retentionConsent"]:checked');
      if (!consentChecked) {
        const err = document.getElementById('error_consent');
        if (err) err.textContent = 'Please select a data retention preference before continuing.';
        isValid = false;
      } else {
        this.applicationData.talentPoolConsent = consentChecked.value === 'agree';
      }
    }

    return isValid;
  }

  setError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.add('has-error');
    const parent = field.closest('.form-group') || field.parentElement;
    const errorEl = parent?.querySelector('.field-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  nextStep() {
    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        this.showStep(this.currentStep + 1);
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.showStep(this.currentStep - 1);
    }
  }

  // --- DYNAMIC QUESTION RENDERING ---

  renderRoleQuestions(job) {
    const container = document.getElementById('wizardDynamicQuestions');
    if (!container) return;

    if (!job.customQuestions || job.customQuestions.length === 0) {
      container.innerHTML = `
        <div class="info-callout">
          <p>No specific custom questionnaire required for this position. Please proceed to Qualifications & Experience.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = job.customQuestions
      .map((q, idx) => {
        let inputMarkup = '';

        if (q.type === 'select') {
          inputMarkup = `
            <select id="question_${q.id}" class="form-input">
              <option value="">-- Please select an option --</option>
              ${q.options.map((opt) => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          `;
        } else if (q.type === 'textarea') {
          inputMarkup = `
            <textarea id="question_${q.id}" class="form-input" rows="4" placeholder="${q.placeholder || 'Enter your response here...'}"></textarea>
          `;
        } else if (q.type === 'text') {
          inputMarkup = `
            <input type="text" id="question_${q.id}" class="form-input" placeholder="${q.placeholder || ''}" />
          `;
        } else if (q.type === 'radio') {
          inputMarkup = `
            <div class="radio-group" id="q_group_${q.id}">
              ${q.options
                .map(
                  (opt, optIdx) => `
                <label class="radio-option">
                  <input type="radio" name="question_${q.id}" value="${opt}" id="q_${q.id}_${optIdx}" />
                  <span>${opt}</span>
                </label>
              `
                )
                .join('')}
              <span class="field-error" style="display:none;"></span>
            </div>
          `;
        } else if (q.type === 'checkbox') {
          inputMarkup = `
            <div class="checkbox-group" id="q_group_${q.id}">
              ${q.options
                .map(
                  (opt, optIdx) => `
                <label class="checkbox-option">
                  <input type="checkbox" name="question_${q.id}" value="${opt}" id="q_${q.id}_${optIdx}" />
                  <span>${opt}</span>
                </label>
              `
                )
                .join('')}
              <span class="field-error" style="display:none;"></span>
            </div>
          `;
        }

        return `
          <div class="form-group">
            <label for="question_${q.id}" class="form-label">
              <span class="question-num">Q${idx + 1}.</span> ${q.label} ${q.required ? '<span class="req-star">*</span>' : ''}
            </label>
            ${inputMarkup}
            ${q.type !== 'radio' && q.type !== 'checkbox' ? '<span class="field-error"></span>' : ''}
          </div>
        `;
      })
      .join('');
  }

  // --- DOCUMENT UPLOAD DROPZONES ---

  renderDocumentDropzones(job) {
    const container = document.getElementById('wizardDocDropzones');
    if (!container) return;

    const docTypes = [
      { key: 'cv', label: 'Curriculum Vitae (CV)', required: true, hint: 'PDF or DOCX format (Max 5MB).' },
      { key: 'id', label: 'Identity Document / Passport', required: true, hint: 'Certified copy of National ID or Passport.' },
      { key: 'license', label: 'Driver’s Licence / Tractor Permit', required: job.requiredDocuments?.includes('license'), hint: 'Code 08 / 10 / 14 or agricultural operator license.' },
      { key: 'qualifications', label: 'Academic & Trade Qualifications', required: job.requiredDocuments?.includes('qualifications'), hint: 'Degrees, diplomas, trade test papers, or certificates.' }
    ];

    container.innerHTML = docTypes
      .map(
        (doc) => `
        <div class="doc-upload-card" id="doc_card_${doc.key}">
          <div class="doc-upload-header">
            <div>
              <strong>${doc.label}</strong>
              <span class="doc-badge ${doc.required ? 'required' : 'optional'}">${doc.required ? 'Mandatory' : 'Optional'}</span>
            </div>
            <span class="doc-hint">${doc.hint}</span>
          </div>

          <div class="dropzone-area" id="dropzone_${doc.key}" data-key="${doc.key}">
            <input type="file" id="file_input_${doc.key}" class="hidden-file-input" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
            <div class="dropzone-prompt">
              <span class="upload-icon">📂</span>
              <p>Drag & drop file here or <button type="button" class="btn-browse-file">Browse File</button></p>
              <span class="accepted-formats">Supported: PDF, DOCX, JPG (Max 5MB)</span>
            </div>
            <div class="upload-progress-bar" style="display: none;"><div class="upload-fill"></div></div>
          </div>

          <div class="uploaded-file-preview" id="preview_${doc.key}" style="display: none;">
            <div class="file-info">
              <span class="file-icon">📄</span>
              <div>
                <strong class="file-name-text">filename.pdf</strong>
                <span class="file-size-text">1.2 MB · Uploaded</span>
              </div>
            </div>
            <div class="file-actions">
              <button type="button" class="btn-remove-file" data-key="${doc.key}">✕ Remove</button>
            </div>
          </div>

          <span class="field-error" id="error_doc_${doc.key}"></span>
        </div>
      `
      )
      .join('');

    // Attach dropzone and input handlers
    docTypes.forEach((doc) => {
      const dropzone = document.getElementById(`dropzone_${doc.key}`);
      const fileInput = document.getElementById(`file_input_${doc.key}`);
      const browseBtn = dropzone?.querySelector('.btn-browse-file');
      const removeBtn = document.querySelector(`.btn-remove-file[data-key="${doc.key}"]`);

      browseBtn?.addEventListener('click', () => fileInput?.click());
      dropzone?.addEventListener('click', (e) => {
        if (e.target !== browseBtn && !e.target.closest('.btn-browse-file')) {
          fileInput?.click();
        }
      });

      fileInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) this.handleFileSelect(doc.key, file);
      });

      // Drag & drop
      dropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-active');
      });
      dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('drag-active'));
      dropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-active');
        const file = e.dataTransfer.files?.[0];
        if (file) this.handleFileSelect(doc.key, file);
      });

      removeBtn?.addEventListener('click', () => this.removeUploadedFile(doc.key));
    });
  }

  handleFileSelect(key, file) {
    const errorEl = document.getElementById(`error_doc_${key}`);
    if (errorEl) errorEl.textContent = '';

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      if (errorEl) errorEl.textContent = 'File size exceeds 5MB limit.';
      return;
    }

    const dropzone = document.getElementById(`dropzone_${key}`);
    const preview = document.getElementById(`preview_${key}`);
    const progressBar = dropzone?.querySelector('.upload-progress-bar');
    const fill = dropzone?.querySelector('.upload-fill');

    // Simulate progress animation
    if (progressBar && fill) {
      progressBar.style.display = 'block';
      fill.style.width = '0%';
      let p = 0;
      const interval = setInterval(() => {
        p += 25;
        fill.style.width = `${p}%`;
        if (p >= 100) {
          clearInterval(interval);
          progressBar.style.display = 'none';

          // Store file representation
          const formattedSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
          this.uploadedFiles[key] = {
            key,
            name: file.name,
            type: key.toUpperCase(),
            size: formattedSize,
            date: new Date().toISOString().split('T')[0]
          };

          // Update Preview
          if (dropzone) dropzone.style.display = 'none';
          if (preview) {
            preview.style.display = 'flex';
            preview.querySelector('.file-name-text').textContent = file.name;
            preview.querySelector('.file-size-text').textContent = `${formattedSize} · Ready for submission`;
          }
        }
      }, 70);
    }
  }

  removeUploadedFile(key) {
    delete this.uploadedFiles[key];
    const dropzone = document.getElementById(`dropzone_${key}`);
    const preview = document.getElementById(`preview_${key}`);
    const fileInput = document.getElementById(`file_input_${key}`);

    if (fileInput) fileInput.value = '';
    if (preview) preview.style.display = 'none';
    if (dropzone) {
      dropzone.style.display = 'flex';
      const fill = dropzone.querySelector('.upload-fill');
      if (fill) fill.style.width = '0%';
    }
  }

  // --- REVIEW SUMMARY BUILDER ---

  buildReviewSummary() {
    const summaryContainer = document.getElementById('wizardReviewSummary');
    if (!summaryContainer) return;

    const data = this.applicationData;
    const questionsList = Object.values(data.questionResponses || {});
    const docsList = Object.values(this.uploadedFiles || {});

    summaryContainer.innerHTML = `
      <div class="review-card">
        <div class="review-card-head">
          <h4>1. Personal Information</h4>
          <button type="button" class="btn-jump-step" data-step="1">Edit</button>
        </div>
        <div class="review-grid">
          <div><strong>Full Name:</strong> <span>${data.applicantName || '—'}</span></div>
          <div><strong>Email Address:</strong> <span>${data.email || '—'}</span></div>
          <div><strong>Contact Phone:</strong> <span>${data.phone || '—'}</span></div>
          <div><strong>ID / Passport:</strong> <span>${data.idNumber || '—'}</span></div>
          <div><strong>Date of Birth:</strong> <span>${data.dob || '—'}</span></div>
          <div><strong>Residential Address:</strong> <span>${data.address || '—'}</span></div>
        </div>
      </div>

      <div class="review-card">
        <div class="review-card-head">
          <h4>2. Role-Specific Responses</h4>
          <button type="button" class="btn-jump-step" data-step="2">Edit</button>
        </div>
        <div class="review-list">
          ${
            questionsList.length > 0
              ? questionsList
                  .map(
                    (q) => `
                <div class="review-q-item">
                  <p class="review-q-label"><strong>${q.label}</strong></p>
                  <p class="review-q-ans">${Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}</p>
                </div>
              `
                  )
                  .join('')
              : '<p class="text-muted">No custom questionnaire required for this position.</p>'
          }
        </div>
      </div>

      <div class="review-card">
        <div class="review-card-head">
          <h4>3. Qualifications & Skills</h4>
          <button type="button" class="btn-jump-step" data-step="3">Edit</button>
        </div>
        <div class="review-grid">
          <div><strong>Education:</strong> <span>${data.education?.highestLevel || '—'}</span></div>
          <div><strong>Institution:</strong> <span>${data.education?.institution || '—'} (${data.education?.yearCompleted || '—'})</span></div>
          <div style="grid-column: 1 / -1;"><strong>Key Capabilities & Skills:</strong> <span>${data.skills || '—'}</span></div>
        </div>
      </div>

      <div class="review-card">
        <div class="review-card-head">
          <h4>4. Uploaded Application Documents</h4>
          <button type="button" class="btn-jump-step" data-step="4">Edit</button>
        </div>
        <div class="review-docs-list">
          ${
            docsList.length > 0
              ? docsList
                  .map(
                    (d) => `
                <div class="review-doc-item">
                  <span>📄 <strong>${d.name}</strong> (${d.type})</span>
                  <span class="file-size">${d.size}</span>
                </div>
              `
                  )
                  .join('')
              : '<p class="text-muted">No documents uploaded.</p>'
          }
        </div>
      </div>

      <div class="review-card">
        <div class="review-card-head">
          <h4>5. Data Privacy & Retention Policy</h4>
          <button type="button" class="btn-jump-step" data-step="5">Edit</button>
        </div>
        <p><strong>Consent Preference:</strong> ${
          data.talentPoolConsent
            ? '✅ Consented to long-term retention in the Cape Town Farm Talent Database for future opportunity matching.'
            : '🔒 Single-application only — personal information will be purged post-recruitment in accordance with data policy.'
        }</p>
      </div>
    `;

    summaryContainer.querySelectorAll('.btn-jump-step').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetStep = parseInt(btn.dataset.step, 10);
        if (targetStep) this.showStep(targetStep);
      });
    });
  }

  // --- FINAL APPLICATION SUBMISSION ---

  submitApplication() {
    const submitBtn = document.getElementById('wizardSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Processing Submission...';
    }

    setTimeout(() => {
      const payload = {
        jobId: this.selectedJob.id,
        jobTitle: this.selectedJob.title,
        department: this.selectedJob.department,
        applicantName: this.applicationData.applicantName,
        email: this.applicationData.email,
        phone: this.applicationData.phone,
        dob: this.applicationData.dob,
        idNumber: this.applicationData.idNumber,
        address: this.applicationData.address,
        education: this.applicationData.education,
        workExperience: this.applicationData.workExperience,
        skills: this.applicationData.skills,
        questionResponses: Object.values(this.applicationData.questionResponses || {}),
        documents: Object.values(this.uploadedFiles || {}),
        talentPoolConsent: this.applicationData.talentPoolConsent
      };

      const result = farmState.submitApplication(payload);

      // Render Confirmation Screen
      document.getElementById('confirmationRefNumber').textContent = result.refNumber;
      document.getElementById('confirmationEmailTarget').textContent = result.email;
      document.getElementById('confirmationJobTarget').textContent = result.jobTitle;

      this.showStep(7); // Show Confirmation Step

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
      }
    }, 900);
  }
}

export const careersController = new CareersController();

