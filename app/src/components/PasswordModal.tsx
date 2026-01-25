import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { authService } from "../services/authService";
import { User, DataContext, DataContextType } from '../types';

interface TempPasswordChange {
    user: User;
    password: string;
}

interface PasswordModalProps {
    isPasswordModalOpen: boolean;
    setIsPasswordModalOpen: (show: boolean) => void;
}

interface Message {
    text: string;
    type: 'success' | 'error';
}

const PasswordModal: React.FC<PasswordModalProps> = ({ setIsPasswordModalOpen }) => {
    const { user, setUser } = useContext<DataContextType>(DataContext);
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<Message | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const tempData = localStorage.getItem('tempPasswordChange');
        if (tempData) {
            const parsed: TempPasswordChange = JSON.parse(tempData);
            setOldPassword(parsed.password);
        }
    }, []);

    const clearSession = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tempPasswordChange');
    };

    const handleClose = () => {
        clearSession();
        setUser(null);
        setIsPasswordModalOpen(false);
        navigate('/');
    };

    const showError = (text: string) => {
        setMessage({ text, type: 'error' });
    };

    const showSuccess = (text: string) => {
        setMessage({ text, type: 'success' });
    };

    const validatePasswords = (): boolean => {
        if (newPassword !== confirmPassword) {
            showError("Wachtwoorden komen niet overeen.");
            return false;
        }

        if (newPassword.length < 6) {
            showError("Wachtwoord moet minstens 6 tekens lang zijn.");
            return false;
        }

        if (!/[A-Z]/.test(newPassword)) {
            showError("Wachtwoord moet minstens één hoofdletter bevatten.");
            return false;
        }

        if (newPassword === oldPassword) {
            showError("Nieuw wachtwoord moet verschillen van het oude wachtwoord.");
            return false;
        }

        return true;
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        if (!validatePasswords()) {
            setIsLoading(false);
            return;
        }

        if (!user) {
            showError("Geen gebruiker gevonden.");
            setIsLoading(false);
            return;
        }

        try {
            const data = await authService.changePassword(user.username || '', oldPassword, newPassword);

            if (data) {
                showSuccess(data.message || "Wachtwoord succesvol gewijzigd.");

                const loginData = await authService.login({
                    username: user.username || '',
                    password: newPassword
                });

                setUser(loginData.user);
                localStorage.removeItem('tempPasswordChange');

                setTimeout(() => {
                    setIsPasswordModalOpen(false);
                }, 1000);
            }
        } catch (error: any) {
            console.error('Password change error:', error);
            showError(error.message || "Er is een fout opgetreden bij het wijzigen van het wachtwoord.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />
            <motion.div
                className="relative w-96 p-8 bg-neutral-950 border border-neutral-700 rounded-3xl shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", duration: 0.3 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo.png"
                            alt="Boer Bert Logo"
                            className="w-8 h-8"
                        />
                        <h1 className="text-xl font-bold text-white">Wachtwoord Wijzigen</h1>
                    </div>
                    <button
                        className="bg-neutral-800 hover:bg-neutral-700 p-2 rounded-xl text-neutral-400 hover:text-white transition-colors"
                        onClick={handleClose}
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>

                <form
                    onSubmit={handlePasswordChange}
                    className="flex flex-col space-y-4"
                >
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Oud wachtwoord</label>
                        <input
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            type="password"
                            placeholder="Voer oud wachtwoord in"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Nieuw Wachtwoord</label>
                        <input
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            type="password"
                            placeholder="Voer nieuw wachtwoord in"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Bevestig wachtwoord</label>
                        <input
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            type="password"
                            placeholder="Bevestig wachtwoord"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 rounded-xl p-3 font-bold mt-2 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Bezig met wijzigen...' : 'Wachtwoord wijzigen'}
                    </button>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-center gap-2 p-3 rounded-xl mt-2 ${message.type === 'success'
                                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                                    : 'bg-red-500/20 border border-red-500/50 text-red-400'
                                }`}
                        >
                            {message.type === 'success'
                                ? <FaCheckCircle className="w-4 h-4 shrink-0" />
                                : <FaExclamationCircle className="w-4 h-4 shrink-0" />
                            }
                            <span className="text-sm">{message.text}</span>
                        </motion.div>
                    )}
                </form>
            </motion.div>
        </div>
    );
}

export default PasswordModal;
