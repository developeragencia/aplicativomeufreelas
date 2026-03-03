import { HelpCircle } from 'lucide-react';

export const HelpButton = () => {
  return (
    <button
      className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-freelas-primary text-white rounded-full shadow-lg hover:bg-freelas-primary-dark hover:scale-105 hover:shadow-xl transition-all duration-200 z-50"
      onClick={() => console.log('Help clicked')}
    >
      <HelpCircle className="w-5 h-5" />
      <span className="text-sm font-medium">Ajuda</span>
    </button>
  );
};

export default HelpButton;
