const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InterviewPrep = sequelize.define('InterviewPrep', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  resumeText: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  parsedResume: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Extracted resume data: name, skills, projects, experience, education',
  },
  resumeAnalysis: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'AI analysis: tech stack, experience level, key strengths',
  },
  interviewQuestions: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Generated questions grouped by category: HR, Technical, Projects, Experience, Resume-based',
  },
  practiceHistory: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of practice attempts with answers and feedback',
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'InterviewPreps',
  timestamps: true,
});

module.exports = InterviewPrep;
