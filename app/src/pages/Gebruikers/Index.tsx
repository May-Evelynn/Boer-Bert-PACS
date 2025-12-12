import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPeopleGroup } from 'react-icons/fa6';

import UserCreation from './components/UserCreation';
import UserEditModal from './components/UserEditModal';

import Table from '../../components/Table';

interface GebruikersProps {
    isLoggedIn: boolean;
}

const Gebruikers: React.FC<GebruikersProps> = ({ isLoggedIn }) => {
    const [isUserEditModalOpen, setIsUserEditModalOpen] = useState(false);
    const [selectedGebruiker, setSelectedGebruiker] = useState<any>(null);

    // Dummy data voor personeel en gasten
    const gebruikers = [
        { id: 1, username: 'jpapendorp', lastName: 'Papendorp', firstName: 'Jan', affix: '', role: 'Schoonmaker' },
        { id: 2, username: 'phendriks', lastName: 'Hendriks', firstName: 'Piet', affix: '', role: 'Schoonmaker' },
        { id: 3, username: 'kvaker', lastName: 'Vaker', firstName: 'Klaas', affix: '', role: 'Receptionist' },
        { id: 4, username: 'bdeboer', lastName: 'Boer', firstName: 'Bert', affix: 'de', role: 'Eigenaar' },
        { id: 5, username: 'ajansen', lastName: 'Jansen', firstName: 'Anna', affix: '', role: 'Manager' },
        { id: 6, username: 'esmit', lastName: 'Smit', firstName: 'Eva', affix: '', role: 'Schoonmaker' },
        { id: 7, username: 'tmeijer', lastName: 'Meijer', firstName: 'Tom', affix: '', role: 'Receptionist' },
        { id: 8, username: 'ldekker', lastName: 'Dekker', firstName: 'Lisa', affix: '', role: 'Manager' },
    ];


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const toggleUserEditModal = (gebruiker: any) => {
        setSelectedGebruiker(gebruiker);
        setIsUserEditModalOpen(true);
    }

    return (
        <>
            {isLoggedIn ? (
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
                            searchFilters={['username']}
                            renderRow={(item) => [
                                item.username,
                                item.role,
                            ]}
                            clickableRows={true}
                            clickFunction={(item) => {
                                toggleUserEditModal(item);
                            }}
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
                />
            )}
        </>
    );
}

export default Gebruikers;
