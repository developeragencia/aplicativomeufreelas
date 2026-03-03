"use client";

import TopHeader from '@/components/painel-freelancer/sections/TopHeader';
import NavigationBar from '@/components/painel-freelancer/sections/NavigationBar';
import Dashboard from '@/components/painel-freelancer/pages/Dashboard';
import Footer from '@/components/painel-freelancer/sections/Footer';
import HelpButton from '@/components/painel-freelancer/sections/HelpButton';

export default function PainelFreelancerPage() {
  return (
    <div className="min-h-screen bg-[#f0f3f5]">
      {/* Top Header */}
      <TopHeader />
      
      {/* Navigation Bar */}
      <NavigationBar />
      
      {/* Main Content */}
      <main className="py-5">
        <Dashboard />
      </main>
      
      <Footer />
      <HelpButton />
    </div>
  );
}