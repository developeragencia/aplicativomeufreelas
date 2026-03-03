import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { ProfilePanel } from '@/components/ProfilePanel';
import { ProjectsPanel } from '@/components/ProjectsPanel';
import { GoalsPanel } from '@/components/GoalsPanel';
import { HelpButton } from '@/components/HelpButton';
import { Footer } from '@/components/Footer';
import { projectStats } from '@/data/mockData';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-freelas-bg">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard type="published" count={projectStats.published} />
          <StatCard type="inProgress" count={projectStats.inProgress} />
          <StatCard type="completed" count={projectStats.completed} />
          <StatCard type="cancelled" count={projectStats.cancelled} />
        </div>

        {/* Profile and Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Profile and Goals */}
          <div className="lg:col-span-2 space-y-6">
            <ProfilePanel />
            <GoalsPanel />
          </div>

          {/* Right Column - Projects */}
          <div className="lg:col-span-3">
            <ProjectsPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Help Button */}
      <HelpButton />
    </div>
  );
}

export default App;
