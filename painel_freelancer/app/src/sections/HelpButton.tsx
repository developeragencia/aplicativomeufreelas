import { HelpCircle } from 'lucide-react';

export default function HelpButton() {
  return (
    <button
      className="fixed bottom-5 right-5 flex items-center gap-2 px-4 py-3 bg-[#00897b] hover:bg-[#00796b] text-white rounded-full shadow-lg btn-hover transition-all duration-200 z-50"
      onClick={() => alert('Ajuda - Em breve!')}
    >
      <HelpCircle className="w-5 h-5" />
      <span className="text-sm font-medium">Ajuda</span>
    </button>
  );
}
