import { motion } from 'framer-motion';
import { useState, useEffect, useContext } from 'react';
import { FaCogs, FaPlus } from 'react-icons/fa';

import { DataContext, DataContextType } from '../../types';
import { druppelService } from '../../services/druppelService';
import { guestService, Guest } from '../../services/guestService';

import Table from '../../components/Table';
import DruppelModal from './components/DruppelModal';
import CreateDruppelModal from './components/CreateDruppelModal';

interface DruppelDisplay {
  id: number;
  druppelId: number;
  druppelCode: string;
  attached_user_id: number;
  buitengebruik: boolean;
  firstName?: string;
  lastName?: string;
  affix?: string;
  role?: string;
}

const Druppels: React.FC = () => {
  const { user, keyfobs, setKeyfobs } = useContext<DataContextType>(DataContext);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDruppelModalOpen, setIsDruppelModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDruppel, setSelectedDruppel] = useState<DruppelDisplay | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const [keyfobData, guestData] = await Promise.all([
          druppelService.getKeyfobs(),
          guestService.getGuests()
        ]);
        setKeyfobs(keyfobData);
        setGuests(guestData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Kon druppels niet laden');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, setKeyfobs]);

  const druppels: DruppelDisplay[] = keyfobs.map((keyfob) => ({
    id: keyfob.keyfob_id,
    druppelId: keyfob.keyfob_id,
    druppelCode: String(keyfob.keyfob_key).padStart(5, '0'),
    attached_user_id: keyfob.attached_user_id || 0,
    buitengebruik: keyfob.buitengebruik,
    firstName: keyfob.firstName,
    lastName: keyfob.lastName,
    affix: keyfob.affix,
    role: keyfob.role,
  }));

  const toggleDruppelModal = (druppel: DruppelDisplay) => {
    setSelectedDruppel(druppel);
    setIsDruppelModalOpen(!isDruppelModalOpen);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [keyfobData, guestData] = await Promise.all([
        druppelService.getKeyfobs(),
        guestService.getGuests()
      ]);
      setKeyfobs(keyfobData);
      setGuests(guestData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Kon druppels niet laden');
    } finally {
      setLoading(false);
    }
  };

  const getLinkedUserName = (druppel: DruppelDisplay): string => {
    if (!druppel.attached_user_id) return '-';
    // First check if the keyfob has name info (staff user)
    if (druppel.firstName || druppel.lastName) {
      const parts = [druppel.firstName];
      if (druppel.affix) parts.push(druppel.affix);
      if (druppel.lastName) parts.push(druppel.lastName);
      return parts.filter(Boolean).join(' ');
    }
    // Check guests
    const guest = guests.find(g => g.user_id === druppel.attached_user_id);
    if (guest) {
      const parts = [guest.first_name];
      if (guest.affix) parts.push(guest.affix);
      if (guest.last_name) parts.push(guest.last_name);
      return parts.filter(Boolean).join(' ');
    }
    // Fallback to ID
    return `User #${druppel.attached_user_id}`;
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

  return (
    <>
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
          <Table
            table={{
              title: 'Druppels',
              columns: ['ID', 'Druppel Code', 'Gekoppelde Gast', 'In Gebruik'],
            }}
            data={druppels}
            searchFilters={['druppelCode']}
            sortableColumns={[0, 1, 2]}
            columnFilters={[
              {
                column: 'buitengebruik',
                label: 'In Gebruik',
                options: ['Ja', 'Nee'],
                valueFormatter: (value) => value ? 'Ja' : 'Nee'
              }
            ]}
            renderRow={(druppel) => [
              druppel.druppelId,
              druppel.druppelCode,
              getLinkedUserName(druppel),
              druppel.buitengebruik ? 'Nee' : 'Ja',
            ]}
            clickableRows={true}
            clickFunction={toggleDruppelModal}
            loading={loading}
            error={error}
            emptyMessage="Geen druppels gevonden."
            actionButton={{
              label: 'Nieuwe Druppel',
              icon: <FaPlus />,
              onClick: () => setIsCreateModalOpen(true),
            }}
            variants={itemVariants}
          />
        </motion.section>
      </div>
      {isDruppelModalOpen && (
        <DruppelModal
          isDruppelModalOpen={isDruppelModalOpen}
          setIsDruppelModalOpen={setIsDruppelModalOpen}
          druppel={selectedDruppel!}
          onUpdate={refreshData}
        />
      )}
      <CreateDruppelModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        onSuccess={refreshData}
      />
    </>
  )
}

export default Druppels;
