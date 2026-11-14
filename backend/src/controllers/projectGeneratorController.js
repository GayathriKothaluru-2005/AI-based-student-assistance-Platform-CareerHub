const { generateProjectIdeas } = require('../services/projectGeneratorService');

/**
 * Generate project ideas based on user's skill level and tech stack
 * POST /api/project-generator/generate
 */
async function generateProjects(req, res) {
  try {
    const { skillLevel, frontendStack, backendStack, database } = req.body;

    // Validate required fields
    if (!skillLevel || !frontendStack || !backendStack || !database) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: skillLevel, frontendStack, backendStack, database',
      });
    }

    // Validate skill level
    const validLevels = ['Beginner', 'Moderate', 'Expert'];
    if (!validLevels.includes(skillLevel)) {
      return res.status(400).json({
        success: false,
        message: `Invalid skill level. Must be one of: ${validLevels.join(', ')}`,
      });
    }

    // Generate projects
    const result = await generateProjectIdeas(skillLevel, frontendStack, backendStack, database);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Project Generation Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating projects',
      error: error.message,
    });
  }
}

module.exports = {
  generateProjects,
};
