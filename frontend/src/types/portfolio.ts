export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  sort_order: number;
}

export interface Profile {
  id: string;
  full_name: string;
  title: string;
  bio?: string;
  avatar_url?: string;
  resume_url?: string;
  location?: string;
  email?: string;
  social_links: SocialLink[];
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string;
  proficiency_level: number;
  is_published: boolean;
  sort_order: number;
}

export interface ProjectGithubMetadata {
  github_id: number;
  full_name: string;
  description?: string;
  url: string;
  language?: string;
  stars: number;
  forks: number;
  topics?: string[] | Record<string, any>;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  summary?: string;
  case_study?: string;
  cover_image_url?: string;
  live_url?: string;
  github_url?: string;
  is_published: boolean;
  featured: boolean;
  sort_order: number;
  github_metadata?: ProjectGithubMetadata;
  skills: Skill[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description?: string;
  is_current: boolean;
  is_published: boolean;
  sort_order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  description?: string;
  is_published: boolean;
  sort_order: number;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  credential_id?: string;
  credential_url?: string;
  issue_date?: string;
  expiry_date?: string;
  image_url?: string;
  is_published: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_title?: string;
  author_company?: string;
  author_avatar_url?: string;
  content: string;
  rating: number;
  is_published: boolean;
  featured: boolean;
  sort_order: number;
}
