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
    const dotColor = isLight ? 'rgba(6, 182, 212, ' : 'rgba(34, 211, 238, ';
    const lineColor = isLight ? 'rgba(6, 182, 212, 0.06)' : 'rgba(6, 182, 212, 0.08)';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = dotColor + p.alpha + ')';
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 0.75;
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

  const savedTheme = localStorage.getItem('farha_theme') || 'dark';
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('farha_theme', nextTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (sunIcon && moonIcon) {
      if (theme === 'light') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
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
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveSection();
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close when clicking outside of menu on mobile
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
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
    'Aspiring Cybersecurity Specialist & Threat Analyst',
    'Network Security & Threat Defense Researcher',
    'AI-Driven Intrusion Detection (BiGRU Autoencoder • 90% Acc)',
    'Network & Mobile Computing Undergraduate (Horizon Campus)',
    'Secure Software Engineer (Android Kotlin • Docker • CI/CD)'
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
   6. PROJECT CATEGORY FILTERING
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
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
   7. RESUME & PROJECT MODALS
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
   8. PROJECT DEEP DIVE MODAL BUILDER
   =================================================================== */
window.openProjectModal = function(projectId) {
  const modal = document.getElementById('project-detail-modal');
  const titleElem = document.getElementById('proj-modal-title');
  const contentElem = document.getElementById('proj-modal-content');
  if (!modal || !titleElem || !contentElem) return;

  if (projectId === 'saferide') {
    titleElem.textContent = 'Safe Ride LK — Android Architecture & Incident Flow';
    contentElem.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <img src="./assets/images/saferide.jpg" alt="Safe Ride LK Android Architecture" style="border-radius:12px; max-height:300px; width:100%; object-fit:cover;">
        
        <div>
          <h4 style="color:var(--text-main); font-size:1.15rem; margin-bottom:8px;">Project Overview & My Contribution</h4>
          <p style="font-size:0.94rem; color:var(--text-muted); line-height:1.6;">
            Safe Ride LK is an Android road safety platform designed to empower citizens to report road hazards, accidents, and speed hazards in real-time. Within the 3-person development team, I operated as the <strong>Backend Developer & Incident Reporting Module Owner</strong>, responsible for the entire end-to-end report capture pipeline.
          </p>
        </div>

        <div style="background:var(--bg-surface-elevated); padding:18px; border-radius:12px; border:1px solid var(--border-subtle);">
          <h5 style="color:var(--primary); font-size:1rem; margin-bottom:10px;">The 6-Fragment Incident Reporting Pipeline</h5>
          <ol style="padding-left:20px; font-size:0.9rem; color:var(--text-muted); display:flex; flex-direction:column; gap:8px;">
            <li><strong>TypeSelectionFragment:</strong> Intuitive categorization interface (Potholes, Road Obstruction, Heavy Traffic, Accident) utilizing dynamic card selectors.</li>
            <li><strong>DetailsLocationFragment:</strong> Captures pinpoint geolocation coordinates, landmark notes, and incident severity level.</li>
            <li><strong>AlertLevelFragment:</strong> Enables users to flag emergency SOS alerts, notifying nearby drivers and designated emergency contacts.</li>
            <li><strong>ReportSummaryFragment:</strong> Pre-submission validation screen displaying all aggregated parameters for user confirmation.</li>
            <li><strong>SubmissionStatusFragment:</strong> Handles async network dispatch, upload retry states, and visual confirmation badge.</li>
            <li><strong>IncidentHistoryFragment:</strong> Cached and synchronized log of past user contributions with status tags (Under Review, Verified, Resolved).</li>
          </ol>
        </div>

        <div>
          <h5 style="color:var(--text-main); font-size:1rem; margin-bottom:6px;">Key Technical Innovation: <code>ReportTypeAdapter</code></h5>
          <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6;">
            To eliminate UI layout duplication across different road incident categories, I architected a reusable <code>ReportTypeAdapter</code> with Kotlin DataBinding. This allowed dynamic view-holder recycling and seamless expansion when new road incident types are introduced.
          </p>
        </div>

        <div style="display:flex; gap:12px; align-items:center; margin-top:10px;">
          <a href="https://github.com/Heerthana23/Safe_rideLK" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            Explore Repository on GitHub
          </a>
        </div>
      </div>
    `;
  } else if (projectId === 'spendify') {
    titleElem.textContent = 'Spendify — DevOps Workflow & Backend Architecture';
    contentElem.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <img src="./assets/images/spendify.jpg" alt="Spendify Web App Mockup" style="border-radius:12px; max-height:300px; width:100%; object-fit:cover;">
        
        <div>
          <h4 style="color:var(--text-main); font-size:1.15rem; margin-bottom:8px;">Full-Stack Financial Automation & CI/CD</h4>
          <p style="font-size:0.94rem; color:var(--text-muted); line-height:1.6;">
            Spendify is an automated personal finance and corporate expense management system. Built with modern JavaScript (ES6+), HTML5, and CSS3, the project followed rigorous industry DevOps standards to enable zero-downtime continuous deployment.
          </p>
        </div>

        <div style="background:var(--bg-surface-elevated); padding:18px; border-radius:12px; border:1px solid var(--border-subtle);">
          <h5 style="color:var(--primary); font-size:1rem; margin-bottom:10px;">Engineering & Team Collaboration Highlights</h5>
          <ul style="padding-left:20px; font-size:0.9rem; color:var(--text-muted); display:flex; flex-direction:column; gap:8px;">
            <li><strong>Git Branching Strategy:</strong> Enforced a strict <code>main / develop / feature-*</code> workflow. Every pull request required peer reviews, which I conducted regularly to ensure high code health and consistency.</li>
            <li><strong>Docker Containerization:</strong> Standardized development and production runtime environments, preventing local dependency divergences.</li>
            <li><strong>GitHub Actions Pipeline:</strong> Automated build validation and lint testing on every pull request, triggering continuous deployment directly to Vercel upon merge to <code>main</code>.</li>
            <li><strong>Financial Analytics:</strong> Integrated categorized monthly expense summaries, budget tracking progress bars, and real-time transaction synchronization.</li>
          </ul>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin-top:10px;">
          <a href="https://spendify-devops-project.vercel.app/" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            Launch Live Application
          </a>
          <a href="https://github.com/Rashadha24/spendify-devops-project" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            Inspect Source Code on GitHub
          </a>
        </div>
      </div>
    `;
  } else if (projectId === 'cav') {
    titleElem.textContent = 'CAV Sensor Cybersecurity — Deep Learning Autoencoder';
    contentElem.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:20px;">
        <img src="./assets/images/cav-research.jpg" alt="CAV Cybersecurity Visualization" style="border-radius:12px; max-height:300px; width:100%; object-fit:cover;">
        
        <div>
          <h4 style="color:var(--text-main); font-size:1.15rem; margin-bottom:8px;">KPR IET CSE Research Residency Findings</h4>
          <p style="font-size:0.94rem; color:var(--text-muted); line-height:1.6;">
            During my full-time research residency at the <strong>Network Security and Cloud Laboratory, Dept. of CSE, KPR Institute of Engineering and Technology</strong> (Coimbatore, India via AIESEC), I spearheaded the research into multi-sensor intrusion detection for Connected and Autonomous Vehicles (CAVs).
          </p>
        </div>

        <div style="background:var(--bg-surface-elevated); padding:18px; border-radius:12px; border:1px solid var(--border-subtle);">
          <h5 style="color:var(--primary); font-size:1rem; margin-bottom:10px;">Deep Learning Architecture: CNN + Bidirectional GRU</h5>
          <ul style="padding-left:20px; font-size:0.9rem; color:var(--text-muted); display:flex; flex-direction:column; gap:8px;">
            <li><strong>Spatial Feature Extraction (CNN):</strong> Captures intricate cross-sensor correlations across LiDAR, GNSS/GPS coordinates, CAN Bus messages, and V2X wireless telemetry.</li>
            <li><strong>Temporal Sequence Learning (BiGRU):</strong> Bidirectional Gated Recurrent Units process sequential dependencies in both forward and backward time steps, modeling normal driving behavior patterns.</li>
            <li><strong>Reconstruction Error Anomaly Detection:</strong> When spoofing or sensor injection attacks occur (e.g. false GPS signals or malicious CAN frames), the autoencoder produces large reconstruction divergence, immediately triggering security alerts.</li>
          </ul>
        </div>

        <!-- Authentic KPR Residency Photos in Modal -->
        <div>
          <h5 style="color:var(--text-main); font-size:1rem; margin-bottom:10px;">Research Residency in Coimbatore, India</h5>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div style="border-radius:8px; overflow:hidden; border:1px solid var(--border-subtle);">
              <img src="./assets/images/kpr-campus.jpg" alt="Farha at KPR IET India" style="width:100%; height:160px; object-fit:cover;">
              <div style="padding:8px 10px; font-size:0.78rem; color:var(--text-muted); background:var(--bg-surface);">KPR IET Campus — Representing Sri Lanka</div>
            </div>
            <div style="border-radius:8px; overflow:hidden; border:1px solid var(--border-subtle);">
              <img src="./assets/images/kpr-lab-research.jpg" alt="Farha in CSE Lab" style="width:100%; height:160px; object-fit:cover;">
              <div style="padding:8px 10px; font-size:0.78rem; color:var(--text-muted); background:var(--bg-surface);">Network Security & Cloud Lab — Manuscript Review</div>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; text-align:center;">
          <div style="background:rgba(0,242,254,0.08); padding:12px; border-radius:8px; border:1px solid var(--border-subtle);">
            <div style="font-size:1.4rem; font-weight:800; color:var(--primary);">90.0%</div>
            <div style="font-size:0.75rem; color:var(--text-dim);">Detection Accuracy</div>
          </div>
          <div style="background:rgba(16,185,129,0.08); padding:12px; border-radius:8px; border:1px solid var(--border-subtle);">
            <div style="font-size:1.4rem; font-weight:800; color:var(--accent-emerald);">Epoch 44</div>
            <div style="font-size:0.75rem; color:var(--text-dim);">Best Validation Loss</div>
          </div>
          <div style="background:rgba(139,92,246,0.08); padding:12px; border-radius:8px; border:1px solid var(--border-subtle);">
            <div style="font-size:1.4rem; font-weight:800; color:var(--accent-purple);">Epoch 48</div>
            <div style="font-size:0.75rem; color:var(--text-dim);">Peak Model Accuracy</div>
          </div>
        </div>

        <div>
          <h5 style="color:var(--text-main); font-size:1rem; margin-bottom:6px;">Scientific Conference Manuscript</h5>
          <p style="font-size:0.92rem; color:var(--text-muted); line-height:1.6;">
            A complete academic manuscript detailing this methodology and empirical benchmarks has been authored and submitted to an international computing conference (currently under peer review).
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
window.handleContactSubmit = function(e) {
  e.preventDefault();

  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const subject = document.getElementById('contact-subject').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  if (!name || !email || !message) {
    showToast('Please fill in all required fields.');
    return;
  }

  // Pre-fill mailto link to open recruiter's default mail client directly
  const mailtoBody = encodeURIComponent(
    `Hello Farha,\n\n${message}\n\nFrom: ${name} (${email})`
  );
  const mailtoSubject = encodeURIComponent(`[Internship Inquiry] ${subject} - ${name}`);
  const mailtoUrl = `mailto:fathimafarhabinthameen1010@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

  window.open(mailtoUrl, '_blank');

  showToast('Opening your email client to reach Farha! Form drafted successfully.');
  document.getElementById('contact-form').reset();
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
