import React, { useState, useEffect } from 'react';
import { X, Download, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { AppState } from '../types';
import { generateMasteryCertificate, downloadCertificatePNG } from '../utils/certificate';
import { soundManager } from '../utils/sound';

interface CertificateModalProps {
  state: AppState;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ state, onClose }) => {
  const [certDataUrl, setCertDataUrl] = useState<string>('');

  useEffect(() => {
    const url = generateMasteryCertificate(state);
    setCertDataUrl(url);
  }, [state]);

  const handleDownload = () => {
    soundManager.playCoin();
    downloadCertificatePNG(state);
  };

  return (
    <div
      id="modal-certificate"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div className="glass-panel w-full max-w-4xl rounded-3xl border border-cyan-500/30 flex flex-col max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xl">
              🎓
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Certificate of Grammar Mastery
              </h2>
              <p className="text-xs text-slate-400">
                Official credential verification based on curriculum exercises
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Preview Image */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center bg-[#070a13]">
          {certDataUrl ? (
            <img
              src={certDataUrl}
              alt="HSC Grammar Mastery Certificate"
              referrerPolicy="no-referrer"
              className="max-w-full h-auto rounded-2xl border-2 border-cyan-500/30 shadow-2xl"
            />
          ) : (
            <div className="text-slate-400 text-sm">Generating certificate...</div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 text-center sm:text-left">
            Awarded to <span className="font-bold text-white">{state.user.name}</span> • Level {state.level} ({state.user.title})
          </span>

          <button
            id="btn-download-cert-png"
            onClick={handleDownload}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Verified PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
