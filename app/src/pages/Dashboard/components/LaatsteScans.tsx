import { motion, Variants } from 'framer-motion';
import { FaLock, FaSpinner } from 'react-icons/fa';

import { User } from '../../../types';

interface Scan {
    id: number;
    location: string;
    time: string;
    tagId: string;
}

interface LaatsteScansProps {
    scans: Scan[];
    variants?: Variants;
    user: User | null;
    loading?: boolean;
}

const LaatsteScans: React.FC<LaatsteScansProps> = ({ scans, variants, user, loading }) => {
    const getLocationColor = (location: string) => {
        const colors: Record<string, string> = {
            'Zwembad': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
            'Sauna': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            'Vlindertuin': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        };
        return colors[location] || 'bg-neutral-600/20 text-neutral-400 border-neutral-500/30';
    };

    return (
        <motion.div
            className="col-span-2 bg-neutral-950 border border-neutral-700 p-4 rounded-3xl"
            variants={variants}
        >
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-medium">Laatste scans</h2>
            </div>
            <div className="bg-neutral-900 rounded-2xl overflow-hidden">
                {!user ? (
                    <div className="p-6 text-center">
                        <FaLock className="mx-auto mb-4 size-12 text-neutral-500" />
                        <p className="text-neutral-400">Je moet ingelogd zijn om de laatste scans te bekijken.</p>
                    </div>
                ) : loading ? (
                    <div className="p-6 text-center">
                        <FaSpinner className="mx-auto mb-4 size-12 text-neutral-500 animate-spin" />
                        <p className="text-neutral-400">Laden...</p>
                    </div>
                ) : scans.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-neutral-400">Geen scans gevonden.</p>
                    </div>
                ) : (
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-neutral-800/50">
                                <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Locatie</th>
                                <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Tijd</th>
                                <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Tag ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scans.map((scan, index) => (
                                <motion.tr
                                    key={scan.id}
                                    className="hover:bg-neutral-800/50 transition-colors"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                                >
                                    <td className="p-3 border-b border-neutral-800">
                                        <span className={`px-2 py-1 rounded-lg border text-sm font-medium ${getLocationColor(scan.location)}`}>
                                            {scan.location}
                                        </span>
                                    </td>
                                    <td className="p-3 border-b border-neutral-800 text-neutral-300">{scan.time}</td>
                                    <td className="p-3 border-b border-neutral-800">
                                        <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">{scan.tagId}</span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </motion.div>
    );
};

export default LaatsteScans;
