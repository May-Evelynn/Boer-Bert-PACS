import { useState } from "react";
import { motion } from "framer-motion";

interface TableProps<T> {
    table: {
        title: string;
        columns: string[];
    };
    data: T[];
    searchFilters?: (keyof T)[];
    renderRow: (item: T) => (string | number)[];
    clickableRows?: boolean;
    clickFunction?: (item: T) => void;
}

const Table = <T extends { id: number }>({ table, data, searchFilters, renderRow, clickableRows, clickFunction }: TableProps<T>) => {
    const [search, setSearch] = useState('');

    const filteredSearch = data.filter((item) => {
        if (!searchFilters || searchFilters.length === 0 || !search) return true;

        return searchFilters.some((filter) => {
            const value = item[filter];
            return value?.toString().toLowerCase().includes(search.toLowerCase());
        });
    });

    return (
        <motion.div className="w-full mb-8">
            <div className="bg-neutral-950 border border-neutral-700 p-4 rounded-3xl">
                <div className='flex justify-between items-center mb-4'>
                    <h2 className="text-2xl">{table.title}</h2>
                    <input
                        type="text"
                        placeholder={`Zoek ${table.title.toLowerCase()}...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-1/2 max-w-48 p-2 rounded-lg bg-neutral-800 border border-neutral-600 text-white"
                    />
                </div>
                <div className="max-h-48 rounded-2xl overflow-hidden overflow-y-auto custom-scrollbar">
                    <table className='bg-neutral-900 w-full  max-h-48 '>
                        <thead className='sticky top-0 bg-neutral-900/90 backdrop-blur-xs'>
                            <tr className='bg-neutral-800/50'>
                                {table.columns.map((col, i) => (
                                    <th key={i} className="text-left p-3 border-b border-neutral-700">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSearch.map((item) => (
                                <motion.tr key={item.id} className={`hover:bg-neutral-800/50 ${clickableRows ? 'cursor-pointer' : ''}`}>
                                    {renderRow(item).map((cell, i) => (
                                        <>
                                            {clickableRows ? (
                                                <td key={i} onClick={() => clickFunction && clickFunction(item)} className="p-3 border-b border-neutral-800">{cell}</td>
                                            ) : (
                                                <td key={i} className="p-3 border-b border-neutral-800">{cell}</td>
                                            )}
                                        </>
                                    ))}
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default Table;
