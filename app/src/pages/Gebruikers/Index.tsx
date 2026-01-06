import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPeopleGroup } from 'react-icons/fa6';

import UserCreation from './components/UserCreation';
import UserEditModal from './components/UserEditModal';

import Table from '../../components/Table';

import { userService } from '../../services/userService';
import { User } from '../../types';

interface GebruikersProps {
    user: User | null;
}

const Gebruikers: React.FC<GebruikersProps> = ({ user }) => {
    const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
    const [selectedGebruiker, setSelectedGebruiker] = useState<User | null>(null);
    const [gebruikers, setGebruikers] = useState<User[]>([]);

    const fetchUsers = async () => {
        try {
            const data = await userService.getUsers();
            setGebruikers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user]);

    const handleUserUpdate = () => {
        fetchUsers();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" as const }
        }
    };

    const getRoleColor = (role: string) => {
        const colors: Record<string, string> = {
            'Eigenaar': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            'Manager': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            'Receptionist': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'Schoonmaker': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        };
        return colors[role] || 'bg-neutral-600/20 text-neutral-400 border-neutral-500/30';
    };

    const toggleUserEditModal = (gebruiker: any) => {
        setSelectedGebruiker(gebruiker);
        setIsUserEditModalOpen(true);
    };

    return (
        <>
            {user ? (
                <div className="z-10 bg-neutral-900 min-h-screen w-full p-4 flex flex-col items-center justify-start text-white">
                    <motion.div
                        className='absolute bottom-16 right-16 -z-10 blur-sm'
                        initial={{ opacity: 0, scale: 0.8, translateX: -50, translateY: 10 }}
                        animate={{ opacity: 1, scale: 1, translateX: 0, translateY: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <FaPeopleGroup className="size-96 text-neutral-800 rotate-12" />
                    </motion.div>
                    <motion.div
                        className="w-full p-4 rounded-3xl justify-center items-center flex space-x-4 mb-8 flex-row"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <FaPeopleGroup className="w-8 h-8 text-emerald-400" />
                        <h1 className="text-4xl font-semibold">Gebruikers</h1>
                    </motion.div>
                    <motion.section
                        className="grid grid-cols-1 md:grid-cols-2 w-full gap-8 mb-8 justify-center items-start"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <UserCreation />

                        <Table
                            table={{
                                title: 'Gebruikers',
                                columns: ['Gebruikersnaam', 'Rol'],
                            }}
                            data={gebruikers}
                            searchFilters={['username', 'role']}
                            columnFilters={[
                                { column: 'role', label: 'Rol' }
                            ]}
                            renderRow={(item) => [
                                item.username,
                                <span className={`px-2 py-1 rounded-lg border text-sm font-medium ${getRoleColor(item.role)}`}>
                                    {item.role}
                                </span>,
                            ]}
                            clickableRows={true}
                            clickFunction={toggleUserEditModal}
                            emptyMessage="Geen gebruikers gevonden."
                            variants={itemVariants}
                        />
                    </motion.section>
                </div>
            ) : (
                <motion.div
                    className="z-10 bg-neutral-900 min-h-screen w-full p-4 flex flex-col items-center justify-center text-white h-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-3xl mb-4">Toegang Geweigerd</h1>
                    <p className="text-neutral-400 mb-2">Je moet ingelogd zijn om de gebruikers te bekijken.</p>
                </motion.div>
            )}
            {isUserEditModalOpen && (
                <UserEditModal
                    isUserEditModalOpen={isUserEditModalOpen}
                    setIsUserEditModalOpen={setIsUserEditModalOpen}
                    gebruiker={selectedGebruiker}
                    onUserUpdated={handleUserUpdate}
                />
            )}
        </>
    );
}

export default Gebruikers;
