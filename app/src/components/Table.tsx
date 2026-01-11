import { useState, ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { FaSpinner, FaLock } from "react-icons/fa";

interface TableProps<T> {
    table: {
        title: string;
        columns: string[];
    };
    data: T[];
    searchFilters?: (keyof T)[];
    renderRow: (item: T) => ReactNode[];
    clickableRows?: boolean;
    clickFunction?: (item: T) => void;
    loading?: boolean;
    error?: string | null;
    emptyMessage?: string;
    actionButton?: {
        label: string;
        icon?: ReactNode;
        onClick: () => void;
    };
    maxHeight?: string;
    variants?: Variants;
    requiresAuth?: boolean;
    isAuthenticated?: boolean;
    authMessage?: string;
    hideSearch?: boolean;
}

const Table = <T extends { id: number | string }>({
    table,
    data,
    searchFilters,
    renderRow,
    clickableRows,
    clickFunction,
    loading = false,
    error = null,
    emptyMessage = "Geen gegevens gevonden.",
    actionButton,
    maxHeight = "max-h-96",
    variants,
    requiresAuth = false,
    isAuthenticated = true,
    authMessage = "Je moet ingelogd zijn om deze gegevens te bekijken.",
    hideSearch = false,
}: TableProps<T>) => {
    const [search, setSearch] = useState('');

    const filteredData = data.filter((item) => {
        if (!searchFilters || searchFilters.length === 0 || !search) return true;

        return searchFilters.some((filter) => {
            const value = item[filter];
            return value?.toString().toLowerCase().includes(search.toLowerCase());
        });
    });

    const renderContent = () => {
        if (requiresAuth && !isAuthenticated) {
            return (
                <div className="p-6 text-center">
                    <FaLock className="mx-auto mb-4 size-12 text-neutral-500" />
                    <p className="text-neutral-400">{authMessage}</p>
                </div>
            );
        }

        if (loading) {
            return (
                <div className="p-6 text-center">
                    <FaSpinner className="mx-auto mb-4 size-12 text-neutral-500 animate-spin" />
                    <p className="text-neutral-400">Laden...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-6 text-center">
                    <p className="text-red-400">{error}</p>
                </div>
            );
        }

        if (filteredData.length === 0) {
            return (
                <div className="p-6 text-center">
                    <p className="text-neutral-400">{emptyMessage}</p>
                </div>
            );
        }

        return (
            <div className={`${maxHeight} overflow-y-auto custom-scrollbar`}>
                <table className="w-full table-auto">
                    <thead className="sticky top-0 bg-neutral-900/90 backdrop-blur-xs">
                        <tr className="bg-neutral-800/50">
                            {table.columns.map((col, i) => (
                                <th
                                    key={i}
                                    className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
                            <motion.tr
                                key={item.id}
                                className={`hover:bg-neutral-800/50 transition-colors ${clickableRows ? 'cursor-pointer' : ''}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * index, duration: 0.3 }}
                                onClick={() => clickableRows && clickFunction?.(item)}
                            >
                                {renderRow(item).map((cell, i) => (
                                    <td key={i} className="p-3 border-b border-neutral-800 text-neutral-300">
                                        {cell}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <motion.div className="w-full" variants={variants}>
            <div className="bg-neutral-950 border border-neutral-700 p-4 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-medium">{table.title}</h2>
                    <div className="flex items-center gap-4">
                        {!hideSearch && (
                            <input
                                type="text"
                                placeholder={`Zoek ${table.title.toLowerCase()}...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="p-2 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:outline-none focus:border-blue-500"
                            />
                        )}
                        {actionButton && (
                            <button
                                onClick={actionButton.onClick}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors"
                            >
                                {actionButton.icon}
                                {actionButton.label}
                            </button>
                        )}
                    </div>
                </div>
                <div className="bg-neutral-900 rounded-2xl overflow-hidden">
                    {renderContent()}
                </div>
            </div>
        </motion.div>
    );
};

export default Table;
