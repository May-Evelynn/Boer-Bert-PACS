import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaCheck } from 'react-icons/fa';

interface FilterOption {
    value: string;
    count?: number;
}

interface FilterDropdownProps {
    label: string;
    options: FilterOption[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
    label,
    options,
    selectedValues,
    onChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter((v) => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    const hasSelection = selectedValues.length > 0;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200
                    ${hasSelection
                        ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400'
                        : 'bg-neutral-800 border-neutral-600 text-neutral-300 hover:border-neutral-500'
                    }
                `}
            >
                <span className="text-sm font-medium">
                    {label}
                    {hasSelection && ` (${selectedValues.length})`}
                </span>
                <FaChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 min-w-48 bg-neutral-800 border border-neutral-600 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {options.length === 0 ? (
                                <div className="px-4 py-3 text-neutral-400 text-sm">
                                    Geen opties beschikbaar
                                </div>
                            ) : (
                                options.map((option) => {
                                    const isSelected = selectedValues.includes(option.value);
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => toggleOption(option.value)}
                                            className={`
                                                w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors
                                                ${isSelected
                                                    ? 'bg-emerald-600/20 text-emerald-400'
                                                    : 'text-neutral-300 hover:bg-neutral-700/50'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`
                                                        w-4 h-4 rounded border flex items-center justify-center transition-colors
                                                        ${isSelected
                                                            ? 'bg-emerald-500 border-emerald-500'
                                                            : 'border-neutral-500'
                                                        }
                                                    `}
                                                >
                                                    {isSelected && <FaCheck className="w-2.5 h-2.5 text-white" />}
                                                </div>
                                                <span className="text-sm">{option.value}</span>
                                            </div>
                                            {option.count !== undefined && (
                                                <span className="text-xs text-neutral-500 ml-2">
                                                    {option.count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                        {hasSelection && (
                            <div className="border-t border-neutral-700 p-2">
                                <button
                                    onClick={() => onChange([])}
                                    className="w-full px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-200 transition-colors rounded-lg hover:bg-neutral-700/50"
                                >
                                    Wis selectie
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FilterDropdown;
