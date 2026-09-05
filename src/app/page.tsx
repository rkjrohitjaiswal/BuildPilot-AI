'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { TrustStrip } from '../components/TrustStrip';
import { HowItWorks } from '../components/HowItWorks';
import { ProfileForm } from '../components/ProfileForm';
import { WhatYouGet } from '../components/WhatYouGet';
import { ProjectWorkspace } from '../components/ProjectWorkspace';
import { FeaturesSection } from '../components/FeaturesSection';
import { Footer } from '../components/Footer';
import { PlanApiResponse, RecommendedProject, ProfileFormState } from '../types/profile';

const DEFAULT_PROFILE: ProfileFormState = {
  skills: [],
  interests: [],
  experienceLevel: 'Intermediate',
  teamSize: '1',
  duration: '3–4 months',
  budget: 'Under ₹5,000',
  domain: 'Any Domain (Recommended)',
  additionalNotes: '',
};

export default function Home() {
  const [resultsData, setResultsData] = useState<PlanApiResponse | null>(null);
  const [selectedWorkspaceProject, setSelectedWorkspaceProject] = useState<RecommendedProject | null>(null);
  const [submittedProfile, setSubmittedProfile] = useState<ProfileFormState>(DEFAULT_PROFILE);

  const handleOpenWorkspace = (project: RecommendedProject) => {
    setSelectedWorkspaceProject(project);
    setTimeout(() => {
      document.getElementById('project-workspace')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBackToRecommendations = () => {
    document.getElementById('what-you-get')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06090F] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar hasActiveWorkspace={selectedWorkspaceProject !== null} />

      {/* Main Page Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Trust/Value Strip */}
        <TrustStrip />

        {/* 3. How It Works */}
        <HowItWorks />

        {/* 4. Profile Setup Form */}
        <ProfileForm
          onResultsGenerated={(data, profile) => {
            setResultsData(data);
            setSelectedWorkspaceProject(null);
            if (profile) setSubmittedProfile(profile);
          }}
          hasResults={resultsData !== null}
        />

        {/* 5. What You'll Get Deliverables Showcase */}
        <WhatYouGet
          data={resultsData}
          onOpenWorkspace={handleOpenWorkspace}
        />

        {/* 6. Selected Project Workspace */}
        {selectedWorkspaceProject && (
          <ProjectWorkspace
            project={selectedWorkspaceProject}
            studentProfile={submittedProfile}
            onBackToRecommendations={handleBackToRecommendations}
          />
        )}

        {/* 7. Features Grid */}
        <FeaturesSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

