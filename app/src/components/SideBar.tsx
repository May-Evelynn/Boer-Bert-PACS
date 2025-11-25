import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaCogs, FaHome, FaLockOpen } from "react-icons/fa";
import { motion } from "framer-motion";
import { FaPerson } from "react-icons/fa6";
import { BsFillGrid1X2Fill } from "react-icons/bs";

import LoginModal from './LoginModal'

const SideBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

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

    const navItems = [
        { path: '/', icon: FaHome, label: 'Home' },
        { path: '/overzicht', icon: BsFillGrid1X2Fill, label: 'Dashboard' },
        { path: '/druppels', icon: FaCogs, label: 'Druppels' },
        { path: '/personen', icon: FaPerson, label: 'Personen' },
    ];

    const activeIndex = navItems.findIndex(item => item.path === location.pathname);

    return (
        <div className="bg-neutral-900">
            <motion.div
                className="flex flex-col bg-neutral-950 p-4 min-h-screen border-r border-neutral-600 rounded-r-2xl items-center justify-between overflow-x-hidden text-white"
                animate={{ width: isOpen ? 256 : 80 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col justify-center w-full mb-10">
                    <div className="flex justify-center items-center overflow-x-hidden space-x-2 mb-4">
                        <img
                            src="/tauri.svg"
                            alt="Boer Bert Logo"
                            className="w-8 h-8"
                        />
                        {isOpen &&
                            <h1 className="text-2xl font-bold">BoerBert</h1>
                        }
                    </div>
                    <div className="relative flex flex-col bg-neutral-900 border border-neutral-700 space-y-2 p-4 mt-10 rounded-3xl justify-center items-center">
                        {activeIndex !== -1 && (
                            <motion.div
                                className={`absolute bg-neutral-600 border border-neutral-400 rounded-full inset-x-4 z-0`}
                                layoutId="sidebar-active-link"
                                style={{ height: '40px' }}
                                animate={{ top: `${16 + activeIndex * 48}px` }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    className={`btn-sidebar flex w-full space-x-2 p-2 items-center overflow-x-hidden relative z-10 ${!isOpen && 'justify-center'} ${isActive ? 'text-blue-400' : ''}`}
                                    onClick={() => navigate(item.path)}
                                >
                                    <Icon size={20} className="shrink-0" />
                                    {isOpen &&
                                        <span>{item.label}</span>
                                    }
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="flex flex-col w-full space-y-4 items-center justify-center">
                    <button
                        className={`btn-sidebar flex w-full space-x-2 p-2 items-center overflow-x-hidden bg-neutral-800 ${!isOpen && 'justify-center'}`}
                        onClick={toggleLoginModal}
                    >
                        <FaLockOpen size={20} className="shrink-0" />
                        {isOpen &&
                            <span>Log In</span>
                        }
                    </button>
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
                    />
                }
            </motion.div>
        </div>
    );
}

export default SideBar;