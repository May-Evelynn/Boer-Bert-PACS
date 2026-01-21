import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';
import { userService } from '../../../services/userService';

interface CreateUserModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSuccess: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, setIsOpen, onSuccess }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [affix, setAffix] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Auto-generate username when name changes, but only if user hasn't typed a custom one
    const createUsername = (first: string, last: string) => {
        if (!first && !last) return '';
        const sanitizedFirst = first.replace(/\s+/g, '');
        const sanitizedLast = last.replace(/\s+/g, '');
        return (sanitizedFirst.charAt(0) + '.' + sanitizedLast).toLowerCase();
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !role) {
            setError('Vul alle verplichte velden in');
            return;
        }

        const finalUsername = username.trim() || createUsername(firstName, lastName);

        try {
            setLoading(true);
            setError(null);
            await userService.createUser({
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                affix: affix.trim(),
                email: email.trim(),
                username: finalUsername,
                role: role
            });
            onSuccess();
            setIsOpen(false);
            resetForm();
        } catch (err: any) {
            console.error('Failed to create user:', err);
            setError(err.message || 'Kon gebruiker niet aanmaken');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setAffix('');
        setUsername('');
        setEmail('');
        setRole('');
        setError(null);
    };

    if (!isOpen) return null;

    const suggestedUsername = createUsername(firstName, lastName);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />
            <motion.div
                className="relative bg-neutral-950 border border-neutral-700 rounded-3xl p-6 w-full max-w-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <h2 className="text-2xl font-semibold mb-6 text-white">Nieuwe Gebruiker</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Voornaam *</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Achternaam *</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Tussenvoegsel</label>
                            <input
                                type="text"
                                value={affix}
                                onChange={(e) => setAffix(e.target.value)}
                                placeholder="bijv. van, de"
                                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Rol *</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                                required
                            >
                                <option value="" disabled>Selecteer rol</option>
                                <option value="Schoonmaker">Schoonmaker</option>
                                <option value="Receptionist">Receptionist</option>
                                <option value="Manager">Manager</option>
                                <option value="Eigenaar">Eigenaar</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">E-mail *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Gebruikersnaam</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={suggestedUsername}
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
                                'Aanmaken'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateUserModal;
