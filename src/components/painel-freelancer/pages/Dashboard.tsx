import { useState } from 'react';
import StatsCards from '../sections/StatsCards';
import ProfileCard from '../sections/ProfileCard';
import ProjectsPanel from '../sections/ProjectsPanel';
import ProposalsPanel from '../sections/ProposalsPanel';
import ConnectionsCard from '../sections/ConnectionsCard';
import GoalsCard from '../sections/GoalsCard';

export default function Dashboard() {
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [proposalsOpen, setProposalsOpen] = useState(true);

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      {/* Stats Cards */}
      <StatsCards />
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-5 mt-5">
        {/* Left Column */}
        <div className="space-y-5">
          <ProfileCard />
          <ConnectionsCard />
          <GoalsCard />
        </div>
        
        {/* Right Column */}
        <div className="space-y-5">
          <ProjectsPanel isOpen={projectsOpen} onToggle={() => setProjectsOpen(!projectsOpen)} />
          <ProposalsPanel isOpen={proposalsOpen} onToggle={() => setProposalsOpen(!proposalsOpen)} />
        </div>
      </div>
    </div>
  );
}
