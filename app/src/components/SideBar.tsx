import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import { FaArrowLeft, FaCogs, FaHome } from "react-icons/fa";
import { MdLogout, MdLogin } from "react-icons/md";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { FaPeopleGroup, FaPerson } from "react-icons/fa6";

import LoginModal from './LoginModal'
import PasswordModal from "./PasswordModal";

import { User } from '../types';

interface SideBarProps {
    user: User | null;
    setUser: (user: User | null) => void;
}

const SideBar: React.FC<SideBarProps> = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    useEffect(() => {
        let storedValue = localStorage.getItem('sidebarOpen')

        if (storedValue !== null) {
            setIsOpen(storedValue === 'true')
        }
    }, []);

    function toggleSidebar() {
        setIsOpen(!isOpen);
        localStorage.setItem('sidebarOpen', String(!isOpen))
    }

    function toggleLoginModal() {
        setIsLoginModalOpen(!isLoginModalOpen)
        console.log(isLoginModalOpen)
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tempPasswordChange');
        setUser(null);
        navigate('/');
    }

    const navItems = [
        { path: '/', icon: FaHome, label: 'Home' },
        { path: '/dashboard', icon: BsFillGrid1X2Fill, label: 'Dashboard' },
        { path: '/gasten', icon: FaPerson, label: 'Gasten' },
        { path: '/gebruikers', icon: FaPeopleGroup, label: 'Gebruikers' },
        { path: '/druppels', icon: FaCogs, label: 'Druppels' },
    ];

    const activeIndex = navItems.findIndex(item => item.path === location.pathname);

    return (
        <div className="z-20 bg-neutral-900">
            <motion.div
                className="flex flex-col bg-neutral-950 p-4 h-screen border-r border-neutral-600 rounded-r-2xl items-center justify-between overflow-x-hidden text-white"
                animate={{ width: isOpen ? 256 : 80 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col justify-center w-full mb-10">
                    <div className="flex justify-center items-center overflow-x-hidden space-x-2 mb-4">
                        <img
                            src="/logo.png"
                            alt="Boer Bert Logo"
                            className="w-8 h-8"
                        />
                        {isOpen &&
                            <h1 className="text-2xl font-bold text-nowrap">Boer DashBert</h1>
                        }
                    </div>
                    <div className="relative flex flex-col bg-neutral-900 border border-neutral-700 gap-2 p-4 mt-10 rounded-3xl justify-center items-center">
                        {activeIndex !== -1 && (
                            <motion.div
                                className="absolute bg-blue-500/20 border border-blue-500/50 rounded-full z-0"
                                layoutId="sidebar-active-link"
                                style={{ height: '40px' }}
                                animate={{
                                    top: `${16 + activeIndex * 48}px`,
                                    left: isOpen ? '16px' : '4px',
                                    right: isOpen ? '16px' : '4px'
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <motion.button
                                    key={item.path}
                                    animate={{
                                        justifyContent: isOpen ? 'flex-start' : 'center'
                                    }}
                                    transition={{ delay: 0.3 }}
                                    className={`btn-sidebar flex w-full h-10 gap-2 px-2 items-center overflow-x-hidden relative z-10 ${isActive ? 'text-blue-400' : 'text-neutral-300 hover:text-white'}`}
                                    onClick={() => navigate(item.path)}
                                >
                                    <Icon size={20} className="shrink-0" />
                                    {isOpen &&
                                        <span>{item.label}</span>
                                    }
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col w-full space-y-4 items-center justify-center">
                    {user ? (
                        <button
                            className={`btn-sidebar flex w-full space-x-2 p-2 items-center overflow-x-hidden bg-red-600/20 border border-red-600/50 hover:bg-red-600/50 transition-colors rounded-xl text-nowrap ${!isOpen && 'justify-center'}`}
                            onClick={handleLogout}
                        >
                            <MdLogout size={20} className="shrink-0" />
                            {isOpen &&
                                <span>Log uit</span>
                            }
                        </button>
                    ) : (
                        <button
                            className={`btn-sidebar flex w-full space-x-2 p-2 items-center overflow-x-hidden bg-blue-500/20 border border-blue-500/50 hover:bg-blue-500/50 transition-colors rounded-xl text-nowrap ${!isOpen && 'justify-center'}`}
                            onClick={toggleLoginModal}
                        >
                            <MdLogin size={20} className="shrink-0" />
                            {isOpen &&
                                <span>Log In</span>
                            }
                        </button>
                    )}
                    <motion.button
                        className="text-2xl text-neutral-200 hover:cursor-pointer"
                        onClick={toggleSidebar}
                        title={isOpen ? "Sluit zijbalk" : "Open zijbalk"}
                    >
                        <motion.div
                            animate={{ rotate: isOpen ? 0 : 180 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FaArrowLeft size={24} />
                        </motion.div>

                    </motion.button>
                </div>
                {isLoginModalOpen &&
                    <LoginModal
                        isLoginModalOpen={isLoginModalOpen}
                        setIsLoginModalOpen={setIsLoginModalOpen}
                        setIsPasswordModalOpen={setIsPasswordModalOpen}
                        user={user}
                        setUser={setUser}
                    />
                }
                {isPasswordModalOpen &&
                    <PasswordModal
                        isPasswordModalOpen={isPasswordModalOpen}
                        setIsPasswordModalOpen={setIsPasswordModalOpen}
                        user={user}
                        setUser={setUser}
                    />
                }
            </motion.div>
        </div>
    );
}

export default SideBar;