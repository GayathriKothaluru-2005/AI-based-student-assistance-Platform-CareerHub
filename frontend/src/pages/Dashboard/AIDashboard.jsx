import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiBookOpen, FiBook, FiCode, FiBriefcase, FiFolder,
  FiCpu, FiServer, FiShare2, FiMessageSquare, FiUser, FiFileText,
  FiLogOut, FiMenu, FiX, FiChevronLeft, FiChevronRight, FiBell,
  FiSun, FiMoon,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: FiHome,
    path: '/dashboard',
    gradient: 'from-blue-500 to-indigo-600',
    group: null,
  },
  {
    id: 'learning',
    label: 'Learning & Planning',
    icon: FiBookOpen,
    path: '/dashboard/learning-planning',
    gradient: 'from-blue-500 to-cyan-500',
    subText: 'Timetable · Roadmap',
    group: 'LEARNING',
  },
  {
    id: 'knowledge',
    label: 'Knowledge & Understanding',
    icon: FiBook,
    path: '/dashboard/knowledge',
    gradient: 'from-purple-500 to-pink-500',
    subText: 'PDF Summariser · Courses',
    group: 'LEARNING',
  },
  {
    id: 'practice',
    label: 'Practice & Skill Building',
    icon: FiCode,
    path: '/dashboard/practice',
    gradient: 'from-green-500 to-emerald-500',
    subText: 'Coding Resources',
    group: 'LEARNING',
  },
  {
    id: 'career-prep',
    label: 'Career Preparation',
    icon: FiBriefcase,
    path: '/dashboard/career-prep',
    gradient: 'from-orange-500 to-amber-500',
    subText: 'Resume · Interview · Aptitude',
    group: 'CAREER',
  },
  {
    id: 'projects',
    label: 'Project Generator',
    icon: FiFolder,
    path: '/dashboard/projects',
    gradient: 'from-pink-500 to-rose-500',
    subText: 'Project Selection · Docs',
    group: 'CAREER',
  },
  {
    id: 'project-showcase',
    label: 'Project Documentation',
    icon: FiFolder,
    path: '/dashboard/project-showcase',
    gradient: 'from-blue-500 to-indigo-600',
    subText: 'CSP · Internship · Final Project',
    group: 'CAREER',
  },
  {
    id: 'company-exams',
    label: 'IT & Non-IT Company Exams',
    icon: FiServer,
    path: '/dashboard/company-exams',
    gradient: 'from-red-500 to-orange-400',
    subText: 'All Company Resources',
    group: 'CAREER',
  },
  {
    id: 'gate',
    label: 'GATE Resources',
    icon: FiCpu,
    path: '/dashboard/gate-resources',
    gradient: 'from-violet-500 to-purple-600',
    subText: 'GATE Exam Preparation',
    group: 'RESOURCES',
  },
  {
    id: 'social',
    label: 'Social Media Optimisation',
    icon: FiShare2,
    path: '/dashboard/social-media',
    gradient: 'from-sky-500 to-blue-500',
    subText: 'Naukri Tips · LinkedIn Tips',
    group: 'RESOURCES',
  },
  {
    id: 'guidance',
    label: 'Career Guidance',
    icon: FiMessageSquare,
    path: '/dashboard/career-guidance',
    gradient: 'from-teal-500 to-cyan-500',
    subText: 'AI Career Chatbot',
    group: 'GUIDANCE',
  },
  {
    id: 'jd-analyzer',
    label: 'JD Analyzer',
    icon: FiFileText,
    path: '/dashboard/jd-analyzer',
    gradient: 'from-blue-500 to-indigo-600',
    subText: 'Analyze · Skill Gap · Roadmap',
    group: 'GUIDANCE',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: FiUser,
    path: '/dashboard/profile',
    gradient: 'from-slate-400 to-slate-600',
    subText: 'Your Details & Settings',
    group: 'GUIDANCE',
  },
];

const GROUPS = ['LEARNING', 'CAREER', 'RESOURCES', 'GUIDANCE'];

function SidebarNav({ collapsed, onClose }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const mainItem = NAV_ITEMS.find((i) => i.group === null);
  const groupedItems = GROUPS.map((g) => ({
    group: g,
    items: NAV_ITEMS.filter((i) => i.group === g),
  }));

  return (
    <div className="space-y-1">
      {/* Dashboard home */}
      <div className="px-2 mb-3">
        {(() => {
          const item = mainItem;
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={onClose}
              title={collapsed ? item.label : ''}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 group border ${
                active
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white border-transparent'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  active
                    ? `bg-gradient-to-br ${item.gradient} text-white shadow-lg`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-slate-800 dark:group-hover:text-white'
                }`}
              >
                <Icon size={15} />
              </div>
              {!collapsed && (
                <span className="text-sm font-semibold">{item.label}</span>
              )}
            </Link>
          );
        })()}
      </div>

      {/* Grouped items */}
      {groupedItems.map(({ group, items }) => (
        <div key={group} className="mb-3">
          {collapsed ? (
            <div className="border-t border-slate-200 dark:border-slate-800/60 my-2 mx-3" />
          ) : (
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 px-4 pb-1.5 pt-1">
              {group}
            </p>
          )}
          <div className="px-2 space-y-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={onClose}
                  title={collapsed ? item.label : ''}
                  className={`flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-200 group border ${
                    active
                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white border-transparent'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                      active
                        ? `bg-gradient-to-br ${item.gradient} text-white shadow-md`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-slate-800 dark:group-hover:text-white'
                    }`}
                  >
                    <Icon size={15} />
                  </div>
                  {!collapsed && (
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-tight truncate">{item.label}</p>
                      {item.subText && (
                        <p className="text-[10px] text-slate-400 dark:text-slate-600 group-hover:text-slate-500 truncate mt-0.5">
                          {item.subText}
                        </p>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AIDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userInitial =
    user?.name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'S';

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      {/* ── Mobile backdrop ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/70 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile sidebar ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 left-0 z-30 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col md:hidden"
          >
            {/* header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
              <Link to="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-slate-900 dark:text-white font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  CareerHub
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* user info */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{userInitial}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">
                    {user?.name || 'Student'}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs truncate">{user?.email || ''}</p>
                </div>
              </div>
            </div>

            {/* nav */}
            <nav className="flex-1 overflow-y-auto py-3">
              <SidebarNav collapsed={false} onClose={() => setSidebarOpen(false)} />
            </nav>

            {/* logout */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <FiLogOut size={15} />
                </div>
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 overflow-hidden transition-colors duration-300"
      >
        {/* header */}
        <div
          className={`flex items-center h-16 px-3 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {collapsed ? (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
          ) : (
            <>
              <Link to="/" className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-slate-900 dark:text-white font-bold whitespace-nowrap bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  CareerHub
                </span>
              </Link>
              <button
                onClick={() => setCollapsed(true)}
                className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex-shrink-0"
              >
                <FiChevronLeft size={13} />
              </button>
            </>
          )}
        </div>

        {/* user info */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{userInitial}</span>
              </div>
              <div className="min-w-0">
                <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">
                  {user?.name || 'Student'}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs truncate">{user?.email || ''}</p>
              </div>
            </div>
          </div>
        )}

        {/* nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          <SidebarNav collapsed={collapsed} onClose={() => {}} />
        </nav>

        {/* expand button (icon-only mode) */}
        {collapsed && (
          <div className="px-2 pb-2">
            <button
              onClick={() => setCollapsed(false)}
              title="Expand sidebar"
              className="w-full h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <FiChevronRight size={14} />
            </button>
          </div>
        )}

        {/* logout */}
        <div className="p-2 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
          <button
            onClick={handleLogout}
            title={collapsed ? 'Logout' : ''}
            className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              <FiLogOut size={15} />
            </div>
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* topbar */}
        <header className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 flex-shrink-0 transition-colors duration-300">
          {/* mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <FiMenu size={20} />
          </button>

          {/* desktop breadcrumb */}
          <div className="hidden md:block">
            <p className="text-slate-500 dark:text-slate-500 text-sm font-medium">
              AI Student Assistance Platform
            </p>
          </div>

          {/* right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>

            <button className="relative w-9 h-9 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <FiBell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </button>
            <Link
              to="/dashboard/profile"
              className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold hover:ring-2 hover:ring-purple-500/40 transition-all"
            >
              {userInitial}
            </Link>
          </div>
        </header>

        {/* page content */}
        <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
