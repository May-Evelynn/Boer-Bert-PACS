import { motion, Variants } from 'framer-motion';
import { FaLock, FaTools } from 'react-icons/fa';
import { MdLocalLaundryService } from 'react-icons/md';

import { User, Facility } from '../../../types';

interface FaciliteitenProps {
    facilities: Facility[];
    variants?: Variants;
    user: User | null;
    loading?: boolean;
}

const Faciliteiten: React.FC<FaciliteitenProps> = ({ facilities, variants, user, loading }) => {
    const brokenFacilities = facilities.filter(f => f.broken);
    const workingFacilities = facilities.filter(f => !f.broken);
    const brokenRatio = facilities.length > 0 ? brokenFacilities.length / facilities.length : 0;

    const getStatusColor = () => {
        if (brokenRatio === 0) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
        if (brokenRatio < 0.5) return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
        return 'bg-rose-500/20 text-rose-400 border-rose-500/50';
    };

    const getFacilityIcon = (type: string) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('was') || lowerType.includes('laundry') || lowerType.includes('droger')) {
            return <MdLocalLaundryService className="w-5 h-5" />;
        }
        return <FaTools className="w-4 h-4" />;
    };

    // Group facilities by type
    const groupedFacilities = facilities.reduce((acc, facility) => {
        const type = facility.facility_type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(facility);
        return acc;
    }, {} as Record<string, Facility[]>);

    return (
        <motion.div
            className="bg-neutral-950 border border-neutral-700 p-4 rounded-3xl"
            variants={variants}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-medium">Faciliteiten</h2>
                </div>
                {user && facilities.length > 0 && (
                    <motion.span
                        className={`text-sm font-medium px-3 py-1.5 rounded-full border ${getStatusColor()}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 500, damping: 25 }}
                    >
                        {workingFacilities.length}/{facilities.length} werkend
                    </motion.span>
                )}
            </div>

            <div className="bg-neutral-900 rounded-2xl p-3">
                {user ? (
                    loading ? (
                        <div className="text-center py-4">
                            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-neutral-400">Laden...</p>
                        </div>
                    ) : facilities.length > 0 ? (
                        <div className="space-y-3">
                            {Object.entries(groupedFacilities).map(([type, typeFacilities], groupIndex) => (
                                <motion.div
                                    key={type}
                                    className="bg-neutral-800/50 border border-neutral-700/50 p-3 rounded-xl"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + groupIndex * 0.1, duration: 0.3 }}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-emerald-400">{getFacilityIcon(type)}</span>
                                        <p className="text-lg font-medium">{type}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {typeFacilities.map((facility, index) => {
                                            const isBroken = facility.broken;
                                            return (
                                                <div
                                                    key={facility.facilities_id}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                                                        isBroken
                                                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                                                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                                    }`}
                                                    title={`Capaciteit: ${facility.capacity}`}
                                                >
                                                    <span className={`w-2 h-2 rounded-full ${isBroken ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                                                    <span>#{index + 1}</span>
                                                    {isBroken && <span className="text-xs">(Defect)</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-2">
                                        Totale capaciteit: {typeFacilities.reduce((sum, f) => sum + f.capacity, 0)}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <FaTools className="mx-auto mb-2 size-8 text-neutral-500" />
                            <p className="text-neutral-400">Geen faciliteiten gevonden</p>
                        </div>
                    )
                ) : (
                    <div className="p-6 text-center">
                        <FaLock className="mx-auto mb-4 size-12 text-neutral-500" />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Faciliteiten;
