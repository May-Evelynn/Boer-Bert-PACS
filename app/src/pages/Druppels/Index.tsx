import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaCogs } from 'react-icons/fa';

import { User } from '../../types';

import DruppelModal from './components/DruppelModal';

interface DruppelsProps {
  user: User | null;
}

const Druppels: React.FC<DruppelsProps> = ({ user }) => {
  // Dummy data voor personeel en gasten
  const druppels = [
    { id: 1, druppelId: 1, druppelCode: '07235', lastName: 'Papendorp', firstName: 'Jan', affix: '', role: 'Schoonmaker' },
    { id: 2, druppelId: 2, druppelCode: '20159', lastName: 'Hendriks', firstName: 'Piet', affix: '', role: 'Schoonmaker' },
    { id: 3, druppelId: 3, druppelCode: '20160', lastName: 'Vaker', firstName: 'Klaas', affix: '', role: 'Receptionist' },
    { id: 4, druppelId: 4, druppelCode: '20161', lastName: 'Boer', firstName: 'Bert', affix: 'de', role: 'Eigenaar' },
  ];

  const [druppelsSearch, setDruppelsSearch] = useState('');
  const [isDruppelModalOpen, setIsDruppelModalOpen] = useState(false);
  const [selectedDruppel, setSelectedDruppel] = useState<Druppel | null>(null);

  interface Druppel {
    id: number;
    druppelId: number;
    druppelCode: string;
    lastName: string;
    firstName: string;
    affix: string;
    role: string;
  }

  const toggleDruppelModal = (druppel: Druppel) => {
    setSelectedDruppel(druppel);
    setIsDruppelModalOpen(!isDruppelModalOpen);
  };

  const filteredDruppels = druppels.filter((druppel) =>
    druppel.druppelCode.toLowerCase().includes(druppelsSearch.toLowerCase()) ||
    druppel.lastName.toLowerCase().includes(druppelsSearch.toLowerCase()) ||
    druppel.firstName.toLowerCase().includes(druppelsSearch.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  return (
    <>
      {user ? (
        <div className="z-10 bg-neutral-900 w-full p-4 flex flex-col items-center justify-start text-white">
          <motion.div
            className='absolute bottom-16 right-16 -z-10 blur-sm'
            initial={{ opacity: 0, scale: 0.8, translateX: -50, translateY: 10 }}
            animate={{ opacity: 1, scale: 1, translateX: 0, translateY: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FaCogs className="size-96 text-neutral-800 rotate-12" />
          </motion.div>
          <motion.div
            className="w-full p-4 rounded-3xl justify-center items-center flex space-x-4 mb-8 flex-row"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <FaCogs className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-semibold">Druppels</h1>
          </motion.div>
          <motion.section
            className="flex flex-col w-full gap-8 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Druppels */}
            <motion.div
              className="w-full mb-8"
              variants={itemVariants}
            >
              <div className="bg-neutral-950 border border-neutral-700 p-4 rounded-3xl">
                <div className='flex justify-between items-center mb-4'>
                  <h2 className="text-2xl">Druppels</h2>
                  {/* Zoekbalk */}
                  <input
                    type="text"
                    placeholder="Zoek druppels..."
                    value={druppelsSearch}
                    onChange={(e) => setDruppelsSearch(e.target.value)}
                    className="p-2 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className='bg-neutral-900 rounded-2xl overflow-hidden'>
                  <table className="w-full table-auto">
                    <thead>
                      <tr className='bg-neutral-800/50'>
                        <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">ID</th>
                        <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Druppel Code</th>
                        <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Achternaam</th>
                        <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Tussenvoegsel</th>
                        <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Voornaam</th>

                      </tr>
                    </thead>
                    <tbody>
                      {filteredDruppels.map((druppel, index) => {
                        return (
                          <motion.tr
                            key={druppel.id}
                            className="hover:bg-neutral-800/50 transition-colors hover:cursor-pointer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                            onClick={() => toggleDruppelModal(druppel)}
                          >
                            <td className="p-3 border-b border-neutral-800 text-neutral-300">{druppel.druppelId}</td>
                            <td className="p-3 border-b border-neutral-800 text-neutral-300">{druppel.druppelCode}</td>
                            <td className="p-3 border-b border-neutral-800 text-neutral-300">{druppel.lastName}</td>
                            <td className="p-3 border-b border-neutral-800 text-neutral-300">{druppel.affix || '-'}</td>
                            <td className="p-3 border-b border-neutral-800 text-neutral-300">{druppel.firstName}</td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.section>
          {isDruppelModalOpen && (
            <DruppelModal
              isDruppelModalOpen={isDruppelModalOpen}
              setIsDruppelModalOpen={setIsDruppelModalOpen}
              druppel={selectedDruppel!}
            />
          )}
        </div>
      ) : (
        <motion.div
          className="z-10 bg-neutral-900 min-h-screen w-full p-4 flex flex-col items-center justify-center text-white h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl mb-4">Toegang Geweigerd</h1>
          <p className="text-neutral-400 mb-2">Je moet ingelogd zijn om de druppels te bekijken.</p>
        </motion.div>
      )}
    </>
  )
}

export default Druppels;
