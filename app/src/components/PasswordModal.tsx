import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { authService } from "../services/authService";

import { User } from '../types';

interface TempPasswordChange {
    user: User;
    password: string;
}

interface PasswordModalProps {
    isPasswordModalOpen: boolean,
    setIsPasswordModalOpen: (show: boolean) => void;
    user: User | null;
    setUser: (user: User | null) => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ setIsPasswordModalOpen, user, setUser }) => {
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Load temp password data if available (from first-time login flow)
    useEffect(() => {
        const tempData = localStorage.getItem('tempPasswordChange');
        if (tempData) {
            const parsed: TempPasswordChange = JSON.parse(tempData);
            setOldPassword(parsed.password);
        }
    }, []);

    const handleClose = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tempPasswordChange');
        setUser(null);
        setIsPasswordModalOpen(false);
        navigate('/');
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        if (newPassword !== confirmPassword) {
            setMessage("Wachtwoorden komen niet overeen.");
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setMessage("Wachtwoord moet minstens 6 tekens lang zijn.");
            setIsLoading(false);
            return;
        }

        if (newPassword === oldPassword) {
            setMessage("Nieuw wachtwoord moet verschillen van het oude wachtwoord.");
            setIsLoading(false);
            return;
        }

        try {
            if (user) {
                console.log('Changing password for user:', user.username, oldPassword, newPassword);
                const data = await authService.changePassword(user.username || '', oldPassword, newPassword);
                if (data) {
                    setMessage(data.message || "Wachtwoord succesvol gewijzigd.");
                    // Re-login with new password to get fresh token
                    const loginData = await authService.login({ username: user?.username || '', password: newPassword });
                    // Update user state with the new user data (is_first_login should now be 0)
                    setUser(loginData.user);
                }
                // Clean up temp data
                localStorage.removeItem('tempPasswordChange');
                setIsPasswordModalOpen(false);
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setMessage(error.message || "Ongeldige gegevemns");
        } finally {
            setIsLoading(false);
        }
    }

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
                <div className="flex justify-center items-center overflow-x-hidden space-x-3 mb-8">
                    <img
                        src="/tauri.svg"
                        alt="Boer Bert Logo"
                        className="w-10 h-10"
                    />
                    <h1 className="text-3xl font-bold">Wijzig uw wachtwoord</h1>
                </div>
                <button
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-2.5 rounded-xl hover:cursor-pointer transition-colors duration-200"
                    onClick={handleClose}
                >
                    <FaTimes className="w-4 h-4" />
                </button>
                <form
                    onSubmit={handlePasswordChange}
                    className="flex flex-col space-y-4"
                >
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Oud wachtwoord</label>
                        <input
                            className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            type="password"
                            placeholder="Voer oud wachtwoord in"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Nieuw Wachtwoord</label>
                        <input
                            className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            type="password"
                            placeholder="Voer nieuw wachtwoord in"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Bevestig wachtwoord</label>
                        <input
                            className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            type="password"
                            placeholder="Bevestig wachtwoord"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 rounded-lg p-3 font-bold mt-2 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Bezig met wijzigen...' : 'Wachtwoord wijzigen'}
                    </button>
                    {message && <p className="text-red-500 mt-2">{message}</p>}
                </form>
            </motion.div>
        </motion.div>
    );
}

export default PasswordModal;
