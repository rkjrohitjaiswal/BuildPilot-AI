import { ExperienceLevel, TeamSize, ProjectDuration, BudgetOption } from '../types/profile';

export const PRESET_SKILLS = [
  'React',
  'JavaScript',
  'Python',
  'Java',
  'SQL',
  'Node.js',
  'Machine Learning',
  'TypeScript',
  'Flutter',
  'C++',
  'MongoDB',
  'Docker',
  'Next.js',
  'PyTorch',
  'AWS',
  'HTML/CSS',
  'FastAPI',
  'Git',
];

export const PRESET_INTERESTS = [
  'AI/ML',
  'Web Development',
  'Cybersecurity',
  'Education',
  'Healthcare',
  'FinTech',
  'IoT',
  'E-Commerce',
  'Data Analytics',
  'Blockchain',
  'Cloud Computing',
  'Gaming & AR/VR',
];

export const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string; desc: string }[] = [
  { id: 'Beginner', label: 'Beginner', desc: 'Basics of coding, building simple projects' },
  { id: 'Intermediate', label: 'Intermediate', desc: 'Comfortable with full apps, APIs & databases' },
  { id: 'Advanced', label: 'Advanced', desc: 'Complex system design, ML models & DevOps' },
];

export const TEAM_SIZES: TeamSize[] = ['1', '2', '3', '4+'];

export const DURATION_OPTIONS: ProjectDuration[] = [
  '1–2 months',
  '3–4 months',
  '5–6 months',
  '6+ months',
];

export const BUDGET_OPTIONS: BudgetOption[] = [
  '₹0',
  'Under ₹5,000',
  '₹5,000–₹15,000',
  '₹15,000+',
];

export const DOMAIN_OPTIONS = [
  'Any Domain (Recommended)',
  'Web & Fullstack Applications',
  'Artificial Intelligence & Data Science',
  'Cybersecurity & Network Defense',
  'Mobile Apps & Cross-Platform',
  'Cloud Native & Distributed Systems',
  'IoT, Embedded Systems & Hardware',
  'EdTech & Learning Tools',
  'Healthcare & Bio-informatics',
  'FinTech & Decentralized Finance',
];
