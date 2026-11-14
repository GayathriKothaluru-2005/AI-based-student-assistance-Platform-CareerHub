const axios = require('axios');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

/**
 * Generate project ideas using Deepseek API based on skill level and tech stack
 */
async function generateProjectIdeas(skillLevel, frontendStack, backendStack, database) {
  try {
    const prompt = `You are an expert software engineer and tech mentor. Generate exactly 10 project ideas for a ${skillLevel} level developer using the following tech stack:

Frontend: ${frontendStack}
Backend: ${backendStack}
Database: ${database}

For each project, provide the following in JSON array format:
[
  {
    "id": 1,
    "name": "Project Name",
    "description": "Brief description (2-3 lines)",
    "difficulty": "${skillLevel}",
    "estimatedTime": "X weeks/months",
    "technologies": ["tech1", "tech2"],
    "features": ["feature1", "feature2", "feature3"],
    "buildingSteps": [
      {
        "step": 1,
        "title": "Step Title",
        "description": "Detailed description of what to do"
      }
    ],
    "learningOutcomes": ["skill1", "skill2"],
    "resources": [
      {"title": "Resource Name", "url": "https://..."}
    ]
  }
]

Make sure projects are:
1. Realistic and achievable for ${skillLevel} developers
2. Progressive in complexity (easy to hard)
3. Using ONLY the specified tech stack
4. Include real-world scenarios
5. Have 5-8 building steps each
6. Include estimated timeline

Return ONLY the JSON array, no additional text.`;

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
      }
    );

    let projectsData = response.data.choices[0].message.content;
    
    // Try to extract JSON from the response
    const jsonMatch = projectsData.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      projectsData = jsonMatch[0];
    }

    // Parse JSON
    const projects = JSON.parse(projectsData);

    // Validate and enhance project data
    const enhancedProjects = projects.map((project, index) => ({
      id: index + 1,
      name: project.name || `Project ${index + 1}`,
      description: project.description || '',
      difficulty: skillLevel,
      estimatedTime: project.estimatedTime || 'Not specified',
      technologies: [...(project.technologies || []), frontendStack, backendStack, database],
      features: project.features || [],
      buildingSteps: (project.buildingSteps || []).map((step, stepIndex) => ({
        step: stepIndex + 1,
        title: step.title || `Step ${stepIndex + 1}`,
        description: step.description || '',
      })),
      learningOutcomes: project.learningOutcomes || [],
      resources: project.resources || [
        { title: 'Documentation', url: '#' },
      ],
    }));

    return {
      success: true,
      skillLevel,
      techStack: {
        frontend: frontendStack,
        backend: backendStack,
        database: database,
      },
      projects: enhancedProjects,
    };
  } catch (error) {
    console.error('Deepseek API Error:', error.response?.data || error.message);

    // Fallback to hardcoded projects if API fails
    return generateFallbackProjects(skillLevel, frontendStack, backendStack, database);
  }
}

/**
 * Fallback function to provide hardcoded projects if API fails
 */
function generateFallbackProjects(skillLevel, frontendStack, backendStack, database) {
  const fallbackProjects = {
    Beginner: [
      {
        id: 1,
        name: 'Todo Application',
        description: 'A simple todo list app with add, edit, delete, and mark complete functionality.',
        difficulty: 'Beginner',
        estimatedTime: '2-3 weeks',
        technologies: [frontendStack, backendStack, database],
        features: ['Add/Edit/Delete tasks', 'Mark tasks as complete', 'Filter by status', 'Responsive design'],
        buildingSteps: [
          { step: 1, title: 'Setup Project', description: 'Create project structure and install dependencies' },
          { step: 2, title: 'Design Database Schema', description: `Create tables in ${database} for tasks and users` },
          { step: 3, title: 'Create API Routes', description: 'Build CRUD endpoints in your chosen backend' },
          { step: 4, title: 'Frontend UI', description: `Create UI components using ${frontendStack}` },
          { step: 5, title: 'Connect Frontend to API', description: 'Integrate API calls in frontend' },
          { step: 6, title: 'Add Authentication', description: 'Implement user login and registration' },
        ],
        learningOutcomes: ['REST API basics', 'Database operations', `${frontendStack} fundamentals`, 'Authentication'],
        resources: [
          { title: 'Backend Docs', url: 'https://www.geeksforgeeks.org/' },
          { title: 'Frontend Docs', url: 'https://www.w3schools.com/' },
        ],
      },
      {
        id: 2,
        name: 'Weather App',
        description: 'Display current weather and 5-day forecast using a public weather API.',
        difficulty: 'Beginner',
        estimatedTime: '2 weeks',
        technologies: [frontendStack, 'API Integration', database],
        features: ['Search by city', 'Display current weather', '5-day forecast', 'Temperature unit conversion'],
        buildingSteps: [
          { step: 1, title: 'Setup Frontend', description: `Set up ${frontendStack} project with routing` },
          { step: 2, title: 'Design UI', description: 'Create weather display components' },
          { step: 3, title: 'API Integration', description: 'Integrate OpenWeatherMap or similar API' },
          { step: 4, title: 'Add Search Feature', description: 'Implement city search functionality' },
          { step: 5, title: 'Cache Results', description: `Store recent searches in ${database}` },
          { step: 6, title: 'Styling & Responsiveness', description: 'Make it mobile-friendly with CSS' },
        ],
        learningOutcomes: ['API consumption', 'Async operations', 'State management', 'UI/UX design'],
        resources: [
          { title: 'Weather API', url: 'https://openweathermap.org/' },
          { title: 'Fetch API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API' },
        ],
      },
      {
        id: 3,
        name: 'Personal Blog',
        description: 'Create a blog platform with posts, comments, and user profiles.',
        difficulty: 'Beginner',
        estimatedTime: '3-4 weeks',
        technologies: [frontendStack, backendStack, database],
        features: ['Create blog posts', 'Comments on posts', 'User profiles', 'Like/Unlike posts'],
        buildingSteps: [
          { step: 1, title: 'Database Design', description: `Design schema for posts, comments, users in ${database}` },
          { step: 2, title: 'Create API', description: `Build REST APIs in ${backendStack}` },
          { step: 3, title: 'Frontend Setup', description: `Create pages using ${frontendStack}` },
          { step: 4, title: 'Post Listing', description: 'Display all posts with pagination' },
          { step: 5, title: 'User Authentication', description: 'Implement signup and login' },
          { step: 6, title: 'Admin Panel', description: 'Create dashboard to manage posts' },
        ],
        learningOutcomes: ['Full-stack development', 'Database design', 'Authentication', 'Pagination'],
        resources: [
          { title: 'Backend Tutorial', url: 'https://www.geeksforgeeks.org/' },
          { title: 'Frontend Tutorial', url: 'https://www.w3schools.com/' },
        ],
      },
      {
        id: 4,
        name: 'Calculator App',
        description: 'A functional calculator with basic operations and history.',
        difficulty: 'Beginner',
        estimatedTime: '1 week',
        technologies: [frontendStack, 'JavaScript'],
        features: ['Basic arithmetic', 'History tracking', 'Clear function', 'Responsive design'],
        buildingSteps: [
          { step: 1, title: 'HTML Structure', description: 'Create calculator layout with buttons' },
          { step: 2, title: 'Styling', description: 'Make UI attractive and user-friendly' },
          { step: 3, title: 'JavaScript Logic', description: 'Implement calculation functions' },
          { step: 4, title: 'Event Handling', description: 'Add click handlers for buttons' },
          { step: 5, title: 'History Feature', description: 'Display calculation history' },
          { step: 6, title: 'Keyboard Support', description: 'Allow keyboard input for operations' },
        ],
        learningOutcomes: ['DOM manipulation', 'Event handling', 'JavaScript logic', 'CSS styling'],
        resources: [
          { title: 'JavaScript Basics', url: 'https://www.w3schools.com/js/' },
          { title: 'DOM Tutorial', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model' },
        ],
      },
      {
        id: 5,
        name: 'Movie Database',
        description: 'Browse and search movies with ratings and reviews.',
        difficulty: 'Beginner',
        estimatedTime: '3 weeks',
        technologies: [frontendStack, backendStack, database],
        features: ['Search movies', 'View ratings', 'User reviews', 'Watchlist feature'],
        buildingSteps: [
          { step: 1, title: 'Setup Database', description: `Create movie tables in ${database}` },
          { step: 2, title: 'Backend API', description: `Create movie listing and search APIs in ${backendStack}` },
          { step: 3, title: 'Frontend Display', description: `Build movie grid using ${frontendStack}` },
          { step: 4, title: 'Search Implementation', description: 'Add search and filter functionality' },
          { step: 5, title: 'Movie Details Page', description: 'Create detailed movie information view' },
          { step: 6, title: 'Reviews & Ratings', description: 'Allow users to rate and review movies' },
        ],
        learningOutcomes: ['Database queries', 'API development', 'Frontend components', 'Search algorithms'],
        resources: [
          { title: 'API Integration', url: 'https://www.themoviedb.org/settings/api' },
          { title: 'React Components', url: 'https://www.w3schools.com/react/' },
        ],
      },
      {
        id: 6,
        name: 'Expense Tracker',
        description: 'Track daily expenses with categories and monthly reports.',
        difficulty: 'Beginner',
        estimatedTime: '2-3 weeks',
        technologies: [frontendStack, backendStack, database],
        features: ['Add expenses', 'Categorize expenses', 'Monthly reports', 'Export as CSV'],
        buildingSteps: [
          { step: 1, title: 'Database Schema', description: `Design expenses table in ${database}` },
          { step: 2, title: 'API Endpoints', description: `Create CRUD operations in ${backendStack}` },
          { step: 3, title: 'UI Components', description: `Build form and listing using ${frontendStack}` },
          { step: 4, title: 'Add Functionality', description: 'Implement add, edit, delete operations' },
          { step: 5, title: 'Reporting', description: 'Create monthly expense reports and charts' },
          { step: 6, title: 'Export Feature', description: 'Add CSV export functionality' },
        ],
        learningOutcomes: ['Data aggregation', 'Date handling', 'Chart libraries', 'Export functionality'],
        resources: [
          { title: 'Chart.js', url: 'https://www.chartjs.org/' },
          { title: 'CSV Export', url: 'https://www.geeksforgeeks.org/export-to-csv/' },
        ],
      },
      {
        id: 7,
        name: 'Quiz Application',
        description: 'Create an interactive quiz with multiple choice questions and score tracking.',
        difficulty: 'Beginner',
        estimatedTime: '2 weeks',
        technologies: [frontendStack, backendStack, database],
        features: ['Multiple questions', 'Score tracking', 'Result analysis', 'Quiz history'],
        buildingSteps: [
          { step: 1, title: 'Database Design', description: `Create quiz and questions tables in ${database}` },
          { step: 2, title: 'Backend API', description: `Build quiz APIs in ${backendStack}` },
          { step: 3, title: 'Quiz Display', description: `Create quiz UI using ${frontendStack}` },
          { step: 4, title: 'Question Loading', description: 'Load questions dynamically' },
          { step: 5, title: 'Score Calculation', description: 'Implement scoring logic' },
          { step: 6, title: 'Result Display', description: 'Show detailed results with analysis' },
        ],
        learningOutcomes: ['Quiz logic', 'State management', 'Data storage', 'Response validation'],
        resources: [
          { title: 'State Management', url: 'https://www.w3schools.com/react/react_state.asp' },
          { title: 'Form Handling', url: 'https://www.geeksforgeeks.org/form-handling-in-javascript/' },
        ],
      },
      {
        id: 8,
        name: 'Chat Application',
        description: 'Real-time messaging app with user authentication.',
        difficulty: 'Beginner',
        estimatedTime: '3 weeks',
        technologies: [frontendStack, backendStack, database, 'WebSocket'],
        features: ['Real-time messaging', 'User profiles', 'Message history', 'Online status'],
        buildingSteps: [
          { step: 1, title: 'Database Schema', description: `Design messages and users tables in ${database}` },
          { step: 2, title: 'Backend Setup', description: `Create backend server with WebSocket in ${backendStack}` },
          { step: 3, title: 'Authentication', description: 'Implement user login and registration' },
          { step: 4, title: 'Frontend UI', description: `Create chat interface using ${frontendStack}` },
          { step: 5, title: 'WebSocket Connection', description: 'Connect frontend to WebSocket server' },
          { step: 6, title: 'Message Display', description: 'Show real-time messages' },
        ],
        learningOutcomes: ['WebSocket', 'Real-time updates', 'Authentication', 'Event handling'],
        resources: [
          { title: 'WebSocket Basics', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket' },
          { title: 'Socket.io', url: 'https://socket.io/' },
        ],
      },
      {
        id: 9,
        name: 'E-commerce Catalog',
        description: 'Product listing and filtering with shopping cart.',
        difficulty: 'Beginner',
        estimatedTime: '3-4 weeks',
        technologies: [frontendStack, backendStack, database],
        features: ['Product listing', 'Filtering', 'Shopping cart', 'Checkout'],
        buildingSteps: [
          { step: 1, title: 'Database Design', description: `Create product and cart tables in ${database}` },
          { step: 2, title: 'Product API', description: `Build product endpoints in ${backendStack}` },
          { step: 3, title: 'Product Display', description: `Create product cards using ${frontendStack}` },
          { step: 4, title: 'Filter & Search', description: 'Add filtering by category and price' },
          { step: 5, title: 'Shopping Cart', description: 'Implement cart functionality' },
          { step: 6, title: 'Checkout Page', description: 'Create order placement flow' },
        ],
        learningOutcomes: ['Product management', 'Cart logic', 'Checkout flow', 'Payment integration'],
        resources: [
          { title: 'E-commerce Guide', url: 'https://www.geeksforgeeks.org/e-commerce-website/' },
          { title: 'Cart Implementation', url: 'https://www.w3schools.com/howto/howto_js_shopping_cart.asp' },
        ],
      },
      {
        id: 10,
        name: 'Notes Application',
        description: 'Simple note-taking app with tags and categories.',
        difficulty: 'Beginner',
        estimatedTime: '2 weeks',
        technologies: [frontendStack, backendStack, database],
        features: ['Create notes', 'Tagging', 'Categories', 'Search notes'],
        buildingSteps: [
          { step: 1, title: 'Setup Database', description: `Create notes table in ${database}` },
          { step: 2, title: 'Backend API', description: `Build note CRUD APIs in ${backendStack}` },
          { step: 3, title: 'Frontend Form', description: `Create note form using ${frontendStack}` },
          { step: 4, title: 'Notes Listing', description: 'Display all notes with timestamps' },
          { step: 5, title: 'Edit & Delete', description: 'Add edit and delete functionality' },
          { step: 6, title: 'Search & Filter', description: 'Implement search by tags or categories' },
        ],
        learningOutcomes: ['CRUD operations', 'Tag/category systems', 'Search functionality', 'Data persistence'],
        resources: [
          { title: 'CRUD Operations', url: 'https://www.geeksforgeeks.org/crud-operations/' },
          { title: 'Database Design', url: 'https://www.geeksforgeeks.org/database-design/' },
        ],
      },
    ],
    Moderate: [
      {
        id: 1,
        name: 'Social Media Feed Clone',
        description: 'Create a social media platform with posts, likes, follows, and commenting system.',
        difficulty: 'Moderate',
        estimatedTime: '6-8 weeks',
        technologies: [frontendStack, backendStack, database],
        features: ['User profiles', 'Post creation', 'Follow/Unfollow', 'Like & Comment', 'Notifications'],
        buildingSteps: [
          { step: 1, title: 'Database Design', description: `Design complex schema with multiple relationships in ${database}` },
          { step: 2, title: 'Authentication', description: 'Implement JWT-based authentication' },
          { step: 3, title: 'Feed Algorithm', description: 'Create algorithm to display relevant posts' },
          { step: 4, title: 'Frontend Architecture', description: `Build component hierarchy using ${frontendStack}` },
          { step: 5, title: 'Real-time Updates', description: 'Implement WebSocket for live notifications' },
          { step: 6, title: 'Image Upload', description: 'Add file upload functionality for posts' },
          { step: 7, title: 'Search & Filter', description: 'Implement user and post search' },
          { step: 8, title: 'Optimization', description: 'Add pagination and caching' },
        ],
        learningOutcomes: ['Complex database design', 'Real-time features', 'Authentication', 'Performance optimization'],
        resources: [
          { title: 'Advanced Database Design', url: 'https://www.geeksforgeeks.org/database-design/' },
          { title: 'JWT Auth', url: 'https://jwt.io/' },
        ],
      },
      {
        id: 2,
        name: 'Project Management Tool',
        description: 'Trello-like project management with tasks, boards, and team collaboration.',
        difficulty: 'Moderate',
        estimatedTime: '5-7 weeks',
        technologies: [frontendStack, backendStack, database],
        features: ['Create projects', 'Kanban board', 'Drag & drop', 'Task assignment', 'Comments', 'Due dates'],
        buildingSteps: [
          { step: 1, title: 'Database Schema', description: `Design database for projects, boards, tasks in ${database}` },
          { step: 2, title: 'Drag & Drop API', description: `Implement drag-drop using ${frontendStack} library` },
          { step: 3, title: 'Backend APIs', description: `Create endpoints in ${backendStack}` },
          { step: 4, title: 'Real-time Sync', description: 'Use WebSocket for live board updates' },
          { step: 5, title: 'User Roles', description: 'Implement permission system for team members' },
          { step: 6, title: 'Notifications', description: 'Send notifications for task changes' },
          { step: 7, title: 'File Attachments', description: 'Add ability to attach files to tasks' },
          { step: 8, title: 'Reporting', description: 'Create project timeline and progress reports' },
        ],
        learningOutcomes: ['Drag-drop implementation', 'Real-time collaboration', 'Permission system', 'File handling'],
        resources: [
          { title: 'React DnD', url: 'https://react-dnd.github.io/react-dnd/' },
          { title: 'WebSocket Guide', url: 'https://socket.io/' },
        ],
      },
      {
        id: 3,
        name: 'Learning Management System',
        description: 'Platform for courses, quizzes, assignments, and student progress tracking.',
        difficulty: 'Moderate',
        estimatedTime: '7-9 weeks',
        technologies: [frontendStack, backendStack, database],
        features: ['Courses', 'Video lessons', 'Quizzes', 'Assignments', 'Progress tracking', 'Certificates'],
        buildingSteps: [
          { step: 1, title: 'Database Design', description: `Create schema for courses, lessons, submissions in ${database}` },
          { step: 2, title: 'Course Management', description: `Build course creation and editing in ${backendStack}` },
          { step: 3, title: 'Video Integration', description: 'Integrate video streaming (AWS S3 or similar)' },
          { step: 4, title: 'Quiz Engine', description: 'Create quiz system with auto-grading' },
          { step: 5, title: 'Assignment Submission', description: 'Build file upload and review system' },
          { step: 6, title: 'Progress Dashboard', description: `Create student dashboard using ${frontendStack}` },
          { step: 7, title: 'Certification', description: 'Generate completion certificates' },
          { step: 8, title: 'Analytics', description: 'Build admin analytics and reporting' },
        ],
        learningOutcomes: ['Video streaming', 'Large file handling', 'Progress tracking', 'Gradebook systems'],
        resources: [
          { title: 'Video Steaming', url: 'https://aws.amazon.com/s3/' },
          { title: 'LMS Guide', url: 'https://www.geeksforgeeks.org/learning-management-system/' },
        ],
      },
      {
        id: 4,
        name: 'Real Estate Platform',
        description: 'Property listing website with advanced search, maps, and virtual tours.',
        difficulty: 'Moderate',
        estimatedTime: '6-8 weeks',
        technologies: [frontendStack, backendStack, database, 'Google Maps API'],
        features: ['Property listings', 'Advanced filters', 'Map integration', 'Gallery', 'User inquiries', 'Favorites'],
        buildingSteps: [
          { step: 1, title: 'Database Design', description: `Create property and user tables in ${database}` },
          { step: 2, title: 'Property API', description: `Build comprehensive property APIs in ${backendStack}` },
          { step: 3, title: 'Map Integration', description: 'Integrate Google Maps for property locations' },
          { step: 4, title: 'Search & Filters', description: 'Create advanced filtering system' },
          { step: 5, title: 'Image Gallery', description: 'Build responsive image gallery' },
          { step: 6, title: 'Virtual Tour', description: 'Integrate 360-degree image viewer' },
          { step: 7, title: 'Inquiry System', description: 'Create contact form and inquiry management' },
          { step: 8, title: 'Admin Panel', description: 'Build property management dashboard' },
        ],
        learningOutcomes: ['Map APIs', 'Image optimization', 'Advanced filtering', 'Admin dashboards'],
        resources: [
          { title: 'Google Maps API', url: 'https://developers.google.com/maps' },
          { title: 'Image Galleries', url: 'https://www.w3schools.com/howto/howto_js_lightbox.asp' },
        ],
      },
      {
        id: 5,
        name: 'Fitness Tracking App',
        description: 'Track workouts, nutrition, and health metrics with progress visualization.',
        difficulty: 'Moderate',
        estimatedTime: '5-7 weeks',
        technologies: [frontendStack, backendStack, database],
        features: ['Workout logging', 'Nutrition tracking', 'Health metrics', 'Progress charts', 'Social features'],
        buildingSteps: [
          { step: 1, title: 'Database Schema', description: `Design health metrics and workout tables in ${database}` },
          { step: 2, title: 'User Profiles', description: 'Create user profile and goal setting' },
          { step: 3, title: 'Workout Logging', description: 'Build workout tracking interface' },
          { step: 4, title: 'Nutrition Database', description: 'Integrate food database API' },
          { step: 5, title: 'Data Visualization', description: 'Create progress charts and graphs' },
          { step: 6, title: 'Reminders', description: 'Implement workout and hydration reminders' },
          { step: 7, title: 'Social Sharing', description: 'Add achievements and social features' },
          { step: 8, title: 'Recommendations', description: 'Create AI-based recommendations engine' },
        ],
        learningOutcomes: ['Health data visualization', 'Chart libraries', 'API integration', 'Data analysis'],
        resources: [
          { title: 'Chart.js', url: 'https://www.chartjs.org/' },
          { title: 'Nutrition API', url: 'https://www.nutritionix.com/api' },
        ],
      },
      {
        id: 6,
        name: 'Video Streaming Platform',
        description: 'Video upload, streaming, and recommendation system.',
        difficulty: 'Moderate',
        estimatedTime: '7-9 weeks',
        technologies: [frontendStack, backendStack, database, 'FFmpeg'],
        features: ['Video upload', 'Streaming', 'Recommendations', 'Comments', 'Subscriptions', 'Analytics'],
        buildingSteps: [
          { step: 1, title: 'Database Design', description: `Create video and user tables in ${database}` },
          { step: 2, title: 'File Upload', description: 'Implement secure video upload' },
          { step: 3, title: 'Video Processing', description: 'Setup FFmpeg for video encoding' },
          { step: 4, title: 'Streaming Server', description: `Create streaming endpoints in ${backendStack}` },
          { step: 5, title: 'Player Implementation', description: 'Build video player with controls' },
          { step: 6, title: 'Recommendation Engine', description: 'Create recommendation algorithm' },
          { step: 7, title: 'Live Chat', description: 'Add live streaming capability' },
          { step: 8, title: 'Analytics Dashboard', description: 'Create view statistics and analytics' },
        ],
        learningOutcomes: ['Video processing', 'Streaming technologies', 'Recommendation algorithms', 'CDN setup'],
        resources: [
          { title: 'FFmpeg', url: 'https://ffmpeg.org/' },
          { title: 'HLS Streaming', url: 'https://en.wikipedia.org/wiki/HTTP_Live_Streaming' },
        ],
      },
      {
        id: 7,
        name: 'Booking & Reservation System',
        description: 'Hotel/Flight booking with payment integration and confirmations.',
        difficulty: 'Moderate',
        estimatedTime: '6-8 weeks',
        technologies: [frontendStack, backendStack, database, 'Stripe/Razorpay'],
        features: ['Search & filter', 'Availability calendar', 'Payment gateway', 'Email confirmation', 'Cancellations'],
        buildingSteps: [
          { step: 1, title: 'Database Design', description: `Design booking schema in ${database}` },
          { step: 2, title: 'Availability Engine', description: `Build availability checking in ${backendStack}` },
          { step: 3, title: 'Calendar Integration', description: 'Create interactive availability calendar' },
          { step: 4, title: 'Payment Integration', description: 'Setup Stripe/Razorpay integration' },
          { step: 5, title: 'Booking Flow', description: 'Create complete booking process' },
          { step: 6, title: 'Email Notifications', description: 'Send booking confirmations and reminders' },
          { step: 7, title: 'Cancellation Policy', description: 'Implement refund and cancellation logic' },
          { step: 8, title: 'Admin Dashboard', description: 'Create booking management interface' },
        ],
        learningOutcomes: ['Payment processing', 'Calendar algorithms', 'Email integration', 'Transaction handling'],
        resources: [
          { title: 'Stripe API', url: 'https://stripe.com/docs/api' },
          { title: 'Payment Processing', url: 'https://www.geeksforgeeks.org/payment-gateway-integration/' },
        ],
      },
      {
        id: 8,
        name: 'Delivery Tracking App',
        description: 'Real-time order tracking with driver location and notifications.',
        difficulty: 'Moderate',
        estimatedTime: '5-7 weeks',
        technologies: [frontendStack, backendStack, database, 'Google Maps'],
        features: ['Live tracking', 'Order history', 'Driver assignment', 'Notifications', 'Ratings'],
        buildingSteps: [
          { step: 1, title: 'Database Schema', description: `Create orders and drivers tables in ${database}` },
          { step: 2, title: 'Location Tracking', description: 'Implement GPS tracking mechanism' },
          { step: 3, title: 'Map Integration', description: 'Show live driver location on map' },
          { step: 4, title: 'Real-time Updates', description: 'Use WebSocket for live status updates' },
          { step: 5, title: 'Driver Assignment', description: 'Create algorithm for nearest driver matching' },
          { step: 6, title: 'Notifications', description: 'Send push and email updates' },
          { step: 7, title: 'Rating System', description: 'Add delivery rating feature' },
          { step: 8, title: 'Analytics', description: 'Create delivery metrics dashboard' },
        ],
        learningOutcomes: ['GPS tracking', 'Real-time updates', 'Location algorithms', 'Push notifications'],
        resources: [
          { title: 'Google Maps API', url: 'https://developers.google.com/maps' },
          { title: 'WebSocket', url: 'https://socket.io/' },
        ],
      },
      {
        id: 9,
        name: 'Healthcare Appointment System',
        description: 'Book doctor appointments with prescription management.',
        difficulty: 'Moderate',
        estimatedTime: '6-8 weeks',
        technologies: [frontendStack, backendStack, database],
        features: ['Appointment booking', 'Doctor profiles', 'Prescriptions', 'Medical records', 'Reviews'],
        buildingSteps: [
          { step: 1, title: 'Database Design', description: `Create medical records schema in ${database}` },
          { step: 2, title: 'Doctor Profiles', description: 'Build doctor listing and profiles' },
          { step: 3, title: 'Availability System', description: 'Create doctor availability management' },
          { step: 4, title: 'Booking System', description: 'Implement appointment booking flow' },
          { step: 5, title: 'Prescription Management', description: 'Create digital prescription system' },
          { step: 6, title: 'Medical Records', description: 'Build patient medical history storage' },
          { step: 7, title: 'Video Consultation', description: 'Integrate video calling for consultations' },
          { step: 8, title: 'Notifications', description: 'Send appointment reminders and updates' },
        ],
        learningOutcomes: ['Healthcare compliance', 'Medical data handling', 'Video integration', 'Scheduling systems'],
        resources: [
          { title: 'Healthcare Standards', url: 'https://www.hl7.org/' },
          { title: 'HIPAA Compliance', url: 'https://www.hhs.gov/hipaa/' },
        ],
      },
      {
        id: 10,
        name: 'Job Portal',
        description: 'Job listing platform with applications, resume upload, and candidate profiles.',
        difficulty: 'Moderate',
        estimatedTime: '6-8 weeks',
        technologies: [frontendStack, backendStack, database],
        features: ['Job listings', 'Apply for jobs', 'Candidate profiles', 'Resume upload', 'Recommendations'],
        buildingSteps: [
          { step: 1, title: 'Database Design', description: `Create jobs and applications tables in ${database}` },
          { step: 2, title: 'Job Posting', description: 'Build job posting interface for employers' },
          { step: 3, title: 'Job Listing', description: 'Create searchable job listing page' },
          { step: 4, title: 'Application System', description: 'Build job application workflow' },
          { step: 5, title: 'Resume Upload', description: 'Implement file upload for resumes' },
          { step: 6, title: 'Candidate Profiles', description: 'Create searchable candidate database' },
          { step: 7, title: 'Matching Algorithm', description: 'Create job-candidate recommendation' },
          { step: 8, title: 'Communication', description: 'Build messaging between employers and candidates' },
        ],
        learningOutcomes: ['Recommendation algorithms', 'File management', 'Matching systems', 'Job market dynamics'],
        resources: [
          { title: 'Resume Parsing', url: 'https://www.geeksforgeeks.org/resume-parser/' },
          { title: 'Job Portal Guide', url: 'https://www.geeksforgeeks.org/job-portal-project/' },
        ],
      },
    ],
    Expert: [
      {
        id: 1,
        name: 'AI-Powered Recommendation Engine',
        description: 'Machine learning-based recommendation system with collaborative and content filtering.',
        difficulty: 'Expert',
        estimatedTime: '10-12 weeks',
        technologies: [frontendStack, backendStack, database, 'TensorFlow/PyTorch'],
        features: ['Collaborative filtering', 'Content filtering', 'Real-time recommendations', 'A/B testing', 'Analytics'],
        buildingSteps: [
          { step: 1, title: 'Data Pipeline', description: 'Create data collection and preprocessing pipeline' },
          { step: 2, title: 'ML Model', description: 'Build recommendation model using collaborative filtering' },
          { step: 3, title: 'Model Training', description: 'Train on historical data with proper validation' },
          { step: 4, title: 'API Development', description: `Create prediction APIs in ${backendStack}` },
          { step: 5, title: 'Real-time Serving', description: 'Setup model serving for real-time predictions' },
          { step: 6, title: 'A/B Testing', description: 'Implement multivariate testing framework' },
          { step: 7, title: 'Performance Optimization', description: 'Optimize for latency and throughput' },
          { step: 8, title: 'Monitoring', description: 'Create model performance monitoring dashboard' },
        ],
        learningOutcomes: ['Machine learning', 'Recommendation algorithms', 'Data pipeline', 'Model deployment'],
        resources: [
          { title: 'TensorFlow', url: 'https://www.tensorflow.org/' },
          { title: 'ML Systems Design', url: 'https://www.deeplearning.ai/' },
        ],
      },
      {
        id: 2,
        name: 'Microservices Architecture E-Commerce',
        description: 'Large-scale e-commerce with microservices, event streaming, and distributed systems.',
        difficulty: 'Expert',
        estimatedTime: '12-16 weeks',
        technologies: [frontendStack, backendStack, 'Kubernetes', 'Docker', 'Kafka', 'gRPC'],
        features: ['Multiple microservices', 'Event streaming', 'Circuit breaker', 'Distributed transactions', 'Service mesh'],
        buildingSteps: [
          { step: 1, title: 'Architecture Design', description: 'Design microservices architecture with clear boundaries' },
          { step: 2, title: 'Service Development', description: `Build individual services in ${backendStack}` },
          { step: 3, title: 'API Gateway', description: 'Create API gateway for service orchestration' },
          { step: 4, title: 'Event Streaming', description: 'Setup Kafka for inter-service communication' },
          { step: 5, title: 'Containerization', description: 'Dockerize all services' },
          { step: 6, title: 'Orchestration', description: 'Deploy to Kubernetes cluster' },
          { step: 7, title: 'Observability', description: 'Setup logging, tracing, and metrics' },
          { step: 8, title: 'Distributed Transactions', description: 'Implement saga pattern for consistency' },
        ],
        learningOutcomes: ['Microservices design', 'Kubernetes', 'Distributed systems', 'Event-driven architecture'],
        resources: [
          { title: 'Kubernetes Docs', url: 'https://kubernetes.io/docs/' },
          { title: 'Microservices Patterns', url: 'https://microservices.io/' },
        ],
      },
      {
        id: 3,
        name: 'Real-time Data Analytics Platform',
        description: 'Streaming data processing with real-time analytics and visualization.',
        difficulty: 'Expert',
        estimatedTime: '10-14 weeks',
        technologies: [frontendStack, backendStack, 'Apache Spark', 'Kafka', 'Elasticsearch'],
        features: ['Stream processing', 'Real-time dashboards', 'Alerting', 'Data warehousing', 'BI integration'],
        buildingSteps: [
          { step: 1, title: 'Data Ingestion', description: 'Setup Kafka for real-time data ingestion' },
          { step: 2, title: 'Stream Processing', description: 'Build data processing pipelines with Spark Streaming' },
          { step: 3, title: 'Data Storage', description: `Store processed data in ${database}` },
          { step: 4, title: 'Indexing', description: 'Use Elasticsearch for fast querying' },
          { step: 5, title: 'Analytics Compute', description: 'Create aggregations and calculations' },
          { step: 6, title: 'Visualization', description: `Build dashboards using ${frontendStack}` },
          { step: 7, title: 'Alerting System', description: 'Create alert rules and notifications' },
          { step: 8, title: 'ML Integration', description: 'Add anomaly detection using ML models' },
        ],
        learningOutcomes: ['Stream processing', 'Big data technologies', 'Real-time systems', 'Data pipelines'],
        resources: [
          { title: 'Apache Spark', url: 'https://spark.apache.org/' },
          { title: 'Kafka Streams', url: 'https://kafka.apache.org/documentation/streams/' },
        ],
      },
      {
        id: 4,
        name: 'Blockchain-Based Supply Chain',
        description: 'Decentralized supply chain tracking using blockchain technology.',
        difficulty: 'Expert',
        estimatedTime: '12-14 weeks',
        technologies: [frontendStack, 'Solidity', 'Ethereum', 'Web3.js'],
        features: ['Smart contracts', 'Immutable records', 'Real-time tracking', 'Multi-stakeholder', 'Audit trail'],
        buildingSteps: [
          { step: 1, title: 'Smart Contracts', description: 'Write Solidity smart contracts for supply chain' },
          { step: 2, title: 'Contract Testing', description: 'Test contracts with Hardhat/Truffle' },
          { step: 3, title: 'Deployment', description: 'Deploy to Ethereum testnet then mainnet' },
          { step: 4, title: 'Backend Integration', description: 'Create backend to interact with blockchain' },
          { step: 5, title: 'Frontend Setup', description: `Build UI using ${frontendStack} and Web3.js` },
          { step: 6, title: 'Wallet Integration', description: 'Integrate MetaMask and wallet management' },
          { step: 7, title: 'Event Tracking', description: 'Setup real-time tracking mechanisms' },
          { step: 8, title: 'Analytics', description: 'Create blockchain analytics dashboard' },
        ],
        learningOutcomes: ['Blockchain development', 'Smart contracts', 'Cryptography', 'Web3 integration'],
        resources: [
          { title: 'Solidity Docs', url: 'https://docs.soliditylang.org/' },
          { title: 'Ethereum', url: 'https://ethereum.org/en/developers/' },
        ],
      },
      {
        id: 5,
        name: 'AI-Powered Content Moderation System',
        description: 'Machine learning system for detecting inappropriate content across media types.',
        difficulty: 'Expert',
        estimatedTime: '10-12 weeks',
        technologies: [backendStack, 'TensorFlow', 'OpenCV', 'NLP Libraries'],
        features: ['Image analysis', 'Text classification', 'Video analysis', 'Custom model training', 'Dashboard'],
        buildingSteps: [
          { step: 1, title: 'Dataset Preparation', description: 'Collect and label training data' },
          { step: 2, title: 'Image Model', description: 'Build CNN model for image classification' },
          { step: 3, title: 'Text Model', description: 'Build NLP model for toxic content detection' },
          { step: 4, title: 'Video Processing', description: 'Extract frames and apply image model' },
          { step: 5, title: 'Model Deployment', description: 'Deploy models using TensorFlow Serving' },
          { step: 6, title: 'API Creation', description: `Create prediction APIs in ${backendStack}` },
          { step: 7, title: 'Queue System', description: 'Implement job queue for processing' },
          { step: 8, title: 'Admin Dashboard', description: 'Build moderation dashboard with appeals' },
        ],
        learningOutcomes: ['Deep learning', 'Computer vision', 'NLP', 'Model deployment at scale'],
        resources: [
          { title: 'TensorFlow Hub', url: 'https://www.tensorflow.org/hub' },
          { title: 'OpenCV', url: 'https://opencv.org/' },
        ],
      },
      {
        id: 6,
        name: 'Distributed IoT Device Management',
        description: 'System for managing and monitoring thousands of IoT devices.',
        difficulty: 'Expert',
        estimatedTime: '12-16 weeks',
        technologies: [backendStack, 'MQTT', 'IoT Platforms', 'Time-series Database'],
        features: ['Device provisioning', 'Real-time monitoring', 'Remote updates', 'Telemetry', 'Edge computing'],
        buildingSteps: [
          { step: 1, title: 'IoT Infrastructure', description: 'Setup MQTT broker for device communication' },
          { step: 2, title: 'Device Provisioning', description: 'Create secure device onboarding workflow' },
          { step: 3, title: 'Time-series DB', description: 'Setup InfluxDB or similar for sensor data' },
          { step: 4, title: 'Data Collection', description: 'Build data aggregation from devices' },
          { step: 5, title: 'Analytics', description: 'Process device metrics and analytics' },
          { step: 6, title: 'Control System', description: 'Create remote command execution' },
          { step: 7, title: 'Edge Computing', description: 'Deploy edge processing on devices' },
          { step: 8, title: 'Monitoring Dashboard', description: 'Build real-time device monitoring UI' },
        ],
        learningOutcomes: ['IoT protocols', 'Edge computing', 'Time-series data', 'Device management'],
        resources: [
          { title: 'MQTT Protocol', url: 'https://mqtt.org/' },
          { title: 'IoT Architecture', url: 'https://aws.amazon.com/iot/' },
        ],
      },
      {
        id: 7,
        name: 'GraphQL API with Advanced Caching',
        description: 'High-performance GraphQL API with Redis caching and DataLoader optimization.',
        difficulty: 'Expert',
        estimatedTime: '8-10 weeks',
        technologies: [backendStack, 'GraphQL', 'Redis', 'PostgreSQL'],
        features: ['GraphQL schema', 'Batch loading', 'Caching strategy', 'Subscription support', 'Performance metrics'],
        buildingSteps: [
          { step: 1, title: 'Schema Design', description: 'Design comprehensive GraphQL schema' },
          { step: 2, title: 'Resolver Implementation', description: `Implement resolvers in ${backendStack}` },
          { step: 3, title: 'Database Optimization', description: 'Optimize queries and indexing' },
          { step: 4, title: 'N+1 Prevention', description: 'Implement DataLoader for batch loading' },
          { step: 5, title: 'Caching Strategy', description: 'Setup Redis for query result caching' },
          { step: 6, title: 'Subscriptions', description: 'Implement real-time GraphQL subscriptions' },
          { step: 7, title: 'Authentication', description: 'Add role-based access control' },
          { step: 8, title: 'Monitoring', description: 'Setup performance monitoring and metrics' },
        ],
        learningOutcomes: ['GraphQL', 'Query optimization', 'Caching strategies', 'Performance tuning'],
        resources: [
          { title: 'GraphQL Official', url: 'https://graphql.org/' },
          { title: 'Apollo Server', url: 'https://www.apollographql.com/docs/apollo-server/' },
        ],
      },
      {
        id: 8,
        name: 'Multi-Cloud Deployment Platform',
        description: 'Platform for deploying and managing applications across multiple cloud providers.',
        difficulty: 'Expert',
        estimatedTime: '14-18 weeks',
        technologies: [backendStack, 'Terraform', 'CloudFormation', 'Kubernetes'],
        features: ['Multi-cloud support', 'Infrastructure as code', 'Resource management', 'Cost optimization', 'CI/CD'],
        buildingSteps: [
          { step: 1, title: 'Infrastructure Design', description: 'Design cloud architecture for multiple providers' },
          { step: 2, title: 'IaC Templates', description: 'Create Terraform and CloudFormation templates' },
          { step: 3, title: 'Automation', description: 'Setup automated provisioning and orchestration' },
          { step: 4, title: 'Hybrid Deployment', description: 'Support deployment to AWS, Azure, GCP' },
          { step: 5, title: 'CI/CD Pipeline', description: 'Create multi-cloud CI/CD workflows' },
          { step: 6, title: 'Monitoring', description: 'Setup unified monitoring across clouds' },
          { step: 7, title: 'Cost Management', description: 'Implement cost tracking and optimization' },
          { step: 8, title: 'Dashboard', description: 'Build operations dashboard' },
        ],
        learningOutcomes: ['Cloud providers', 'Infrastructure as code', 'DevOps', 'Multi-cloud strategies'],
        resources: [
          { title: 'Terraform Docs', url: 'https://www.terraform.io/docs' },
          { title: 'AWS CloudFormation', url: 'https://aws.amazon.com/cloudformation/' },
        ],
      },
      {
        id: 9,
        name: 'Competitive Programming Judge',
        description: 'Online judge system for competitive programming with code execution sandbox.',
        difficulty: 'Expert',
        estimatedTime: '10-12 weeks',
        technologies: [frontendStack, backendStack, 'Docker', 'RabbitMQ'],
        features: ['Code execution', 'Multiple languages', 'Problem set', 'Leaderboard', 'Contests'],
        buildingSteps: [
          { step: 1, title: 'Problem Management', description: 'Create problem storage and display system' },
          { step: 2, title: 'Code Submission', description: 'Build code submission interface' },
          { step: 3, title: 'Sandbox Environment', description: 'Setup Docker containers for code execution' },
          { step: 4, title: 'Judge Engine', description: 'Create test case validation system' },
          { step: 5, title: 'Queue System', description: 'Implement job queue with RabbitMQ' },
          { step: 6, title: 'Leaderboard', description: 'Build competitive leaderboard' },
          { step: 7, title: 'Contests', description: 'Create contest management system' },
          { step: 8, title: 'Analysis', description: 'Build problem statistics and analysis' },
        ],
        learningOutcomes: ['Code sandboxing', 'Docker', 'Judge systems', 'Competitive programming'],
        resources: [
          { title: 'Docker Docs', url: 'https://docs.docker.com/' },
          { title: 'Judge Algorithms', url: 'https://www.geeksforgeeks.org/online-judge-system/' },
        ],
      },
      {
        id: 10,
        name: 'Federated Learning Platform',
        description: 'Distributed machine learning platform with privacy-preserving model training.',
        difficulty: 'Expert',
        estimatedTime: '14-16 weeks',
        technologies: [backendStack, 'TensorFlow Federated', 'Differential Privacy'],
        features: ['Federated training', 'Privacy preservation', 'Model aggregation', 'Communication efficient', 'Monitoring'],
        buildingSteps: [
          { step: 1, title: 'Architecture Design', description: 'Design federated learning system' },
          { step: 2, title: 'Client Framework', description: 'Create client-side training scripts' },
          { step: 3, title: 'Model Aggregation', description: 'Implement secure model averaging' },
          { step: 4, title: 'Privacy Protection', description: 'Add differential privacy mechanisms' },
          { step: 5, title: 'Communication', description: 'Optimize network communication' },
          { step: 6, title: 'Orchestration', description: `Create coordinator service in ${backendStack}` },
          { step: 7, title: 'Monitoring', description: 'Build training monitoring dashboard' },
          { step: 8, title: 'Security', description: 'Implement secure aggregation protocols' },
        ],
        learningOutcomes: ['Federated learning', 'Privacy-preserving ML', 'Distributed training', 'Advanced ML'],
        resources: [
          { title: 'TensorFlow Federated', url: 'https://www.tensorflow.org/federated' },
          { title: 'Federated Learning', url: 'https://research.google/pubs/federated-learning/' },
        ],
      },
    ],
  };

  return {
    success: true,
    skillLevel,
    techStack: {
      frontend: frontendStack,
      backend: backendStack,
      database: database,
    },
    projects: fallbackProjects[skillLevel] || [],
  };
}

module.exports = {
  generateProjectIdeas,
};
