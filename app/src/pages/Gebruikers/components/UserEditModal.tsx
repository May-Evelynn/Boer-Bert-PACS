import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

interface UserEditModalProps {
    isUserEditModalOpen: boolean;
    setIsUserEditModalOpen: (show: boolean) => void;
    gebruiker: {
        id: number;
        username: string;
        lastName: string;
        firstName: string;
        affix: string;
        role: string;
    };
}

const UserEditModal: React.FC<UserEditModalProps> = ({ setIsUserEditModalOpen, gebruiker }) => {
    const handleClose = () => {
        setIsUserEditModalOpen(false);
    };

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
                <div className="flex overflow-x-hidden space-x-3 mb-8">
                    <h1 className="text-3xl font-bold">Gebruiker Details:</h1>
                </div>
                <button
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-2.5 rounded-xl hover:cursor-pointer transition-colors duration-200"
                    onClick={handleClose}
                >
                    <FaTimes className="w-4 h-4" />
                </button>
                <div className="space-y-2">
                    <p><strong>Gebruikersnaam:</strong> {gebruiker.username}</p>
                    <p><strong>Voornaam:</strong> {gebruiker.firstName}</p>
                    <p><strong>Achternaam:</strong> {gebruiker.lastName}</p>
                    {gebruiker.affix && <p><strong>Tussenvoegsel:</strong> {gebruiker.affix}</p>}
                    <p><strong>Rol:</strong> {gebruiker.role}</p>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default UserEditModal;