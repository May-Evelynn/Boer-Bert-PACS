import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner, FaTag } from 'react-icons/fa';
import { druppelService } from '../../../services/druppelService';
import { Guest } from '../../../services/guestService';
import { Keyfob } from '../../../types';

interface TagAssignModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    guest: Guest;
    availableKeyfobs: Keyfob[];
    onSuccess: () => void;
}

const TagAssignModal: React.FC<TagAssignModalProps> = ({ isOpen, setIsOpen, guest, availableKeyfobs, onSuccess }) => {
    const [selectedKeyfobId, setSelectedKeyfobId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedKeyfobId) {
            setError('Selecteer een tag');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await druppelService.attachUser(guest.user_id, selectedKeyfobId);
            onSuccess();
            setIsOpen(false);
        } catch (err) {
            console.error('Failed to attach tag:', err);
            setError('Kon tag niet koppelen');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />
            <motion.div
                className="relative bg-neutral-950 border border-neutral-700 rounded-3xl p-6 w-full max-w-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <h2 className="text-2xl font-semibold mb-2">Tag Koppelen</h2>
                <p className="text-neutral-400 mb-6">
                    Koppel een tag aan <span className="text-white font-medium">{guest.first_name} {guest.last_name}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {availableKeyfobs.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                            {availableKeyfobs.map((keyfob) => (
                                <button
                                    key={keyfob.keyfob_id}
                                    type="button"
                                    onClick={() => setSelectedKeyfobId(keyfob.keyfob_id)}
                                    className={`p-3 rounded-xl border text-center font-mono transition-colors ${selectedKeyfobId === keyfob.keyfob_id
                                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-500'
                                        }`}
                                >
                                    #{keyfob.keyfob_id}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <FaTag className="mx-auto mb-4 size-8 text-neutral-500" />
                            <p className="text-neutral-400">Geen beschikbare tags gevonden</p>
                            <p className="text-neutral-500 text-sm">Maak eerst een nieuwe druppel aan</p>
                        </div>
                    )}

                    {error && (
                        <p className="text-rose-400 text-sm">{error}</p>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl hover:bg-neutral-700 transition-colors text-white"
                        >
                            Annuleren
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !selectedKeyfobId || availableKeyfobs.length === 0}
                            className="flex-1 px-4 py-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Bezig...
                                </>
                            ) : (
                                'Koppelen'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default TagAssignModal;
