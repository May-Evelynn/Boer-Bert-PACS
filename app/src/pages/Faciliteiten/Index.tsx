import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaTools, FaPlus, FaTrash, FaSpinner, FaEdit } from 'react-icons/fa';
import { MdLocalLaundryService } from 'react-icons/md';
import { FaSwimmingPool, FaToilet, FaShower } from 'react-icons/fa';

import Table from '../../components/Table';
import { facilityService } from '../../services/facilityService';
import { DataContext, DataContextType, Facility } from '../../types';

const Faciliteiten: React.FC = () => {
    const { facilities, setFacilities } = useContext<DataContextType>(DataContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
    const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(null);

    useEffect(() => {
        fetchFacilities();
    }, []);

    const fetchFacilities = async () => {
        try {
            setLoading(true);
            const data = await facilityService.getFacilities();
            setFacilities(data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch facilities:', err);
            setError('Kon faciliteiten niet laden');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (facility: Facility) => {
        setFacilityToDelete(facility);
    };

    const confirmDelete = async () => {
        if (!facilityToDelete) return;
        try {
            await facilityService.deleteFacility(facilityToDelete.facilities_id);
            setFacilityToDelete(null);
            await fetchFacilities();
        } catch (err) {
            console.error('Failed to delete facility:', err);
            setFacilityToDelete(null);
        }
    };

    const handleEdit = (facility: Facility) => {
        setSelectedFacility(facility);
        setIsEditModalOpen(true);
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

    const getFacilityIcon = (type: string) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('was') || lowerType.includes('laundry') || lowerType.includes('droger')) {
            return <MdLocalLaundryService className="w-5 h-5 text-violet-400" />;
        }
        if (lowerType.includes('zwembad') || lowerType.includes('pool')) {
            return <FaSwimmingPool className="w-4 h-4 text-sky-400" />;
        }
        if (lowerType.includes('toilet') || lowerType.includes('wc')) {
            return <FaToilet className="w-4 h-4 text-orange-400" />;
        }
        if (lowerType.includes('douche') || lowerType.includes('shower')) {
            return <FaShower className="w-4 h-4 text-emerald-400" />;
        }
        return <FaTools className="w-4 h-4 text-neutral-400" />;
    };

    const getStatusBadge = (facility: Facility) => {
        if (facility.broken) {
            return (
                <span className="px-2 py-1 rounded-lg border text-sm font-medium bg-rose-500/20 text-rose-400 border-rose-500/30">
                    Defect
                </span>
            );
        }
        if (!facility.active) {
            return (
                <span className="px-2 py-1 rounded-lg border text-sm font-medium bg-amber-500/20 text-amber-400 border-amber-500/30">
                    Inactief
                </span>
            );
        }
        return (
            <span className="px-2 py-1 rounded-lg border text-sm font-medium bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                Actief
            </span>
        );
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
                    <FaTools className="size-96 text-neutral-800 rotate-12" />
                </motion.div>
                <motion.div
                    className="w-full p-4 rounded-3xl justify-start items-center flex space-x-4 mb-8 flex-row"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <FaTools className="w-8 h-8 text-emerald-400" />
                    <h1 className="text-4xl font-semibold">Faciliteiten</h1>
                </motion.div>
                <motion.section
                    className="flex flex-col w-full gap-8 mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Table
                        table={{
                            title: 'Faciliteiten',
                            columns: ['Type', 'Capaciteit', 'Status', 'Acties'],
                        }}
                        data={facilities.map(f => ({ ...f, id: f.facilities_id }))}
                        searchFilters={['facility_type']}
                        sortableColumns={[0, 1]}
                        columnFilters={[
                            {
                                column: 'broken',
                                label: 'Status',
                                options: ['Actief', 'Defect'],
                                valueFormatter: (value) => value ? 'Defect' : 'Actief'
                            }
                        ]}
                        renderRow={(facility) => [
                            <div className="flex items-center gap-2">
                                {getFacilityIcon(facility.facility_type)}
                                <span>{facility.facility_type}</span>
                            </div>,
                            <span className="font-mono">{facility.capacity}</span>,
                            getStatusBadge(facility),
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(facility);
                                    }}
                                    className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                                    title="Bewerken"
                                >
                                    <FaEdit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(facility);
                                    }}
                                    className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 transition-colors"
                                    title="Verwijderen"
                                >
                                    <FaTrash className="w-4 h-4" />
                                </button>
                            </div>,
                        ]}
                        loading={loading}
                        error={error}
                        emptyMessage="Geen faciliteiten gevonden."
                        actionButton={{
                            label: 'Nieuwe Faciliteit',
                            icon: <FaPlus />,
                            onClick: () => setIsCreateModalOpen(true),
                        }}
                        clickableRows={true}
                        clickFunction={handleEdit}
                        variants={itemVariants}
                    />
                </motion.section >
            </div >

            {isCreateModalOpen && (
                <CreateFacilityModal
                    isOpen={isCreateModalOpen}
                    setIsOpen={setIsCreateModalOpen}
                    onSuccess={fetchFacilities}
                />
            )}
            {
                isEditModalOpen && selectedFacility && (
                    <EditFacilityModal
                        isOpen={isEditModalOpen}
                        setIsOpen={setIsEditModalOpen}
                        facility={selectedFacility}
                        onSuccess={fetchFacilities}
                    />
                )
            }

            {
                facilityToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setFacilityToDelete(null)}
                        />
                        <motion.div
                            className="relative w-96 p-6 bg-neutral-950 border border-neutral-700 rounded-3xl shadow-2xl"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", duration: 0.3 }}
                        >
                            <h2 className="text-xl font-semibold mb-4">Faciliteit verwijderen</h2>
                            <p className="text-neutral-400 mb-6">
                                Weet je zeker dat je "{facilityToDelete.facility_type}" wilt verwijderen?
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setFacilityToDelete(null)}
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
                )
            }
        </>
    );
};

interface CreateFacilityModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSuccess: () => void;
}

const CreateFacilityModal: React.FC<CreateFacilityModalProps> = ({ isOpen, setIsOpen, onSuccess }) => {
    const [facilityType, setFacilityType] = useState('');
    const [capacity, setCapacity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!facilityType.trim()) {
            setError('Vul een type in');
            return;
        }
        const capacityNum = parseInt(capacity, 10);
        if (isNaN(capacityNum) || capacityNum < 1) {
            setError('Vul een geldige capaciteit in');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await facilityService.createFacility(facilityType.trim(), capacityNum);
            onSuccess();
            setIsOpen(false);
            setFacilityType('');
            setCapacity('');
        } catch (err) {
            console.error('Failed to create facility:', err);
            setError('Kon faciliteit niet aanmaken');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />
            <motion.div
                className="relative bg-neutral-950 border border-neutral-700 rounded-3xl p-6 w-full max-w-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <h2 className="text-2xl font-semibold mb-6">Nieuwe Faciliteit</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Type</label>
                        <input
                            type="text"
                            value={facilityType}
                            onChange={(e) => setFacilityType(e.target.value)}
                            placeholder="bijv. Zwembad, Toilet, Douche..."
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Capaciteit</label>
                        <input
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            placeholder="1"
                            min="1"
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    {error && (
                        <p className="text-rose-400 text-sm">{error}</p>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl hover:bg-neutral-700 transition-colors"
                        >
                            Annuleren
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Bezig...
                                </>
                            ) : (
                                'Aanmaken'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

interface EditFacilityModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    facility: Facility;
    onSuccess: () => void;
}

const EditFacilityModal: React.FC<EditFacilityModalProps> = ({ isOpen, setIsOpen, facility, onSuccess }) => {
    const [facilityType, setFacilityType] = useState(facility.facility_type);
    const [capacity, setCapacity] = useState(String(facility.capacity));
    const [active, setActive] = useState(facility.active);
    const [broken, setBroken] = useState(facility.broken);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!facilityType.trim()) {
            setError('Vul een type in');
            return;
        }
        const capacityNum = parseInt(capacity, 10);
        if (isNaN(capacityNum) || capacityNum < 1) {
            setError('Vul een geldige capaciteit in');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await facilityService.updateFacility(facility.facilities_id, {
                facilityType: facilityType.trim(),
                capacity: capacityNum,
                active,
                broken
            });
            onSuccess();
            setIsOpen(false);
        } catch (err) {
            console.error('Failed to update facility:', err);
            setError('Kon faciliteit niet bijwerken');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />
            <motion.div
                className="relative bg-neutral-950 border border-neutral-700 rounded-3xl p-6 w-full max-w-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            >
                <h2 className="text-2xl font-semibold mb-6">Faciliteit Bewerken</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Type</label>
                        <input
                            type="text"
                            value={facilityType}
                            onChange={(e) => setFacilityType(e.target.value)}
                            placeholder="bijv. Zwembad, Toilet, Douche..."
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Capaciteit</label>
                        <input
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            placeholder="1"
                            min="1"
                            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={active}
                                onChange={(e) => setActive(e.target.checked)}
                                className="w-5 h-5 rounded bg-neutral-800 border-neutral-600 text-emerald-500 focus:ring-emerald-500"
                            />
                            <span>Actief</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={broken}
                                onChange={(e) => setBroken(e.target.checked)}
                                className="w-5 h-5 rounded bg-neutral-800 border-neutral-600 text-rose-500 focus:ring-rose-500"
                            />
                            <span className="text-rose-400">Defect</span>
                        </label>
                    </div>

                    {error && (
                        <p className="text-rose-400 text-sm">{error}</p>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl hover:bg-neutral-700 transition-colors"
                        >
                            Annuleren
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Bezig...
                                </>
                            ) : (
                                'Opslaan'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Faciliteiten;

