const {
  awards,
  certifications,
  education,
  experience,
  profile,
  projects,
  skills,
  stats,
} = window.PORTFOLIO_DATA;

const projectFilters = ["All", "My Projects", "Work Projects"];

const state = {
  activeFilter: "All",
  activeProject: projects[0],
  activeThumbnailIndex: 0,
  activeSection: "home",
};

let thumbnailInterval;
let revealObserver;
let isScrollFrameQueued = false;

// render() rebuilds the whole page, so what has already animated is remembered
// here. Otherwise every click would replay every animation.
const revealedKeys = new Set();

const LIGHTBOX_INTERVAL = 4000;

function lightboxIcon(paths) {
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

const LIGHTBOX_ICONS = {
  close: lightboxIcon(`<path d="M6 6l12 12M18 6L6 18" />`),
  previous: lightboxIcon(`<path d="M15 5l-7 7 7 7" />`),
  next: lightboxIcon(`<path d="M9 5l7 7-7 7" />`),
  pause: lightboxIcon(`<path d="M9 5v14M15 5v14" />`),
  play: lightboxIcon(`<path d="M8 5l11 7-11 7z" />`),
  expand: lightboxIcon(`<path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />`),
};

const TOOL_ICONS = {
  python: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M12 4c-3 0-4 1-4 3v2h4.5v1H6.5C5 10 4 11 4 13s1 3 2.5 3H8v-2c0-1.4 1-2.5 2.5-2.5h3.5c1.2 0 2-.8 2-2V7c0-2-1-3-4-3Z" fill="none"></path>
      <path d="M12 20c3 0 4-1 4-3v-2h-4.5v-1h6c1.500 0 2.500-1 2.500-3s-1-3-2.500-3H16v2c0 1.400-1 2.500-2.500 2.500H10c-1.200 0-2 .8-2 2V17c0 2 1 3 4 3Z" fill="none"></path>
    </svg>
  `,
  render: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M6 19v-8a6 6 0 0 1 6-6h6" fill="none"></path>
      <circle cx="15.5" cy="15.5" r="3"></circle>
    </svg>
  `,
  neon: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="16" height="16" rx="3.5" fill="none"></rect>
      <path d="M9 16V8l6 8V8" fill="none"></path>
    </svg>
  `,
  supabase: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M13 4 5.5 14H12l-1 6 7.5-10H12l1-6Z"></path>
    </svg>
  `,
  linkedin: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <rect x="4" y="4" width="16" height="16" rx="3" fill="none"></rect>
      <path d="M8 10.5V16M8 7.6v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6s2.2.9 2.2 2.6v3" fill="none"></path>
    </svg>
  `,
  react: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="1.8"></circle>
      <ellipse cx="12" cy="12" rx="8.2" ry="3.4"></ellipse>
      <ellipse cx="12" cy="12" rx="8.2" ry="3.4" transform="rotate(60 12 12)"></ellipse>
      <ellipse cx="12" cy="12" rx="8.2" ry="3.4" transform="rotate(120 12 12)"></ellipse>
    </svg>
  `,
  javascript: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M5 4.5h14v15H5z" fill="none"></path>
      <path d="M10.1 8.4v6.1c0 2-1.1 3.1-3 3.1-.9 0-1.7-.2-2.3-.8l1-1.6c.3.3.7.5 1.1.5.7 0 1.1-.3 1.1-1.4V8.4h2.1Zm3.1 7.1c.6.9 1.3 1.3 2.4 1.3.9 0 1.5-.4 1.5-1.1 0-.8-.6-1.1-1.7-1.6l-.6-.2c-1.8-.8-2.9-1.7-2.9-3.6 0-1.8 1.4-3.1 3.5-3.1 1.5 0 2.6.5 3.4 1.9l-1.7 1.1c-.4-.7-.8-.9-1.7-.9-.8 0-1.2.4-1.2 1 0 .7.4 1 1.5 1.4l.6.2c2.1.9 3.2 1.8 3.2 3.8 0 2.2-1.7 3.3-4 3.3-2.2 0-3.6-1-4.3-2.3l1.8-1.1Z"></path>
    </svg>
  `,
  html5: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M5.2 4.5h13.6l-1.2 13.8L12 19.8l-5.6-1.5L5.2 4.5Z"></path>
      <path d="M12 6.4v11.4l4.5-1.2 1-10.2H12Z" fill="rgba(255,255,255,0.18)" stroke="none"></path>
      <path d="M8.1 9h7.8M8.6 12.1h6.8M9 15.2h5.5" fill="none"></path>
    </svg>
  `,
  css3: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M5.4 4.5h13.2l-1.3 13.8-5.3 1.5-5.3-1.5L5.4 4.5Z"></path>
      <path d="M12 6.4v11.4l4.2-1.2 1-10.2H12Z" fill="rgba(255,255,255,0.18)" stroke="none"></path>
      <path d="M8.2 8.9h7.6M8.8 12h5.8M9.4 15.1h4.4" fill="none"></path>
    </svg>
  `,
  bootstrap: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M7 5.8h7.4c2 0 3.2 1.1 3.2 2.7 0 1.2-.7 2.1-1.8 2.5 1.4.3 2.3 1.4 2.3 2.9 0 2-1.5 3.3-3.8 3.3H7V5.8Zm2.3 4.6h4.4c1 0 1.6-.5 1.6-1.3s-.6-1.3-1.6-1.3H9.3v2.6Zm0 4.8H14c1.2 0 1.9-.5 1.9-1.5s-.7-1.5-1.9-1.5H9.3v3Z"></path>
    </svg>
  `,
  tailwind: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M6 10.2c1-2.1 2.6-3.1 4.8-3.1 3.3 0 3.7 2.4 5.3 2.4 1 0 1.8-.5 2.5-1.4-.9 2.1-2.5 3.1-4.8 3.1-3.3 0-3.7-2.4-5.3-2.4-1 0-1.8.5-2.5 1.4Zm-2 5.7c1-2.1 2.6-3.1 4.8-3.1 3.3 0 3.7 2.4 5.3 2.4 1 0 1.8-.5 2.5-1.4-.9 2.1-2.5 3.1-4.8 3.1-3.3 0-3.7-2.4-5.3-2.4-1 0-1.8.5-2.5 1.4Z"></path>
    </svg>
  `,
  jquery: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M8.1 8.4c1.2 1 2 2.2 2.3 3.6M12.2 6.1c1.7 1.2 2.8 3 3.2 5.1M6.4 12.4c1.5 1.3 3.3 2.1 5.4 2.3M10.8 15.1c1.6.8 3.3 1.1 5.1.9" fill="none"></path>
    </svg>
  `,
  ajax: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M6 8.5h7.5M6 12h5.2M6 15.5h7.5M15.4 8.3l2.8 3.7-2.8 3.7M18.2 12h-5.1" fill="none"></path>
    </svg>
  `,
  docker: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <rect x="4" y="9" width="3" height="3" rx="0.8"></rect>
      <rect x="8" y="9" width="3" height="3" rx="0.8"></rect>
      <rect x="12" y="9" width="3" height="3" rx="0.8"></rect>
      <rect x="8" y="5" width="3" height="3" rx="0.8"></rect>
      <rect x="12" y="5" width="3" height="3" rx="0.8"></rect>
      <path d="M4 13.5c.6 3 3.1 4.8 7.5 4.8 4.7 0 7.9-2.1 8.9-6.2-.8.4-1.7.4-2.5 0-.5-.3-.9-.7-1.2-1.1-.7 1-1.8 1.7-3.4 1.7H4Z"></path>
      <path d="M18.4 8.9c1.2-.4 2.2.5 2.4 1.7-1.1.2-2-.2-2.4-1.7Z"></path>
    </svg>
  `,
  git: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M7 12a2.2 2.2 0 1 0 2.7-2.1V6.9a2.2 2.2 0 1 0-1.4 0v3A2.2 2.2 0 0 0 7 12Zm8.7 3.1v-3a2.2 2.2 0 1 0-1.4 0v3a2.2 2.2 0 1 0 1.4 0ZM12 13.7a1.7 1.7 0 0 1-1.2-.5l-1.9-1.9 1-1 1.9 1.9c.1.1.2.1.3.1h2.2v1.4H12Z"></path>
    </svg>
  `,
  github: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M12 3.7a8.3 8.3 0 0 0-2.6 16.2c.4.1.6-.2.6-.5v-1.8c-2.4.5-3-1-3-1-.4-1-.9-1.3-.9-1.3-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.3 2.1.9 2.6.7.1-.6.3-.9.6-1.2-1.9-.2-3.9-.9-3.9-4.2 0-.9.3-1.7.9-2.4-.1-.2-.4-1.1.1-2.2 0 0 .7-.2 2.4.9a8 8 0 0 1 4.4 0c1.7-1.1 2.4-.9 2.4-.9.5 1.1.2 2 .1 2.2.6.7.9 1.5.9 2.4 0 3.2-2 4-3.9 4.2.3.3.6.8.6 1.6v2.4c0 .3.2.6.6.5A8.3 8.3 0 0 0 12 3.7Z"></path>
    </svg>
  `,
  svn: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <circle cx="6" cy="8" r="2.2"></circle>
      <circle cx="18" cy="8" r="2.2"></circle>
      <circle cx="12" cy="16" r="2.2"></circle>
      <path d="M7.8 9.3 10.5 14M16.2 9.3 13.5 14M8.7 8h6.6"></path>
    </svg>
  `,
  vercel: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M12 5.3 19.5 18.7H4.5L12 5.3Z"></path>
    </svg>
  `,
  php: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <ellipse cx="12" cy="12" rx="8.5" ry="5.3"></ellipse>
      <path d="M8.1 13.9v-3.7h1.8c1 0 1.8.5 1.8 1.7s-.8 1.8-1.9 1.8H9.3M12.8 13.9v-3.7h1.6c1 0 1.6.5 1.6 1.7s-.7 2-1.9 2h-1.3M16.8 13.9v-3.7h2" fill="none"></path>
    </svg>
  `,
  nodejs: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="m12 4.5 6.5 3.8v7.4L12 19.5l-6.5-3.8V8.3L12 4.5Z"></path>
      <path d="M12 7.7v8.6M8.9 9.5v5M15.1 9.5v5" fill="none"></path>
    </svg>
  `,
  rest: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M5.5 8.5h13M5.5 12h8.5M5.5 15.5h13M15.8 9.3 18.5 12l-2.7 2.7" fill="none"></path>
    </svg>
  `,
  java: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <path d="M9 16.7c0 1 1.6 1.8 3.7 1.8s3.7-.8 3.7-1.8c0-.8-1-1.3-2.5-1.6M11.1 7.1c1.4.9-1.4 2-.2 3.3M13.3 6c1.6 1-.8 1.9.2 3.1M8 14.2h9.2" fill="none"></path>
      <path d="M8.7 14.2c.4 1 1.7 1.7 3.3 1.7s2.9-.7 3.3-1.7" fill="none"></path>
    </svg>
  `,
  mysql: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <ellipse cx="12" cy="7.5" rx="5.8" ry="2.4"></ellipse>
      <path d="M6.2 7.5v8.8c0 1.3 2.6 2.4 5.8 2.4s5.8-1.1 5.8-2.4V7.5M6.2 11.9c0 1.3 2.6 2.4 5.8 2.4s5.8-1.1 5.8-2.4" fill="none"></path>
    </svg>
  `,
  database: `
    <svg viewBox="0 0 24 24" class="tag-icon-svg" aria-hidden="true" focusable="false">
      <ellipse cx="12" cy="7.2" rx="6.2" ry="2.7"></ellipse>
      <path d="M5.8 7.2v9.6c0 1.5 2.8 2.7 6.2 2.7s6.2-1.2 6.2-2.7V7.2M5.8 12c0 1.5 2.8 2.7 6.2 2.7s6.2-1.2 6.2-2.7" fill="none"></path>
    </svg>
  `,
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function filteredProjects() {
  if (state.activeFilter === "All") return projects;
  return projects.filter((project) => project.category === state.activeFilter);
}

function hasLiveLink(project) {
  return project.liveUrl && project.liveUrl !== "#";
}

function hasRepoLink(project) {
  return project.repoUrl && project.repoUrl !== "#";
}

function hasThumbnail(project) {
  return Boolean(project.thumbnailCode);
}

function getThumbnailCount(project) {
  return Number(project.thumbnailCount) > 0 ? Number(project.thumbnailCount) : 1;
}

function getThumbnailExt(project) {
  return project.thumbnailExt || "jpg";
}

function getThumbnailSrc(project, index = 1) {
  if (!hasThumbnail(project)) return "";
  return `./assets/${project.thumbnailCode}_${index}.${getThumbnailExt(project)}`;
}

function normalizeSkillItem(item) {
  return typeof item === "string" ? { name: item } : item;
}

function renderSkillTag(item) {
  const skill = normalizeSkillItem(item);
  const iconMarkup = skill.icon && TOOL_ICONS[skill.icon]
    ? `<span class="tag-icon" aria-hidden="true">${TOOL_ICONS[skill.icon]}</span>`
    : "";

  return `
    <span class="tag${iconMarkup ? " has-icon" : ""}">
      ${iconMarkup}
      <span>${escapeHtml(skill.name)}</span>
    </span>
  `;
}

function renderThumbnailImage(project, className, index = 1) {
  if (!hasThumbnail(project)) return "";

  return `
    <img
      src="${escapeHtml(getThumbnailSrc(project, index))}"
      alt="${escapeHtml(project.title)} thumbnail"
      class="${escapeHtml(className)}"
      onerror="this.style.display='none'; this.parentElement.classList.add('thumbnail-missing');"
    />
  `;
}

function renderSpotlightImages(project) {
  if (!hasThumbnail(project)) return "";

  return Array.from({ length: getThumbnailCount(project) }, (_, imageIndex) => `
    <img
      src="${escapeHtml(getThumbnailSrc(project, imageIndex + 1))}"
      alt="${escapeHtml(project.title)} preview ${imageIndex + 1}"
      class="spotlight-image${imageIndex === state.activeThumbnailIndex ? " is-active" : ""}"
      onerror="this.style.display='none'; this.parentElement.classList.add('thumbnail-missing');"
    />
  `).join("");
}

function renderSocialLinks() {
  return `
    <a class="btn btn-secondary" href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noreferrer">
      ${TOOL_ICONS.linkedin}
      LinkedIn
    </a>
    <a class="btn btn-secondary" href="${escapeHtml(profile.github)}" target="_blank" rel="noreferrer">
      ${TOOL_ICONS.github}
      GitHub
    </a>
  `;
}

function ensureActiveProject() {
  const visibleProjects = filteredProjects();
  if (!visibleProjects.find((project) => project.title === state.activeProject.title)) {
    state.activeProject = visibleProjects[0];
  }
}

function animateScrollTo(targetTop) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, targetTop);
    return;
  }

  const startTop = window.scrollY;
  const distance = targetTop - startTop;
  const duration = 720;
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startTop + distance * easedProgress);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

function scrollToSection(event, sectionId) {
  if (event) event.preventDefault();
  const target = document.getElementById(sectionId);
  if (!target) return;

  const topbar = document.querySelector(".topbar");
  const offset = topbar ? topbar.getBoundingClientRect().height + 18 : 96;
  const nextTop = target.getBoundingClientRect().top + window.scrollY - offset;
  animateScrollTo(Math.max(nextTop, 0));
}

function scrollToElement(selector) {
  const target = document.querySelector(selector);
  if (!target) return;

  const topbar = document.querySelector(".topbar");
  const offset = topbar ? topbar.getBoundingClientRect().height + 18 : 96;
  const nextTop = target.getBoundingClientRect().top + window.scrollY - offset;
  animateScrollTo(Math.max(nextTop, 0));
}

function render() {
  ensureActiveProject();

  const root = document.getElementById("root");
  const currentProjects = filteredProjects();
  const activeProject = state.activeProject;
  state.activeThumbnailIndex = Math.min(state.activeThumbnailIndex, getThumbnailCount(activeProject) - 1);

  root.innerHTML = `
    <div class="page-shell">
      <header class="topbar">
        <div class="container topbar-inner">
          <a class="brand" href="#home" data-section-link="home">${escapeHtml(profile.name)}</a>
          <nav class="nav" aria-label="Main">
            ${["home", "about", "experience", "projects", "contact"]
              .map(
                (item) => `
                  <a
                    href="#${item}"
                    class="nav-link${state.activeSection === item ? " active" : ""}"
                    data-section-link="${item}"
                  >
                    ${escapeHtml(item)}
                  </a>
                `
              )
              .join("")}
          </nav>
        </div>
        <div class="scroll-progress" aria-hidden="true"></div>
      </header>

      <main>
        <section id="home" class="hero on-dark">
          <div class="container">
            <div class="hero-grid">
              <div class="hero-copy">
                <span class="section-kicker" data-reveal="hero-kicker" style="--reveal-i: 0">${escapeHtml(profile.role)} &middot; ${escapeHtml(profile.location)}</span>
                <h1 data-reveal="hero-title" style="--reveal-i: 1">${escapeHtml(profile.name)}</h1>
                <p class="hero-tagline" data-reveal="hero-tagline" style="--reveal-i: 2">Designing <em>bright, reliable</em> web experiences that make work easier.</p>
                <p class="lede" data-reveal="hero-lede" style="--reveal-i: 2">${escapeHtml(profile.summary)}</p>
                <div class="hero-actions" data-reveal="hero-actions" style="--reveal-i: 3">
                  <a class="btn btn-primary" href="#projects" data-section-link="projects">View My Work</a>
                  <a
                    class="btn btn-secondary"
                    href="./assets/Rica_Mae_Pintoy_Resume_Web_Dev.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Resume
                  </a>
                  ${renderSocialLinks()}
                </div>
                <ul class="highlight-list" data-reveal="hero-highlights" style="--reveal-i: 4">
                  ${profile.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
              </div>

              <aside class="hero-card" data-reveal="hero-photo" style="--reveal-i: 2">
                <div class="photo-frame">
                  <img
                    src="${LOOK_IMAGES[lookState.current]}"
                    data-look="${lookState.current}"
                    alt="Portrait of Rica Mae Pintoy"
                    class="about-photo"
                    draggable="false"
                  />
                </div>
                <blockquote class="hero-quote">“With great power comes great responsibility.”</blockquote>
              </aside>
            </div>

            <div class="stat-grid">
              ${stats
                .map(
                  (stat, statIndex) => `
                    <article class="stat-tile" data-reveal="stat:${escapeHtml(stat.label)}" style="--reveal-i: ${statIndex}">
                      <strong data-count>${escapeHtml(stat.value)}</strong>
                      <span>${escapeHtml(stat.label)}</span>
                    </article>
                  `
                )
                .join("")}
            </div>
          </div>
        </section>

        <section id="about" class="section">
          <div class="container section-grid">
            <article class="panel about-card" data-reveal="about" style="--reveal-i: 0">
              <div class="section-heading">
                <span class="section-kicker">About Me</span>
                <h2>Technical depth with a calm, practical approach.</h2>
              </div>
              <p>
                I build responsive applications, integrate APIs, and turn complex business workflows into clean,
                approachable interfaces. My background spans frontend development, backend services, data-driven systems,
                and collaboration with cross-functional teams.
              </p>
              <div class="mini-profile">
                <div>
                  <span>Location</span>
                  <strong>${escapeHtml(profile.location)}</strong>
                </div>
                <div>
                  <span>Education</span>
                  <strong>${escapeHtml(education.degree)}</strong>
                </div>
                <div>
                  <span>Recognition</span>
                  <strong>${escapeHtml(education.distinctions.join(" • "))}</strong>
                </div>
              </div>
            </article>

            <article class="panel skills-card" data-reveal="skills" style="--reveal-i: 1">
              <div class="section-heading">
                <span class="section-kicker">Skills</span>
                <h2>Tools I work with</h2>
              </div>
              <div class="skill-groups">
                ${skills
                  .map(
                    (group) => `
                      <section class="skill-group">
                        <h3>${escapeHtml(group.title)}</h3>
                        <div class="tag-row">
                          ${group.items.map((item) => renderSkillTag(item)).join("")}
                        </div>
                      </section>
                    `
                  )
                  .join("")}
              </div>
            </article>
          </div>
        </section>

        <section id="experience" class="section section-alt">
          <div class="container experience-grid">
            <article class="timeline-card">
              <div class="section-heading" data-reveal="experience-heading" style="--reveal-i: 0">
                <span class="section-kicker">Experience</span>
                <h2>Hands-on work across enterprise systems</h2>
              </div>
              <div class="timeline">
                <div class="timeline-progress" aria-hidden="true"></div>
                ${experience
                  .map(
                    (job) => `
                      <article class="timeline-item" data-reveal="job:${escapeHtml(job.role)}">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                          <div class="timeline-topline">
                            <h3>${escapeHtml(job.role)}</h3>
                            <span>${escapeHtml(job.period)}</span>
                          </div>
                          <p class="timeline-company">${escapeHtml(job.company)} • ${escapeHtml(job.location)}</p>
                          <ul class="detail-list">
                            ${job.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
                          </ul>
                        </div>
                      </article>
                    `
                  )
                  .join("")}
              </div>
            </article>

            <article class="panel side-stack" data-reveal="side-stack" style="--reveal-i: 1">
              <section class="stack-block">
                <span class="section-kicker">Education</span>
                <h3>${escapeHtml(education.school)}</h3>
                <p>${escapeHtml(education.degree)}</p>
                <p class="muted">${escapeHtml(education.period)}</p>
                <div class="tag-row">
                  ${education.distinctions.map((item) => `<span class="tag soft">${escapeHtml(item)}</span>`).join("")}
                </div>
              </section>

              <section class="stack-block">
                <span class="section-kicker">Certifications</span>
                <h3>Learning &amp; Growth</h3>
                <ul class="detail-list compact">
                  ${certifications.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
              </section>

              <section class="stack-block">
                <span class="section-kicker">Awards</span>
                <h3>Recognition</h3>
                <ul class="detail-list compact">
                  ${awards.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                </ul>
              </section>
            </article>
          </div>
        </section>

        <section id="projects" class="section">
          <div class="container">
            <div class="section-heading split" data-reveal="projects-heading" style="--reveal-i: 0">
              <div>
                <span class="section-kicker">Portfolio</span>
                <h2>Website and system showcase</h2>
              </div>
              <p class="muted">Select a project to preview it, then click the image to see it larger.</p>
            </div>

            <div class="filter-row" data-reveal="projects-filters" style="--reveal-i: 1">
              ${projectFilters
                .map(
                  (filter) => `
                    <button
                      class="filter-chip${state.activeFilter === filter ? " active" : ""}"
                      data-filter="${escapeHtml(filter)}"
                    >
                      ${escapeHtml(filter)}
                    </button>
                  `
                )
                .join("")}
            </div>

            <div class="panel project-spotlight" data-reveal="projects-spotlight" style="--reveal-i: 2">
              <div class="spotlight-visual ${escapeHtml(activeProject.accent)}${hasThumbnail(activeProject) ? " has-thumbnail" : ""}">
                ${renderSpotlightImages(activeProject)}
                <div class="spotlight-title">${escapeHtml(activeProject.thumbnailLabel)}</div>
                ${
                  hasThumbnail(activeProject)
                    ? `
                      <button
                        type="button"
                        class="spotlight-open"
                        aria-label="View larger screenshots of ${escapeHtml(activeProject.title)}"
                      >
                        <span class="spotlight-open-hint">
                          ${LIGHTBOX_ICONS.expand}
                          View larger
                        </span>
                      </button>
                    `
                    : ""
                }
              </div>

              <div class="spotlight-content">
                <span class="section-kicker">${escapeHtml(activeProject.category)} &middot; ${escapeHtml(activeProject.type)}</span>
                <h3>${escapeHtml(activeProject.title)}</h3>
                <p>${escapeHtml(activeProject.blurb)}</p>
                <p class="impact">${escapeHtml(activeProject.impact)}</p>
                <div class="tag-row">
                  ${activeProject.stack.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
                </div>
                ${
                  hasLiveLink(activeProject) || hasRepoLink(activeProject)
                    ? `
                      <div class="hero-actions">
                        ${
                          hasLiveLink(activeProject)
                            ? `
                              <a class="btn btn-primary" href="${escapeHtml(activeProject.liveUrl)}" target="_blank" rel="noreferrer">
                                Open Website
                              </a>
                            `
                            : ""
                        }
                        ${
                          hasRepoLink(activeProject)
                            ? `
                              <a class="btn btn-secondary" href="${escapeHtml(activeProject.repoUrl)}" target="_blank" rel="noreferrer">
                                View Code
                              </a>
                            `
                            : ""
                        }
                      </div>
                    `
                    : ""
                }
              </div>
            </div>

            <div class="project-grid">
              ${currentProjects
                .map(
                  (project, cardIndex) => `
                    <button
                      class="project-card${activeProject.title === project.title ? " active" : ""}"
                      data-project="${escapeHtml(project.title)}"
                      data-reveal="card:${escapeHtml(project.title)}"
                      style="--reveal-i: ${cardIndex % 3}"
                    >
                      <div class="project-thumb ${escapeHtml(project.accent)}${hasThumbnail(project) ? " has-thumbnail" : ""}">
                        ${renderThumbnailImage(project, "project-thumb-image", 1)}
                        <span>${escapeHtml(project.thumbnailLabel)}</span>
                      </div>
                      <div class="project-copy">
                        <span class="project-type">${escapeHtml(project.type)}</span>
                        <h3>${escapeHtml(project.title)}</h3>
                        <p>${escapeHtml(project.blurb)}</p>
                      </div>
                    </button>
                  `
                )
                .join("")}
            </div>
          </div>
        </section>

        <section id="contact" class="contact-panel on-dark">
          <div class="container">
            <span class="section-kicker" data-reveal="contact-kicker" style="--reveal-i: 0">Contact</span>
            <h2 data-reveal="contact-title" style="--reveal-i: 1">Let's build something useful and well-crafted.</h2>
            <p class="contact-copy" data-reveal="contact-copy" style="--reveal-i: 2">
              I'm open to web development opportunities where I can contribute strong frontend work, dependable backend
              logic, and thoughtful collaboration.
            </p>
            <div class="contact-links" data-reveal="contact-links" style="--reveal-i: 3">
              <a class="btn btn-primary" href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>
              <a class="btn btn-secondary" href="tel:${escapeHtml(profile.phone.replace(/\s+/g, ""))}">${escapeHtml(profile.phone)}</a>
              ${renderSocialLinks()}
            </div>
          </div>
        </section>
      </main>
    </div>
  `;

  bindEvents();
  setupReveal();
  updateActiveSection();
  updateScrollEffects();
  setupThumbnailSlideshow();
}

function bindEvents() {
  document.querySelectorAll("[data-section-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      scrollToSection(event, link.dataset.sectionLink);
    });
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeFilter = button.dataset.filter;
      state.activeThumbnailIndex = 0;
      ensureActiveProject();
      forgetRevealedCards();
      render();
      animateSpotlightChange();
    });
  });

  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => {
      const project = projects.find((item) => item.title === button.dataset.project);
      if (!project) return;
      state.activeProject = project;
      state.activeThumbnailIndex = 0;
      render();
      animateSpotlightChange();
      scrollToElement(".project-spotlight");
    });
  });

  const spotlightOpen = document.querySelector(".spotlight-open");
  if (spotlightOpen) {
    spotlightOpen.addEventListener("click", () => {
      openLightbox(state.activeProject, state.activeThumbnailIndex);
    });
  }
}

// The lightbox lives on <body>, outside #root, because render() replaces all of
// #root and can run at any time (for example from the section observer).
function openLightbox(project, startIndex) {
  const count = getThumbnailCount(project);
  const hasMultiple = count > 1;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", `${project.title} screenshots`);
  dialog.innerHTML = `
    <header class="lightbox-bar">
      <div class="lightbox-caption">
        <strong>${escapeHtml(project.title)}</strong>
        ${hasMultiple ? `<span class="lightbox-counter"></span>` : ""}
      </div>
      <div class="lightbox-actions">
        ${
          hasMultiple
            ? `<button type="button" class="lightbox-control lightbox-toggle"></button>`
            : ""
        }
        <button type="button" class="lightbox-control lightbox-close" aria-label="Close" autofocus>
          ${LIGHTBOX_ICONS.close}
        </button>
      </div>
    </header>

    <div class="lightbox-stage">
      ${Array.from({ length: count }, (_, imageIndex) => `
        <div class="lightbox-slide">
          <img
            src="${escapeHtml(getThumbnailSrc(project, imageIndex + 1))}"
            alt="${escapeHtml(project.title)} screenshot ${imageIndex + 1} of ${count}"
            draggable="false"
          />
        </div>
      `).join("")}
      ${
        hasMultiple
          ? `
            <button type="button" class="lightbox-control lightbox-arrow is-prev" aria-label="Previous screenshot">
              ${LIGHTBOX_ICONS.previous}
            </button>
            <button type="button" class="lightbox-control lightbox-arrow is-next" aria-label="Next screenshot">
              ${LIGHTBOX_ICONS.next}
            </button>
          `
          : ""
      }
    </div>

    ${
      hasMultiple
        ? `
          <div class="lightbox-thumbs">
            ${Array.from({ length: count }, (_, imageIndex) => `
              <button type="button" class="lightbox-thumb" aria-label="Show screenshot ${imageIndex + 1} of ${count}">
                <img src="${escapeHtml(getThumbnailSrc(project, imageIndex + 1))}" alt="" draggable="false" />
              </button>
            `).join("")}
          </div>
        `
        : ""
    }
  `;

  const slides = Array.from(dialog.querySelectorAll(".lightbox-slide"));
  const thumbs = Array.from(dialog.querySelectorAll(".lightbox-thumb"));
  const counter = dialog.querySelector(".lightbox-counter");
  const toggle = dialog.querySelector(".lightbox-toggle");
  const stage = dialog.querySelector(".lightbox-stage");

  let index = startIndex;
  let isPlaying = hasMultiple && !reduceMotion;
  let timer = null;
  let swipeStartX = null;
  let didSwipe = false;

  function syncIndicators() {
    slides.forEach((slide, slideIndex) => {
      slide.setAttribute("aria-hidden", String(slideIndex !== index));
    });
    thumbs.forEach((thumb, thumbIndex) => {
      const isCurrent = thumbIndex === index;
      thumb.classList.toggle("is-active", isCurrent);
      if (isCurrent) {
        thumb.setAttribute("aria-current", "true");
        thumb.scrollIntoView({ block: "nearest", inline: "center" });
      } else {
        thumb.removeAttribute("aria-current");
      }
    });
    if (counter) counter.textContent = `${index + 1} / ${count}`;
  }

  // Only the outgoing and incoming slides move, so wrapping from the last image
  // to the first slides one step instead of rewinding through the whole set.
  function slideTo(nextIndex, direction) {
    if (nextIndex === index) return;

    const incoming = slides[nextIndex];
    incoming.style.transition = "none";
    incoming.style.transform = `translateX(${direction * 100}%)`;
    void incoming.offsetWidth;
    incoming.style.transition = "";
    incoming.style.transform = "translateX(0)";
    slides[index].style.transform = `translateX(${-direction * 100}%)`;

    index = nextIndex;
    syncIndicators();
  }

  function startTimer() {
    window.clearInterval(timer);
    timer = isPlaying
      ? window.setInterval(() => slideTo((index + 1) % count, 1), LIGHTBOX_INTERVAL)
      : null;
  }

  function step(direction) {
    if (!hasMultiple) return;
    slideTo((index + direction + count) % count, direction);
    startTimer();
  }

  function syncToggle() {
    if (!toggle) return;
    toggle.innerHTML = isPlaying ? LIGHTBOX_ICONS.pause : LIGHTBOX_ICONS.play;
    toggle.setAttribute("aria-label", isPlaying ? "Pause slideshow" : "Play slideshow");
    // Announce image changes only when they come from the viewer, not the timer.
    if (counter) counter.setAttribute("aria-live", isPlaying ? "off" : "polite");
  }

  slides.forEach((slide, slideIndex) => {
    slide.style.transform = slideIndex === index ? "translateX(0)" : "translateX(100%)";
  });

  dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());

  if (hasMultiple) {
    dialog.querySelector(".is-prev").addEventListener("click", () => step(-1));
    dialog.querySelector(".is-next").addEventListener("click", () => step(1));

    toggle.addEventListener("click", () => {
      isPlaying = !isPlaying;
      syncToggle();
      startTimer();
    });

    thumbs.forEach((thumb, thumbIndex) => {
      thumb.addEventListener("click", () => {
        slideTo(thumbIndex, thumbIndex > index ? 1 : -1);
        startTimer();
      });
    });

    stage.addEventListener("pointerdown", (event) => {
      didSwipe = false;
      swipeStartX = event.target.closest("button") ? null : event.clientX;
    });

    stage.addEventListener("pointerup", (event) => {
      if (swipeStartX === null) return;
      const distance = event.clientX - swipeStartX;
      swipeStartX = null;
      if (Math.abs(distance) < 50) return;
      didSwipe = true;
      step(distance < 0 ? 1 : -1);
    });

    stage.addEventListener("pointercancel", () => {
      swipeStartX = null;
    });
  }

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  });

  // Clicking the empty area around the image closes the viewer.
  dialog.addEventListener("click", (event) => {
    if (didSwipe) {
      didSwipe = false;
      return;
    }
    if (event.target.matches(".lightbox, .lightbox-bar, .lightbox-stage, .lightbox-slide, .lightbox-thumbs")) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => {
    window.clearInterval(timer);
    dialog.remove();
    document.documentElement.classList.remove("lightbox-open");
    document.body.style.paddingRight = "";

    // Carry on the page's slideshow from the image the viewer stopped on.
    state.activeThumbnailIndex = index;
    document.querySelectorAll(".spotlight-image").forEach((image, imageIndex) => {
      image.classList.toggle("is-active", imageIndex === index);
    });
    setupThumbnailSlideshow();

    const opener = document.querySelector(".spotlight-open");
    if (opener) opener.focus({ preventScroll: true });
  });

  // Pause the page's slideshow, and fill the scrollbar's space so the page behind doesn't shift.
  window.clearInterval(thumbnailInterval);
  thumbnailInterval = null;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  document.documentElement.classList.add("lightbox-open");

  document.body.appendChild(dialog);
  dialog.showModal();
  syncIndicators();
  syncToggle();
  startTimer();
}

function setupThumbnailSlideshow() {
  if (thumbnailInterval) {
    window.clearInterval(thumbnailInterval);
    thumbnailInterval = null;
  }

  const count = getThumbnailCount(state.activeProject);
  if (!hasThumbnail(state.activeProject) || count <= 1) return;

  thumbnailInterval = window.setInterval(() => {
    state.activeThumbnailIndex = (state.activeThumbnailIndex + 1) % count;
    const images = Array.from(document.querySelectorAll(".spotlight-image"));

    images.forEach((image, index) => {
      image.classList.toggle("is-active", index === state.activeThumbnailIndex);
    });
  }, 2600);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setupReveal() {
  if (revealObserver) revealObserver.disconnect();

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealObserver.unobserve(entry.target);
        revealedKeys.add(entry.target.dataset.reveal);
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll("[data-count]").forEach(countUp);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
  );

  const skipAnimation = prefersReducedMotion();
  document.querySelectorAll("[data-reveal]").forEach((node) => {
    if (skipAnimation || revealedKeys.has(node.dataset.reveal)) {
      node.classList.add("is-seen");
    } else {
      revealObserver.observe(node);
    }
  });
}

function forgetRevealedCards() {
  revealedKeys.forEach((key) => {
    if (key.startsWith("card:")) revealedKeys.delete(key);
  });
}

function animateSpotlightChange() {
  if (prefersReducedMotion()) return;
  const spotlight = document.querySelector(".project-spotlight");
  if (spotlight) spotlight.classList.add("is-switching");
}

function countUp(node) {
  const finalText = node.textContent;
  const match = finalText.match(/^(\d+)(.*)$/);
  if (!match) return;

  const target = Number(match[1]);
  const suffix = match[2];
  const duration = 1400;
  const startTime = performance.now();

  function step(currentTime) {
    if (!node.isConnected) return;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    if (progress < 1) {
      node.textContent = `${Math.round(target * eased)}${suffix}`;
      window.requestAnimationFrame(step);
    } else {
      node.textContent = finalText;
    }
  }

  node.textContent = `0${suffix}`;
  window.requestAnimationFrame(step);
}

function updateScrollEffects() {
  const bar = document.querySelector(".scroll-progress");
  if (bar) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    bar.style.transform = `scaleX(${progress})`;
  }

  // The timeline fills up to a line 60% of the way down the screen.
  const timeline = document.querySelector(".timeline");
  const fill = document.querySelector(".timeline-progress");
  if (timeline && fill) {
    const fillLine = window.innerHeight * 0.6;
    const rect = timeline.getBoundingClientRect();
    const filled = Math.max(0, Math.min((fillLine - rect.top) / rect.height, 1));
    fill.style.transform = `scaleY(${filled})`;
    document.querySelectorAll(".timeline-marker").forEach((marker) => {
      marker.classList.toggle("is-passed", marker.getBoundingClientRect().top <= fillLine);
    });
  }

  // A gentle drift on the hero photo, only where it sits beside the headline.
  const photo = document.querySelector(".photo-frame");
  if (photo) {
    const canDrift = !prefersReducedMotion() && window.matchMedia("(min-width: 981px)").matches;
    photo.style.transform = canDrift ? `translateY(${window.scrollY * -0.05}px)` : "";
  }
}

// The hero photo looks toward the mouse, down or up while scrolling, back at the
// viewer when scrolling stops, pulls a silly face for 1 second on a click, and
// pouts for 1 second on a double-click.
const LOOK_IMAGES = {
  front: "./assets/rica_pic.jpg",
  N: "./assets/look_N.jpg",
  NE: "./assets/look_NE.jpg",
  E: "./assets/look_E.jpg",
  SE: "./assets/look_SE.jpg",
  S: "./assets/look_S.jpg",
  SW: "./assets/look_SW.jpg",
  W: "./assets/look_W.jpg",
  NW: "./assets/look_NW.jpg",
  pout: "./assets/look_pout.jpg",
  silly1: "./assets/look_silly1.jpg",
  silly2: "./assets/look_silly2.jpg",
  silly3: "./assets/look_silly3.jpg",
};

// The look_* files are named from Rica's point of view, so left and right are
// mirrored compared with the screen: look_E shows her looking at the screen's left.
const SCREEN_TO_LOOK = { E: "W", SE: "SW", S: "S", SW: "SE", W: "E", NW: "NE", N: "N", NE: "NW" };
const SCREEN_DIRECTIONS = ["E", "SE", "S", "SW", "W", "NW", "N", "NE"];
const EXPRESSION_DURATION = 1000;
const SILLY_LOOKS = ["silly1", "silly2", "silly3"];
const SCROLL_SETTLE_DELAY = 250;
// A click waits this long to see whether it becomes a double-click.
const DOUBLE_CLICK_WINDOW = 300;

const readyLooks = new Set(["front"]);
const lookState = {
  current: "front",
  isScrolling: false,
  isHoldingExpression: false,
  scrollTimer: null,
  expressionTimer: null,
  clickTimer: null,
  nextSilly: 0,
  lastScrollY: window.scrollY,
  pointer: null,
  isPointerFrameQueued: false,
};

function preloadLooks() {
  Object.entries(LOOK_IMAGES).forEach(([name, src]) => {
    if (readyLooks.has(name)) return;
    const image = new Image();
    image.src = src;
    image
      .decode()
      .then(() => readyLooks.add(name))
      .catch(() => {});
  });
}

function showLook(name) {
  // Until a photo has downloaded, keep the current one rather than flash a blank frame.
  if (!readyLooks.has(name)) return;
  lookState.current = name;
  const photo = document.querySelector(".about-photo");
  if (photo && photo.dataset.look !== name) {
    photo.src = LOOK_IMAGES[name];
    photo.dataset.look = name;
  }
}

function lookTowardPointer() {
  lookState.isPointerFrameQueued = false;
  if (lookState.isHoldingExpression || lookState.isScrolling || !lookState.pointer) return;

  const frame = document.querySelector(".photo-frame");
  if (!frame) return;

  const rect = frame.getBoundingClientRect();
  const dx = lookState.pointer.x - (rect.left + rect.width / 2);
  const dy = lookState.pointer.y - (rect.top + rect.height / 2);

  // Over the photo itself, she looks straight at the viewer.
  if (Math.hypot(dx, dy) < rect.width / 2) {
    showLook("front");
    return;
  }

  const sector = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8;
  showLook(SCREEN_TO_LOOK[SCREEN_DIRECTIONS[sector]]);
}

function handleLookPointerMove(event) {
  if (event.pointerType === "touch") return;
  lookState.pointer = { x: event.clientX, y: event.clientY };
  if (lookState.isPointerFrameQueued) return;
  lookState.isPointerFrameQueued = true;
  window.requestAnimationFrame(lookTowardPointer);
}

function handleLookPointerLeave() {
  lookState.pointer = null;
  if (!lookState.isHoldingExpression && !lookState.isScrolling) showLook("front");
}

function handleLookScroll() {
  const scrollY = window.scrollY;
  if (scrollY === lookState.lastScrollY) return;
  const direction = scrollY > lookState.lastScrollY ? "S" : "N";
  lookState.lastScrollY = scrollY;

  lookState.isScrolling = true;
  if (!lookState.isHoldingExpression) showLook(direction);

  window.clearTimeout(lookState.scrollTimer);
  lookState.scrollTimer = window.setTimeout(() => {
    lookState.isScrolling = false;
    if (!lookState.isHoldingExpression) showLook("front");
  }, SCROLL_SETTLE_DELAY);
}

// Shows an expression for 1 second; mouse and scroll can't change it meanwhile.
function holdExpression(name) {
  if (!readyLooks.has(name)) return;
  window.clearTimeout(lookState.expressionTimer);
  showLook(name);
  lookState.isHoldingExpression = true;
  lookState.expressionTimer = window.setTimeout(() => {
    lookState.isHoldingExpression = false;
    showLook("front");
  }, EXPRESSION_DURATION);
}

// Rotates through the silly faces so the same one never shows twice in a row.
function showNextSillyLook() {
  for (let offset = 0; offset < SILLY_LOOKS.length; offset++) {
    const index = (lookState.nextSilly + offset) % SILLY_LOOKS.length;
    if (readyLooks.has(SILLY_LOOKS[index])) {
      lookState.nextSilly = (index + 1) % SILLY_LOOKS.length;
      holdExpression(SILLY_LOOKS[index]);
      return;
    }
  }
}

// Mouse clicks and phone taps both arrive here: one click is a silly face, two quick
// clicks are a pout. A click waits briefly first, so a double-click never flashes a silly face.
function handleLookClick(event) {
  if (!event.target.closest(".photo-frame")) return;

  if (lookState.clickTimer) {
    window.clearTimeout(lookState.clickTimer);
    lookState.clickTimer = null;
    holdExpression("pout");
    return;
  }

  lookState.clickTimer = window.setTimeout(() => {
    lookState.clickTimer = null;
    showNextSillyLook();
  }, DOUBLE_CLICK_WINDOW);
}

function handleScroll() {
  if (isScrollFrameQueued) return;
  isScrollFrameQueued = true;
  window.requestAnimationFrame(() => {
    isScrollFrameQueued = false;
    updateActiveSection();
    updateScrollEffects();
  });
}

function updateActiveSection() {
  const sections = ["home", "about", "experience", "projects", "contact"];
  const readingLine = window.innerHeight * 0.4;
  const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

  let current = sections[0];
  sections.forEach((id) => {
    const node = document.getElementById(id);
    if (node && node.getBoundingClientRect().top <= readingLine) current = id;
  });

  // The last section can be too short to ever reach the reading line.
  state.activeSection = isAtBottom ? sections[sections.length - 1] : current;

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.sectionLink === state.activeSection);
  });
}

render();
window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("resize", handleScroll);
window.addEventListener("scroll", handleLookScroll, { passive: true });
document.addEventListener("pointermove", handleLookPointerMove, { passive: true });
document.documentElement.addEventListener("mouseleave", handleLookPointerLeave);
document.addEventListener("click", handleLookClick);

if (document.readyState === "complete") {
  preloadLooks();
} else {
  window.addEventListener("load", preloadLooks);
}
