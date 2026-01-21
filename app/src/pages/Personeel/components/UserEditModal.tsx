import { useState, useEffect } from "react";
import { FaSave, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { User } from "../../../types";
import { userService } from "../../../services/userService";

interface UserEditModalProps {
    isUserEditModalOpen: boolean;
    setIsUserEditModalOpen: (show: boolean) => void;
    gebruiker: User | null;
    onUserUpdated: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
    setIsUserEditModalOpen,
    gebruiker,
    onUserUpdated
}) => {
    const [formData, setFormData] = useState<Partial<User>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (gebruiker) {
            setFormData(gebruiker);
        }
    }, [gebruiker]);

    const handleClose = () => {
        setIsUserEditModalOpen(false);
        setError(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!gebruiker) return;
        setIsLoading(true);
        setError(null);

        try {
            const { id, user_id, ...updateData } = formData as any;
            await userService.updateUser(gebruiker.id, updateData);
            onUserUpdated();
            handleClose();
        } catch (err: any) {
            console.error("Failed to update user", err);
            setError(err.response?.data?.error || "Failed to update user");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!gebruiker) return;

        setIsLoading(true);
        setError(null);

        try {
            await userService.deleteUser(gebruiker.id);
            onUserUpdated();
            handleClose();
        } catch (err: any) {
            console.error("Failed to delete user", err);
            setError(err.response?.data?.error || "Failed to delete user");
        } finally {
            setIsLoading(false);
        }
    };

    if (!gebruiker) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />
            <motion.div
                className="relative bg-neutral-950 border border-neutral-700 rounded-3xl p-6 w-full max-w-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">Bewerk Gebruiker</h2>
                </div>

                {error && (
                    <p className="mb-4 text-rose-400 text-sm">{error}</p>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Gebruikersnaam</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Voornaam</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Achternaam</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Tussenvoegsel</label>
                            <input
                                type="text"
                                name="affix"
                                value={formData.affix || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-2">Rol</label>
                            <select
                                name="role"
                                value={formData.role || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            >
                                <option value="Schoonmaker">Schoonmaker</option>
                                <option value="Receptionist">Receptionist</option>
                                <option value="Manager">Manager</option>
                                <option value="Eigenaar">Eigenaar</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? '...' : (
                                <>
                                    <FaTrash />
                                    <span>Verwijder</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl hover:bg-neutral-700 transition-colors text-white"
                        >
                            Annuleren
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? '...' : (
                                <>
                                    <FaSave />
                                    <span>Opslaan</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default UserEditModal;
