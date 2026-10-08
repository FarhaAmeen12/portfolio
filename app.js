/**
 * FARHA.DEV — INTERACTIVE PORTFOLIO APPLICATION LOGIC
 * Candidate: M.A. Fathima Farha | IT Undergraduate (Network & Mobile Computing)
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initTheme();
  initNavbar();
  initRoleRotator();
  initStatsObserver();
  initRoleFilters();
  initProjectFilters();
  initResumeModal();
});

/* ===================================================================
   1. AMBIENT BACKGROUND CANVAS (SUBTLE CONSTELLATION PARTICLES)
   =================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particlesCount = Math.min(width > 768 ? 45 : 22, 50);
  const particles = [];

  for (let i = 0; i < particlesCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const dotColor = isLight ? 'rgba(8, 145, 178, ' : 'rgba(34, 211, 238, ';
    const lineColor = isLight ? 'rgba(8, 145, 178, 0.22)' : 'rgba(6, 182, 212, 0.12)';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const alpha = isLight ? (p.alpha * 0.6 + 0.38) : p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isLight ? p.radius * 1.15 : p.radius, 0, Math.PI * 2);
      ctx.fillStyle = dotColor + alpha + ')';
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 135) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = isLight ? 1.0 : 0.75;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ===================================================================
   2. THEME SWITCHER (DARK / LIGHT WITH LOCAL STORAGE)
   =================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const sunIcon = toggleBtn ? toggleBtn.querySelector('.sun-icon') : null;
  const moonIcon = toggleBtn ? toggleBtn.querySelector('.moon-icon') : null;

  const savedTheme = localStorage.getItem('farha_theme') || 'light';
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('farha_theme', nextTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (sunIcon && moonIcon) {
      if (theme === 'light') {
        // In Light mode: show Moon icon to switch to Dark
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        if (toggleBtn) {
          toggleBtn.setAttribute('aria-label', 'Switch to dark theme');
          toggleBtn.setAttribute('title', 'Switch to dark theme');
        }
      } else {
        // In Dark mode: show Sun icon to switch to Light
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        if (toggleBtn) {
          toggleBtn.setAttribute('aria-label', 'Switch to light theme');
          toggleBtn.setAttribute('title', 'Switch to light theme');
        }
      }
    }
  }
}

/* ===================================================================
   3. NAVBAR BEHAVIOR & SMOOTH SCROLL TRACKING
   =================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveSection();
  }, { passive: true });

  if (mobileToggle && navMenu) {
    const toggleMenu = (open) => {
      const willOpen = typeof open === 'boolean' ? open : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', willOpen);
      mobileToggle.classList.toggle('active', willOpen);
      mobileToggle.setAttribute('aria-expanded', String(willOpen));
      if (navbar) navbar.classList.toggle('menu-open', willOpen);
      document.body.style.overflow = willOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close when clicking outside of navbar & menu
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open')) {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
          toggleMenu(false);
        }
      }
    });

    // Close with Escape key for keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
        mobileToggle.focus();
      }
    });
  }

  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const sectionHeight = sec.offsetHeight;
      const sectionTop = sec.offsetTop - 120;
      const sectionId = sec.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ===================================================================
   4. DYNAMIC TYPING & ROLE ROTATOR
   =================================================================== */
function initRoleRotator() {
  const target = document.getElementById('role-rotator');
  if (!target) return;

  const roles = [
    'Software Engineering Intern Candidate',
    'Native Android Developer (Kotlin • Fragment Architecture)',
    'Full-Stack & Backend Developer (JavaScript • Docker • CI/CD)',
    'IT Undergraduate in Network & Mobile Computing (Horizon Campus)',
    'Applied Machine Learning & Data Systems Researcher'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 65;

  function type() {
    const currentText = roles[roleIdx];

    if (isDeleting) {
      target.textContent = currentText.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      target.textContent = currentText.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 65;
    }

    if (!isDeleting && charIdx === currentText.length) {
      typingSpeed = 2200; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ===================================================================
   5. STATS COUNTER ANIMATION WITH INTERSECTION OBSERVER
   =================================================================== */
function initStatsObserver() {
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateStats();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);

  function animateStats() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      let current = 0;
      const duration = 1500;
      const stepTime = 30;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current) + suffix;
        }
      }, stepTime);
    });
  }
}

/* ===================================================================
   6. TARGET ROLES FILTERING
   =================================================================== */
function initRoleFilters() {
  const filterBtns = document.querySelectorAll('.roles-filters .filter-btn');
  const roleCards = document.querySelectorAll('.role-card[data-domain]');

  if (!filterBtns.length || !roleCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-role-filter');

      roleCards.forEach(card => {
        const domain = card.getAttribute('data-domain');
        if (filter === 'all' || domain === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   7. PROJECT CATEGORY FILTERING
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filters .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   8. RESUME & PROJECT MODALS
   =================================================================== */
function initResumeModal() {
  const openBtn = document.getElementById('open-cv-btn');
  if (openBtn) {
    openBtn.addEventListener('click', openResumeModal);
  }

  // Close modals on clicking overlay background
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modal on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });
}

window.openResumeModal = function() {
  const modal = document.getElementById('resume-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

/* ===================================================================
   8. PROJECT CASE STUDY MODAL BUILDER (BLUEPRINT SPECIFICATION)
   =================================================================== */
window.openProjectModal = function(projectId) {
  const modal = document.getElementById('project-detail-modal');
  const titleElem = document.getElementById('proj-modal-title');
  const contentElem = document.getElementById('proj-modal-content');
  if (!modal || !titleElem || !contentElem) return;

  if (projectId === 'saferide') {
    titleElem.textContent = 'Safe Ride LK — Android Road Safety Application';
    contentElem.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <img src="./assets/images/saferide.jpg" alt="Safe Ride LK Android App Screens" style="border-radius:12px; max-height:280px; width:100%; object-fit:cover;">
        
        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">01 — Overview</h4>
          <p style="font-size:0.94rem; color:var(--text-muted); line-height:1.6;">
            Safe Ride LK is a native Android mobile application designed to help road users and traffic authorities in Sri Lanka report road hazards, accidents, and dangerous road conditions in real-time. Within our 3-person team, I worked as the <strong>Backend Developer & Incident Reporting Module Lead</strong>.
          </p>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">02 — The Problem</h4>
          <p style="font-size:0.94rem; color:var(--text-muted); line-height:1.6;">
            When drivers see potholes, fallen trees, or road accidents, there is usually no fast or structured way to report them. Traditional phone calls to local authorities are slow, lack GPS coordinates, and do not alert other nearby drivers in time.
          </p>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">03 — The Solution</h4>
          <p style="font-size:0.94rem; color:var(--text-muted); line-height:1.6;">
            We created a fast, multi-step incident reporting pipeline that lets users submit a detailed hazard report in under 30 seconds, complete with GPS location, photo proof, severity level, and instant alerts.
          </p>
        </div>

        <div style="background:var(--bg-surface-elevated); padding:18px; border-radius:12px; border:1px solid var(--border-subtle);">
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:8px;">04 — Key Features</h4>
          <ul style="padding-left:20px; font-size:0.91rem; color:var(--text-muted); display:flex; flex-direction:column; gap:6px;">
            <li><strong>6-Step Modular Flow:</strong> Type selection, geolocation details, urgent SOS alert, summary review, submission state, and personal incident history.</li>
            <li><strong>Hazard Categorization:</strong> Clean icons and categories for Potholes, Road Obstacles, Severe Traffic, and Accidents.</li>
            <li><strong>Emergency SOS:</strong> One-tap alert to notify nearby drivers and designated emergency contacts.</li>
            <li><strong>History & Status Tracking:</strong> Real-time status tags showing whether a report is Pending, Verified, or Resolved.</li>
          </ul>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">05 — Technology Stack</h4>
          <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6;">
            <strong>Language:</strong> Kotlin<br>
            <strong>Platform:</strong> Android SDK (Android Studio, Gradle)<br>
            <strong>UI Architecture:</strong> Jetpack Fragment Navigation, Data Binding, ConstraintLayout
          </p>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">06 — Technical Challenge</h4>
          <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6;">
            Different road hazard types required slightly different form fields and icons, which originally caused duplicated XML layouts and repetitive activity code across fragments.
          </p>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">07 — How I Solved It</h4>
          <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6;">
            I engineered a custom, reusable <code>ReportTypeAdapter</code> using Kotlin Data Binding. This allowed dynamic view-holder recycling across all hazard categories, reduced boilerplate code by 40%, and made it easy to add new report types later.
          </p>
        </div>

        <div style="display:flex; gap:12px; align-items:center; margin-top:8px;">
          <a href="https://github.com/Heerthana23/Safe_rideLK" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            View Source on GitHub →
          </a>
        </div>
      </div>
    `;
  } else if (projectId === 'spendify') {
    titleElem.textContent = 'Spendify — Automated Expense Tracker & DevOps CI/CD';
    contentElem.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <img src="./assets/images/spendify.jpg" alt="Spendify Web App Screenshot" style="border-radius:12px; max-height:280px; width:100%; object-fit:cover;">
        
        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">01 — Overview</h4>
          <p style="font-size:0.94rem; color:var(--text-muted); line-height:1.6;">
            Spendify is an automated personal finance web application with live analytics dashboards, budget categories, and an automated continuous deployment pipeline. In our 3-person team, I served as <strong>Backend Developer & DevOps Contributor</strong>.
          </p>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">02 — The Problem</h4>
          <p style="font-size:0.94rem; color:var(--text-muted); line-height:1.6;">
            Most personal budget trackers are either overly complicated corporate software or simple spreadsheets that lack real-time visual progress. Teams building such apps also often struggle with manual, error-prone deployment steps.
          </p>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">03 — The Solution</h4>
          <p style="font-size:0.94rem; color:var(--text-muted); line-height:1.6;">
            We created an easy-to-use web app that calculates spending categories automatically, and built a modern DevOps pipeline with Docker and GitHub Actions so any code merged to <code>main</code> is automatically tested and deployed live.
          </p>
        </div>

        <div style="background:var(--bg-surface-elevated); padding:18px; border-radius:12px; border:1px solid var(--border-subtle);">
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:8px;">04 — Key Features</h4>
          <ul style="padding-left:20px; font-size:0.91rem; color:var(--text-muted); display:flex; flex-direction:column; gap:6px;">
            <li><strong>Live Budget Tracking:</strong> Visual percentage progress bars showing spending against monthly category budgets.</li>
            <li><strong>Automated Categorization:</strong> Categorizes transactions into Food, Transport, Utilities, and Entertainment.</li>
            <li><strong>Containerized Environment:</strong> Dockerized runtime so developers can start the app with a single command.</li>
            <li><strong>Continuous Deployment:</strong> GitHub Actions pipeline testing pull requests and deploying directly to Vercel.</li>
          </ul>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">05 — Technology Stack</h4>
          <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6;">
            <strong>Frontend:</strong> HTML5, CSS3, JavaScript (ES6+)<br>
            <strong>DevOps:</strong> Docker, GitHub Actions (CI/CD), Git Branching, Vercel
          </p>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">06 — Technical Challenge</h4>
          <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6;">
            Preventing code conflicts and broken deployments while three team members were pushing updates simultaneously across different machines and operating systems.
          </p>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">07 — How I Solved It</h4>
          <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6;">
            I set up a strict Git branching workflow (<code>main/develop/feature-*</code>), standardized runtime environments with Docker, and required automated GitHub Actions build checks before any pull request could be merged.
          </p>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin-top:8px;">
          <a href="https://spendify-devops-project.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            Launch Live App →
          </a>
          <a href="https://github.com/Rashadha24/spendify-devops-project" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            View on GitHub →
          </a>
        </div>
      </div>
    `;
  } else if (projectId === 'cav') {
    titleElem.textContent = 'CAV Threat Detection — AI Security Model';
    contentElem.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <img src="./assets/images/cav-research.jpg" alt="Autonomous Vehicle Security Telemetry" style="border-radius:12px; max-height:280px; width:100%; object-fit:cover;">
        
        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">01 — Overview</h4>
          <p style="font-size:0.94rem; color:var(--text-muted); line-height:1.6;">
            During my 6-week research residency at the <strong>Network Security and Cloud Lab at KPR Institute of Engineering and Technology (India)</strong>, I investigated how to protect Connected and Autonomous Vehicles (CAVs) from GPS spoofing and sensor injection attacks.
          </p>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">02 — The Problem</h4>
          <p style="font-size:0.94rem; color:var(--text-muted); line-height:1.6;">
            Self-driving and connected cars rely heavily on GPS, LiDAR, and internal sensor feeds. If a malicious attacker broadcasts fake GPS coordinates or injects false signals into the car's network, the vehicle can veer off course or make fatal navigation decisions.
          </p>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">03 — The Solution</h4>
          <p style="font-size:0.94rem; color:var(--text-muted); line-height:1.6;">
            I built a hybrid deep learning autoencoder combining <strong>CNN</strong> (to extract spatial features across sensors) and <strong>Bidirectional GRU</strong> (to learn normal driving patterns over time). When a spoofing attack occurs, the model cannot reconstruct the fake pattern, instantly triggering an alert.
          </p>
        </div>

        <div style="background:var(--bg-surface-elevated); padding:18px; border-radius:12px; border:1px solid var(--border-subtle);">
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:8px;">04 — Key Empirical Results</h4>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; text-align:center; margin-top:8px;">
            <div style="background:rgba(6,182,212,0.1); padding:10px; border-radius:8px;">
              <div style="font-size:1.3rem; font-weight:800; color:var(--primary);">90.0%</div>
              <div style="font-size:0.75rem; color:var(--text-dim);">Detection Accuracy</div>
            </div>
            <div style="background:rgba(34,197,94,0.1); padding:10px; border-radius:8px;">
              <div style="font-size:1.3rem; font-weight:800; color:var(--accent-emerald);">Epoch 44</div>
              <div style="font-size:0.75rem; color:var(--text-dim);">Optimal Loss</div>
            </div>
            <div style="background:rgba(139,92,246,0.1); padding:10px; border-radius:8px;">
              <div style="font-size:1.3rem; font-weight:800; color:var(--accent-purple);">Epoch 48</div>
              <div style="font-size:0.75rem; color:var(--text-dim);">Peak Accuracy</div>
            </div>
          </div>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">05 — Technology Stack</h4>
          <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6;">
            <strong>Language:</strong> Python<br>
            <strong>Frameworks:</strong> TensorFlow, Keras, Scikit-learn<br>
            <strong>Data Processing:</strong> NumPy, Pandas
          </p>
        </div>

        <div>
          <h4 style="color:var(--primary); font-size:1.1rem; margin-bottom:6px;">06 — Research Paper Submission</h4>
          <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6;">
            A full academic manuscript detailing the hybrid model and empirical benchmarks was co-authored and submitted to an international computing conference (currently under peer review).
          </p>
        </div>
      </div>
    `;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

/* ===================================================================
   9. INTERACTIVE CONTACT FORM & TOAST SYSTEM
   =================================================================== */
window.handleContactSubmit = async function(e) {
  e.preventDefault();

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = e.target.querySelector('button[type="submit"]');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const subject = subjectInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !email || !message) {
    showToast('Please fill in all required fields.');
    return;
  }

  const originalBtnHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>Sending Message...</span>`;

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      showToast('Thank you! Your message has been sent successfully.');
      document.getElementById('contact-form').reset();
    } else {
      showToast(data.error || 'Could not send message. Please try again.');
    }
  } catch (err) {
    console.warn('API submission failed, falling back to client mailto:', err);
    // Fallback: Open mail client if serverless is unreachable
    const mailtoBody = encodeURIComponent(
      `Hello Farha,\n\n${message}\n\nFrom: ${name} (${email})`
    );
    const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${subject} - ${name}`);
    window.open(`mailto:fathimafarhabinthameen1010@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`, '_blank');
    showToast('Message client opened! Please send your email.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHtml;
  }
};

window.copyToClipboard = function(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg || 'Copied to clipboard!');
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
};

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg || 'Copied to clipboard!');
  } catch (err) {
    showToast('Could not copy automatically. Value: ' + text);
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  const toast = document.getElementById('toast-notice');
  const msgElem = document.getElementById('toast-message');
  if (!toast || !msgElem) return;

  msgElem.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}
