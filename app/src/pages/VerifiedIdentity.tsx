import { useEffect, useRef, useState } from 'react';
import AppShell from '../components/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { apiKycStatus, apiKycSubmit, hasApi } from '@/lib/api';
import { CheckCircle2, UploadCloud, XCircle, Clock } from 'lucide-react';

export default function VerifiedIdentity() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [reason, setReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [front, setFront] = useState<string>('');
  const [back, setBack] = useState<string>('');
  const [selfie, setSelfie] = useState<string>('');
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      if (!user?.id || !hasApi()) return;
      const res = await apiKycStatus(String(user.id));
      if (res.ok && res.kyc) {
        setStatus(res.kyc.status as any);
        setReason(res.kyc.reprovado_motivo || null);
      } else {
        setStatus('none');
      }
    }
    load();
  }, [user?.id]);

  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ''));
      r.onerror = reject;
      r.readAsDataURL(file);
    });

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, set: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (file) set(await readAsDataUrl(file));
  };

  const submit = async () => {
    if (!user?.id) return;
    if (!front || !back || !selfie) {
      alert('Envie frente, verso e selfie.');
      return;
    }
    setLoading(true);
    if (hasApi()) {
      const r = await apiKycSubmit(String(user.id), { front, back }, selfie);
      if (!r.ok) {
        setLoading(false);
        alert(r.error || 'Falha ao enviar verificação');
        return;
      }
    }
    setStatus('pending');
    setLoading(false);
  };

  return (
    <AppShell wide>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Identidade Verificada</h1>
        <p className="text-gray-600 mb-6">Envie seus documentos e verifique sua identidade.</p>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          {status === 'approved' && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 p-3 rounded">
              <CheckCircle2 className="w-5 h-5" /> Sua identidade foi verificada. O selo será exibido no seu perfil e nas buscas.
            </div>
          )}
          {status === 'pending' && (
            <div className="flex items-center gap-2 text-yellow-800 bg-yellow-50 border border-yellow-200 p-3 rounded">
              <Clock className="w-5 h-5" /> Sua verificação está em análise.
            </div>
          )}
          {status === 'rejected' && (
            <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 p-3 rounded">
              <XCircle className="w-5 h-5" /> Verificação reprovada{reason ? `: ${reason}` : ''}. Envie novamente.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Documento (frente)</label>
              <input ref={frontRef} type="file" accept="image/*" onChange={(e) => handleFile(e, setFront)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Documento (verso)</label>
              <input ref={backRef} type="file" accept="image/*" onChange={(e) => handleFile(e, setBack)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selfie com documento</label>
              <input ref={selfieRef} type="file" accept="image/*" onChange={(e) => handleFile(e, setSelfie)} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={submit}
              disabled={loading}
              className="px-5 py-2 bg-99blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              Enviar para verificação
            </button>
            <button
              onClick={() => { setFront(''); setBack(''); setSelfie(''); frontRef.current && (frontRef.current.value = ''); backRef.current && (backRef.current.value = ''); selfieRef.current && (selfieRef.current.value = ''); }}
              className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
