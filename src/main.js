import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import htm from "https://esm.sh/htm@3.1.1";
import {
  awards,
  certifications,
  education,
  experience,
  profile,
  projects,
  skills,
  stats,
} from "./data.js";

const html = htm.bind(React.createElement);

const projectFilters = ["All", "Website", "Enterprise", "Dashboard", "System", "Data", "Integration"];

function App() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = ["home", "about", "experience", "projects", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.2, 0.45, 0.7] }
    );

    sections.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    if (!filteredProjects.find((project) => project.title === activeProject.title)) {
      setActiveProject(filteredProjects[0]);
    }
  }, [filteredProjects, activeProject]);

  return html`
    <div className="page-shell">
      <div className="orb orb-one"></div>
      <div className="orb orb-two"></div>
      <div className="orb orb-three"></div>

      <header className="topbar">
        <a className="brand" href="#home">${profile.name}</a>
        <nav className="nav">
          ${["home", "about", "experience", "projects", "contact"].map(
            (item) => html`
              <a
                key=${item}
                href=${`#${item}`}
                className=${activeSection === item ? "nav-link active" : "nav-link"}
              >
                ${item}
              </a>
            `
          )}
        </nav>
      </header>

      <main className="layout">
        <section id="home" className="hero panel">
          <div className="hero-copy">
            <span className="eyebrow">Full-Stack Builder | React | PHP | SQL</span>
            <h1>Designing bright, reliable web experiences that make work easier.</h1>
            <p className="lede">${profile.summary}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">View My Work</a>
              <a
                className="btn btn-secondary"
                href="./assets/Rica_Mae_Pintoy_Resume_Web_Dev.pdf"
                target="_blank"
                rel="noreferrer"
              >
                View Resume
              </a>
              <a className="btn btn-secondary" href=${profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
            <ul className="highlight-list">
              ${profile.highlights.map(
                (item) => html`<li key=${item}>${item}</li>`
              )}
            </ul>
          </div>

          <aside className="hero-card">
            <div className="hero-card-header">
              <span className="status-dot"></span>
              <p>Currently building user-focused internal systems</p>
            </div>
            <div className="stat-grid">
              ${stats.map(
                (stat) => html`
                  <article key=${stat.label} className="stat-tile">
                    <strong>${stat.value}</strong>
                    <span>${stat.label}</span>
                  </article>
                `
              )}
            </div>
          </aside>
        </section>

        <section id="about" className="section-grid">
          <article className="panel about-card">
            <div className="section-heading">
              <span className="section-kicker">About Me</span>
              <h2>Technical depth with a calm, practical approach.</h2>
            </div>
            <p>
              I build responsive applications, integrate APIs, and turn complex business workflows into clean,
              approachable interfaces. My background spans frontend development, backend services, data-driven systems,
              and collaboration with cross-functional teams.
            </p>
            <div className="mini-profile">
              <div>
                <span>Location</span>
                <strong>${profile.location}</strong>
              </div>
              <div>
                <span>Education</span>
                <strong>${education.degree}</strong>
              </div>
              <div>
                <span>Recognition</span>
                <strong>${education.distinctions.join(" • ")}</strong>
              </div>
            </div>
          </article>

          <article className="panel skills-card">
            <div className="section-heading">
              <span className="section-kicker">Skills</span>
              <h2>Tools I work with</h2>
            </div>
            <div className="skill-groups">
              ${skills.map(
                (group) => html`
                  <section key=${group.title} className="skill-group">
                    <h3>${group.title}</h3>
                    <div className="tag-row">
                      ${group.items.map(
                        (item) => html`<span key=${item} className="tag">${item}</span>`
                      )}
                    </div>
                  </section>
                `
              )}
            </div>
          </article>
        </section>

        <section id="experience" className="section-grid">
          <article className="panel timeline-card">
            <div className="section-heading">
              <span className="section-kicker">Experience</span>
              <h2>Hands-on work across enterprise systems</h2>
            </div>
            <div className="timeline">
              ${experience.map(
                (job) => html`
                  <article key=${`${job.company}-${job.role}`} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-topline">
                        <h3>${job.role}</h3>
                        <span>${job.period}</span>
                      </div>
                      <p className="timeline-company">${job.company} • ${job.location}</p>
                      <ul className="detail-list">
                        ${job.points.map(
                          (point) => html`<li key=${point}>${point}</li>`
                        )}
                      </ul>
                    </div>
                  </article>
                `
              )}
            </div>
          </article>

          <article className="panel side-stack">
            <section className="stack-block">
              <div className="section-heading">
                <span className="section-kicker">Education</span>
                <h2>${education.school}</h2>
              </div>
              <p>${education.degree}</p>
              <p className="muted">${education.period}</p>
              <div className="tag-row">
                ${education.distinctions.map(
                  (item) => html`<span key=${item} className="tag soft">${item}</span>`
                )}
              </div>
            </section>

            <section className="stack-block">
              <div className="section-heading">
                <span className="section-kicker">Certifications</span>
                <h2>Learning & Growth</h2>
              </div>
              <ul className="detail-list compact">
                ${certifications.map(
                  (item) => html`<li key=${item}>${item}</li>`
                )}
              </ul>
            </section>

            <section className="stack-block">
              <div className="section-heading">
                <span className="section-kicker">Awards</span>
                <h2>Recognition</h2>
              </div>
              <ul className="detail-list compact">
                ${awards.map((item) => html`<li key=${item}>${item}</li>`)}
              </ul>
            </section>
          </article>
        </section>

        <section id="projects" className="panel projects-panel">
          <div className="section-heading split">
            <div>
              <span className="section-kicker">Portfolio</span>
              <h2>Website and system showcase</h2>
            </div>
            <p className="muted">
              Click a project card to preview details. The gallery is ready for live website links and thumbnail updates.
            </p>
          </div>

          <div className="filter-row">
            ${projectFilters.map(
              (filter) => html`
                <button
                  key=${filter}
                  className=${activeFilter === filter ? "filter-chip active" : "filter-chip"}
                  onClick=${() => setActiveFilter(filter)}
                >
                  ${filter}
                </button>
              `
            )}
          </div>

          <div className="project-layout">
            <div className="project-grid">
              ${filteredProjects.map(
                (project) => html`
                  <button
                    key=${project.title}
                    className=${activeProject.title === project.title ? "project-card active" : "project-card"}
                    onClick=${() => setActiveProject(project)}
                  >
                    <div className=${`project-thumb ${project.accent}`}>
                      <span>${project.thumbnailLabel}</span>
                    </div>
                    <div className="project-copy">
                      <div className="project-topline">
                        <h3>${project.title}</h3>
                        <span>${project.type}</span>
                      </div>
                      <p>${project.blurb}</p>
                    </div>
                  </button>
                `
              )}
            </div>

            <aside className="project-spotlight">
              <div className=${`spotlight-visual ${activeProject.accent}`}>
                <div className="browser-chrome">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="spotlight-label">${activeProject.thumbnailLabel}</div>
                <div className="spotlight-title">${activeProject.title}</div>
              </div>

              <div className="spotlight-content">
                <span className="section-kicker">${activeProject.category}</span>
                <h3>${activeProject.title}</h3>
                <p>${activeProject.blurb}</p>
                <p className="impact">${activeProject.impact}</p>
                <div className="tag-row">
                  ${activeProject.stack.map(
                    (item) => html`<span key=${item} className="tag">${item}</span>`
                  )}
                </div>
                <div className="hero-actions">
                  <a
                    className="btn btn-primary"
                    href=${activeProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Website
                  </a>
                  <a
                    className="btn btn-secondary"
                    href=${activeProject.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Code
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="contact" className="panel contact-panel">
          <div className="section-heading">
            <span className="section-kicker">Contact</span>
            <h2>Let’s build something useful and well-crafted.</h2>
          </div>
          <p className="contact-copy">
            I’m open to web development opportunities where I can contribute strong frontend work, dependable backend
            logic, and thoughtful collaboration.
          </p>
          <div className="contact-links">
            <a href=${`mailto:${profile.email}`}>${profile.email}</a>
            <a href=${`tel:${profile.phone.replace(/\s+/g, "")}`}>${profile.phone}</a>
            <a href=${profile.linkedin} target="_blank" rel="noreferrer">LinkedIn Profile</a>
          </div>
        </section>
      </main>
    </div>
  `;
}

createRoot(document.getElementById("root")).render(html`<${App} />`);
