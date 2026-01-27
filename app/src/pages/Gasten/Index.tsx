import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaPerson } from 'react-icons/fa6';
import { FaPlus, FaTag, FaTrash } from 'react-icons/fa';

import Table from '../../components/Table';
import { guestService, Guest } from '../../services/guestService';
import { druppelService } from '../../services/druppelService';
import { DataContext, DataContextType, Keyfob } from '../../types';

import CreateGuestModal from './components/CreateGuestModal';
import EditGuestModal from './components/EditGuestModal';
import TagAssignModal from './components/TagAssignModal';
import { FaEdit } from 'react-icons/fa';

const Gasten: React.FC = () => {
  const { keyfobs, setKeyfobs } = useContext<DataContextType>(DataContext);
  const [gasten, setGasten] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [guests, keyfobData] = await Promise.all([
        guestService.getGuests(),
        druppelService.getKeyfobs()
      ]);
      setGasten(guests);
      setKeyfobs(keyfobData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Kon gasten niet laden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTagClick = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsTagModalOpen(true);
  };

  const handleDelete = async (guest: Guest) => {
    setGuestToDelete(guest);
  };

  const confirmDelete = async () => {
    if (!guestToDelete) return;
    try {
      const guestKeyfobs = getGuestKeyfobs(guestToDelete.user_id);
      for (const keyfob of guestKeyfobs) {
        await druppelService.detachUserFromKeyfob({ keyfobId: keyfob.keyfob_id });
      }
      await guestService.deleteGuest(guestToDelete.user_id);
      setGuestToDelete(null);
      await fetchData();
    } catch (err) {
      console.error('Failed to delete guest:', err);
      setGuestToDelete(null);
    }
  };

  const getGuestKeyfobs = (userId: number): Keyfob[] => {
    return keyfobs.filter(k => k.attached_user_id === userId);
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

  const formatName = (guest: Guest) => {
    const parts = [guest.first_name];
    if (guest.affix) parts.push(guest.affix);
    if (guest.last_name) parts.push(guest.last_name);
    return parts.join(' ');
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
          <FaPerson className="size-96 text-neutral-800 rotate-12" />
        </motion.div>
        <motion.div
          className="w-full p-4 rounded-3xl justify-start items-center flex space-x-4 mb-8 flex-row"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <FaPerson className="w-8 h-8 text-emerald-400" />
          <h1 className="text-4xl font-semibold">Gasten</h1>
        </motion.div>
        <motion.section
          className="flex flex-col w-full gap-8 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Table
            table={{
              title: 'Gasten',
              columns: ['Naam', 'Tags', 'Acties'],
            }}
            data={gasten}
            searchFilters={['first_name', 'last_name']}
            sortableColumns={[0]}
            renderRow={(guest) => {
              const guestKeyfobs = getGuestKeyfobs(guest.user_id);
              return [
                formatName(guest),
                <div className="flex items-center gap-1 flex-wrap">
                  {guestKeyfobs.length > 0 ? (
                    <>
                      {guestKeyfobs.map(keyfob => (
                        <span key={keyfob.keyfob_id} className="font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded flex items-center gap-1 text-sm">
                          <FaTag className="w-2.5 h-2.5" />
                          #{keyfob.keyfob_id}
                        </span>
                      ))}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTagClick(guest);
                        }}
                        className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        title="Tags beheren"
                      >
                        <FaTag className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTagClick(guest);
                      }}
                      className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 hover:bg-amber-500/30 transition-colors text-sm flex items-center gap-1"
                    >
                      <FaTag className="w-3 h-3" />
                      Koppelen
                    </button>
                  )}
                </div>,
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGuest(guest);
                      setIsEditModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    title="Bewerken"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(guest);
                    }}
                    className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 transition-colors"
                    title="Verwijderen"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>,
              ];
            }}
            loading={loading}
            error={error}
            emptyMessage="Geen gasten gevonden."
            actionButton={{
              label: 'Nieuwe Gast',
              icon: <FaPlus />,
              onClick: () => setIsCreateModalOpen(true),
            }}
            clickableRows={true}
            clickFunction={(guest) => {
              setSelectedGuest(guest);
              setIsEditModalOpen(true);
            }}
            variants={itemVariants}
          />
        </motion.section>
      </div>

      {isCreateModalOpen && (
        <CreateGuestModal
          isOpen={isCreateModalOpen}
          setIsOpen={setIsCreateModalOpen}
          onSuccess={fetchData}
        />
      )}

      {isEditModalOpen && selectedGuest && (
        <EditGuestModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          onSuccess={fetchData}
          guest={selectedGuest}
        />
      )}

      {isTagModalOpen && selectedGuest && (
        <TagAssignModal
          isOpen={isTagModalOpen}
          setIsOpen={setIsTagModalOpen}
          guest={selectedGuest}
          availableKeyfobs={keyfobs.filter(k => !k.attached_user_id && !k.buitengebruik)}
          linkedKeyfobs={getGuestKeyfobs(selectedGuest.user_id)}
          onSuccess={fetchData}
        />
      )}

      {guestToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setGuestToDelete(null)}
          />
          <motion.div
            className="relative w-96 p-6 bg-neutral-950 border border-neutral-700 rounded-3xl shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">Gast verwijderen</h2>
            <p className="text-neutral-400 mb-6">
              Weet je zeker dat je "{guestToDelete.first_name} {guestToDelete.last_name}" wilt verwijderen?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setGuestToDelete(null)}
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
      )}
    </>
  );
}

export default Gasten;
