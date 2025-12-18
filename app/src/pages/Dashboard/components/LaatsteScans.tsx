import { Variants } from 'framer-motion';

import Table from '../../../components/Table';
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
        <div className="col-span-2">
            <Table
                table={{
                    title: 'Laatste scans',
                    columns: ['Locatie', 'Tijd', 'Tag ID'],
                }}
                data={scans}
                renderRow={(scan) => [
                    <span className={`px-2 py-1 rounded-lg border text-sm font-medium ${getLocationColor(scan.location)}`}>
                        {scan.location}
                    </span>,
                    scan.time,
                    <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                        {scan.tagId}
                    </span>,
                ]}
                loading={loading}
                emptyMessage="Geen scans gevonden."
                requiresAuth={true}
                isAuthenticated={!!user}
                authMessage="Je moet ingelogd zijn om de laatste scans te bekijken."
                hideSearch={true}
                maxHeight="max-h-64"
                variants={variants}
            />
        </div>
    );
};

export default LaatsteScans;
