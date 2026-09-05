import { z } from 'zod';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type TeamSize = '1' | '2' | '3' | '4+';
export type ProjectDuration = '1–2 months' | '3–4 months' | '5–6 months' | '6+ months';
export type BudgetOption = '₹0' | 'Under ₹5,000' | '₹5,000–₹15,000' | '₹15,000+';

export interface ProfileFormState {
  skills: string[];
  interests: string[];
  experienceLevel: ExperienceLevel;
  teamSize: TeamSize;
  duration: ProjectDuration;
  budget: BudgetOption;
  domain: string;
  additionalNotes: string;
}

export const profileSchema = z.object({
  skills: z
    .array(z.string().trim().min(1, 'Skill cannot be empty').max(50, 'Skill name must be under 50 characters'))
    .min(1, 'At least one skill is required.')
    .max(25, 'Maximum 25 skills allowed.'),
  interests: z
    .array(z.string().trim().min(1, 'Interest cannot be empty').max(50, 'Interest name must be under 50 characters'))
    .min(1, 'At least one interest area is required.')
    .max(20, 'Maximum 20 interests allowed.'),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  teamSize: z.enum(['1', '2', '3', '4+']),
  duration: z.string().min(1, 'Project duration is required.').max(60),
  budget: z.string().min(1, 'Budget option is required.').max(60),
  domain: z.string().min(1, 'Preferred domain is required.').max(100),
  additionalNotes: z.string().max(1000, 'Additional notes must be under 1000 characters.').optional().default(''),
});

export interface ProjectTechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  ai: string[];
  deployment: string[];
}

export interface ProjectRoadmapPhase {
  phase: string;
  duration: string;
  tasks: string[];
  deliverable: string;
}

export interface RecommendedProject {
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  skillMatch: number;
  feasibility: number;
  innovation: number;
  overallScore: number;
  whyItFits: string[];
  targetUsers: string[];
  features: string[];
  techStack: ProjectTechStack;
  roadmap: ProjectRoadmapPhase[];
  risks: string[];
  futureScope: string[];
  vivaQuestions: string[];
}

export interface PlanApiResponse {
  summary: {
    profileFit: string;
    recommendation: string;
  };
  projects: RecommendedProject[];
}

export interface FormSubmissionStatus {
  submitted: boolean;
  loading: boolean;
  error?: string | null;
  data?: PlanApiResponse | null;
}
