import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ResumeDashboard from './pages/ResumeBuilder/ResumeDashboard';
import ManualBuilder from './pages/ResumeBuilder/ManualBuilder';
import ResumeParser from './pages/ResumeBuilder/ResumeParser';
import JobOptimizer from './pages/ResumeBuilder/JobOptimizer';

// Dashboard
import AIDashboard from './pages/Dashboard/AIDashboard';
import DashboardHome from './pages/Dashboard/DashboardHome';
import LearningPlanning from './pages/Dashboard/LearningPlanning';
import KnowledgeUnderstanding from './pages/Dashboard/KnowledgeUnderstanding';
import PracticeSkillBuilding from './pages/Dashboard/PracticeSkillBuilding';
import CareerPreparation from './pages/Dashboard/CareerPreparation';
import ProjectDocumentation from './pages/Dashboard/ProjectDocumentation';
import ProjectShowcase from './pages/Dashboard/ProjectShowcase';
import GateResources from './pages/Dashboard/GateResources';
import GateCSDetailedGuide from './pages/Dashboard/GateCSDetailedGuide';
import CompanyExams from './pages/Dashboard/CompanyExams';
import SocialMediaOptimisation from './pages/Dashboard/SocialMediaOptimisation';
import CareerGuidance from './pages/Dashboard/CareerGuidance';
import UserProfile from './pages/Dashboard/UserProfile';
import JDAnalyzer from './pages/Dashboard/JDAnalyzer';

const NotFound = () => (
  <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center px-4"
    >
      <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
        404
      </h1>
      <p className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
        Page Not Found
      </p>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
      >
        Go Home
      </a>
    </motion.div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId="624131590086-f533frt26g1tlggcvgcbftol1ssh712o.apps.googleusercontent.com">
        <AuthProvider>
          <Router>
            <AppLayout />
          </Router>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

function AppLayout() {
  const location = useLocation();
  const isResumeBuilder = location.pathname.startsWith('/resume-builder');
  const isDashboard = location.pathname.startsWith('/dashboard');
  const hideChrome = isResumeBuilder || isDashboard;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {!hideChrome && <Navbar />}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />

            {/* Resume builder */}
            <Route path="/resume-builder" element={<ResumeDashboard />} />
            <Route path="/resume-builder/manual" element={<ManualBuilder />} />
            <Route path="/resume-builder/parse" element={<ResumeParser />} />
            <Route path="/resume-builder/optimize" element={<JobOptimizer />} />

            {/* AI Dashboard with sidebar layout */}
            <Route path="/dashboard" element={<AIDashboard />}>
              <Route index element={<DashboardHome />} />
              <Route path="learning-planning" element={<LearningPlanning />} />
              <Route path="knowledge" element={<KnowledgeUnderstanding />} />
              <Route path="practice" element={<PracticeSkillBuilding />} />
              <Route path="career-prep" element={<CareerPreparation />} />
              <Route path="projects" element={<ProjectDocumentation />} />
              <Route path="project-showcase" element={<ProjectShowcase />} />
              <Route path="gate-resources" element={<GateResources />} />
              <Route path="gate-cs-guide" element={<GateCSDetailedGuide />} />
              <Route path="company-exams" element={<CompanyExams />} />
              <Route path="social-media" element={<SocialMediaOptimisation />} />
              <Route path="career-guidance" element={<CareerGuidance />} />
              <Route path="jd-analyzer" element={<JDAnalyzer />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!hideChrome && <Footer />}
    </div>
  );
}

export default App;
