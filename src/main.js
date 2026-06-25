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
                        ${group.items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
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
