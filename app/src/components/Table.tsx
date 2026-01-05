import { useState, ReactNode, useMemo } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { FaSpinner, FaLock, FaTimes } from "react-icons/fa";
import FilterDropdown from "./FilterDropdown";

interface ColumnFilter<T> {
    column: keyof T;
    label: string;
    options?: string[];
    valueFormatter?: (value: unknown) => string;
}

interface TableProps<T> {
    table: {
        title: string;
        columns: string[];
    };
    data: T[];
    searchFilters?: (keyof T)[];
    columnFilters?: ColumnFilter<T>[];
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
    columnFilters = [],
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
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    // Generate filter options from data for each column filter
    const filterOptions = useMemo(() => {
        const options: Record<string, { value: string; count: number }[]> = {};

        columnFilters.forEach((filter) => {
            if (filter.options) {
                // Use provided options
                options[filter.column as string] = filter.options.map((opt) => ({
                    value: opt,
                    count: data.filter((item) => {
                        const value = item[filter.column];
                        const formatted = filter.valueFormatter
                            ? filter.valueFormatter(value)
                            : String(value ?? '');
                        return formatted === opt;
                    }).length,
                }));
            } else {
                // Auto-generate options from data
                const valueCounts = new Map<string, number>();
                data.forEach((item) => {
                    const value = item[filter.column];
                    const formatted = filter.valueFormatter
                        ? filter.valueFormatter(value)
                        : String(value ?? '');
                    if (formatted) {
                        valueCounts.set(formatted, (valueCounts.get(formatted) || 0) + 1);
                    }
                });

                options[filter.column as string] = Array.from(valueCounts.entries())
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([value, count]) => ({ value, count }));
            }
        });

        return options;
    }, [columnFilters, data]);

    // Combined filtering: text search + column filters
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // Text search filter
            if (search && searchFilters && searchFilters.length > 0) {
                const matchesSearch = searchFilters.some((filter) => {
                    const value = item[filter];
                    return value?.toString().toLowerCase().includes(search.toLowerCase());
                });
                if (!matchesSearch) return false;
            }

            // Column filters
            for (const filter of columnFilters) {
                const selectedValues = activeFilters[filter.column as string];
                if (selectedValues && selectedValues.length > 0) {
                    const itemValue = item[filter.column];
                    const formatted = filter.valueFormatter
                        ? filter.valueFormatter(itemValue)
                        : String(itemValue ?? '');
                    if (!selectedValues.includes(formatted)) {
                        return false;
                    }
                }
            }

            return true;
        });
    }, [data, search, searchFilters, columnFilters, activeFilters]);

    const handleFilterChange = (column: string, values: string[]) => {
        setActiveFilters((prev) => ({
            ...prev,
            [column]: values,
        }));
    };

    const clearAllFilters = () => {
        setSearch('');
        setActiveFilters({});
    };

    const removeFilter = (column: string, value: string) => {
        setActiveFilters((prev) => ({
            ...prev,
            [column]: prev[column]?.filter((v) => v !== value) || [],
        }));
    };

    // Get all active filter badges
    const activeFilterBadges = useMemo(() => {
        const badges: { column: string; label: string; value: string }[] = [];
        columnFilters.forEach((filter) => {
            const values = activeFilters[filter.column as string] || [];
            values.forEach((value) => {
                badges.push({
                    column: filter.column as string,
                    label: filter.label,
                    value,
                });
            });
        });
        return badges;
    }, [columnFilters, activeFilters]);

    const hasActiveFilters = search || activeFilterBadges.length > 0;

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
                {/* Header with title and controls */}
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-medium">{table.title}</h2>
                        <div className="flex items-center gap-3">
                            {/* Search input */}
                            {!hideSearch && (
                                <input
                                    type="text"
                                    placeholder={`Zoek ${table.title.toLowerCase()}...`}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="p-2 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:outline-none focus:border-blue-500"
                                />
                            )}

                            {/* Column filter dropdowns */}
                            {columnFilters.map((filter) => (
                                <FilterDropdown
                                    key={filter.column as string}
                                    label={filter.label}
                                    options={filterOptions[filter.column as string] || []}
                                    selectedValues={activeFilters[filter.column as string] || []}
                                    onChange={(values) => handleFilterChange(filter.column as string, values)}
                                />
                            ))}


                            {/* Action button */}
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

                    {/* Active filter badges */}
                    <AnimatePresence>
                        {activeFilterBadges.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-wrap gap-2"
                            >
                                {activeFilterBadges.map((badge) => (
                                    <motion.span
                                        key={`${badge.column}-${badge.value}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-full text-sm"
                                    >
                                        <span className="text-emerald-300/70">{badge.label}:</span>
                                        {badge.value}
                                        <button
                                            onClick={() => removeFilter(badge.column, badge.value)}
                                            className="ml-1 hover:text-emerald-200 transition-colors"
                                        >
                                            <FaTimes className="w-3 h-3" />
                                        </button>
                                    </motion.span>
                                ))}
                                {/* Clear all filters button */}
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="px-3 py-2 text-sm hover:text-red-200 bg-red-600/20 text-red-400 border border-red-500/30 rounded-full transition-colors hover:cursor-pointer"
                                    >
                                        Wis Filters
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="bg-neutral-900 rounded-2xl overflow-hidden">
                    {renderContent()}
                </div>
            </div>
        </motion.div>
    );
};

export default Table;
