/**
 * resumeDownload.js
 * Generates styled A4 HTML from resume data and triggers PDF / DOCX download.
 * No extra npm packages required — uses the browser's native print dialog (Save as PDF)
 * for PDF, and an HTML-blob trick (.doc) for DOCX.
 */

/* ─── Shared header styles ─── */
const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', Arial, sans-serif; font-size: 11px; color: #1e293b; background: white; }
  @page { size: A4; margin: 0; }
  @media print {
    html, body { width: 210mm; height: 297mm; }
    .page { width: 210mm; min-height: 297mm; padding: 18mm 16mm; page-break-after: always; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  }
  .page { width: 100%; max-width: 794px; min-height: 1123px; margin: 0 auto; padding: 40px 44px; }
  h1 { font-size: 22px; font-weight: 700; }
  h2 { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; border-bottom: 1px solid currentColor; padding-bottom: 3px; }
  p, li { font-size: 10.5px; line-height: 1.55; }
  ul { padding-left: 14px; }
  a { color: inherit; text-decoration: none; }
  .section { margin-bottom: 14px; }
  .row { display: flex; justify-content: space-between; align-items: baseline; }
  .muted { color: #64748b; font-size: 10px; }
  .bold { font-weight: 600; }
  .pill { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 9.5px; margin: 2px 2px 2px 0; }
`;

/* ════════════════════════════════════════════
   TEMPLATE HTML GENERATORS
════════════════════════════════════════════ */

function minimalHTML(d) {
  return `
    <style>
      ${BASE_CSS}
      .header { margin-bottom: 14px; }
      .contact-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 5px; color: #475569; font-size: 10px; }
      h2 { color: #1e293b; border-bottom-color: #cbd5e1; }
    </style>
    <div class="page">
      <div class="header">
        <h1>${esc(d.personal.name)}</h1>
        <div class="contact-row">
          ${d.personal.email ? `<span>✉ ${esc(d.personal.email)}</span>` : ''}
          ${d.personal.phone ? `<span>📞 ${esc(d.personal.phone)}</span>` : ''}
          ${d.personal.location ? `<span>📍 ${esc(d.personal.location)}</span>` : ''}
          ${d.personal.linkedin ? `<span>🔗 ${esc(d.personal.linkedin)}</span>` : ''}
          ${d.personal.github ? `<span>⭐ ${esc(d.personal.github)}</span>` : ''}
          ${d.personal.website ? `<span>🌐 ${esc(d.personal.website)}</span>` : ''}
        </div>
      </div>
      ${summary(d, '#1e293b')}
      ${educationSection(d, '#1e293b')}
      ${skillsSection(d, '#1e293b')}
      ${experienceSection(d, '#1e293b')}
      ${projectsSection(d, '#1e293b')}
      ${certSection(d, '#1e293b')}
    </div>`;
}

function sidebarHTML(d) {
  return `
    <style>
      ${BASE_CSS}
      .page { padding: 0; display: flex; }
      .sidebar { width: 220px; min-height: 1123px; background: #1d4ed8; color: white; padding: 30px 20px; flex-shrink: 0; }
      .sidebar h1 { font-size: 18px; margin-bottom: 4px; }
      .sidebar .sub { font-size: 10px; color: #bfdbfe; margin-bottom: 20px; }
      .sidebar h2 { color: white; border-bottom-color: rgba(255,255,255,0.3); font-size: 9.5px; }
      .sidebar p, .sidebar li { color: #dbeafe; font-size: 10px; }
      .avatar { width: 60px; height: 60px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; margin: 0 auto 14px; }
      .main { flex: 1; padding: 30px 28px; }
      .main h2 { color: #1d4ed8; border-bottom-color: #bfdbfe; }
    </style>
    <div class="page">
      <div class="sidebar">
        <div class="avatar">${d.personal.name ? esc(d.personal.name[0].toUpperCase()) : 'U'}</div>
        <h1 style="text-align:center">${esc(d.personal.name)}</h1>
        <p class="sub" style="text-align:center">${esc((d.personal.summary || '').slice(0, 70)) || 'Software Engineer'}</p>
        <div class="section">
          <h2>Contact</h2>
          ${d.personal.email ? `<p>✉ ${esc(d.personal.email)}</p>` : ''}
          ${d.personal.phone ? `<p>📞 ${esc(d.personal.phone)}</p>` : ''}
          ${d.personal.location ? `<p>📍 ${esc(d.personal.location)}</p>` : ''}
          ${d.personal.linkedin ? `<p>🔗 ${esc(d.personal.linkedin)}</p>` : ''}
          ${d.personal.github ? `<p>⭐ ${esc(d.personal.github)}</p>` : ''}
        </div>
        ${d.skills.technical ? `<div class="section"><h2>Technical Skills</h2><p>${esc(d.skills.technical)}</p></div>` : ''}
        ${d.skills.tools ? `<div class="section"><h2>Tools</h2><p>${esc(d.skills.tools)}</p></div>` : ''}
        ${d.skills.soft ? `<div class="section"><h2>Soft Skills</h2><p>${esc(d.skills.soft)}</p></div>` : ''}
        ${d.certifications.filter(c => c.name).length > 0 ? `
          <div class="section"><h2>Certifications</h2>
            ${d.certifications.filter(c => c.name).map(c =>
              `<p>• ${esc(c.name)}${c.issuer ? ` — ${esc(c.issuer)}` : ''}${c.year ? ` (${esc(c.year)})` : ''}</p>`
            ).join('')}
          </div>` : ''}
      </div>
      <div class="main">
        ${summary(d, '#1d4ed8')}
        ${educationSection(d, '#1d4ed8')}
        ${experienceSection(d, '#1d4ed8')}
        ${projectsSection(d, '#1d4ed8')}
      </div>
    </div>`;
}

function creativeHTML(d) {
  return `
    <style>
      ${BASE_CSS}
      .page { padding: 0; }
      .cr-header { background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 28px 36px 22px; }
      .cr-header h1 { font-size: 24px; margin-bottom: 4px; }
      .cr-header .tagline { color: #f5d0fe; font-size: 10.5px; margin-bottom: 10px; }
      .cr-header .contact-row { display: flex; flex-wrap: wrap; gap: 12px; color: #e9d5ff; font-size: 10px; }
      .cr-body { padding: 24px 36px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
      h2 { color: #7c3aed; border-bottom-color: #e9d5ff; }
      .pill { background: #f3e8ff; color: #7c3aed; }
      .accent-left { border-left: 3px solid #db2777; padding-left: 10px; margin-bottom: 10px; }
    </style>
    <div class="page">
      <div class="cr-header">
        <h1>${esc(d.personal.name)}</h1>
        ${d.personal.summary ? `<p class="tagline">${esc(d.personal.summary.slice(0, 100))}</p>` : ''}
        <div class="contact-row">
          ${d.personal.email ? `<span>✉ ${esc(d.personal.email)}</span>` : ''}
          ${d.personal.phone ? `<span>📞 ${esc(d.personal.phone)}</span>` : ''}
          ${d.personal.location ? `<span>📍 ${esc(d.personal.location)}</span>` : ''}
          ${d.personal.linkedin ? `<span>🔗 ${esc(d.personal.linkedin)}</span>` : ''}
          ${d.personal.github ? `<span>⭐ ${esc(d.personal.github)}</span>` : ''}
        </div>
      </div>
      <div class="cr-body">
        <div>
          ${d.skills.technical ? `
            <div class="section">
              <h2>Technical Skills</h2>
              <div style="margin-top:6px">
                ${d.skills.technical.split(',').map(s => `<span class="pill">${esc(s.trim())}</span>`).join('')}
              </div>
            </div>` : ''}
          ${d.skills.tools ? `<div class="section"><h2>Tools</h2><p>${esc(d.skills.tools)}</p></div>` : ''}
          ${educationSection(d, '#7c3aed')}
          ${certSection(d, '#7c3aed')}
        </div>
        <div>
          ${d.experience.filter(e => e.company || e.role).length > 0 ? `
            <div class="section"><h2>Experience</h2>
              ${d.experience.filter(e => e.company || e.role).map(e => `
                <div class="accent-left">
                  <div class="row"><p class="bold">${esc(e.role)}</p><p class="muted">${esc(e.duration)}</p></div>
                  <p class="muted">${esc(e.company)}</p>
                  ${e.description ? `<p style="margin-top:3px;color:#475569;white-space:pre-line">${esc(e.description)}</p>` : ''}
                </div>`).join('')}
            </div>` : ''}
          ${d.projects.filter(p => p.name).length > 0 ? `
            <div class="section"><h2>Projects</h2>
              ${d.projects.filter(p => p.name).map(p => `
                <div class="accent-left" style="border-left-color:#7c3aed">
                  <p class="bold">${esc(p.name)}${p.tech ? ` <span class="muted">— ${esc(p.tech)}</span>` : ''}</p>
                  ${p.description ? `<p class="muted">${esc(p.description)}</p>` : ''}
                  ${p.link ? `<p style="color:#7c3aed;font-size:9px">${esc(p.link)}</p>` : ''}
                </div>`).join('')}
            </div>` : ''}
        </div>
      </div>
    </div>`;
}

function professionalHTML(d) {
  return `
    <style>
      ${BASE_CSS}
      .page { padding: 0; }
      .pro-header { background: #0e7490; color: white; padding: 24px 36px; }
      .pro-header h1 { font-size: 22px; border: none; }
      .pro-header .contact-row { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 6px; font-size: 10px; color: #a5f3fc; }
      .pro-body { padding: 22px 36px; }
      h2 { color: #0e7490; border-bottom-color: #a5f3fc; }
    </style>
    <div class="page">
      <div class="pro-header">
        <h1>${esc(d.personal.name)}</h1>
        <div class="contact-row">
          ${d.personal.email ? `<span>✉ ${esc(d.personal.email)}</span>` : ''}
          ${d.personal.phone ? `<span>📞 ${esc(d.personal.phone)}</span>` : ''}
          ${d.personal.location ? `<span>📍 ${esc(d.personal.location)}</span>` : ''}
          ${d.personal.linkedin ? `<span>🔗 ${esc(d.personal.linkedin)}</span>` : ''}
          ${d.personal.github ? `<span>⭐ ${esc(d.personal.github)}</span>` : ''}
        </div>
      </div>
      <div class="pro-body">
        ${summary(d, '#0e7490')}
        ${educationSection(d, '#0e7490')}
        ${skillsSection(d, '#0e7490')}
        ${experienceSection(d, '#0e7490')}
        ${projectsSection(d, '#0e7490')}
        ${certSection(d, '#0e7490')}
      </div>
    </div>`;
}

/* ─── Shared section builders ─── */
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function summary(d, color) {
  if (!d.personal.summary) return '';
  return `<div class="section"><h2 style="color:${color};border-bottom-color:${color}33">Summary</h2><p style="color:#475569;margin-top:5px">${esc(d.personal.summary)}</p></div>`;
}

function educationSection(d, color) {
  const items = d.education.filter(e => e.institution || e.degree);
  if (!items.length) return '';
  return `<div class="section"><h2 style="color:${color};border-bottom-color:${color}33">Education</h2>
    ${items.map(e => `
      <div class="row" style="margin-top:6px">
        <div>
          <p class="bold">${esc(e.institution)}</p>
          <p class="muted">${esc(e.degree)}${e.field ? ` in ${esc(e.field)}` : ''}</p>
        </div>
        <p class="muted">${esc(e.year)}${e.gpa ? ` | GPA: ${esc(e.gpa)}` : ''}</p>
      </div>`).join('')}
  </div>`;
}

function skillsSection(d, color) {
  if (!d.skills.technical && !d.skills.tools && !d.skills.soft) return '';
  return `<div class="section"><h2 style="color:${color};border-bottom-color:${color}33">Skills</h2>
    <div style="margin-top:5px">
      ${d.skills.technical ? `<p><strong>Technical:</strong> ${esc(d.skills.technical)}</p>` : ''}
      ${d.skills.tools ? `<p style="margin-top:3px"><strong>Tools:</strong> ${esc(d.skills.tools)}</p>` : ''}
      ${d.skills.soft ? `<p style="margin-top:3px"><strong>Soft Skills:</strong> ${esc(d.skills.soft)}</p>` : ''}
    </div>
  </div>`;
}

function experienceSection(d, color) {
  const items = d.experience.filter(e => e.company || e.role);
  if (!items.length) return '';
  return `<div class="section"><h2 style="color:${color};border-bottom-color:${color}33">Experience</h2>
    ${items.map(e => `
      <div style="margin-top:8px">
        <div class="row">
          <p class="bold">${esc(e.role)}${e.company ? ` — ${esc(e.company)}` : ''}</p>
          <p class="muted">${esc(e.duration)}</p>
        </div>
        ${e.description ? `<p style="color:#475569;margin-top:4px;white-space:pre-line">${esc(e.description)}</p>` : ''}
      </div>`).join('')}
  </div>`;
}

function projectsSection(d, color) {
  const items = d.projects.filter(p => p.name);
  if (!items.length) return '';
  return `<div class="section"><h2 style="color:${color};border-bottom-color:${color}33">Projects</h2>
    ${items.map(p => `
      <div style="margin-top:8px">
        <p class="bold">${esc(p.name)}${p.tech ? ` <span style="font-weight:400;color:#64748b">— ${esc(p.tech)}</span>` : ''}${p.link ? ` <span style="font-size:9px;color:${color}">${esc(p.link)}</span>` : ''}</p>
        ${p.description ? `<p class="muted" style="margin-top:2px">${esc(p.description)}</p>` : ''}
      </div>`).join('')}
  </div>`;
}

function certSection(d, color) {
  const items = d.certifications.filter(c => c.name);
  if (!items.length) return '';
  return `<div class="section"><h2 style="color:${color};border-bottom-color:${color}33">Certifications</h2>
    ${items.map(c => `<p style="margin-top:4px">• ${esc(c.name)}${c.issuer ? ` — ${esc(c.issuer)}` : ''}${c.year ? ` (${esc(c.year)})` : ''}</p>`).join('')}
  </div>`;
}

/* ════════════════════════════════════════════
   PUBLIC API
════════════════════════════════════════════ */

export function generateResumeHTML(data, template) {
  const generators = {
    minimal: minimalHTML,
    sidebar: sidebarHTML,
    creative: creativeHTML,
    professional: professionalHTML,
  };
  const gen = generators[template] || generators.minimal;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${esc(data.personal.name || 'Resume')}</title></head><body>${gen(data)}</body></html>`;
}

/**
 * Opens the resume in a new tab and triggers the browser Print dialog.
 * The user can choose "Save as PDF" → gives a real PDF.
 */
export function downloadAsPDF(data, template) {
  const html = generateResumeHTML(data, template);
  const win = window.open('', '_blank');
  if (!win) {
    alert('Please allow pop-ups for this site to download the PDF.');
    return;
  }
  win.document.write(html);
  win.document.close();
  // Small delay so styles load before print dialog
  setTimeout(() => {
    win.focus();
    win.print();
  }, 600);
}

/**
 * Downloads resume as a .doc file (Word-compatible HTML).
 */
export function downloadAsDoc(data, template) {
  const html = generateResumeHTML(data, template);
  const blob = new Blob(
    ['\ufeff', html],  // BOM for Word encoding
    { type: 'application/msword' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(data.personal.name || 'Resume').replace(/\s+/g, '_')}_Resume.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
