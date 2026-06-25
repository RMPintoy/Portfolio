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
  scrollProgress: 0,
  isTopbarPinned: false,
};

let sectionObserver;
let thumbnailInterval;

const TOOL_ICONS = {
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

function ensureActiveProject() {
  const visibleProjects = filteredProjects();
  if (!visibleProjects.find((project) => project.title === state.activeProject.title)) {
    state.activeProject = visibleProjects[0];
  }
}

function animateScrollTo(targetTop) {
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
    <div
      class="page-shell"
      style="--night-progress: ${state.scrollProgress}; --night-shift: ${state.scrollProgress * 32}%"
    >
      <div class="orb orb-one"></div>
      <div class="orb orb-two"></div>
      <div class="orb orb-three"></div>

      <header class="topbar${state.isTopbarPinned ? " is-pinned" : ""}">
        <a class="brand" href="#home" data-section-link="home">${escapeHtml(profile.name)} | Web Developer</a>
        <nav class="nav">
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
      </header>

      <main class="layout">
        <section id="home" class="hero panel">
          <div class="hero-copy">
            <span class="eyebrow"></span>
            <h1>Designing bright, reliable web experiences that make work easier.</h1>
            <p class="lede">${escapeHtml(profile.summary)}</p>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#projects" data-section-link="projects">View My Work</a>
              <a
                class="btn btn-secondary"
                href="./assets/Rica_Mae_Pintoy_Resume_Web_Dev.pdf"
                target="_blank"
                rel="noreferrer"
              >
                View Resume
              </a>
              <a class="btn btn-secondary" href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
            <ul class="highlight-list">
              ${profile.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
          </div>

          <aside class="hero-card">
            <div class="hero-card-header">
              <span class="status-dot"></span>
              <p>Currently building user-focused internal systems</p>
            </div>
            <div class="stat-grid">
              ${stats
                .map(
                  (stat) => `
                    <article class="stat-tile">
                      <strong>${escapeHtml(stat.value)}</strong>
                      <span>${escapeHtml(stat.label)}</span>
                    </article>
                  `
                )
                .join("")}
            </div>
          </aside>
        </section>

        <section id="about" class="section-grid">
          <article class="panel about-card">
            <div class="about-intro">
              <div class="about-photo-box" aria-label="2x2 picture placeholder">
                <div class="photo-frame">
                  <img src="./assets/rica_pic.jpg" alt="Rica Mae Pintoy portrait" class="about-photo" />
                </div>
              </div>
              <div>
                <div class="section-heading">
                  <span class="section-kicker">About Me</span>
                  <h2>Technical depth with a calm, practical approach.</h2>
                </div>
              </div>
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

          <article class="panel skills-card">
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
        </section>

        <section id="experience" class="section-grid">
          <article class="panel timeline-card">
            <div class="section-heading">
              <span class="section-kicker">Experience</span>
              <h2>Hands-on work across enterprise systems</h2>
            </div>
            <div class="timeline">
              ${experience
                .map(
                  (job) => `
                    <article class="timeline-item">
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

          <article class="panel side-stack">
            <section class="stack-block">
              <div class="section-heading">
                <span class="section-kicker">Education</span>
                <h2>${escapeHtml(education.school)}</h2>
              </div>
              <p>${escapeHtml(education.degree)}</p>
              <p class="muted">${escapeHtml(education.period)}</p>
              <div class="tag-row">
                ${education.distinctions.map((item) => `<span class="tag soft">${escapeHtml(item)}</span>`).join("")}
              </div>
            </section>

            <section class="stack-block">
              <div class="section-heading">
                <span class="section-kicker">Certifications</span>
                <h2>Learning & Growth</h2>
              </div>
              <ul class="detail-list compact">
                ${certifications.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </section>

            <section class="stack-block">
              <div class="section-heading">
                <span class="section-kicker">Awards</span>
                <h2>Recognition</h2>
              </div>
              <ul class="detail-list compact">
                ${awards.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </section>
          </article>
        </section>

        <section id="projects" class="panel projects-panel">
          <div class="section-heading split">
            <div>
              <span class="section-kicker">Portfolio</span>
              <h2>Website and system showcase</h2>
            </div>
            <p class="muted">
              Click a project card to preview details. The gallery is ready for live website links and thumbnail updates.
            </p>
          </div>

          <div class="filter-row">
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

          <div class="project-layout">
            <div class="project-grid">
              ${currentProjects
                .map(
                  (project) => `
                    <button
                      class="project-card${activeProject.title === project.title ? " active" : ""}"
                      data-project="${escapeHtml(project.title)}"
                    >
                      <div class="project-thumb ${escapeHtml(project.accent)}${hasThumbnail(project) ? " has-thumbnail" : ""}">
                        ${renderThumbnailImage(project, "project-thumb-image", 1)}
                        <span>${escapeHtml(project.thumbnailLabel)}</span>
                      </div>
                      <div class="project-copy">
                        <div class="project-topline">
                          <h3>${escapeHtml(project.title)}</h3>
                          <span>${escapeHtml(project.type)}</span>
                        </div>
                        <p>${escapeHtml(project.blurb)}</p>
                      </div>
                    </button>
                  `
                )
                .join("")}
            </div>

            <aside class="project-spotlight">
              <div class="spotlight-visual ${escapeHtml(activeProject.accent)}${hasThumbnail(activeProject) ? " has-thumbnail" : ""}">
                ${renderSpotlightImages(activeProject)}
                <div class="browser-chrome">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="spotlight-label">${escapeHtml(activeProject.thumbnailLabel)}</div>
                <div class="spotlight-title">${escapeHtml(activeProject.title)}</div>
              </div>

              <div class="spotlight-content">
                <span class="section-kicker">${escapeHtml(activeProject.category)}</span>
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
            </aside>
          </div>
        </section>

        <section id="contact" class="panel contact-panel">
          <div class="section-heading">
            <span class="section-kicker">Contact</span>
            <h2>Let's build something useful and well-crafted.</h2>
          </div>
          <p class="contact-copy">
            I'm open to web development opportunities where I can contribute strong frontend work, dependable backend
            logic, and thoughtful collaboration.
          </p>
          <div class="contact-links">
            <a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>
            <a href="tel:${escapeHtml(profile.phone.replace(/\s+/g, ""))}">${escapeHtml(profile.phone)}</a>
            <a href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noreferrer">LinkedIn Profile</a>
          </div>
        </section>
      </main>
    </div>
  `;

  bindEvents();
  refreshSectionObserver();
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
      render();
    });
  });

  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => {
      const project = projects.find((item) => item.title === button.dataset.project);
      if (!project) return;
      state.activeProject = project;
      state.activeThumbnailIndex = 0;
      render();
      scrollToElement(".project-spotlight");
    });
  });
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

function refreshSectionObserver() {
  const sections = ["home", "about", "experience", "projects", "contact"];

  if (sectionObserver) {
    sectionObserver.disconnect();
  }

  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible && visible.target && visible.target.id && state.activeSection !== visible.target.id) {
        state.activeSection = visible.target.id;
        render();
      }
    },
    { threshold: [0.2, 0.45, 0.7] }
  );

  sections.forEach((id) => {
    const node = document.getElementById(id);
    if (node) sectionObserver.observe(node);
  });
}

function setupScrollTracking() {
  function updateScrollProgress() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    state.scrollProgress = scrollableHeight <= 0 ? 0 : Math.min(window.scrollY / scrollableHeight, 1);
    state.isTopbarPinned = window.scrollY > 24;
    const shell = document.querySelector(".page-shell");
    const topbar = document.querySelector(".topbar");

    if (shell) {
      shell.style.setProperty("--night-progress", state.scrollProgress);
      shell.style.setProperty("--night-shift", `${state.scrollProgress * 32}%`);
    }

    if (topbar) {
      topbar.classList.toggle("is-pinned", state.isTopbarPinned);
    }
  }

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
}

render();
setupScrollTracking();
