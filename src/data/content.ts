import type { PortfolioContent } from '../types/portfolio'

export const fallbackContent: PortfolioContent = {
  profile: {
    name: 'Andrey C. Quizon',
    role: 'Frontend Developer',
    location: 'Pampanga, Philippines',
    email: 'canilaoquizonandrey@gmail.com',
    resumeUrl: '/documents/resume-placeholder.pdf',
    photoUrl: '/assets/img/profile-placeholder.svg',
    socials: {
      instagram: 'https://www.instagram.com/heizzzx/',
      github: 'https://github.com/andreyqzn',
      linkedin: 'https://www.linkedin.com/in/andrey-quizon-5a188a373/',
    },
  },
  about: {
    paragraphs: [
      'I build clean, interactive interfaces that turn complex workflows into something people can actually use. My focus is frontend development — React, TypeScript, and thoughtful UI — with enough full-stack experience to ship end-to-end features when a product needs them.',
      'Recently I led development on a Smart Queue Management System for a pediatric clinic, with QR arrival validation, live line monitoring, push notifications, and role-based dashboards for parents, secretaries, and doctors. I care about bridging technical functionality and visual clarity so technology stays accessible.',
    ],
  },
  experience: [
    {
      year: '2026',
      title: 'Full-Stack Developer',
      org: 'Smart Queue — Pediatric Clinic',
    },
    {
      year: '2025',
      title: 'Frontend Developer',
      org: 'Client Web Project',
    },
    {
      year: '2025',
      title: 'Programmer',
      org: 'STI Code Fest',
    },
    {
      year: '2024',
      title: 'Full-Stack Developer',
      org: 'Enrollment System — Client Project',
    },
  ],
  education: {
    degree: 'Bachelor of Science in Information Technology',
    school: 'Pampanga State Agricultural University (PSAU)',
    detail: 'Frontend-focused coursework in web systems and software development',
  },
  techStack: {
    frontend: ['JavaScript', 'TypeScript', 'React', 'Vite', 'Tailwind CSS'],
    backend: ['Node.js', 'Express.js', 'Firebase', 'MongoDB', 'PHP'],
    tools: ['Git', 'GitHub', 'VS Code', 'Android Studio', 'Figma'],
  },
  beyondCoding:
    'Outside of code, I work on graphic and poster design, which sharpens how I organize information visually. I play competitive online games that keep decision-making and teamwork sharp, and I practice guitar — a steady reminder that patience and repetition are how real skill compounds. Those habits carry into how I approach product UI.',
  projects: [
    {
      id: 'smart-queue',
      slug: 'smart-queue',
      title: 'Smart Queue Management System',
      subtitle: 'Pediatric Clinic',
      description:
        'Real-time queue system for a pediatric clinic with QR arrival validation, live line monitoring, Firebase Cloud Messaging, and role-based dashboards for parents, secretaries, and doctors.',
      tech: ['React', 'Firebase', 'FCM', 'TypeScript'],
      image: '/assets/img/smart-queue-placeholder.svg',
      featured: true,
    },
    {
      id: 'dinas-mami-house',
      slug: 'dinas-mami-house',
      title: "Dina's Mami House",
      subtitle: 'Restaurant Website',
      description:
        'Multi-page marketing site for a local Filipino comfort-food restaurant — homepage, menu, gallery, about, and contact — built to help customers explore the menu and reach the business easily.',
      tech: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
      image: '/assets/img/FinalProject.png',
      liveUrl: '/demos/dinas-mami-house/index.html',
      repoUrl: 'https://github.com/andreyqzn/Quizon-Portfolio',
    },
  ],
  socialsPage: {
    displayName: 'Heiz',
    links: [
      {
        label: 'Instagram',
        handle: '@heizzzx',
        url: 'https://www.instagram.com/heizzzx/',
        iconSlug: 'instagram',
        sortOrder: 0,
      },
    ],
  },
  connectLinks: [
    {
      label: 'Instagram',
      handle: '@heizzzx',
      url: 'https://www.instagram.com/heizzzx/',
      iconSlug: 'instagram',
      sortOrder: 0,
    },
    {
      label: 'GitHub',
      handle: 'andreyqzn',
      url: 'https://github.com/andreyqzn',
      iconSlug: 'github',
      sortOrder: 1,
    },
    {
      label: 'LinkedIn',
      handle: 'Andrey Quizon',
      url: 'https://www.linkedin.com/in/andrey-quizon-5a188a373/',
      iconSlug: 'linkedin',
      sortOrder: 2,
    },
  ],
}

/** @deprecated use fallbackContent — kept for any legacy imports */
export const profile = fallbackContent.profile
export const about = fallbackContent.about
export const experience = fallbackContent.experience
export const education = fallbackContent.education
export const techStack = fallbackContent.techStack
export const beyondCoding = fallbackContent.beyondCoding
export const projects = fallbackContent.projects
export type { ProjectItem as Project } from '../types/portfolio'
