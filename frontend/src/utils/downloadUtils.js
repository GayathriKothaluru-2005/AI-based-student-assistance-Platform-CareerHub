/**
 * downloadUtils.js
 * Professional PDF download utilities for all AI tools
 */

import html2pdf from 'html2pdf.js';

/**
 * Download content as professional PDF
 */
export async function downloadAsPDF(htmlContent, filename) {
  try {
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    
    const options = {
      margin: 10,
      filename: filename || 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    await html2pdf().set(options).from(element).save();
  } catch (error) {
    console.error('PDF download failed:', error);
    alert('Failed to download PDF. Please try again.');
  }
}

/**
 * Generate professional table-based PDF for Timetable Report
 */
export function generateTimetablePDF(timetableData, subjects) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Calculate study metrics
  const studySessions = Object.values(timetableData.timetable || {}).flat().filter(s => s.type === 'study').length;
  
  const html = `
    <div style="font-family: 'Calibri', 'Arial', sans-serif; color: #1a1a1a; background: white; line-height: 1.6;">
      
      <!-- HEADER SECTION -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; margin-bottom: 40px; border-radius: 8px;">
        <h1 style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 0.5px;">STUDY TIMETABLE REPORT</h1>
        <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.95;">Professional Academic Planning & Optimization</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.85;">Generated: ${currentDate}</p>
      </div>

      <!-- EXECUTIVE SUMMARY -->
      <div style="margin-bottom: 35px; background: #f8f9ff; padding: 25px; border-left: 5px solid #667eea; border-radius: 4px;">
        <h2 style="margin: 0 0 15px 0; color: #667eea; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">📊 SCHEDULE SUMMARY</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
          <tr>
            <td style="padding: 8px 15px; background: white; border: 1px solid #ddd; font-weight: 600; color: #333;">Total Subjects</td>
            <td style="padding: 8px 15px; background: #f0f4ff; border: 1px solid #ddd; color: #667eea; font-weight: 600;">${timetableData.subjectsAnalysis?.length || 0}</td>
            <td style="padding: 8px 15px; background: white; border: 1px solid #ddd; font-weight: 600; color: #333;">Study Sessions</td>
            <td style="padding: 8px 15px; background: #f0f4ff; border: 1px solid #ddd; color: #667eea; font-weight: 600;">${studySessions}</td>
            <td style="padding: 8px 15px; background: white; border: 1px solid #ddd; font-weight: 600; color: #333;">Revision Sessions</td>
            <td style="padding: 8px 15px; background: #f0f4ff; border: 1px solid #ddd; color: #667eea; font-weight: 600;">${Object.values(timetableData.timetable || {}).flat().filter(s => s.type === 'revision').length}</td>
          </tr>
        </table>
      </div>

      <!-- SUBJECT ANALYSIS TABLE -->
      <div style="margin-bottom: 35px; page-break-inside: avoid;">
        <h2 style="color: #333; border-bottom: 3px solid #667eea; padding-bottom: 12px; margin-bottom: 20px; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">SUBJECT ANALYSIS & PRIORITY RANKING</h2>
        <table style="width: 100%; border-collapse: collapse; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: #667eea; color: white;">
              <th style="padding: 15px; text-align: left; font-weight: 700; border-right: 1px solid rgba(255,255,255,0.3);">Subject Name</th>
              <th style="padding: 15px; text-align: center; font-weight: 700; border-right: 1px solid rgba(255,255,255,0.3);">Difficulty Level</th>
              <th style="padding: 15px; text-align: center; font-weight: 700; border-right: 1px solid rgba(255,255,255,0.3);">Exam Date</th>
              <th style="padding: 15px; text-align: center; font-weight: 700; border-right: 1px solid rgba(255,255,255,0.3);">Days Remaining</th>
              <th style="padding: 15px; text-align: center; font-weight: 700;">Priority Score</th>
            </tr>
          </thead>
          <tbody>
            ${timetableData.subjectsAnalysis?.map((s, idx) => {
              const priorityColor = s.priority === 'High' ? '#d32f2f' : s.priority === 'Medium' ? '#f57c00' : '#388e3c';
              return `
              <tr style="background: ${idx % 2 === 0 ? 'white' : '#f9f9f9'}; border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 14px 15px; font-weight: 600; color: #333;">${s.name || 'N/A'}</td>
                <td style="padding: 14px 15px; text-align: center; color: #666;">${s.difficulty || 0}<span style="color: #999; font-size: 12px; margin-left: 3px;">/ 10</span></td>
                <td style="padding: 14px 15px; text-align: center; color: #666;">${new Date(s.examDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}</td>
                <td style="padding: 14px 15px; text-align: center; font-weight: 600; color: #667eea;">${s.daysUntilExam || 0} days</td>
                <td style="padding: 14px 15px; text-align: center; background: ${priorityColor}20; color: ${priorityColor}; font-weight: 700; border-radius: 4px;">${s.priority || 'N/A'}</td>
              </tr>
            `;
            }).join('') || '<tr><td colspan="5" style="padding: 20px; text-align: center; color: #999;">No subject data available</td></tr>'}
          </tbody>
        </table>
      </div>

      <!-- WEEKLY TIMETABLE SECTIONS -->
      ${Object.entries(timetableData.timetable || {}).map(([day, sessions], dayIdx) => `
        <div style="margin-bottom: 30px; page-break-inside: avoid;">
          <h3 style="background: #667eea; color: white; padding: 12px 15px; margin: 0 0 15px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px;">${day}</h3>
          <table style="width: 100%; border-collapse: collapse; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
            <thead>
              <tr style="background: #f5f7ff; border-bottom: 2px solid #667eea;">
                <th style="padding: 12px 15px; text-align: left; font-weight: 700; color: #333; width: 15%;">Time</th>
                <th style="padding: 12px 15px; text-align: left; font-weight: 700; color: #333; width: 35%;">Subject</th>
                <th style="padding: 12px 15px; text-align: center; font-weight: 700; color: #333; width: 20%;">Duration</th>
                <th style="padding: 12px 15px; text-align: center; font-weight: 700; color: #333; width: 30%;">Type</th>
              </tr>
            </thead>
            <tbody>
              ${(sessions || []).map((session, idx) => {
                const typeColor = session.type === 'break' ? '#ff9800' : session.type === 'revision' ? '#4caf50' : '#667eea';
                const typeLabel = session.type === 'break' ? '☕ Break' : session.type === 'revision' ? '🔄 Revision' : '📚 Study';
                const bgColor = session.type === 'break' ? '#fff8e1' : session.type === 'revision' ? '#e8f5e9' : '#f3f6ff';
                
                return `
                <tr style="background: ${bgColor}; border-bottom: 1px solid ${typeColor}20;">
                  <td style="padding: 14px 15px; font-weight: 600; color: ${typeColor}; font-size: 14px;">${session.startTime}</td>
                  <td style="padding: 14px 15px; color: #333; font-weight: 500;">${session.subject}</td>
                  <td style="padding: 14px 15px; text-align: center; color: #666; font-size: 13px;">${session.interval || '90 min'}</td>
                  <td style="padding: 14px 15px; text-align: center;">
                    <span style="background: ${typeColor}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; display: inline-block;">${typeLabel}</span>
                  </td>
                </tr>
              `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `).join('')}

      <!-- KEY RECOMMENDATIONS -->
      <div style="margin-top: 40px; background: #f0f4ff; padding: 25px; border-radius: 8px; border-left: 5px solid #667eea;">
        <h2 style="color: #667eea; margin: 0 0 15px 0; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">💡 STUDY RECOMMENDATIONS</h2>
        <ul style="margin: 0; padding-left: 25px; color: #555; font-size: 13px;">
          <li style="margin-bottom: 10px;"><strong>Peak Hours Strategy:</strong> Focus on high-priority subjects (Difficulty 7-10) during your peak productivity hours (9 AM - 12 PM)</li>
          <li style="margin-bottom: 10px;"><strong>Break Management:</strong> Take 15-minute breaks every 90 minutes to maintain optimal focus and prevent burnout</li>
          <li style="margin-bottom: 10px;"><strong>Revision Schedule:</strong> Use dedicated revision sessions to reinforce previously learned concepts and build long-term retention</li>
          <li style="margin-bottom: 10px;"><strong>Flexibility:</strong> Adjust time slots based on your personal energy levels and productivity patterns</li>
          <li style="margin-bottom: 0;"><strong>Consistency:</strong> Follow the schedule consistently for 2-3 weeks before making adjustments for better results</li>
        </ul>
      </div>

      <!-- FOOTER -->
      <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; color: #999; font-size: 11px;">
        <p style="margin: 5px 0;"><strong>CONFIDENTIAL - PERSONAL STUDY PLAN</strong></p>
        <p style="margin: 5px 0;">Generated by AI Study Planner | www.careerhub.edu.in</p>
        <p style="margin: 5px 0;">This document contains personalized study recommendations. Please adjust based on individual circumstances.</p>
      </div>

    </div>
  `;
  
  return html;
}

/**
 * Generate professional PDF for Roadmap Report
 */
export function generateRoadmapPDF(roadmapData) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const { topic, roadmap } = roadmapData;
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background: white;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">📚 Learning Roadmap: ${topic}</h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Generated on ${currentDate}</p>
      </div>

      <!-- Beginner Level -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: white; background: #667eea; padding: 12px 15px; margin: 0 0 20px 0; border-radius: 6px; font-size: 18px;">🎯 Beginner Level</h2>
        ${(roadmap.beginner || []).length > 0 ? (roadmap.beginner || []).map(mod => `
          <div style="background: #f9f9f9; padding: 15px; margin-bottom: 15px; border-left: 4px solid #667eea; border-radius: 4px;">
            <div style="font-weight: 600; color: #667eea; font-size: 16px; margin-bottom: 8px;">📌 ${mod.topic}</div>
            <div style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">${mod.explanation}</div>
            ${mod.tools?.length ? `
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${mod.tools.map(tool => `<span style="background: #667eea; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${tool}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('') : '<p style="color: #999; text-align: center; padding: 20px;">No modules in this level</p>'}
      </div>

      <!-- Intermediate Level -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: white; background: #667eea; padding: 12px 15px; margin: 0 0 20px 0; border-radius: 6px; font-size: 18px;">🚀 Intermediate Level</h2>
        ${(roadmap.intermediate || []).length > 0 ? (roadmap.intermediate || []).map(mod => `
          <div style="background: #f9f9f9; padding: 15px; margin-bottom: 15px; border-left: 4px solid #667eea; border-radius: 4px;">
            <div style="font-weight: 600; color: #667eea; font-size: 16px; margin-bottom: 8px;">📌 ${mod.topic}</div>
            <div style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">${mod.explanation}</div>
            ${mod.tools?.length ? `
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${mod.tools.map(tool => `<span style="background: #667eea; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${tool}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('') : '<p style="color: #999; text-align: center; padding: 20px;">No modules in this level</p>'}
      </div>

      <!-- Advanced Level -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: white; background: #667eea; padding: 12px 15px; margin: 0 0 20px 0; border-radius: 6px; font-size: 18px;">⭐ Advanced Level</h2>
        ${(roadmap.advanced || []).length > 0 ? (roadmap.advanced || []).map(mod => `
          <div style="background: #f9f9f9; padding: 15px; margin-bottom: 15px; border-left: 4px solid #667eea; border-radius: 4px;">
            <div style="font-weight: 600; color: #667eea; font-size: 16px; margin-bottom: 8px;">📌 ${mod.topic}</div>
            <div style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">${mod.explanation}</div>
            ${mod.tools?.length ? `
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${mod.tools.map(tool => `<span style="background: #667eea; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">${tool}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('') : '<p style="color: #999; text-align: center; padding: 20px;">No modules in this level</p>'}
      </div>

      <!-- Footer -->
      <div style="text-align: center; color: #999; font-size: 12px; padding-top: 20px; border-top: 1px solid #eee;">
        <p>Master ${topic} step by step! 🚀</p>
        <p>Generated by AI Learning Roadmap Generator</p>
      </div>
    </div>
  `;
  
  return html;
}

/**
 * Generate professional PDF for JD Analysis Report
 */
export function generateJDReportPDF(analysisResult) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const { analysis } = analysisResult || {};
  
  const matchPercentage = analysis?.matchPercentage || 0;
  let matchColor = '#d32f2f';
  if (matchPercentage >= 70) matchColor = '#2e7d32';
  else if (matchPercentage >= 50) matchColor = '#ffa726';
  
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; background: white;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">📋 Job Description Analysis Report</h1>
        <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Generated on ${currentDate}</p>
      </div>

      <!-- Match Score Section -->
      <div style="background: #f9f9f9; padding: 25px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
        <h3 style="margin-top: 0; color: #333; font-size: 16px;">Your Profile Match Score</h3>
        <div style="font-size: 48px; font-weight: 700; color: ${matchColor}; margin: 15px 0;">${matchPercentage}%</div>
        <div style="background: #e0e0e0; height: 24px; border-radius: 12px; overflow: hidden; margin-bottom: 15px;">
          <div style="background: ${matchColor}; height: 100%; width: ${matchPercentage}%; transition: width 0.3s;"></div>
        </div>
        <p style="color: #666; margin: 0; font-size: 14px;">
          ${matchPercentage >= 70 ? '✓ Strong match - You have most required skills!' : 
            matchPercentage >= 50 ? '⚠ Moderate match - Build missing skills to increase compatibility' : 
            '⚠ Building skills - Focus on high-priority gaps'}
        </p>
      </div>

      <!-- Key Skills Required -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; border-bottom: 3px solid #667eea; padding-bottom: 12px; margin-bottom: 20px; font-size: 18px;">🎯 Key Skills Required</h2>
        ${(analysis?.keySkills || []).length > 0 ? (analysis.keySkills || []).map(skill => `
          <div style="background: #f9f9f9; padding: 12px 15px; margin-bottom: 10px; border-left: 4px solid #667eea; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #333; font-weight: 500;">✓ ${skill}</span>
            <span style="background: #667eea; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">Required</span>
          </div>
        `).join('') : '<p style="color: #999; text-align: center; padding: 20px;">No skills extracted</p>'}
      </div>

      <!-- Matched Skills (Your Strengths) -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; border-bottom: 3px solid #2e7d32; padding-bottom: 12px; margin-bottom: 20px; font-size: 18px;">✅ Your Strengths</h2>
        ${(analysis?.matchedSkills || []).length > 0 ? (analysis.matchedSkills || []).map(skill => `
          <div style="background: #e6f9e6; padding: 12px 15px; margin-bottom: 10px; border-left: 4px solid #2e7d32; border-radius: 4px;">
            <strong style="color: #2e7d32;">✓ ${skill}</strong>
            <span style="color: #666; font-size: 13px; display: block; margin-top: 4px;">You already possess this skill</span>
          </div>
        `).join('') : '<p style="color: #999; text-align: center; padding: 20px;">Build your matching skills to see them listed here</p>'}
      </div>

      <!-- Skills Gaps -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; border-bottom: 3px solid #d32f2f; padding-bottom: 12px; margin-bottom: 20px; font-size: 18px;">📚 Skill Gaps to Address</h2>
        ${(analysis?.missingSkills || []).length > 0 ? (analysis.missingSkills || []).map(skill => `
          <div style="background: #ffebee; padding: 12px 15px; margin-bottom: 10px; border-left: 4px solid #d32f2f; border-radius: 4px;">
            <strong style="color: #d32f2f;">✗ ${skill}</strong>
            <span style="color: #666; font-size: 13px; display: block; margin-top: 4px;">Priority learning area - Focus on developing this skill</span>
          </div>
        `).join('') : '<p style="color: #999; text-align: center; padding: 20px;">No major gaps identified</p>'}
      </div>

      <!-- Recommendations -->
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #333; font-size: 16px;">💡 Recommendations</h3>
        <ul style="margin: 10px 0; padding-left: 20px; color: #555; line-height: 1.8;">
          <li>Focus on developing high-priority missing skills first</li>
          <li>Take online courses to strengthen skill gaps</li>
          <li>Build real-world projects using required technology stack</li>
          <li>Practice interview questions related to required skills</li>
        </ul>
      </div>

      <!-- Footer -->
      <div style="text-align: center; color: #999; font-size: 12px; padding-top: 20px; border-top: 1px solid #eee;">
        <p>Use this analysis to build your learning roadmap! 🚀</p>
        <p>Generated by AI Job Description Analyzer</p>
      </div>
    </div>
  `;
  
  return html;
}
