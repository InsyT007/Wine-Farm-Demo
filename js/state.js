/**
 * Cape Town Farm — Enterprise State Manager
 * Handles local state, localStorage persistence, business workflows,
 * audit history logging, operations approval queues, and simulated communications.
 */

import {
  INITIAL_DEPARTMENTS,
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_SIMULATED_EMAILS
} from './data.js';

const STORAGE_KEYS = {
  JOBS: 'ctf_enterprise_jobs_v1',
  APPLICATIONS: 'ctf_enterprise_applications_v1',
  DEPARTMENTS: 'ctf_enterprise_departments_v1',
  EMAILS: 'ctf_enterprise_emails_v1'
};

class StateManager {
  constructor() {
    this.listeners = new Set();
    this.init();
  }

  init() {
    try {
      const storedJobs = localStorage.getItem(STORAGE_KEYS.JOBS);
      this.jobs = storedJobs ? JSON.parse(storedJobs) : [...INITIAL_JOBS];

      const storedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      this.applications = storedApps ? JSON.parse(storedApps) : [...INITIAL_APPLICATIONS];

      const storedDepts = localStorage.getItem(STORAGE_KEYS.DEPARTMENTS);
      this.departments = storedDepts ? JSON.parse(storedDepts) : [...INITIAL_DEPARTMENTS];

      const storedEmails = localStorage.getItem(STORAGE_KEYS.EMAILS);
      this.simulatedEmails = storedEmails ? JSON.parse(storedEmails) : [...INITIAL_SIMULATED_EMAILS];
    } catch (e) {
      console.warn('Could not read from localStorage, using in-memory state.', e);
      this.jobs = [...INITIAL_JOBS];
      this.applications = [...INITIAL_APPLICATIONS];
      this.departments = [...INITIAL_DEPARTMENTS];
      this.simulatedEmails = [...INITIAL_SIMULATED_EMAILS];
    }

    // Auto-check for expired deadlines
    this.evaluateJobDeadlines();
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(this.jobs));
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(this.applications));
      localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(this.departments));
      localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(this.simulatedEmails));
    } catch (e) {
      console.warn('Could not write to localStorage.', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this);
      } catch (err) {
        console.error('State listener error:', err);
      }
    });
  }

  resetAll() {
    this.jobs = [...INITIAL_JOBS];
    this.applications = [...INITIAL_APPLICATIONS];
    this.departments = [...INITIAL_DEPARTMENTS];
    this.simulatedEmails = [...INITIAL_SIMULATED_EMAILS];
    this.save();
  }

  // --- JOB MANAGEMENT ---

  getJobs({ department = 'all', status = 'published', search = '' } = {}) {
    this.evaluateJobDeadlines();
    return this.jobs.filter((job) => {
      const matchDept = department === 'all' || job.department.toLowerCase() === department.toLowerCase();
      const matchStatus = status === 'all' || job.status === status;
      const matchSearch =
        !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase()) ||
        job.department.toLowerCase().includes(search.toLowerCase());
      return matchDept && matchStatus && matchSearch;
    });
  }

  getJobById(id) {
    return this.jobs.find((job) => job.id === id);
  }

  createJob(jobData) {
    const newJob = {
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Helena van der Merwe (HR Lead)',
      status: jobData.status || 'pending_approval',
      customQuestions: jobData.customQuestions || [],
      requiredDocuments: jobData.requiredDocuments || ['cv', 'id'],
      optionalDocuments: jobData.optionalDocuments || [],
      ...jobData
    };

    if (newJob.status === 'pending_approval') {
      newJob.submittedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
      this.sendSimulatedEmail({
        to: 'kobus.malan@capetownfarm.co.za',
        from: 'hr-system@capetownfarm.co.za',
        badge: 'Operations Requisition Alert',
        subject: `New Requisition for Approval: ${newJob.title}`,
        bodyHtml: `
          <p>Dear Kobus Malan,</p>
          <p>A new job requisition has been submitted by HR for your review and approval:</p>
          <ul>
            <li><strong>Position:</strong> ${newJob.title}</li>
            <li><strong>Department:</strong> ${newJob.department}</li>
            <li><strong>Closing Date:</strong> ${newJob.closingDate}</li>
            <li><strong>Compensation:</strong> ${newJob.salary}</li>
          </ul>
          <p>Please review and approve or request revisions in the Operations Dashboard.</p>
        `
      });
    }

    this.jobs.unshift(newJob);
    this.save();
    return newJob;
  }

  updateJob(id, updates) {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index === -1) return null;
    this.jobs[index] = { ...this.jobs[index], ...updates };
    this.save();
    return this.jobs[index];
  }

  submitJobForApproval(id) {
    const job = this.getJobById(id);
    if (!job) return null;

    job.status = 'pending_approval';
    job.submittedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    delete job.rejectionReason;

    this.sendSimulatedEmail({
      to: 'kobus.malan@capetownfarm.co.za',
      from: 'hr-system@capetownfarm.co.za',
      badge: 'Operations Requisition Alert',
      subject: `Resubmitted Requisition for Approval: ${job.title}`,
      bodyHtml: `
        <p>Dear Kobus Malan,</p>
        <p>HR Lead Helena van der Merwe has revised and resubmitted the job requisition for <strong>${job.title}</strong>.</p>
        <p>Please log in to your Operations portal to review the updated details.</p>
      `
    });

    this.save();
    return job;
  }

  approveJob(id, approver = 'Kobus Malan (Operations Director)') {
    const job = this.getJobById(id);
    if (!job) return null;

    job.status = 'published';
    job.approvedBy = approver;
    job.approvedAt = new Date().toISOString().split('T')[0];
    delete job.rejectionReason;

    this.sendSimulatedEmail({
      to: 'helena.vdm@capetownfarm.co.za',
      from: 'operations@capetownfarm.co.za',
      badge: 'Requisition Approved',
      subject: `Requisition Approved: ${job.title}`,
      bodyHtml: `
        <p>Dear Helena,</p>
        <p>The job requisition for <strong>${job.title}</strong> has been approved by Operations (${approver}) and is now live on the public Careers portal.</p>
      `
    });

    this.save();
    return job;
  }

  rejectJob(id, reason, rejecter = 'Kobus Malan (Operations Director)') {
    const job = this.getJobById(id);
    if (!job) return null;

    job.status = 'draft';
    job.rejectionReason = reason;
    job.rejectedBy = rejecter;
    job.rejectedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    this.sendSimulatedEmail({
      to: 'helena.vdm@capetownfarm.co.za',
      from: 'operations@capetownfarm.co.za',
      badge: 'Requisition Revision Required',
      subject: `Action Required: Requisition Returned — ${job.title}`,
      bodyHtml: `
        <p>Dear Helena,</p>
        <p>The job requisition for <strong>${job.title}</strong> has been reviewed by Operations (${rejecter}) and returned with feedback:</p>
        <blockquote style="border-left: 3px solid #c47a20; padding-left: 12px; margin: 12px 0; color: #173125; font-style: italic;">
          "${reason}"
        </blockquote>
        <p>Please revise the role requirements or compensation in HR Job Management and resubmit for approval.</p>
      `
    });

    this.save();
    return job;
  }

  closeJob(id, reason, closedBy = 'Helena van der Merwe (HR Lead)') {
    const job = this.getJobById(id);
    if (!job) return null;

    job.status = 'closed';
    job.closureReason = reason || 'Manually Closed by HR';
    job.closedBy = closedBy;
    job.closedAt = new Date().toISOString().split('T')[0];

    this.save();
    return job;
  }

  evaluateJobDeadlines() {
    const today = new Date().toISOString().split('T')[0];
    let changed = false;

    this.jobs.forEach((job) => {
      if (job.status === 'published' && job.closingDate && job.closingDate < today) {
        job.status = 'closed';
        job.closureReason = 'Application Deadline Reached';
        job.closedAt = today;
        changed = true;
      }
    });

    if (changed) {
      this.save();
    }
  }

  // --- APPLICATION MANAGEMENT ---

  getApplications({ jobId = 'all', department = 'all', status = 'all', search = '', sort = 'newest' } = {}) {
    return this.applications
      .filter((app) => {
        const matchJob = jobId === 'all' || app.jobId === jobId;
        const matchDept = department === 'all' || (app.department && app.department.toLowerCase() === department.toLowerCase());
        const matchStatus = status === 'all' || app.status === status;
        const matchSearch =
          !search ||
          app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
          app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
          app.refNumber.toLowerCase().includes(search.toLowerCase()) ||
          app.email.toLowerCase().includes(search.toLowerCase());
        return matchJob && matchDept && matchStatus && matchSearch;
      })
      .sort((a, b) => {
        if (sort === 'newest') return new Date(b.appliedAt) - new Date(a.appliedAt);
        if (sort === 'oldest') return new Date(a.appliedAt) - new Date(b.appliedAt);
        if (sort === 'name') return a.applicantName.localeCompare(b.applicantName);
        if (sort === 'status') return a.status.localeCompare(b.status);
        return 0;
      });
  }

  getApplicationById(id) {
    return this.applications.find((app) => app.id === id || app.refNumber === id);
  }

  submitApplication(formData) {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const refNumber = `APP-2026-${randomDigits}`;

    const newApp = {
      id: `app-${Date.now()}`,
      refNumber,
      status: 'New Application',
      appliedAt: timestamp,
      internalNotes: [],
      auditTrail: [
        {
          timestamp,
          user: 'System (Online Portal)',
          event: `Application received & reference ${refNumber} issued.`
        }
      ],
      ...formData
    };

    this.applications.unshift(newApp);

    // Dispatch simulated candidate confirmation email
    this.sendSimulatedEmail({
      to: newApp.email,
      from: 'recruitment@capetownfarm.co.za',
      badge: 'Applicant Confirmation',
      subject: `Application Confirmation — ${newApp.jobTitle} (Ref: ${refNumber})`,
      bodyHtml: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0d7cb; background: #faf6f0;">
          <h2 style="color: #173125; margin-top: 0;">CAPE TOWN FARM</h2>
          <p>Dear <strong>${newApp.applicantName}</strong>,</p>
          <p>Thank you for submitting your application for the <strong>${newApp.jobTitle}</strong> position.</p>
          <div style="background: #ffffff; padding: 14px; border: 1px solid #ddd; margin: 16px 0;">
            <p style="margin: 0; font-size: 12px; color: #536556;">APPLICATION REFERENCE NUMBER:</p>
            <p style="margin: 4px 0 0; font-size: 20px; font-weight: bold; color: #173125;">${refNumber}</p>
          </div>
          <p>Our Human Resources recruitment committee will review your dossier. You may retain this reference number for all future communications.</p>
          <p><em>Privacy Notice:</em> Your data is processed in strict accordance with your consent preferences.</p>
        </div>
      `
    });

    // Dispatch simulated HR alert
    this.sendSimulatedEmail({
      to: 'helena.vdm@capetownfarm.co.za',
      from: 'recruitment-system@capetownfarm.co.za',
      badge: 'New Application Received',
      subject: `New Candidate: ${newApp.applicantName} for ${newApp.jobTitle}`,
      bodyHtml: `
        <p>A new application has been submitted via the public careers portal:</p>
        <ul>
          <li><strong>Applicant:</strong> ${newApp.applicantName}</li>
          <li><strong>Position:</strong> ${newApp.jobTitle}</li>
          <li><strong>Reference:</strong> ${refNumber}</li>
          <li><strong>Talent Pool Consent:</strong> ${newApp.talentPoolConsent ? 'Consented for future consideration' : 'Single application only (purge post-process)'}</li>
        </ul>
        <p>Open the HR Recruitment Portal to inspect the candidate dossier.</p>
      `
    });

    this.save();
    return newApp;
  }

  updateApplicationStatus(id, newStatus, author = 'Helena van der Merwe (HR Lead)', noteText = '') {
    const app = this.getApplicationById(id);
    if (!app) return null;

    const oldStatus = app.status;
    if (oldStatus === newStatus) return app;

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    app.status = newStatus;

    app.auditTrail.push({
      timestamp,
      user: author,
      event: `Status updated from "${oldStatus}" to "${newStatus}".${noteText ? ` (${noteText})` : ''}`
    });

    if (noteText) {
      app.internalNotes.push({
        id: `note-${Date.now()}`,
        author,
        timestamp,
        text: noteText
      });
    }

    // Trigger candidate status update email simulation
    this.sendSimulatedEmail({
      to: app.email,
      from: 'recruitment@capetownfarm.co.za',
      badge: `Status: ${newStatus}`,
      subject: `Application Update — ${app.jobTitle} (${app.refNumber})`,
      bodyHtml: `
        <p>Dear ${app.applicantName},</p>
        <p>There is an update on your application for <strong>${app.jobTitle}</strong> (Ref: ${app.refNumber}).</p>
        <p>Your application status is currently: <strong>${newStatus}</strong>.</p>
        ${newStatus === 'Interview' ? '<p>Our recruitment coordinator will follow up with detailed scheduling and logistics.</p>' : ''}
        ${newStatus === 'Offer' ? '<p>Congratulations! Our HR team has prepared a conditional offer of employment for your consideration.</p>' : ''}
        <p>Kind regards,<br>Cape Town Farm Recruitment Committee</p>
      `
    });

    this.save();
    return app;
  }

  addApplicationNote(id, noteText, author = 'Helena van der Merwe (HR Lead)') {
    const app = this.getApplicationById(id);
    if (!app || !noteText.trim()) return null;

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const note = {
      id: `note-${Date.now()}`,
      author,
      timestamp,
      text: noteText.trim()
    };

    app.internalNotes.push(note);
    app.auditTrail.push({
      timestamp,
      user: author,
      event: `Internal HR note recorded.`
    });

    this.save();
    return note;
  }

  // --- SIMULATED COMMUNICATIONS ---

  sendSimulatedEmail({ to, from = 'system@capetownfarm.co.za', subject, bodyHtml, badge = 'System Notification' }) {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const email = {
      id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
      to,
      from,
      subject,
      badge,
      preview: bodyHtml.replace(/<[^>]*>?/gm, '').slice(0, 140) + '...',
      bodyHtml
    };

    this.simulatedEmails.unshift(email);
    this.save();

    // Dispatch a browser DOM event so UI can trigger toast
    window.dispatchEvent(
      new CustomEvent('ctf-simulated-email', {
        detail: email
      })
    );

    return email;
  }

  getEmails() {
    return this.simulatedEmails;
  }
}

export const farmState = new StateManager();

