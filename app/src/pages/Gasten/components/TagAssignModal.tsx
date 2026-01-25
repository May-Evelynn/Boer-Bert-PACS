import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner, FaTag, FaTimes, FaPlus } from 'react-icons/fa';
import { druppelService } from '../../../services/druppelService';
import { Guest } from '../../../services/guestService';
import { Keyfob } from '../../../types';

interface TagAssignModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    guest: Guest;
    availableKeyfobs: Keyfob[];
    linkedKeyfobs: Keyfob[];
    onSuccess: () => void;
}

const TagAssignModal: React.FC<TagAssignModalProps> = ({ isOpen, setIsOpen, guest, availableKeyfobs, linkedKeyfobs, onSuccess }) => {
    const [selectedKeyfobId, setSelectedKeyfobId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentLinkedKeyfobs, setCurrentLinkedKeyfobs] = useState<Keyfob[]>(linkedKeyfobs);

    useEffect(() => {
        setCurrentLinkedKeyfobs(linkedKeyfobs);
    }, [linkedKeyfobs]);

    const handleAttach = async () => {
        if (!selectedKeyfobId) {
            setError('Selecteer een tag');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await druppelService.attachUser(guest.user_id, selectedKeyfobId);
            const attached = availableKeyfobs.find(k => k.keyfob_id === selectedKeyfobId);
            if (attached) {
                setCurrentLinkedKeyfobs(prev => [...prev, attached]);
            }
            setSelectedKeyfobId(null);
            onSuccess();
        } catch (err) {
            console.error('Failed to attach tag:', err);
            setError('Kon tag niet koppelen');
        } finally {
            setLoading(false);
        }
    };

    const handleDetach = async (keyfobId: number) => {
        try {
            setLoading(true);
            setError(null);
            await druppelService.detachUserFromKeyfob({ keyfobId });
            setCurrentLinkedKeyfobs(prev => prev.filter(k => k.keyfob_id !== keyfobId));
            onSuccess();
        } catch (err) {
            console.error('Failed to detach tag:', err);
            setError('Kon tag niet ontkoppelen');
        } finally {
            setLoading(false);
        }
    };

    const actuallyAvailable = availableKeyfobs.filter(
        k => !currentLinkedKeyfobs.some(linked => linked.keyfob_id === k.keyfob_id)
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />
            <motion.div
                className="relative bg-neutral-950 border border-neutral-700 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <h2 className="text-2xl font-semibold mb-2">Tags Beheren</h2>
                <p className="text-neutral-400 mb-6">
                    Beheer tags voor <span className="text-white font-medium">{guest.first_name} {guest.last_name}</span>
                </p>

                <div className="mb-6">
                    <label className="block text-sm text-neutral-400 mb-3">
                        <div className="flex items-center gap-2">
                            <FaTag className="w-3 h-3" />
                            Gekoppelde Tags ({currentLinkedKeyfobs.length})
                        </div>
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                        {currentLinkedKeyfobs.length === 0 ? (
                            <p className="text-neutral-500 text-sm italic py-2">Geen tags gekoppeld</p>
                        ) : (
                            currentLinkedKeyfobs.map(keyfob => (
                                <div 
                                    key={keyfob.keyfob_id} 
                                    className="flex items-center justify-between bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <FaTag className="w-3 h-3 text-blue-400" />
                                        <span className="font-mono text-blue-400">
                                            #{keyfob.keyfob_id}
                                        </span>
                                        <span className="text-neutral-500 text-sm">
                                            (Code: {String(keyfob.keyfob_key).padStart(5, '0')})
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDetach(keyfob.keyfob_id)}
                                        disabled={loading}
                                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                                        title="Ontkoppelen"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="border-t border-neutral-800 pt-4">
                    <label className="block text-sm text-neutral-400 mb-3">Tag Toevoegen</label>
                    {actuallyAvailable.length > 0 ? (
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                                {actuallyAvailable.map((keyfob) => (
                                    <button
                                        key={keyfob.keyfob_id}
                                        type="button"
                                        onClick={() => setSelectedKeyfobId(keyfob.keyfob_id)}
                                        className={`p-2 rounded-xl border text-center font-mono text-sm transition-colors ${selectedKeyfobId === keyfob.keyfob_id
                                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                            : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-500'
                                            }`}
                                    >
                                        #{keyfob.keyfob_id}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleAttach}
                                disabled={loading || !selectedKeyfobId}
                                className="w-full px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <FaSpinner className="animate-spin" />
                                ) : (
                                    <>
                                        <FaPlus className="w-3 h-3" />
                                        Tag Toevoegen
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-neutral-500 text-sm">Geen beschikbare tags gevonden</p>
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-rose-400 text-sm mt-4">{error}</p>
                )}

                <div className="flex gap-3 pt-6">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl hover:bg-neutral-700 transition-colors text-white"
                    >
                        Sluiten
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default TagAssignModal;
