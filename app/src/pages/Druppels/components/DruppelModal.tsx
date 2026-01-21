import { useState, useEffect } from "react";
import { FaTimes, FaUserPlus, FaUserMinus, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import { userService } from "../../../services/userService";
import { druppelService } from "../../../services/druppelService";

interface User {
    id: number;
    user_id?: number;
    first_name: string;
    last_name?: string;
    affix?: string;
    username: string;
}

interface DruppelModalProps {
    isDruppelModalOpen: boolean;
    setIsDruppelModalOpen: (show: boolean) => void;
    druppel: {
        id: number;
        druppelId: number;
        druppelCode: string;
        attached_user_id: number;
        buitengebruik: boolean;
        firstName?: string;
        lastName?: string;
        affix?: string;
        role?: string;
    };
    onUpdate?: () => void;
}

const DruppelModal: React.FC<DruppelModalProps> = ({ setIsDruppelModalOpen, druppel, onUpdate }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingUsers, setIsFetchingUsers] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isInGebruik, setIsInGebruik] = useState(!druppel.buitengebruik);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsFetchingUsers(true);
                const fetchedUsers = await userService.getUsers();
                setUsers(fetchedUsers);
            } catch (err) {
                console.error("Failed to fetch users:", err);
                setError("Kon gebruikers niet laden");
            } finally {
                setIsFetchingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    const [currentAttachedUserId, setCurrentAttachedUserId] = useState(druppel.attached_user_id);

    const handleClose = () => {
        setIsDruppelModalOpen(false);
    };

    const handleAttachUser = async () => {
        if (!selectedUserId) {
            setError("Selecteer eerst een gebruiker");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            await druppelService.attachUserToKeyfob({
                userId: selectedUserId,
                keyfobId: druppel.druppelId,
            });
            setSuccessMessage("Gebruiker succesvol gekoppeld!");
            setCurrentAttachedUserId(selectedUserId);
            setSelectedUserId(null);
            onUpdate?.();
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (err) {
            console.error("Failed to attach user:", err);
            setError("Kon gebruiker niet koppelen");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDetachUser = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await druppelService.detachUserFromKeyfob({
                keyfobId: druppel.druppelId,
            });
            setSuccessMessage("Gebruiker succesvol ontkoppeld!");
            setCurrentAttachedUserId(0);
            onUpdate?.();
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (err) {
            console.error("Failed to detach user:", err);
            setError("Kon gebruiker niet ontkoppelen");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleInGebruik = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const newValue = !isInGebruik;
            await druppelService.toggleKeyfob(
                druppel.druppelId,
                { toggle: newValue ? 0 : 1 }
            );
            setIsInGebruik(newValue);
            setSuccessMessage(newValue ? "Druppel weer in gebruik gezet!" : "Druppel buiten gebruik gezet!");
            onUpdate?.();
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (err) {
            console.error("Failed to toggle buitengebruik:", err);
            setError("Kon status niet wijzigen");
        } finally {
            setIsLoading(false);
        }
    };

    const hasAttachedUser = currentAttachedUserId && currentAttachedUserId > 0;

    const attachedUser = users.find(u => u.id === currentAttachedUserId);

    const getDisplayName = (user: User) => {
        const parts = [user.first_name];
        if (user.affix) parts.push(user.affix);
        if (user.last_name) parts.push(user.last_name);
        return parts.join(" ");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />
            <motion.div
                className="relative w-[500px] p-8 bg-neutral-950 border border-neutral-700 rounded-3xl shadow-2xl overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", duration: 0.3 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Druppel Bewerken</h1>
                    <button
                        className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-xl text-neutral-400 hover:text-white transition-colors"
                        onClick={handleClose}
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>

                <div className="mb-6 p-5 bg-neutral-900 rounded-2xl border border-neutral-800">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">DRUPPEL CODE</p>
                            <p className="text-xl font-mono font-semibold text-white tracking-widest">{druppel.druppelCode}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">ID</p>
                            <p className="text-sm font-mono text-neutral-300">#{druppel.druppelId}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-neutral-400">Status</p>
                            <p className={`font-medium ${isInGebruik ? 'text-emerald-400' : 'text-red-400'}`}>
                                {isInGebruik ? 'Actief' : 'Geblokkeerd'}
                            </p>
                        </div>
                        <button
                            onClick={handleToggleInGebruik}
                            disabled={isLoading}
                            className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${isInGebruik
                                ? 'bg-emerald-500/20 border border-emerald-500/50'
                                : 'bg-red-500/20 border border-red-500/50'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            <div
                                className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-200 shadow-sm ${isInGebruik
                                    ? 'translate-x-7 bg-emerald-400'
                                    : 'translate-x-1 bg-red-400'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                <div className="mb-6 p-5 bg-neutral-900 rounded-2xl border border-neutral-800">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">HUIDIGE GEBRUIKER</p>
                    {hasAttachedUser ? (
                        <div className="flex items-center justify-between">
                            <div className="overflow-hidden">
                                {isFetchingUsers ? (
                                    <p className="text-neutral-400 animate-pulse">Gegevens laden...</p>
                                ) : attachedUser ? (
                                    <>
                                        <p className="font-semibold text-lg text-white truncate">
                                            {getDisplayName(attachedUser)}
                                        </p>
                                        <p className="text-sm text-neutral-400 truncate">@{attachedUser.username}</p>
                                    </>
                                ) : (
                                    <p className="text-neutral-400">Gebruiker ID: {druppel.attached_user_id}</p>
                                )}
                            </div>
                            <button
                                onClick={handleDetachUser}
                                disabled={isLoading}
                                className="ml-4 flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl transition-colors shrink-0"
                            >
                                {isLoading ? (
                                    <FaSpinner className="w-4 h-4 animate-spin" />
                                ) : (
                                    <FaUserMinus className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center text-neutral-500 italic py-2">
                            <span className="w-2 h-2 rounded-full bg-neutral-700 mr-2"></span>
                            Nog geen gebruiker gekoppeld
                        </div>
                    )}
                </div>

                <div className="p-5 bg-neutral-900 rounded-2xl border border-neutral-800">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                        {hasAttachedUser ? "GEBRUIKER WISSELEN" : "GEBRUIKER KOPPELEN"}
                    </p>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <select
                                value={selectedUserId || ""}
                                onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
                                disabled={isFetchingUsers || isLoading}
                                className="w-full pl-4 pr-8 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50 appearance-none"
                            >
                                <option value="">
                                    {isFetchingUsers ? "Laden..." : "Selecteer gebruiker..."}
                                </option>
                                {users
                                    .filter((user) => user.id !== druppel.attached_user_id)
                                    .map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {getDisplayName(user)}
                                        </option>
                                    ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <button
                            onClick={handleAttachUser}
                            disabled={!selectedUserId || isLoading}
                            className="flex items-center gap-2 px-4 py-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors font-medium shrink-0"
                        >
                            {isLoading ? (
                                <FaSpinner className="w-4 h-4 animate-spin" />
                            ) : (
                                <FaUserPlus className="w-4 h-4" />
                            )}
                            <span>Koppelen</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm text-center"
                    >
                        {successMessage}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default DruppelModal;
