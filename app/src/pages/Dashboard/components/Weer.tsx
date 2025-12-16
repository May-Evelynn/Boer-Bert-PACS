import { motion, Variants } from 'framer-motion';
import { FaSun } from 'react-icons/fa';

interface WeerProps {
    variants?: Variants;
}

const Weer: React.FC<WeerProps> = ({ variants }) => {
    return (
        <motion.div
            className="flex flex-col bg-neutral-950 border border-neutral-700 p-4 rounded-3xl justify-between"
            variants={variants}
        >
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-medium">Weer</h2>
                </div>
                <div className="bg-neutral-900 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-4xl font-light text-white">26°C</p>
                            <p className="text-neutral-400 mt-1">Zonnig</p>
                        </div>
                        <div className="text-amber-400">
                            <FaSun size={48} />
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-sm font-semibold text-neutral-500 mt-4">Laatst bijgewerkt: 2 minuten geleden</p>
        </motion.div>
    );
};

export default Weer;
