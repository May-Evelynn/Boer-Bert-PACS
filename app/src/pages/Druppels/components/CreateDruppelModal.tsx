import { useState } from 'react';
import { FaTimes, FaPlus, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { druppelService } from '../../../services/druppelService';

interface CreateDruppelModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateDruppelModal: React.FC<CreateDruppelModalProps> = ({ isOpen, setIsOpen, onSuccess }) => {
  const [keyfobKey, setKeyfobKey] = useState('');
  const [attachUserId, setAttachUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setKeyfobKey('');
    setAttachUserId('');
    setError(null);
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const keyNumber = parseInt(keyfobKey, 10);
    if (isNaN(keyNumber)) {
      setError('Druppel code moet een nummer zijn');
      return;
    }

    const userId = attachUserId.trim() ? parseInt(attachUserId, 10) : null;
    if (attachUserId.trim() && isNaN(userId!)) {
      setError('Gebruiker ID moet een nummer zijn');
      return;
    }

    setLoading(true);
    try {
      await druppelService.initKeyfob({ keyfob_key: keyNumber });

      if (userId !== null) {
        await druppelService.attachUserToKeyfob({
          userId: userId,
          keyfobId: keyNumber
        });
      }

      handleClose();
      onSuccess();
    } catch (err: any) {
      console.error('Failed to create druppel:', err);
      setError(err.message || 'Kon druppel niet aanmaken');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      <motion.div
        className="relative w-96 p-8 bg-neutral-950 border border-neutral-700 rounded-3xl shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Nieuwe Druppel</h1>
          <button
            className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-xl text-neutral-400 hover:text-white transition-colors"
            onClick={handleClose}
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Druppel Code <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              value={keyfobKey}
              onChange={(e) => setKeyfobKey(e.target.value)}
              placeholder="Bijv. 12345"
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder-neutral-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">
              Gebruiker ID koppelen <span className="text-neutral-600 font-normal">(optioneel)</span>
            </label>
            <input
              type="text"
              value={attachUserId}
              onChange={(e) => setAttachUserId(e.target.value)}
              placeholder="Bijv. 1"
              className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder-neutral-600"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Aanmaken...
                </>
              ) : (
                <>
                  <FaPlus />
                  Druppel Aanmaken
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateDruppelModal;
