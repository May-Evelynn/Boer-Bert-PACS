import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaCogs, FaSpinner, FaPlus } from 'react-icons/fa';

import { User, Keyfob } from '../../types';
import { druppelService } from '../../services/druppelService';

import DruppelModal from './components/DruppelModal';
import CreateDruppelModal from './components/CreateDruppelModal';

interface DruppelsProps {
  user: User | null;
}

interface DruppelDisplay {
  id: number;
  druppelId: number;
  druppelCode: string;
  attached_user_id: number;
  buitengebruik: boolean;
}

const Druppels: React.FC<DruppelsProps> = ({ user }) => {
  const [keyfobs, setKeyfobs] = useState<Keyfob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKeyfobs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await druppelService.getKeyfobs();
        setKeyfobs(data);
      } catch (err) {
        console.error('Failed to fetch keyfobs:', err);
        setError('Kon druppels niet laden');
      } finally {
        setLoading(false);
      }
    };

    fetchKeyfobs();
  }, [user]);

  // Transform keyfobs to display format
  const druppels: DruppelDisplay[] = keyfobs.map((keyfob) => ({
    id: keyfob.keyfob_id,
    druppelId: keyfob.keyfob_id,
    druppelCode: String(keyfob.keyfob_key).padStart(5, '0'),
    attached_user_id: keyfob.attached_user_id || 0,
    buitengebruik: keyfob.buitengebruik,
  }));

  const [druppelsSearch, setDruppelsSearch] = useState('');
  const [isDruppelModalOpen, setIsDruppelModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDruppel, setSelectedDruppel] = useState<DruppelDisplay | null>(null);

  const toggleDruppelModal = (druppel: DruppelDisplay) => {
    setSelectedDruppel(druppel);
    setIsDruppelModalOpen(!isDruppelModalOpen);
  };

  const refreshKeyfobs = async () => {
    setLoading(true);
    try {
      const data = await druppelService.getKeyfobs();
      setKeyfobs(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch keyfobs:', err);
      setError('Kon druppels niet laden');
    } finally {
      setLoading(false);
    }
  };

  const filteredDruppels = druppels.filter((druppel) =>
    druppel.druppelCode.toLowerCase().includes(druppelsSearch.toLowerCase())
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
                  <div className="flex items-center gap-4">
                    {/* Zoekbalk */}
                    <input
                      type="text"
                      placeholder="Zoek druppels..."
                      value={druppelsSearch}
                      onChange={(e) => setDruppelsSearch(e.target.value)}
                      className="p-2 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:outline-none focus:border-blue-500"
                    />
                    {/* Nieuwe druppel knop */}
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors"
                    >
                      <FaPlus />
                      Nieuwe Druppel
                    </button>
                  </div>
                </div>
                <div className='bg-neutral-900 rounded-2xl overflow-hidden'>
                  {loading ? (
                    <div className="p-6 text-center">
                      <FaSpinner className="mx-auto mb-4 size-12 text-neutral-500 animate-spin" />
                      <p className="text-neutral-400">Laden...</p>
                    </div>
                  ) : error ? (
                    <div className="p-6 text-center">
                      <p className="text-red-400">{error}</p>
                    </div>
                  ) : filteredDruppels.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-neutral-400">Geen druppels gevonden.</p>
                    </div>
                  ) : (
                    <table className="w-full table-auto">
                      <thead>
                        <tr className='bg-neutral-800/50'>
                          <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">ID</th>
                          <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Druppel Code</th>
                          <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Gekoppelde Gebruikers ID</th>
                          <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Buitengebruik</th>
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
                              <td className="p-3 border-b border-neutral-800 text-neutral-300">{druppel.attached_user_id}</td>
                              <td className="p-3 border-b border-neutral-800 text-neutral-300">{druppel.buitengebruik ? 'Ja' : 'Nee'}</td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
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
          <CreateDruppelModal
            isOpen={isCreateModalOpen}
            setIsOpen={setIsCreateModalOpen}
            onSuccess={refreshKeyfobs}
          />
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
