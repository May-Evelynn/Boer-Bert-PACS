import { motion, Variants } from 'framer-motion';
import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { User, Scan, Facility } from '../../../types';
import { FaSpinner } from 'react-icons/fa';

interface ScanGrafiekProps {
    scans: Scan[];
    facilities: Facility[];
    variants?: Variants;
    user: User | null;
    loading?: boolean;
}

type ViewMode = 'hour' | 'day';

interface ScanDetail {
    time: string;
    location: string;
    tagId: string;
}

const COLORS: Record<string, string> = {
    'Zwembad': '#0ea5e9',
    'Toilet': '#f97316',
    'Douche': '#10b981',
    'Wasmachine': '#a855f7'
};

const LOCATION_STYLES: Record<string, string> = {
    'Zwembad': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    'Toilet': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Douche': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Wasmachine': 'bg-violet-500/20 text-violet-400 border-violet-500/30'
};

const getColor = (name: string, index: number) => {
    if (COLORS[name]) return COLORS[name];
    const fallbackColors = ['#8b5cf6', '#ec4899', '#eab308', '#06b6d4'];
    return fallbackColors[index % fallbackColors.length];
};

const getLocationStyle = (location: string) => {
    return LOCATION_STYLES[location] || 'bg-neutral-600/20 text-neutral-400 border-neutral-500/30';
};

const ScanGrafiek: React.FC<ScanGrafiekProps> = ({ scans, facilities, variants, user, loading }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('hour');
    const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

    const processData = () => {
        const grouped: Record<string, Record<string, number>> = {};
        const scanDetails: Record<string, ScanDetail[]> = {};
        const facilityNames = new Set<string>();
        const dayTimestamps: Record<string, number> = {};

        scans.forEach((scan) => {
            const date = new Date(scan.timestamp * 1000);
            let key: string;
            let displayKey: string;

            if (viewMode === 'hour') {
                key = date.toLocaleTimeString('nl-NL', { hour: '2-digit' }) + ':00';
                displayKey = key;
            } else {
                displayKey = date.toLocaleDateString('nl-NL', { month: 'short', weekday: 'short', day: 'numeric' });
                key = displayKey;
                if (!dayTimestamps[key] || date.getTime() < dayTimestamps[key]) {
                    dayTimestamps[key] = date.getTime();
                }
            }
            
            const facility = facilities.find(f => f.facilities_id === scan.facility_id);
            const facilityName = facility?.facility_type || `Facility ${scan.facility_id}`;
            facilityNames.add(facilityName);

            if (!grouped[key]) {
                grouped[key] = { name: displayKey };
                scanDetails[displayKey] = [];
            }
            grouped[key][facilityName] = (grouped[key][facilityName] || 0) + 1;

            scanDetails[displayKey].push({
                time: date.toLocaleString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
                location: facilityName,
                tagId: String(scan.keyfob_id).padStart(5, '0'),
            });
        });

        const sortedKeys = Object.keys(grouped).sort((a, b) => {
            if (viewMode === 'hour') {
                return parseInt(a) - parseInt(b);
            }
            return (dayTimestamps[a] || 0) - (dayTimestamps[b] || 0);
        });

        return {
            data: sortedKeys.map(key => grouped[key]),
            scanDetails,
            facilityNames: Array.from(facilityNames),
        };
    };

    const { data, scanDetails, facilityNames } = processData();

    const handleBarClick = (data: any) => {
        if (data?.name) {
            const period = data.name;
            setSelectedPeriod(selectedPeriod === period ? null : period);
        }
    };

    const selectedDetails = selectedPeriod ? scanDetails[selectedPeriod] || [] : [];
    const selectedTotal = selectedDetails.length;

    if (!user) {
        return (
            <motion.div
                variants={variants}
                className="col-span-2 bg-neutral-950 border border-neutral-700 p-4 rounded-3xl"
            >
                <h2 className="text-2xl font-medium mb-4">Scan Statistieken</h2>
                <div className="bg-neutral-900 rounded-2xl p-3">
                    <div className="flex items-center justify-center h-48 text-neutral-400">
                        Je moet ingelogd zijn om de scan statistieken te bekijken.
                    </div>
                </div>
            </motion.div>
        );
    }

    if (loading) {
        return (
            <motion.div
                variants={variants}
                className="col-span-2 bg-neutral-950 border border-neutral-700 p-4 rounded-3xl"
            >
                <h2 className="text-2xl font-medium mb-4">Scan Statistieken</h2>
                <div className="bg-neutral-900 rounded-2xl p-3">
                    <div className="p-6 text-center">
                        <FaSpinner className="mx-auto mb-4 size-12 text-neutral-500 animate-spin" />
                        <p className="text-neutral-400">Laden...</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={variants}
            className="col-span-2 bg-neutral-950 border border-neutral-700 p-4 rounded-3xl"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-medium">Scan Statistieken</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('hour')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${viewMode === 'hour'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                            : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
                            }`}
                    >
                        Per uur
                    </button>
                    <button
                        onClick={() => setViewMode('day')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${viewMode === 'day'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                            : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
                            }`}
                    >
                        Per dag
                    </button>
                </div>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-3">
                {data.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-neutral-400">
                        Geen scan data beschikbaar.
                    </div>
                ) : (
                    <>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={data}
                                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: '#a3a3a3', fontSize: 12 }}
                                        axisLine={{ stroke: '#525252' }}
                                        tickLine={{ stroke: '#525252' }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#a3a3a3', fontSize: 12 }}
                                        axisLine={{ stroke: '#525252' }}
                                        tickLine={{ stroke: '#525252' }}
                                        allowDecimals={false}
                                    />
                                    {viewMode === 'hour' && (
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                                            wrapperStyle={{ zIndex: 100 }}
                                            contentStyle={{
                                                backgroundColor: '#171717',
                                                border: '1px solid #404040',
                                                borderRadius: '8px',
                                                color: '#fff',
                                            }}
                                            formatter={(value: number, name: string) => [value, name]}
                                        />
                                    )}
                                    <Legend
                                        wrapperStyle={{ paddingTop: 10 }}
                                        formatter={(value) => <span style={{ color: '#a3a3a3' }}>{value}</span>}
                                    />
                                    {facilityNames.map((name, index) => (
                                        <Bar
                                            key={name}
                                            dataKey={name}
                                            stackId="a"
                                            fill={getColor(name, index)}
                                            radius={index === facilityNames.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                                            onClick={viewMode === 'day' ? handleBarClick : undefined}
                                            style={{ cursor: viewMode === 'day' ? 'pointer' : 'default' }}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Selected period details panel */}
                        {selectedPeriod && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 border-t border-neutral-700 pt-3"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-white">
                                        {selectedPeriod} — {selectedTotal} scan{selectedTotal !== 1 ? 's' : ''}
                                    </span>
                                    <button
                                        onClick={() => setSelectedPeriod(null)}
                                        className="text-neutral-500 hover:text-neutral-300 text-sm"
                                    >
                                        Sluiten
                                    </button>
                                </div>
                                <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                                    {selectedDetails.map((scan, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <span className="text-neutral-500 font-mono text-xs w-12">{scan.time}</span>
                                            <span className={`px-1.5 py-0.5 rounded border text-xs font-medium ${getLocationStyle(scan.location)}`}>
                                                {scan.location}
                                            </span>
                                            <span className="font-mono text-emerald-400 text-xs">{scan.tagId}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default ScanGrafiek;
