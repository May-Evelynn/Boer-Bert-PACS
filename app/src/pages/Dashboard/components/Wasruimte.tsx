import { motion, Variants } from 'framer-motion';
import { FaLock } from 'react-icons/fa';

import { User } from '../../../types';

interface Machine {
    id: number;
    machine: string;
    status: string;
    tagId: string;
    timeRemaining: string;
}

interface WasruimteProps {
    wasruimte: Machine[];
    variants?: Variants;
    user: User | null;
}

const Wasruimte: React.FC<WasruimteProps> = ({ wasruimte, variants, user }) => {
    const occupiedMachines = wasruimte.filter(m => m.status === 'Bezet');
    const occupancyRatio = occupiedMachines.length / wasruimte.length;

    const getOccupancyColor = () => {
        if (occupancyRatio === 0) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
        if (occupancyRatio < 0.5) return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
        return 'bg-rose-500/20 text-rose-400 border-rose-500/50';
    };

    return (
        <motion.div
            className="bg-neutral-950 border border-neutral-700 p-4 rounded-3xl"
            variants={variants}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-medium">Wasruimte</h2>
                </div>
                {user && (
                    <motion.span
                        className={`text-sm font-medium px-3 py-1.5 rounded-full border ${getOccupancyColor()}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 500, damping: 25 }}
                    >
                        {occupiedMachines.length}/{wasruimte.length} bezet
                    </motion.span>
                )}
            </div>

            <div className="bg-neutral-900 rounded-2xl p-3">
                {user ? (
                    <>
                        {occupiedMachines.length > 0 ? (
                            <div className="space-y-2">
                                {occupiedMachines.map((machine, index) => (
                                    <motion.div
                                        key={machine.id}
                                        className="flex justify-between items-center bg-neutral-800/50 border border-neutral-700/50 p-3 rounded-xl"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                                    >
                                        <div>
                                            <p className="text-lg font-medium">{machine.machine}</p>
                                            <p className="text-sm text-neutral-400">Tag ID: <span className="font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded">{machine.tagId}</span></p>
                                            <p className="text-sm text-neutral-400">Tijd resterend: <span className="font-mono px-1 rounded">{machine.timeRemaining}</span></p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-2"></div>
                                <p className="text-emerald-400">Alle machines zijn vrij!</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="p-6 text-center">
                        <FaLock className="mx-auto mb-4 size-12 text-neutral-500" />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Wasruimte;
