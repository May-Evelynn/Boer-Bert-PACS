import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

interface DruppelModalProps {
    isDruppelModalOpen: boolean,
    setIsDruppelModalOpen: (show: boolean) => void;
    druppel : {
        id: number;
        druppelId: number;
        druppelCode: string;
        lastName: string;
        firstName:  string;
        affix: string;
        role: string;
    };
}

const DruppelModal: React.FC<DruppelModalProps> = ({ setIsDruppelModalOpen, druppel }) => {
    const handleClose = () => {
        setIsDruppelModalOpen(false);
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
                <div className="flex justify-center items-center overflow-x-hidden space-x-3 mb-8">
                    <h1 className="text-3xl font-bold">Druppel Details ({druppel.druppelCode})</h1>
                </div>
                <button
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 p-2.5 rounded-xl hover:cursor-pointer transition-colors duration-200"
                    onClick={handleClose}
                >
                    <FaTimes className="w-4 h-4" />
                </button>
                <div>
                    <p><strong>Druppel ID:</strong> {druppel.druppelId}</p>
                    <p><strong>Gebruiker:</strong> {druppel.firstName} {druppel.affix} {druppel.lastName}</p>
                    <p><strong>Rol:</strong> {druppel.role}</p>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default DruppelModal;
