import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaPeopleGroup, FaPlus } from 'react-icons/fa6';
import { FaEdit, FaTrash } from 'react-icons/fa';

import CreateUserModal from './components/CreateUserModal';
import UserEditModal from './components/UserEditModal';

import Table from '../../components/Table';

import { userService } from '../../services/userService';
import { DataContext, DataContextType, User } from '../../types';

const Personeel: React.FC = () => {
    const { user } = useContext<DataContextType>(DataContext);
    const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [selectedGebruiker, setSelectedGebruiker] = useState<User | null>(null);
    const [gebruikers, setGebruikers] = useState<User[]>([]);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const fetchUsers = async () => {
        try {
            const data = await userService.getUsers();
            setGebruikers(data.filter((u: User) => u.role));
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

    const handleDelete = (user: User) => {
        setUserToDelete(user);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await userService.deleteUser(userToDelete.id);
            setUserToDelete(null);
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Kon gebruiker niet verwijderen.");
            setUserToDelete(null);
        }
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
                    className="w-full p-4 rounded-3xl justify-start items-center flex space-x-4 mb-8 flex-row"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <FaPeopleGroup className="w-8 h-8 text-emerald-400" />
                    <h1 className="text-4xl font-semibold">Personeel</h1>
                </motion.div>
                <motion.section
                    className="flex flex-col w-full space-y-8 mb-8 justify-center items-start"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Table
                        table={{
                            title: 'Personeel',
                            columns: ['Gebruikersnaam', 'Rol', 'Acties'],
                        }}
                        data={gebruikers}
                        searchFilters={['username', 'role']}
                        sortableColumns={[0, 1]}
                        columnFilters={[
                            { column: 'role', label: 'Rol' }
                        ]}
                        renderRow={(item) => [
                            item.username,
                            <span className={`px-2 py-1 rounded-lg border text-sm font-medium ${getRoleColor(item.role)}`}>
                                {item.role}
                            </span>,
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleUserEditModal(item);
                                    }}
                                    className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                    title="Bewerken"
                                >
                                    <FaEdit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item);
                                    }}
                                    className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 transition-colors"
                                    title="Verwijderen"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </button>
                            </div>
                        ]}
                        clickableRows={true}
                        clickFunction={toggleUserEditModal}
                        emptyMessage="Geen gebruikers gevonden."
                        variants={itemVariants}
                        actionButton={{
                            label: 'Nieuwe Gebruiker',
                            icon: <FaPlus />,
                            onClick: () => setIsCreateUserModalOpen(true),
                        }}
                    />
                </motion.section>
            </div>
            {isUserEditModalOpen && (
                <UserEditModal
                    isUserEditModalOpen={isUserEditModalOpen}
                    setIsUserEditModalOpen={setIsUserEditModalOpen}
                    gebruiker={selectedGebruiker}
                    onUserUpdated={handleUserUpdate}
                />
            )}
            <CreateUserModal
                isOpen={isCreateUserModalOpen}
                setIsOpen={setIsCreateUserModalOpen}
                onSuccess={handleUserUpdate}
            />
            {userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setUserToDelete(null)}
                    />
                    <motion.div
                        className="relative w-96 p-6 bg-neutral-950 border border-neutral-700 rounded-3xl shadow-2xl"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.3 }}
                    >
                        <h2 className="text-xl font-semibold mb-4">Gebruiker verwijderen</h2>
                        <p className="text-neutral-400 mb-6">
                            Weet je zeker dat je "{userToDelete.first_name} {userToDelete.last_name}" ({userToDelete.username}) wilt verwijderen?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-600 text-neutral-300 hover:bg-neutral-700 transition-colors"
                            >
                                Annuleren
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-400 hover:bg-rose-500/30 transition-colors"
                            >
                                Verwijderen
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}

export default Personeel;
