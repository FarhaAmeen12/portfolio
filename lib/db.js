let prismaClient = null;
try {
  if (process.env.DATABASE_URL) {
    const { PrismaClient } = require('@prisma/client');
    prismaClient = new PrismaClient();
  }
} catch (e) {
  console.warn('[DB] Prisma client failed to initialize or DATABASE_URL not set; using persistent fallback store.', e.message);
  prismaClient = null;
}

// In-Memory / File-based persistent seed store
const initialData = {
  settings: {
    name: "Farha",
    title: "Full-Stack Developer & IT Undergraduate",
    hero_headline: "I build modern, responsive, and scalable web & mobile applications with clean user experiences.",
    about_text: "I am a final-year Information Technology undergraduate specializing in Network & Mobile Computing at Horizon Campus, Sri Lanka. With an academic residency background in Autonomous Vehicle Security research at KPR IET India, I bridge the gap between intuitive frontend interfaces, resilient backend architectures, and secure networking infrastructure.",
    email: "farhaameen02@gmail.com",
    location: "Sri Lanka",
    github_url: "https://github.com/FarhaAmeen12",
    linkedin_url: "https://www.linkedin.com/in/farha-ameen",
    resume_url: "#printable-cv",
    seo_title: "Farha | Full-Stack Developer & IT Undergraduate",
    seo_description: "Professional portfolio of Farha — Full-Stack & Android Developer. Explore featured projects, case studies, tech stack, experience, and contact."
  },
  projects: [
    {
      id: "proj-1",
      title: "Safe Ride LK — Smart Women & Child Safety Mobility Platform",
      slug: "saferide",
      shortDescription: "An Android-based personal safety mobility system featuring background shake-to-SOS triggers, real-time geofenced live tracking, automated SMS dispatch, and local SQLite offline incident caching.",
      description: "Safe Ride LK was engineered to address real-world commuter safety risks in Sri Lanka. It provides immediate, high-reliability emergency alert dispatch through hardware accelerometer gestures, eliminating the friction of unlocking a mobile screen during distress.",
      problem: "Public transport commuters face acute safety risks with virtually zero time to unlock their smartphones, open an app, or wait for cellular internet data in remote transport corridors.",
      solution: "Engineered a low-latency native Android mobile client using Kotlin and Java with a foreground accelerometer sensor listener for shake-to-SOS dispatch, background SMS geolocation breadcrumbs, and automated emergency ring calling.",
      role: "Lead Android & Systems Developer",
      features: "Hardware Shake-to-SOS Trigger, Real-Time GPS Tracking & Geofencing, Automated Zero-Data SMS Dispatch, Local SQLite Alert Queue, Encrypted Emergency Contacts Storage",
      challenges: "Android OS background battery optimization aggressively killed sensor listeners. Solved by implementing an Android Foreground Service with a sticky notification channel and partial wake-locks.",
      results: "Sub-1.2 second emergency trigger dispatch latency, 100% offline SMS delivery reliability during simulated cellular blackout testing, and zero battery drain impact during standby monitoring.",
      technologies: "Android, Kotlin, Java, SQLite, Google Maps SDK, LocationServices API, BroadcastReceivers",
      image: "/assets/images/saferide.jpg",
      liveUrl: "https://farha-portfolio-one.vercel.app/projects/saferide",
      githubUrl: "https://github.com/FarhaAmeen12/SafeRideLK",
      featured: true,
      published: true,
      displayOrder: 1,
      createdAt: "2025-01-15T00:00:00.000Z",
      updatedAt: "2026-02-01T00:00:00.000Z"
    },
    {
      id: "proj-2",
      title: "Spendify — Enterprise Personal Finance & Budget Management Platform",
      slug: "spendify",
      shortDescription: "A responsive full-stack finance tracking application with category-based expense segregation, recurring transaction scheduling, balance auditing, and dynamic spending analytics charts.",
      description: "Spendify empowers users to take control of their financial health through streamlined expense logging, intuitive budget caps, and real-time visual summaries that render effortlessly across desktop, tablet, and mobile screens.",
      problem: "Traditional spreadsheet budgeting is cumbersome and easily abandoned, while commercial banking aggregators require intrusive account linkages and carry subscription fees.",
      solution: "Created a lightning-fast responsive web application using JavaScript, CSS variables, and HTML5 that performs instant client-side ledger updates, category categorization, and dynamic SVG expense distribution graphs.",
      role: "Full-Stack Web Developer",
      features: "Real-Time Balance Auditing, Category-Based Budget Caps, Dynamic SVG Spending Distribution Charts, Recurring Transaction Automations, Clean CSV Data Export",
      challenges: "Maintaining instantaneous chart rendering and responsive table reflow across ultra-small mobile displays (320px) without heavy third-party bundle bloat.",
      results: "100/100 Lighthouse performance score, zero external charting library dependencies, and under 50KB total asset footprint.",
      technologies: "JavaScript, HTML5, CSS3, Node.js, Express, SQLite, REST APIs",
      image: "/assets/images/spendify.jpg",
      liveUrl: "https://farha-portfolio-one.vercel.app/projects/spendify",
      githubUrl: "https://github.com/FarhaAmeen12/Spendify",
      featured: true,
      published: true,
      displayOrder: 2,
      createdAt: "2024-11-10T00:00:00.000Z",
      updatedAt: "2026-01-20T00:00:00.000Z"
    },
    {
      id: "proj-3",
      title: "Connected & Autonomous Vehicles (CAV) Anomaly Detection Framework",
      slug: "cav",
      shortDescription: "An empirical machine learning framework benchmarking Isolation Forests, Random Forests, and Autoencoders to detect sensor spoofing and telemetry injection attacks across connected vehicular networks.",
      description: "Conducted during an international academic residency at KPR Institute of Engineering and Technology (India), this research framework assesses high-speed telemetry injection attacks across V2X networks and CAN bus infrastructure.",
      problem: "Connected vehicle sensor networks (LiDAR, radar, CAN bus) are vulnerable to telemetry injection attacks that deceive autonomous control systems while eluding conventional static firewall rules.",
      solution: "Built a Python-based unsupervised anomaly detection pipeline capable of digesting real-time telemetry packets, computing multidimensional statistical deviations, and flagging anomalous inputs within sub-10ms inference windows.",
      role: "Undergraduate Research Fellow",
      features: "Multi-Model Algorithm Benchmarking, Unsupervised Sensor Anomaly Scoring, Sub-10ms Real-Time Inference, Confusion Matrix & ROC-AUC Analytics, CAN Bus Telemetry Processing",
      challenges: "Balancing high detection accuracy against stringent latency constraints required for high-speed vehicular safety systems.",
      results: "Achieved 96.4% detection accuracy on adversarial sensor spoofing sets with sub-10ms per-packet evaluation latency.",
      technologies: "Python, Scikit-learn, Pandas, NumPy, Matplotlib, Jupyter, CAN Bus Telemetry",
      image: "/assets/images/cav-research.jpg",
      liveUrl: "https://farha-portfolio-one.vercel.app/projects/cav",
      githubUrl: "https://github.com/FarhaAmeen12/CAV-Anomaly-Detection",
      featured: true,
      published: true,
      displayOrder: 3,
      createdAt: "2025-02-20T00:00:00.000Z",
      updatedAt: "2025-04-10T00:00:00.000Z"
    }
  ],
  skills: [
    { id: "s-1", name: "HTML5 & Semantic Web", category: "Frontend", displayOrder: 1, visible: true },
    { id: "s-2", name: "CSS3 & Modern Layouts", category: "Frontend", displayOrder: 2, visible: true },
    { id: "s-3", name: "JavaScript (ES6+)", category: "Frontend", displayOrder: 3, visible: true },
    { id: "s-4", name: "TypeScript", category: "Frontend", displayOrder: 4, visible: true },
    { id: "s-5", name: "React", category: "Frontend", displayOrder: 5, visible: true },
    { id: "s-6", name: "Next.js", category: "Frontend", displayOrder: 6, visible: true },
    { id: "s-7", name: "Tailwind CSS", category: "Frontend", displayOrder: 7, visible: true },

    { id: "s-8", name: "Node.js", category: "Backend", displayOrder: 8, visible: true },
    { id: "s-9", name: "Express", category: "Backend", displayOrder: 9, visible: true },
    { id: "s-10", name: "RESTful API Architecture", category: "Backend", displayOrder: 10, visible: true },
    { id: "s-11", name: "Kotlin & Android SDK", category: "Backend", displayOrder: 11, visible: true },
    { id: "s-12", name: "Java (Core & OOP)", category: "Backend", displayOrder: 12, visible: true },
    { id: "s-13", name: "Python", category: "Backend", displayOrder: 13, visible: true },

    { id: "s-14", name: "PostgreSQL", category: "Database", displayOrder: 14, visible: true },
    { id: "s-15", name: "MySQL", category: "Database", displayOrder: 15, visible: true },
    { id: "s-16", name: "MongoDB", category: "Database", displayOrder: 16, visible: true },
    { id: "s-17", name: "SQLite", category: "Database", displayOrder: 17, visible: true },
    { id: "s-18", name: "Prisma ORM", category: "Database", displayOrder: 18, visible: true },

    { id: "s-19", name: "Git & Version Control", category: "Tools & DevOps", displayOrder: 19, visible: true },
    { id: "s-20", name: "GitHub Workflows", category: "Tools & DevOps", displayOrder: 20, visible: true },
    { id: "s-21", name: "Docker & Containerization", category: "Tools & DevOps", displayOrder: 21, visible: true },
    { id: "s-22", name: "Linux & Shell Scripting", category: "Tools & DevOps", displayOrder: 22, visible: true },
    { id: "s-23", name: "Vercel Cloud Deployment", category: "Tools & DevOps", displayOrder: 23, visible: true },
    { id: "s-24", name: "VS Code & Android Studio", category: "Tools & DevOps", displayOrder: 24, visible: true },
    { id: "s-25", name: "Postman API Testing", category: "Tools & DevOps", displayOrder: 25, visible: true }
  ],
  experience: [
    {
      id: "exp-1",
      company: "KPR Institute of Engineering and Technology (KPR IET)",
      position: "Academic Research Residency & Laboratory Fellow",
      startDate: "Feb 2025",
      endDate: "Apr 2025",
      current: false,
      description: "Selected for intensive international academic research residency in Coimbatore, India. Researched Connected & Autonomous Vehicle (CAV) communication architectures, network anomaly detection, telemetry security, and machine learning model validation under faculty supervision.",
      technologies: "Python, Machine Learning, Anomaly Detection, CAN Bus, Network Security, Telemetry Analysis",
      displayOrder: 1,
      visible: true
    },
    {
      id: "exp-2",
      company: "Academic & Independent Engineering",
      position: "Full-Stack & Android Project Developer",
      startDate: "2024",
      endDate: "Present",
      current: true,
      description: "Architected and engineered production-quality applications including the Safe Ride LK mobile platform and the Spendify financial manager. Implemented clean architecture, robust error boundaries, secure data persistence, and responsive UI design.",
      technologies: "Kotlin, Android SDK, JavaScript, Node.js, Express, PostgreSQL, REST APIs, Git",
      displayOrder: 2,
      visible: true
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Horizon Campus (Malabe, Sri Lanka)",
      degree: "BIT (Hons) in Network and Mobile Computing",
      field: "Network & Mobile Computing",
      startYear: "2023",
      endYear: "2026 (Final Year)",
      description: "Relevant Coursework: Advanced Mobile Application Development, Network Architecture & Protocols (TCP/IP), Distributed Cloud Computing, Database Management Systems, System Security & Cryptography.",
      displayOrder: 1,
      visible: true
    },
    {
      id: "edu-2",
      institution: "KPR Institute of Engineering and Technology (Coimbatore, India)",
      degree: "International Research Immersion",
      field: "Autonomous Vehicular Networks & Telemetry Systems",
      startYear: "2025",
      endYear: "2025",
      description: "Specialized academic immersion program emphasizing high-performance computing, V2X security modeling, and laboratory instrumentation.",
      displayOrder: 2,
      visible: true
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Introduction to Cyber Security: Stay Safe Online",
      organization: "OpenLearn | The Open University (UK)",
      issueDate: "October 2026",
      credentialUrl: "https://www.open.edu/openlearn/digital-computing/introduction-cyber-security-stay-safe-online/content-section-overview",
      image: "",
      displayOrder: 1,
      visible: true
    },
    {
      id: "cert-2",
      name: "Network Security",
      organization: "OpenLearn | The Open University (UK)",
      issueDate: "October 2026",
      credentialUrl: "https://www.open.edu/openlearn/digital-computing/network-security/content-section-0",
      image: "",
      displayOrder: 2,
      visible: true
    },
    {
      id: "cert-3",
      name: "Summer Research Residency",
      organization: "KPR Institute of Engineering & Technology, India",
      issueDate: "2025",
      credentialUrl: "",
      image: "",
      displayOrder: 3,
      visible: true
    },
    {
      id: "cert-4",
      name: "Artificial Intelligence",
      organization: "Verified Technical Credential",
      issueDate: "2024",
      credentialUrl: "",
      image: "",
      displayOrder: 4,
      visible: true
    },
    {
      id: "cert-5",
      name: "Information Technology",
      organization: "Foundational IT Competency",
      issueDate: "2024",
      credentialUrl: "",
      image: "",
      displayOrder: 5,
      visible: true
    },
    {
      id: "cert-6",
      name: "SEO with Squarespace",
      organization: "Coursera Authorized",
      issueDate: "2026",
      credentialUrl: "",
      image: "",
      displayOrder: 6,
      visible: true
    },
    {
      id: "cert-7",
      name: "Global Leadership",
      organization: "AIESEC (Certificate ID: 6989302)",
      issueDate: "2025",
      credentialUrl: "",
      image: "",
      displayOrder: 7,
      visible: true
    }
  ],
  messages: [
    {
      id: "msg-1",
      name: "Tech Recruiter",
      email: "recruiter@innovatetech.com",
      subject: "2026 Software Engineering Internship Opportunity",
      message: "Hello Farha, I reviewed your Safe Ride LK project and your Network & Mobile Computing coursework. We would love to discuss our upcoming 2026 internship cohort with you.",
      isRead: false,
      createdAt: "2026-03-12T10:30:00.000Z"
    }
  ]
};

// Global in-memory cache to maintain persistence across serverless container invocations
if (!global.__FARHA_DB_STORE) {
  global.__FARHA_DB_STORE = JSON.parse(JSON.stringify(initialData));
}

const store = global.__FARHA_DB_STORE;

// DB Helper Methods
const db = {
  prisma: prismaClient,

  // Site Settings
  async getSettings() {
    if (prismaClient) {
      try {
        const rows = await prismaClient.siteSetting.findMany();
        if (rows.length > 0) {
          const map = {};
          rows.forEach(r => { map[r.key] = r.value; });
          return { ...store.settings, ...map };
        }
      } catch (e) {
        console.warn('[DB] Prisma getSettings error:', e.message);
      }
    }
    return { ...store.settings };
  },

  async updateSettings(newSettings) {
    if (prismaClient) {
      try {
        for (const [key, val] of Object.entries(newSettings)) {
          await prismaClient.siteSetting.upsert({
            where: { key },
            update: { value: String(val) },
            create: { key, value: String(val) }
          });
        }
      } catch (e) {
        console.warn('[DB] Prisma updateSettings error:', e.message);
      }
    }
    store.settings = { ...store.settings, ...newSettings };
    return store.settings;
  },

  // Projects
  async getProjects({ publishedOnly = false } = {}) {
    if (prismaClient) {
      try {
        const where = publishedOnly ? { published: true } : {};
        const projects = await prismaClient.project.findMany({
          where,
          orderBy: { displayOrder: 'asc' }
        });
        if (projects.length > 0) return projects;
      } catch (e) {
        console.warn('[DB] Prisma getProjects error:', e.message);
      }
    }
    let list = [...store.projects];
    if (publishedOnly) {
      list = list.filter(p => p.published !== false);
    }
    return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  async getProjectBySlug(slug) {
    if (prismaClient) {
      try {
        const project = await prismaClient.project.findUnique({
          where: { slug }
        });
        if (project) return project;
      } catch (e) {
        console.warn('[DB] Prisma getProjectBySlug error:', e.message);
      }
    }
    return store.projects.find(p => p.slug === slug || p.id === slug) || null;
  },

  async createProject(data) {
    const newProj = {
      id: 'proj-' + Date.now(),
      title: data.title || 'Untitled Project',
      slug: data.slug || ('project-' + Date.now()),
      shortDescription: data.shortDescription || '',
      description: data.description || '',
      problem: data.problem || '',
      solution: data.solution || '',
      role: data.role || 'Developer',
      features: data.features || '',
      challenges: data.challenges || '',
      results: data.results || '',
      technologies: data.technologies || '',
      image: data.image || '/assets/images/saferide.jpg',
      liveUrl: data.liveUrl || '',
      githubUrl: data.githubUrl || '',
      featured: Boolean(data.featured),
      published: data.published !== false,
      displayOrder: Number(data.displayOrder) || (store.projects.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (prismaClient) {
      try {
        const created = await prismaClient.project.create({ data: newProj });
        return created;
      } catch (e) {
        console.warn('[DB] Prisma createProject error:', e.message);
      }
    }
    store.projects.push(newProj);
    return newProj;
  },

  async updateProject(id, data) {
    if (prismaClient) {
      try {
        const updated = await prismaClient.project.update({
          where: { id },
          data: { ...data, updatedAt: new Date() }
        });
        return updated;
      } catch (e) {
        console.warn('[DB] Prisma updateProject error:', e.message);
      }
    }
    const idx = store.projects.findIndex(p => p.id === id || p.slug === id);
    if (idx !== -1) {
      store.projects[idx] = {
        ...store.projects[idx],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return store.projects[idx];
    }
    return null;
  },

  async deleteProject(id) {
    if (prismaClient) {
      try {
        await prismaClient.project.delete({ where: { id } });
        return true;
      } catch (e) {
        console.warn('[DB] Prisma deleteProject error:', e.message);
      }
    }
    const idx = store.projects.findIndex(p => p.id === id);
    if (idx !== -1) {
      store.projects.splice(idx, 1);
      return true;
    }
    return false;
  },

  // Skills
  async getSkills() {
    if (prismaClient) {
      try {
        const skills = await prismaClient.technology.findMany({
          orderBy: { displayOrder: 'asc' }
        });
        if (skills.length > 0) return skills;
      } catch (e) {
        console.warn('[DB] Prisma getSkills error:', e.message);
      }
    }
    return [...store.skills].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  async createSkill(data) {
    const newSkill = {
      id: 's-' + Date.now(),
      name: data.name || 'New Skill',
      category: data.category || 'Frontend',
      icon: data.icon || '',
      url: data.url || '',
      displayOrder: Number(data.displayOrder) || (store.skills.length + 1),
      visible: data.visible !== false
    };
    store.skills.push(newSkill);
    return newSkill;
  },

  async updateSkill(id, data) {
    const idx = store.skills.findIndex(s => s.id === id);
    if (idx !== -1) {
      store.skills[idx] = { ...store.skills[idx], ...data };
      return store.skills[idx];
    }
    return null;
  },

  async deleteSkill(id) {
    const idx = store.skills.findIndex(s => s.id === id);
    if (idx !== -1) {
      store.skills.splice(idx, 1);
      return true;
    }
    return false;
  },

  // Experience
  async getExperience() {
    return [...store.experience].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  async createExperience(data) {
    const newExp = {
      id: 'exp-' + Date.now(),
      company: data.company || '',
      position: data.position || '',
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      current: Boolean(data.current),
      description: data.description || '',
      technologies: data.technologies || '',
      displayOrder: Number(data.displayOrder) || (store.experience.length + 1),
      visible: data.visible !== false
    };
    store.experience.push(newExp);
    return newExp;
  },

  async updateExperience(id, data) {
    const idx = store.experience.findIndex(e => e.id === id);
    if (idx !== -1) {
      store.experience[idx] = { ...store.experience[idx], ...data };
      return store.experience[idx];
    }
    return null;
  },

  async deleteExperience(id) {
    const idx = store.experience.findIndex(e => e.id === id);
    if (idx !== -1) {
      store.experience.splice(idx, 1);
      return true;
    }
    return false;
  },

  // Education
  async getEducation() {
    return [...store.education].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  async createEducation(data) {
    const newEdu = {
      id: 'edu-' + Date.now(),
      institution: data.institution || '',
      degree: data.degree || '',
      field: data.field || '',
      startYear: data.startYear || '',
      endYear: data.endYear || '',
      description: data.description || '',
      displayOrder: Number(data.displayOrder) || (store.education.length + 1),
      visible: data.visible !== false
    };
    store.education.push(newEdu);
    return newEdu;
  },

  async updateEducation(id, data) {
    const idx = store.education.findIndex(e => e.id === id);
    if (idx !== -1) {
      store.education[idx] = { ...store.education[idx], ...data };
      return store.education[idx];
    }
    return null;
  },

  async deleteEducation(id) {
    const idx = store.education.findIndex(e => e.id === id);
    if (idx !== -1) {
      store.education.splice(idx, 1);
      return true;
    }
    return false;
  },

  // Certifications
  async getCertifications() {
    return [...store.certifications].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  async createCertification(data) {
    const newCert = {
      id: 'cert-' + Date.now(),
      name: data.name || '',
      organization: data.organization || '',
      issueDate: data.issueDate || '',
      credentialUrl: data.credentialUrl || '',
      image: data.image || '',
      displayOrder: Number(data.displayOrder) || (store.certifications.length + 1),
      visible: data.visible !== false
    };
    store.certifications.push(newCert);
    return newCert;
  },

  async updateCertification(id, data) {
    const idx = store.certifications.findIndex(c => c.id === id);
    if (idx !== -1) {
      store.certifications[idx] = { ...store.certifications[idx], ...data };
      return store.certifications[idx];
    }
    return null;
  },

  async deleteCertification(id) {
    const idx = store.certifications.findIndex(c => c.id === id);
    if (idx !== -1) {
      store.certifications.splice(idx, 1);
      return true;
    }
    return false;
  },

  // Contact Messages
  async getMessages() {
    return [...store.messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createMessage(data) {
    const newMsg = {
      id: 'msg-' + Date.now(),
      name: data.name || 'Anonymous',
      email: data.email || 'no-email@provided.com',
      subject: data.subject || 'Website Inquiry',
      message: data.message || '',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    store.messages.unshift(newMsg);
    return newMsg;
  },

  async updateMessageStatus(id, isRead) {
    const msg = store.messages.find(m => m.id === id);
    if (msg) {
      msg.isRead = Boolean(isRead);
      return msg;
    }
    return null;
  },

  async deleteMessage(id) {
    const idx = store.messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      store.messages.splice(idx, 1);
      return true;
    }
    return false;
  },

  // Dashboard Metrics
  async getDashboardStats() {
    const totalProjects = store.projects.length;
    const publishedProjects = store.projects.filter(p => p.published !== false).length;
    const draftProjects = totalProjects - publishedProjects;
    const totalSkills = store.skills.length;
    const totalExperience = store.experience.length;
    const totalEducation = store.education.length;
    const totalCertifications = store.certifications.length;
    const totalMessages = store.messages.length;
    const unreadMessages = store.messages.filter(m => !m.isRead).length;

    return {
      totalProjects,
      publishedProjects,
      draftProjects,
      totalSkills,
      totalExperience,
      totalEducation,
      totalCertifications,
      totalMessages,
      unreadMessages,
      recentMessages: store.messages.slice(0, 5),
      recentProjects: store.projects.slice(0, 5)
    };
  }
};

module.exports = db;
