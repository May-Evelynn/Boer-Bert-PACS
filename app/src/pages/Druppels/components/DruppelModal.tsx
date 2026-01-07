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

    // Local state to track attached user (updates after operations)
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

    const hasAttachedUser = currentAttachedUserId && currentAttachedUserId > 0;

    const attachedUser = users.find(u => u.id === currentAttachedUserId);

    const getDisplayName = (user: User) => {
        const parts = [user.first_name];
        if (user.affix) parts.push(user.affix);
        if (user.last_name) parts.push(user.last_name);
        return parts.join(" ");
    };

    return (
        <motion.div
            className="absolute flex top-0 left-0 bg-black/50 backdrop-blur-md h-full w-full items-center justify-center text-white z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
        >
            <motion.div
                className="relative w-[450px] p-8 bg-neutral-900/90 border border-neutral-700 rounded-2xl shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-center items-center overflow-x-hidden space-x-3 mb-6">
                    <h1 className="text-2xl font-bold">Druppel Bewerken</h1>
                </div>
                <button
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-2.5 rounded-xl hover:cursor-pointer transition-colors duration-200"
                    onClick={handleClose}
                >
                    <FaTimes className="w-4 h-4" />
                </button>

                {/* Druppel Info */}
                <div className="mb-6 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                    <p className="text-sm text-neutral-400 mb-1">Druppel Code</p>
                    <p className="text-lg font-mono font-semibold">{druppel.druppelCode}</p>
                    <p className="text-sm text-neutral-400 mt-3 mb-1">Druppel ID</p>
                    <p className="text-lg font-mono">{druppel.druppelId}</p>
                </div>

                {/* Current User */}
                <div className="mb-6 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                    <p className="text-sm text-neutral-400 mb-2">Huidige Gebruiker</p>
                    {hasAttachedUser ? (
                        <div className="flex items-center justify-between">
                            <div>
                                {isFetchingUsers ? (
                                    <p className="text-neutral-400">Laden...</p>
                                ) : attachedUser ? (
                                    <>
                                        <p className="font-semibold">
                                            {getDisplayName(attachedUser)}
                                        </p>
                                        <p className="text-sm text-neutral-400">{attachedUser.username}</p>
                                    </>
                                ) : (
                                    <p className="text-neutral-400">Gebruiker ID: {druppel.attached_user_id}</p>
                                )}
                            </div>
                            <button
                                onClick={handleDetachUser}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                            >
                                {isLoading ? (
                                    <FaSpinner className="w-4 h-4 animate-spin" />
                                ) : (
                                    <FaUserMinus className="w-4 h-4" />
                                )}
                                <span>Ontkoppelen</span>
                            </button>
                        </div>
                    ) : (
                        <p className="text-neutral-500 italic">Geen gebruiker gekoppeld</p>
                    )}
                </div>

                {/* Attach New User */}
                <div className="p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                    <p className="text-sm text-neutral-400 mb-3">
                        {hasAttachedUser ? "Andere Gebruiker Koppelen" : "Gebruiker Koppelen"}
                    </p>
                    <div className="flex gap-3">
                        <select
                            value={selectedUserId || ""}
                            onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
                            disabled={isFetchingUsers || isLoading}
                            className="flex-1 px-4 py-2.5 bg-neutral-900 border border-neutral-600 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {isFetchingUsers ? "Laden..." : "Selecteer gebruiker"}
                            </option>
                            {users
                                .filter((user) => user.id !== druppel.attached_user_id)
                                .map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {getDisplayName(user)} ({user.username})
                                    </option>
                                ))}
                        </select>
                        <button
                            onClick={handleAttachUser}
                            disabled={!selectedUserId || isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
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

                {/* Messages */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-red-600/20 border border-red-600 rounded-lg text-red-400 text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-green-600/20 border border-green-600 rounded-lg text-green-400 text-sm text-center"
                    >
                        {successMessage}
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default DruppelModal;
