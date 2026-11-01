export type ProfileContent = {
  name: string
  role: string
  location: string
  email: string
  resumeUrl: string
  photoUrl: string
  socials: {
    instagram: string
    github: string
    linkedin: string
  }
}

export type ExperienceItem = {
  id?: string
  year: string
  title: string
  org: string
  sortOrder?: number
}

export type EducationContent = {
  degree: string
  school: string
  detail: string
}

export type TechStackContent = {
  frontend: string[]
  backend: string[]
  tools: string[]
}

export type ProjectItem = {
  id: string
  slug?: string
  title: string
  subtitle: string
  description: string
  tech: string[]
  image: string
  liveUrl?: string
  repoUrl?: string
  featured?: boolean
  sortOrder?: number
}

export type SocialLinkItem = {
  id?: string
  label: string
  handle: string
  url: string
  iconSlug: string
  sortOrder?: number
}

export type SocialsPageContent = {
  displayName: string
  links: SocialLinkItem[]
}

export type PortfolioContent = {
  profile: ProfileContent
  about: { paragraphs: string[] }
  experience: ExperienceItem[]
  education: EducationContent
  techStack: TechStackContent
  beyondCoding: string
  projects: ProjectItem[]
  socialsPage: SocialsPageContent
  connectLinks: SocialLinkItem[]
}
