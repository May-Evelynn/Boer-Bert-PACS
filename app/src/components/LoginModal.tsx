import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { authService } from "../services/authService";

import { User } from '../types';

interface LoginModalProps {
    isLoginModalOpen: boolean,
    setIsLoginModalOpen: (show: boolean) => void;
    setIsPasswordModalOpen: (show: boolean) => void;
    user: User | null;
    setUser: (user: User | null) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ setIsLoginModalOpen, setIsPasswordModalOpen, setUser }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLogin, setIsFirstLogin] = useState(false);
    const [tempUserData, setTempUserData] = useState<{ user: User; password: string } | null>(null);


    const handleClose = () => {
        setIsLoginModalOpen(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const data = await authService.login({ username, password });
            if (data.user.is_first_login === 1) {
                setMessage("Dit is de eerste keer dat u inlogt. Wijzig alstublieft uw wachtwoord.");
                setIsFirstLogin(true);
                // Store user data and password for the password change flow
                setTempUserData({ user: data.user, password });
                setIsLoading(false);
                return;
            }
            // Update user state for normal login
            setUser(data.user);
            setIsLoginModalOpen(false);
        } catch (error: any) {
            console.error('Login error:', error);
            setMessage(error.message || "Ongeldige inloggegevens");
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
                        src="/logo.png"
                        alt="Boer Bert Logo"
                        className="w-10 h-10"
                    />
                    <h1 className="text-3xl font-bold">Boer DashBert Inlog</h1>
                </div>
                <button
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-2.5 rounded-xl hover:cursor-pointer transition-colors duration-200"
                    onClick={handleClose}
                >
                    <FaTimes className="w-4 h-4" />
                </button>
                <form
                    onSubmit={handleLogin}
                    className="flex flex-col space-y-4"
                >
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Gebruikersnaam</label>
                        <input
                            className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            type="text"
                            placeholder="Voer gebruikersnaam in"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Wachtwoord</label>
                        <input
                            className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            type="password"
                            placeholder="Voer wachtwoord in"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 rounded-lg p-3 font-bold mt-2 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Bezig met inloggen...' : 'Log In'}
                    </button>
                    {isFirstLogin && tempUserData &&
                        <button className="bg-orange-400 hover:bg-orange-500 rounded-lg p-3 font-bold mt-2 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => {
                            // Store temp data for PasswordModal
                            localStorage.setItem('tempPasswordChange', JSON.stringify(tempUserData));
                            setUser(tempUserData.user);
                            setIsLoginModalOpen(false);
                            setIsPasswordModalOpen(true);
                        }}>
                            Wijzig wachtwoord
                        </button>
                    }
                    {message && <p className="text-red-500 mt-2">{message}</p>}
                </form>
            </motion.div>
        </motion.div>
    );
}

export default LoginModal;
