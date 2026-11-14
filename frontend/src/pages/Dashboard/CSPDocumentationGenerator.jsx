import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiFileText, FiAlertCircle } from 'react-icons/fi';

// Section templates for document generation
const defaultSections = [
  {
    id: 1,
    title: 'COMMUNITY INTERNSHIP REPORT',
    type: 'header',
    content: 'Community Internship Report\n\nName of the Student: {{STUDENT_NAME}}\nRegistration Number: {{REG_ID}}\nPeriod of CSI: {{DURATION}}\nFrom {{START_DATE}} To {{END_DATE}}\nName & Address of the Community/Habitation: {{COMMUNITY_NAME}}',
    editable: true,
  },
  {
    id: 2,
    title: 'EXECUTIVE SUMMARY',
    type: 'section',
    content: `In this community internship project, we undertook an initiative to address key community challenges. The project focused on creating awareness and implementing sustainable solutions that would benefit the local population.

Key Aspects of the Project:
• Problem Identification: {{PROBLEM_IDENTIFIED}}
• Duration: {{PROJECT_DURATION}}
• Target Community: {{TARGET_COMMUNITY}}
• Key Activities: {{KEY_ACTIVITIES}}`,
    editable: true,
  },
  {
    id: 3,
    title: 'OVERVIEW OF THE COMMUNITY',
    type: 'section',
    content: `Location: {{COMMUNITY_LOCATION}}
Population: {{POPULATION}}
Area: {{AREA}}

Socio-Economic Condition:
{{SOCIO_ECONOMIC_INFO}}

Traditions and Culture:
{{TRADITIONS}}

Climate and Natural Resources:
{{CLIMATE}}`,
    editable: true,
  },
  {
    id: 4,
    title: 'COMMUNITY SERVICE ACTIVITIES',
    type: 'section',
    content: `Week 1-2: Initial Community Assessment
- Visited community and identified key problems
- Conducted surveys and interviews
- Learning Outcome: {{WEEK_1_OUTCOME}}

Week 3-4: Awareness Programs
- Organized awareness sessions
- Conducted educational workshops
- Learning Outcome: {{WEEK_3_OUTCOME}}

Week 5-6: Implementation Phase
- Began implementing solutions
- Engaged community members in activities
- Learning Outcome: {{WEEK_5_OUTCOME}}

Week 7-8: Monitoring and Evaluation
- Monitored progress of initiatives
- Gathered feedback from community
- Learning Outcome: {{WEEK_7_OUTCOME}}`,
    editable: true,
  },
  {
    id: 5,
    title: 'OUTCOMES & ACHIEVEMENTS',
    type: 'section',
    content: `Key Outcomes:
1. {{OUTCOME_1}}
2. {{OUTCOME_2}}
3. {{OUTCOME_3}}

Community Impact:
- Number of people reached: {{PEOPLE_REACHED}}
- Activities completed: {{ACTIVITIES_COMPLETED}}
- Community satisfaction: {{SATISFACTION_LEVEL}}

Learning Outcomes:
• {{LEARNING_1}}
• {{LEARNING_2}}
• {{LEARNING_3}}`,
    editable: true,
  },
  {
    id: 6,
    title: 'PROBLEMS IDENTIFIED',
    type: 'section',
    content: `Primary Issue: {{PRIMARY_ISSUE}}
Secondary Issues: {{SECONDARY_ISSUES}}

Root Causes:
1. {{CAUSE_1}}
2. {{CAUSE_2}}
3. {{CAUSE_3}}

Impact on Community: {{IMPACT_DESCRIPTION}}`,
    editable: true,
  },
  {
    id: 7,
    title: 'ACTION PLAN & RECOMMENDATIONS',
    type: 'section',
    content: `Short-term Solutions (0-3 months):
1. {{SHORT_TERM_1}}
2. {{SHORT_TERM_2}}

Long-term Solutions (3-12 months):
1. {{LONG_TERM_1}}
2. {{LONG_TERM_2}}

Recommendations for Authorities:
- {{RECOMMENDATION_1}}
- {{RECOMMENDATION_2}}
- {{RECOMMENDATION_3}}`,
    editable: true,
  },
  {
    id: 8,
    title: 'CONCLUSION',
    type: 'section',
    content: `This community internship project provided valuable insights into addressing real-world community challenges. Through our efforts, we were able to:

✓ Create awareness about {{AWARENESS_TOPIC}}
✓ Implement {{IMPLEMENTATION_COUNT}} community initiatives
✓ Engage {{ENGAGEMENT_COUNT}} community members
✓ Generate {{SOLUTIONS_COUNT}} sustainable solutions

The experience has enhanced our understanding of community development and the importance of grassroots initiatives in creating lasting social impact.`,

    editable: true,
  },
];

// String template for document generation
const cspTemplate = defaultSections.map(section => section.content).join('\n\n');

// Form fields for the CSP Documentation Generator
const formFields = [
  { key: 'PROJECT_TITLE', label: 'Project Title', type: 'text', placeholder: 'Enter project title' },
  { key: 'STUDENT_NAME', label: 'Student Name', type: 'text', placeholder: 'Enter your name' },
  { key: 'REG_ID', label: 'Registration Number', type: 'text', placeholder: 'Enter registration number' },
  { key: 'SUPERVISOR_NAME', label: 'Supervisor Name', type: 'text', placeholder: 'Enter supervisor name' },
  { key: 'DURATION', label: 'Duration', type: 'text', placeholder: 'e.g. 8 weeks' },
  { key: 'YEAR', label: 'Year', type: 'text', placeholder: 'e.g. 2026' },
  { key: 'START_DATE', label: 'Start Date', type: 'text', placeholder: 'e.g. 2026-01-01' },
  { key: 'END_DATE', label: 'End Date', type: 'text', placeholder: 'e.g. 2026-02-28' },
  { key: 'COMMUNITY_NAME', label: 'Community Name & Address', type: 'text', placeholder: 'Enter community name and address' },
  { key: 'PROBLEM_IDENTIFIED', label: 'Problem Identified', type: 'text', placeholder: 'Describe the main problem' },
  { key: 'PROJECT_DURATION', label: 'Project Duration', type: 'text', placeholder: 'e.g. 8 weeks' },
  { key: 'TARGET_COMMUNITY', label: 'Target Community', type: 'text', placeholder: 'Who is the target community?' },
  { key: 'KEY_ACTIVITIES', label: 'Key Activities', type: 'textarea', placeholder: 'List key activities' },
  { key: 'COMMUNITY_LOCATION', label: 'Community Location', type: 'text', placeholder: 'Enter location' },
  { key: 'POPULATION', label: 'Population', type: 'text', placeholder: 'Enter population' },
  { key: 'AREA', label: 'Area', type: 'text', placeholder: 'Enter area' },
  { key: 'SOCIO_ECONOMIC_INFO', label: 'Socio-Economic Info', type: 'textarea', placeholder: 'Describe socio-economic info' },
  { key: 'TRADITIONS', label: 'Traditions and Culture', type: 'textarea', placeholder: 'Describe traditions and culture' },
  { key: 'CLIMATE', label: 'Climate and Natural Resources', type: 'textarea', placeholder: 'Describe climate and resources' },
  { key: 'WEEK_1_OUTCOME', label: 'Week 1-2 Outcome', type: 'textarea', placeholder: 'Learning outcome for weeks 1-2' },
  { key: 'WEEK_3_OUTCOME', label: 'Week 3-4 Outcome', type: 'textarea', placeholder: 'Learning outcome for weeks 3-4' },
  { key: 'WEEK_5_OUTCOME', label: 'Week 5-6 Outcome', type: 'textarea', placeholder: 'Learning outcome for weeks 5-6' },
  { key: 'WEEK_7_OUTCOME', label: 'Week 7-8 Outcome', type: 'textarea', placeholder: 'Learning outcome for weeks 7-8' },
  { key: 'OUTCOME_1', label: 'Key Outcome 1', type: 'text', placeholder: 'Describe outcome 1' },
  { key: 'OUTCOME_2', label: 'Key Outcome 2', type: 'text', placeholder: 'Describe outcome 2' },
  { key: 'OUTCOME_3', label: 'Key Outcome 3', type: 'text', placeholder: 'Describe outcome 3' },
  { key: 'PEOPLE_REACHED', label: 'People Reached', type: 'text', placeholder: 'Number of people reached' },
  { key: 'ACTIVITIES_COMPLETED', label: 'Activities Completed', type: 'text', placeholder: 'Number of activities completed' },
  { key: 'SATISFACTION_LEVEL', label: 'Community Satisfaction', type: 'text', placeholder: 'Satisfaction level' },
  { key: 'LEARNING_1', label: 'Learning Outcome 1', type: 'text', placeholder: 'Describe learning 1' },
  { key: 'LEARNING_2', label: 'Learning Outcome 2', type: 'text', placeholder: 'Describe learning 2' },
  { key: 'LEARNING_3', label: 'Learning Outcome 3', type: 'text', placeholder: 'Describe learning 3' },
  { key: 'PRIMARY_ISSUE', label: 'Primary Issue', type: 'text', placeholder: 'Describe primary issue' },
  { key: 'SECONDARY_ISSUES', label: 'Secondary Issues', type: 'textarea', placeholder: 'Describe secondary issues' },
  { key: 'CAUSE_1', label: 'Root Cause 1', type: 'text', placeholder: 'Describe cause 1' },
  { key: 'CAUSE_2', label: 'Root Cause 2', type: 'text', placeholder: 'Describe cause 2' },
  { key: 'CAUSE_3', label: 'Root Cause 3', type: 'text', placeholder: 'Describe cause 3' },
  { key: 'IMPACT_DESCRIPTION', label: 'Impact on Community', type: 'textarea', placeholder: 'Describe impact' },
  { key: 'SHORT_TERM_1', label: 'Short-term Solution 1', type: 'text', placeholder: 'Describe short-term solution 1' },
  { key: 'SHORT_TERM_2', label: 'Short-term Solution 2', type: 'text', placeholder: 'Describe short-term solution 2' },
  { key: 'LONG_TERM_1', label: 'Long-term Solution 1', type: 'text', placeholder: 'Describe long-term solution 1' },
  { key: 'LONG_TERM_2', label: 'Long-term Solution 2', type: 'text', placeholder: 'Describe long-term solution 2' },
  { key: 'RECOMMENDATION_1', label: 'Recommendation 1', type: 'text', placeholder: 'Enter recommendation 1' },
  { key: 'RECOMMENDATION_2', label: 'Recommendation 2', type: 'text', placeholder: 'Enter recommendation 2' },
  { key: 'RECOMMENDATION_3', label: 'Recommendation 3', type: 'text', placeholder: 'Enter recommendation 3' },
  { key: 'AWARENESS_TOPIC', label: 'Awareness Topic', type: 'text', placeholder: 'Topic for awareness' },
  { key: 'IMPLEMENTATION_COUNT', label: 'Implementation Count', type: 'text', placeholder: 'Number of initiatives implemented' },
  { key: 'ENGAGEMENT_COUNT', label: 'Engagement Count', type: 'text', placeholder: 'Number of community members engaged' },
  { key: 'SOLUTIONS_COUNT', label: 'Solutions Count', type: 'text', placeholder: 'Number of solutions generated' },
];


export default function CSPDocumentationGenerator() {
  const [formData, setFormData] = useState({});
  const [generatedDoc, setGeneratedDoc] = useState(null);
  const [currentStep, setCurrentStep] = useState('form');
  const [validationErrors, setValidationErrors] = useState([]);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const errors = [];
    const requiredFields = [
      'PROJECT_TITLE',
      'STUDENT_NAME',
      'REG_ID',
      'SUPERVISOR_NAME',
      'DURATION',
      'YEAR',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === '') {
        errors.push(`${field.replace(/_/g, ' ')} is required`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const generateDocument = () => {
    if (!validateForm()) {
      return;
    }

    let doc = cspTemplate;
    Object.keys(formData).forEach((key) => {
      const placeholder = `{{${key}}}`;
      doc = doc.replace(new RegExp(placeholder, 'g'), formData[key] || '');
    });

    setGeneratedDoc(doc);
    setCurrentStep('preview');
  };

  const downloadDocument = (format) => {
    if (!generatedDoc) return;

    let content = generatedDoc;
    let filename = `${formData.PROJECT_TITLE || 'CSP_Report'}.${format}`;

    if (format === 'txt') {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else if (format === 'pdf') {
      // For PDF, you would need a library like html2pdf or pdfkit
      alert('PDF export requires integration with PDF library. Using TXT for now.');
      downloadDocument('txt');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      {currentStep === 'form' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">CSP Documentation Generator</h1>
              <p className="text-blue-100">Generate professional capstone project reports</p>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 m-4"
              >
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-red-800 dark:text-red-300 mb-2">Validation Errors:</p>
                    {validationErrors.map((error, i) => (
                      <p key={i} className="text-sm text-red-700 dark:text-red-400">• {error}</p>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <div className="p-8 space-y-6 max-h-96 overflow-y-auto">
              {formFields.slice(0, 12).map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    {field.label} <span className="text-red-500">*</span>
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateDocument}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <FiFileText size={16} />
                Generate Document
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white flex items-center justify-between">
              <h2 className="text-2xl font-bold">Document Preview</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setCurrentStep('form')}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <FiArrowLeft size={24} />
              </motion.button>
            </div>

            {/* Preview */}
            <div className="p-8 max-h-96 overflow-y-auto bg-slate-50 dark:bg-slate-800">
              <pre className="whitespace-pre-wrap text-sm text-slate-900 dark:text-slate-100 font-mono">
                {generatedDoc?.substring(0, 1500)}...
              </pre>
            </div>

            {/* Download Buttons */}
            <div className="bg-slate-50 dark:bg-slate-800 p-8 flex gap-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => downloadDocument('txt')}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <FiDownload size={16} />
                Download TXT
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => downloadDocument('docx')}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <FiDownload size={16} />
                Download DOCX
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setCurrentStep('form')}
                className="flex-1 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <FiArrowLeft size={16} />
                Edit
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
