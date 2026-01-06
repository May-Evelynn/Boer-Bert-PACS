import { useState, useEffect } from "react";
import { FaTimes, FaSave, FaTrash } from "react-icons/fa";
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
            // Remove id and user_id from payload to prevent backend errors
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
        if (!window.confirm("Weet je zeker dat je deze gebruiker wilt verwijderen?")) return;

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
        <motion.div
            className="absolute flex top-0 left-0 bg-black/50 backdrop-blur-md h-full w-full items-center justify-center text-white z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="relative w-96 p-8 bg-neutral-900/90 border border-neutral-700 rounded-2xl shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.3 }}
            >
                <div className="flex overflow-x-hidden space-x-3 mb-8 items-center justify-between">
                    <h1 className="text-3xl font-bold">Bewerk Gebruiker</h1>
                    <button
                        className="bg-red-600 hover:bg-red-700 p-2.5 rounded-xl hover:cursor-pointer transition-colors duration-200"
                        onClick={handleClose}
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Gebruikersnaam</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username || ''}
                            onChange={handleChange}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Voornaam</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name || ''}
                            onChange={handleChange}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Achternaam</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name || ''}
                            onChange={handleChange}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Tussenvoegsel</label>
                        <input
                            type="text"
                            name="affix"
                            value={formData.affix || ''}
                            onChange={handleChange}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Rol</label>
                        <select
                            name="role"
                            value={formData.role || ''}
                            onChange={handleChange}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-white"
                        >
                            <option value="Schoonmaker">Schoonmaker</option>
                            <option value="Receptionist">Receptionist</option>
                            <option value="Manager">Manager</option>
                            <option value="Eigenaar">Eigenaar</option>
                        </select>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span>...</span>
                            ) : (
                                <>
                                    <FaTrash />
                                    <span>Verwijder</span>
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span>Opslaan...</span>
                            ) : (
                                <>
                                    <FaSave />
                                    <span>Opslaan</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default UserEditModal;
