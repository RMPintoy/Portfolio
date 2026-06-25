window.PORTFOLIO_DATA = {
  profile: {
    name: "Rica Mae V. Pintoy",
    role: "Web Developer",
    location: "Mabalacat City, Pampanga",
    phone: "+63 975 081 4958",
    email: "ricapintoy@gmail.com",
    linkedin: "https://www.linkedin.com/in/rica-mae-pintoy",
    summary:
      "Results-driven Web Developer with 2+ years of experience building and optimizing full-stack web applications using React, JavaScript, PHP, and SQL. Passionate about user-friendly interfaces, scalable systems, cloud technologies, and AI-assisted workflows.",
    highlights: [
      "2+ years building responsive full-stack applications",
      "Contributed to enterprise platforms used across multiple companies",
      "Cum Laude Computer Science graduate",
    ],
  },
  stats: [
    { value: "2+", label: "Years of experience" },
    { value: "50+", label: "Enterprise modules improved" },
    { value: "100+", label: "Daily users supported" },
    { value: "100%", label: "Developing production focused web applications"},
  ],
  skills: [
    {
      title: "Frontend",
      items: [
        { name: "React.js", icon: "react" },
        { name: "JavaScript", icon: "javascript" },
        { name: "HTML5", icon: "html5" },
        { name: "CSS3", icon: "css3" },
        { name: "Bootstrap", icon: "bootstrap" },
        { name: "Tailwind CSS", icon: "tailwind" },
        { name: "jQuery", icon: "jquery" },
        { name: "AJAX", icon: "ajax" },
      ],
    },
    {
      title: "Backend",
      items: [
        { name: "PHP", icon: "php" },
        { name: "Node.js", icon: "nodejs" },
        { name: "REST API", icon: "rest" },
        { name: "Java", icon: "java" },
      ],
    },
    {
      title: "Database",
      items: [
        { name: "MySQL", icon: "mysql" },
        { name: "SQL", icon: "database" },
      ],
    },
    {
      title: "Tools",
      items: [
        { name: "Docker", icon: "docker" },
        { name: "Git", icon: "git" },
        { name: "GitHub", icon: "github" },
        { name: "SVN", icon: "svn" },
        { name: "Vercel", icon: "vercel" },
      ],
    },
  ],
  experience: [
    {
      company: "Trackerteer Web Developer Corporation",
      role: "Web Developer",
      period: "June 2024 - Present",
      location: "Clark, Pampanga",
      points: [
        "Engineered responsive mobile-first interfaces with React, JavaScript, HTML, and CSS across multiple internal enterprise modules.",
        "Built and optimized PHP and SQL backend services for production data workflows, improving reliability and reducing errors.",
        "Integrated REST APIs for real-time synchronization across leave management and RFID operations.",
        "Collaborated with cross-functional teams to ship features on schedule and resolve critical system issues quickly.",
      ],
    },
    {
      company: "Trackerteer Web Developer Corporation",
      role: "Web Developer Intern",
      period: "August 2023",
      location: "Clark, Pampanga",
      points: [
        "Developed frontend task-tracking displays using HTML, CSS, JavaScript, and SQL.",
        "Designed and implemented a complete session-based authentication module for secure internal access.",
        "Built reusable layouts and navigation components for consistent branding and responsive behavior.",
      ],
    },
  ],
  education: {
    school: "Tarlac State University",
    degree: "Bachelor of Science in Computer Science",
    period: "2020 - 2024",
    distinctions: ["Cum Laude", "Dean's Lister (2020-2024)"],
  },
  certifications: [
    "AWS re/Start Program Graduate (2022)",
    "Switching, Routing, and Wireless Essentials - CCNA 2 (2021)",
    "Introduction to Networks - CCNA 1 (2020)",
  ],
  awards: [
    "Cum Laude - Tarlac State University, 2024",
    "Dean's Lister - Tarlac State University, 2020-2024",
    "Board of Public Relations - JPCS, TSU Chapter, 2023",
  ],
  projects: [
    {
      title: "Orange Calculator",
      type: "Hours Calculator",
      stack: ["JavaScript", "Responsive Design", "Vercel"],
      thumbnailCode: "hc",
      thumbnailCount: 2,
      thumbnailExt: "PNG",
      blurb:
        "A personal web hour calculator project with a bright, approachable interface and a focused user experience for quick time calculations.",
      impact:
        "Published as a live personal website and ready to be featured directly in the portfolio showcase.",
      category: "My Projects",
      liveUrl: "https://orangecalculator.vercel.app",
      repoUrl: "https://github.com/RMPintoy/Hours_calculator",
      thumbnailLabel: "Calculator",
      accent: "orange",
    },
    {
      title: "Weather Forecast - Is the SKY BLUE Today?",
      type: "Weather Website",
      stack: ["JavaScript", "HTML", "CSS", "Weather API", "React","Vercel"],
      thumbnailCode: "wc",
      thumbnailCount: 4,
      thumbnailExt: "PNG",
      blurb:
        "A playful weather web app that gives users a quick snapshot of current conditions through a simple, memorable experience centered around one question: is the sky blue today?",
      impact:
        "Published as a live personal project that showcases API integration, responsive frontend development, and approachable weather-focused UI design.",
      category: "My Projects",
      liveUrl: "https://istheskybluetoday.vercel.app/",
      repoUrl: "https://github.com/RMPintoy/weather_forcaster",
      thumbnailLabel: "Weather",
      accent: "blue",
    },
    {
      title: "Flowchart Maker - MindVault",
      type: "Productivity Website",
      stack: ["JavaScript", "HTML", "CSS", "React", "Vercel"],
      thumbnailCode: "mv",
      thumbnailExt: "PNG",
      blurb:
        "An interactive flowchart-building web app designed to help users map ideas, organize processes, and turn rough concepts into clear visual structures through a clean and focused interface.",
      impact:
        "Published as a live personal project that highlights hands-on frontend problem solving, visual organization, and user-friendly productivity tool design.",
      category: "My Projects",
      liveUrl: "https://mndvault.vercel.app/",
      repoUrl: "https://github.com/RMPintoy/mindvault",
      thumbnailLabel: "Flowchart",
      accent: "green",
    },
    {
      title: "Portfolio Maker with Interactive Sign In",
      type: "Creative Website",
      stack: ["JavaScript", "HTML", "CSS", "React", "PHP", "Vercel"],
      thumbnailCode: "pm",
      thumbnailExt: "PNG",
      blurb:
        "A creative portfolio-building web app that pairs a polished presentation flow with an interactive sign-in experience, making the process of creating and exploring portfolio content feel more engaging and personalized.",
      impact:
        "Published as a live personal project that showcases interface creativity, user-flow design, and the ability to turn a standard portfolio concept into a more memorable interactive product.",
      category: "My Projects",
      liveUrl: "https://portello-tawny.vercel.app/",
      repoUrl: "https://github.com/RMPintoy/portfolio_maker",
      thumbnailLabel: "Portfolio",
      accent: "orange",
    },
    {
      title: "TaskBanana",
      type: "Enterprise Platform",
      stack: ["PHP", "MySQL", "JavaScript"],
      blurb:
        "A multi-module PLM and enterprise operations system supporting design, procurement, inventory, and production workflows across garment manufacturing teams.",
      impact:
        "Deployed across multiple companies internationally and supporting thousands of employees.",
      category: "Work Projects",
      liveUrl: "#",
      repoUrl: "#",
      thumbnailLabel: "PLM / Ops",
      accent: "orange",
    },
    {
      title: "Production Performance Monitoring System",
      type: "Dashboard",
      stack: ["React", "Laravel", "PHP", "MySQL", "AJAX"],
      blurb:
        "A React-based dashboard for tracking weekly sewing operator output with performance visualization and quota attainment reporting.",
      impact:
        "Used by the CEO and management team to monitor productivity across the organization.",
      category: "Work Projects",
      liveUrl: "#",
      repoUrl: "",
      thumbnailLabel: "Performance",
      accent: "blue",
    },
    {
      title: "Ticket & Workflow Management Systems",
      type: "Workflow Tools",
      stack: ["PHP", "MySQL", "JavaScript", "AJAX"],
      blurb:
        "Internal task and collaboration systems with assignment flows, status tracking, and support tooling for design operations.",
      impact:
        "Adopted by around 97% of employees and extended to a sister company for cross-team collaboration.",
      category: "Work Projects",
      liveUrl: "#",
      repoUrl: "#",
      thumbnailLabel: "Workflow",
      accent: "green",
    },
    {
      title: "RFID Data Management System",
      type: "Data Platform",
      stack: ["PHP", "MySQL", "JavaScript", "AJAX"],
      blurb:
        "A warehouse and logistics data platform built to manage large RFID datasets with validation and retrieval features.",
      impact:
        "Centralized millions of RFID records for accurate inventory and warehouse operations.",
      category: "Work Projects",
      liveUrl: "#",
      repoUrl: "#",
      thumbnailLabel: "RFID Data",
      accent: "yellow",
    },
    {
      title: "Supervisorial Leave Approval Module",
      type: "HR Module",
      stack: ["PHP", "MySQL", "JavaScript", "REST API"],
      blurb:
        "A real-time leave management module connected to an external attendance platform for supervisory review and approvals.",
      impact:
        "Enabled GMs to review, approve, and track leave applications efficiently.",
      category: "Work Projects",
      liveUrl: "#",
      repoUrl: "#",
      thumbnailLabel: "Leave API",
      accent: "orange",
    },
  ],
};
