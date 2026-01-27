import { useState, useEffect } from "react";
import { FaSave, FaTrash, FaTag, FaTimes, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { User, Keyfob } from "../../../types";
import { userService } from "../../../services/userService";
import { druppelService } from "../../../services/druppelService";
import { authService } from "../../../services/authService";

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

    const [allKeyfobs, setAllKeyfobs] = useState<Keyfob[]>([]);
    const [userKeyfobs, setUserKeyfobs] = useState<Keyfob[]>([]);
    const [selectedKeyfobId, setSelectedKeyfobId] = useState<number | null>(null);
    const [isLoadingKeyfobs, setIsLoadingKeyfobs] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (gebruiker) {
            setFormData(gebruiker);
            fetchKeyfobs();
        }
    }, [gebruiker]);

    const fetchKeyfobs = async () => {
        if (!gebruiker) return;
        setIsLoadingKeyfobs(true);
        try {
            const keyfobs = await druppelService.getKeyfobs();
            setAllKeyfobs(keyfobs);
            setUserKeyfobs(keyfobs.filter(k => k.attached_user_id === gebruiker.id));
        } catch (err) {
            console.error("Failed to fetch keyfobs:", err);
        } finally {
            setIsLoadingKeyfobs(false);
        }
    };

    const availableKeyfobs = allKeyfobs.filter(k => !k.attached_user_id && !k.buitengebruik);

    const handleAttachKeyfob = async () => {
        if (!selectedKeyfobId || !gebruiker) return;
        setIsLoadingKeyfobs(true);
        try {
            await druppelService.attachUserToKeyfob({
                userId: gebruiker.id,
                keyfobId: selectedKeyfobId,
            });
            await fetchKeyfobs();
            setSelectedKeyfobId(null);
        } catch (err) {
            console.error("Failed to attach keyfob:", err);
            setError("Kon druppel niet koppelen");
        } finally {
            setIsLoadingKeyfobs(false);
        }
    };

    const handleDetachKeyfob = async (keyfobId: number) => {
        setIsLoadingKeyfobs(true);
        try {
            await druppelService.detachUserFromKeyfob({ keyfobId });
            await fetchKeyfobs();
        } catch (err) {
            console.error("Failed to detach keyfob:", err);
            setError("Kon druppel niet ontkoppelen");
        } finally {
            setIsLoadingKeyfobs(false);
        }
    };

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

    const handleResetPassword = async () => {
        if (!gebruiker) return;
        if (!window.confirm(`Weet je zeker dat je het wachtwoord van ${gebruiker.first_name} wilt resetten?`)) return;

        setIsLoading(true);
        setError(null);
        try {
            await authService.resetPassword(gebruiker.username);
            alert("Wachtwoord succesvol gereset. De gebruiker heeft een e-mail ontvangen.");
        } catch (err: any) {
            console.error("Failed to reset password", err);
            setError(err.message || "Kon wachtwoord niet resetten");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!gebruiker) return;

        setIsLoading(true);
        setError(null);

        try {
            await userService.deleteUser(gebruiker.id);
            setShowDeleteConfirm(false);
            onUserUpdated();
            handleClose();
        } catch (err: any) {
            console.error("Failed to delete user", err);
            setError(err.response?.data?.error || "Failed to delete user");
            setShowDeleteConfirm(false);
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
                className="relative bg-neutral-950 border border-neutral-700 rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar"
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
                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
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

                    <div className="pt-4 border-t border-neutral-800">
                        <label className="block text-sm text-neutral-400 mb-3">
                            <div className="flex items-center gap-2">
                                <FaTag className="w-3 h-3" />
                                Gekoppelde Druppels ({userKeyfobs.length})
                            </div>
                        </label>

                        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto custom-scrollbar">
                            {isLoadingKeyfobs ? (
                                <p className="text-neutral-500 text-sm">Laden...</p>
                            ) : userKeyfobs.length === 0 ? (
                                <p className="text-neutral-500 text-sm italic">Geen druppels gekoppeld</p>
                            ) : (
                                userKeyfobs.map(keyfob => (
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
                                            onClick={() => handleDetachKeyfob(keyfob.keyfob_id)}
                                            disabled={isLoadingKeyfobs}
                                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-colors"
                                            title="Ontkoppelen"
                                        >
                                            <FaTimes className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <select
                                    value={selectedKeyfobId || ""}
                                    onChange={(e) => setSelectedKeyfobId(e.target.value ? Number(e.target.value) : null)}
                                    disabled={isLoadingKeyfobs || availableKeyfobs.length === 0}
                                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50 text-sm"
                                >
                                    <option value="">
                                        {availableKeyfobs.length === 0 ? "Geen beschikbare druppels" : "Selecteer druppel..."}
                                    </option>
                                    {availableKeyfobs.map(keyfob => (
                                        <option key={keyfob.keyfob_id} value={keyfob.keyfob_id}>
                                            #{keyfob.keyfob_id} - Code: {String(keyfob.keyfob_key).padStart(5, '0')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleAttachKeyfob}
                                disabled={!selectedKeyfobId || isLoadingKeyfobs}
                                className="flex items-center gap-1 px-3 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors text-sm"
                            >
                                <FaPlus className="w-3 h-3" />
                                Toevoegen
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800">
                        <button
                            onClick={handleResetPassword}
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-xl hover:bg-orange-500/30 transition-colors disabled:opacity-50 mb-3"
                        >
                            Reset Wachtwoord
                        </button>
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

            {showDeleteConfirm && (
                <motion.div
                    className="absolute inset-0 z-10 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowDeleteConfirm(false)}
                    />
                    <motion.div
                        className="relative w-80 p-6 bg-neutral-950 border border-neutral-700 rounded-2xl shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.3 }}
                    >
                        <h3 className="text-lg font-semibold mb-3">Gebruiker verwijderen</h3>
                        <p className="text-neutral-400 mb-5 text-sm">
                            Weet je zeker dat je "{gebruiker?.first_name} {gebruiker?.last_name}" wilt verwijderen?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-600 text-neutral-300 hover:bg-neutral-700 transition-colors text-sm"
                            >
                                Annuleren
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500/30 transition-colors text-sm disabled:opacity-50"
                            >
                                {isLoading ? '...' : 'Verwijderen'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

export default UserEditModal;
