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
    <motion.div
      className="fixed inset-0 flex bg-black/50 backdrop-blur-md items-center justify-center text-white z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-96 p-8 bg-neutral-900/90 border border-neutral-700 rounded-2xl shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.3 }}
      >
        <div className="flex justify-center items-center space-x-3 mb-6">
          <FaPlus className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-bold">Nieuwe Druppel</h1>
        </div>
        <button
          className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-2.5 rounded-xl hover:cursor-pointer transition-colors duration-200"
          onClick={handleClose}
        >
          <FaTimes className="w-4 h-4" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Druppel Code <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={keyfobKey}
              onChange={(e) => setKeyfobKey(e.target.value)}
              placeholder="Bijv. 12345"
              className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Gebruiker ID koppelen <span className="text-neutral-500">(optioneel)</span>
            </label>
            <input
              type="text"
              value={attachUserId}
              onChange={(e) => setAttachUserId(e.target.value)}
              placeholder="Bijv. 1"
              className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateDruppelModal;
