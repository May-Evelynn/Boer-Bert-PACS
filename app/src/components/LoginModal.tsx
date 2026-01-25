import { useEffect, useState, useRef, useContext } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../services/authService";

import { DataContext, DataContextType, User } from '../types';

interface LoginModalProps {
    isLoginModalOpen: boolean;
    setIsLoginModalOpen: (show: boolean) => void;
    setIsPasswordModalOpen: (show: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ setIsLoginModalOpen, setIsPasswordModalOpen }) => {
    const { setUser, apiUrls, setApiUrls, activeApiUrl, setActiveApiUrl } = useContext<DataContextType>(DataContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLogin, setIsFirstLogin] = useState(false);
    const [tempUserData, setTempUserData] = useState<{ user: User; password: string } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [localApiUrls, setLocalApiUrls] = useState(apiUrls);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const checkApiOnline = async (url: string): Promise<boolean> => {
        try {
            const baseUrl = url.replace(/\/api\/?$/, '');
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(baseUrl, { 
                method: 'GET',
                mode: 'cors',
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    const checkApiUrls = async () => {
        const updatedUrls = await Promise.all(
            apiUrls.map(async (api) => ({
                ...api,
                isOnline: await checkApiOnline(api.value),
            }))
        );
        setLocalApiUrls(updatedUrls);
        setApiUrls(updatedUrls);
    };

    useEffect(() => {
        checkApiUrls();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedApi = localApiUrls.find(api => api.value === activeApiUrl) || localApiUrls[0];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const data = await authService.login({ username, password });
            if (data.user.is_first_login === 1) {
                setMessage("Dit is de eerste keer dat u inlogt. Wijzig alstublieft uw wachtwoord.");
                setIsFirstLogin(true);
                setTempUserData({ user: data.user, password });
                setIsLoading(false);
                return;
            }
            setUser(data.user);
            setIsLoginModalOpen(false);
        } catch (error: any) {
            console.error('Login error:', error);
            setMessage(error?.message || "Ongeldige inloggegevens");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer" 
                onClick={() => setIsLoginModalOpen(false)}
            />
            <motion.div
                className="relative w-96 p-8 bg-neutral-950 border border-neutral-700 rounded-3xl shadow-2xl"
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

                <form
                    onSubmit={handleLogin}
                    className="flex flex-col space-y-4"
                >
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Gebruikersnaam</label>
                        <input
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            type="text"
                            placeholder="Voer gebruikersnaam in"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Wachtwoord</label>
                        <input
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors text-white"
                            type="password"
                            placeholder="Voer wachtwoord in"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 rounded-xl p-3 font-bold mt-2 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Bezig met inloggen...' : 'Log In'}
                    </button>
                    {isFirstLogin && tempUserData &&
                        <button className="bg-orange-500/20 border border-orange-500/50 text-orange-400 hover:bg-orange-500/30 rounded-xl p-3 font-bold mt-2 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => {
                            // Store temp data for PasswordModal
                            localStorage.setItem('tempPasswordChange', JSON.stringify(tempUserData));
                            setUser(tempUserData.user);
                            setIsLoginModalOpen(false);
                            setIsPasswordModalOpen(true);
                        }}>
                            Wijzig wachtwoord
                        </button>
                    }
                    {message && <p className="text-red-400 mt-2 text-center text-sm">{message}</p>}
                    <div className="flex flex-col items-center gap-1 mt-4">
                        <label className="text-sm font-medium text-neutral-500">Wijzig Server:</label>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-sm font-medium text-neutral-300 cursor-pointer hover:border-neutral-600 transition-colors min-w-[200px] justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${selectedApi.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    {selectedApi.label}
                                </div>
                                <FaChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute bottom-full left-0 right-0 mb-1 bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden shadow-xl z-10"
                                    >
                                        {localApiUrls.map((api) => (
                                            <button
                                                key={api.value}
                                                type="button"
                                                onClick={() => {
                                                    setActiveApiUrl(api.value);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors ${api.value === activeApiUrl
                                                    ? 'bg-blue-600/20 text-blue-400'
                                                    : 'text-neutral-300 hover:bg-neutral-800'
                                                    }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${api.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {api.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

export default LoginModal;
