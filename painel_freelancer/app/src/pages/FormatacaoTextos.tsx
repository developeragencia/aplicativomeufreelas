import { useState } from 'react';
import { Type, Copy, Check, Bold, Italic, Underline } from 'lucide-react';

export default function FormatacaoTextos() {
  const [text, setText] = useState('');
  const [formatted, setFormatted] = useState('');
  const [copied, setCopied] = useState(false);

  const formatText = (format: string) => {
    let newText = text;
    switch (format) {
      case 'bold':
        newText = `**${text}**`;
        break;
      case 'italic':
        newText = `*${text}*`;
        break;
      case 'underline':
        newText = `<u>${text}</u>`;
        break;
      case 'uppercase':
        newText = text.toUpperCase();
        break;
      case 'lowercase':
        newText = text.toLowerCase();
        break;
      case 'capitalize':
        newText = text.replace(/\b\w/g, l => l.toUpperCase());
        break;
      case 'removeSpaces':
        newText = text.replace(/\s+/g, ' ').trim();
        break;
      case 'removeLines':
        newText = text.replace(/\n/g, ' ');
        break;
      default:
        break;
    }
    setFormatted(newText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatted || text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearText = () => {
    setText('');
    setFormatted('');
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-[#333] mb-2">Formatação de Textos</h1>
      <p className="text-[#666] mb-6">
        Ferramentas úteis para formatar e editar seus textos
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="bg-white rounded shadow-sm p-6">
          <h2 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
            <Type className="w-5 h-5 text-[#00a8cc]" />
            Texto Original
          </h2>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cole ou digite seu texto aqui..."
            rows={10}
            className="w-full px-4 py-3 border border-[#ddd] rounded focus:outline-none focus:border-[#00a8cc] resize-none mb-4"
          />

          {/* Format Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => formatText('bold')}
              className="p-2 border border-[#ddd] rounded hover:bg-gray-50 transition-colors duration-200"
              title="Negrito"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('italic')}
              className="p-2 border border-[#ddd] rounded hover:bg-gray-50 transition-colors duration-200"
              title="Itálico"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('underline')}
              className="p-2 border border-[#ddd] rounded hover:bg-gray-50 transition-colors duration-200"
              title="Sublinhado"
            >
              <Underline className="w-4 h-4" />
            </button>
            <div className="w-px h-8 bg-[#ddd] mx-1" />
            <button
              onClick={() => formatText('uppercase')}
              className="px-3 py-2 border border-[#ddd] rounded hover:bg-gray-50 text-sm transition-colors duration-200"
            >
              MAIÚSCULAS
            </button>
            <button
              onClick={() => formatText('lowercase')}
              className="px-3 py-2 border border-[#ddd] rounded hover:bg-gray-50 text-sm transition-colors duration-200"
            >
              minúsculas
            </button>
            <button
              onClick={() => formatText('capitalize')}
              className="px-3 py-2 border border-[#ddd] rounded hover:bg-gray-50 text-sm transition-colors duration-200"
            >
              Capitalizar
            </button>
            <div className="w-px h-8 bg-[#ddd] mx-1" />
            <button
              onClick={() => formatText('removeSpaces')}
              className="px-3 py-2 border border-[#ddd] rounded hover:bg-gray-50 text-sm transition-colors duration-200"
            >
              Remover Espaços
            </button>
            <button
              onClick={() => formatText('removeLines')}
              className="px-3 py-2 border border-[#ddd] rounded hover:bg-gray-50 text-sm transition-colors duration-200"
            >
              Remover Quebras
            </button>
          </div>

          <button
            onClick={clearText}
            className="text-sm text-[#d9534f] hover:text-red-700"
          >
            Limpar texto
          </button>
        </div>

        {/* Output */}
        <div className="bg-white rounded shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#333] flex items-center gap-2">
              <Type className="w-5 h-5 text-[#00a8cc]" />
              Resultado
            </h2>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-2 bg-[#00a8cc] hover:bg-[#0088aa] text-white text-sm rounded transition-colors duration-200"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          
          <textarea
            value={formatted || text}
            readOnly
            rows={10}
            className="w-full px-4 py-3 border border-[#ddd] rounded bg-gray-50 resize-none"
          />

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-2xl font-bold text-[#00a8cc]">{text.length}</p>
              <p className="text-xs text-[#666]">Caracteres</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-2xl font-bold text-[#00a8cc]">
                {text.trim() ? text.trim().split(/\s+/).length : 0}
              </p>
              <p className="text-xs text-[#666]">Palavras</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-2xl font-bold text-[#00a8cc]">
                {text.split('\n').length}
              </p>
              <p className="text-xs text-[#666]">Linhas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
        <h3 className="font-medium text-blue-800 mb-2">Dicas de uso</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use **texto** para negrito em Markdown</li>
          <li>• Use *texto* para itálico em Markdown</li>
          <li>• A ferramenta conta caracteres, palavras e linhas automaticamente</li>
          <li>• Clique em "Copiar" para copiar o resultado formatado</li>
        </ul>
      </div>
    </div>
  );
}
