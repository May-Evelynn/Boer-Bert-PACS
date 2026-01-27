import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import { guestService, Guest } from '../../../services/guestService';

interface EditGuestModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSuccess: () => void;
    guest: Guest | null;
}

const EditGuestModal: React.FC<EditGuestModalProps> = ({ isOpen, setIsOpen, onSuccess, guest }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [affix, setAffix] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (guest) {
            setFirstName(guest.first_name);
            setLastName(guest.last_name);
            setAffix(guest.affix || '');
        }
    }, [guest]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!guest) return;
        if (!firstName.trim() || !lastName.trim()) {
            setError('Vul voornaam en achternaam in');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await guestService.updateGuest(guest.user_id, {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                affix: affix.trim() || undefined
            });
            onSuccess();
            setIsOpen(false);
        } catch (err) {
            console.error('Failed to update guest:', err);
            setError('Kon gast niet bewerken');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !guest) return null;

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
                <h2 className="text-2xl font-semibold mb-6">Bewerk Gast</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Voornaam *</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Achternaam *</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Tussenvoegsel</label>
                        <input
                            type="text"
                            value={affix}
                            onChange={(e) => setAffix(e.target.value)}
                            placeholder="bijv. van, de, van der"
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                        />
                    </div>

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
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Bezig...
                                </>
                            ) : (
                                'Opslaan'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditGuestModal;
