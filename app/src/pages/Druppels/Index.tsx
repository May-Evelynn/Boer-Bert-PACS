import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaCogs, FaPlus } from 'react-icons/fa';

import { User, Keyfob } from '../../types';
import { druppelService } from '../../services/druppelService';

import Table from '../../components/Table';
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
  firstName?: string;
  lastName?: string;
  affix?: string;
  role?: string;
}

const Druppels: React.FC<DruppelsProps> = ({ user }) => {
  const [keyfobs, setKeyfobs] = useState<Keyfob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDruppelModalOpen, setIsDruppelModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDruppel, setSelectedDruppel] = useState<DruppelDisplay | null>(null);

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
    firstName: keyfob.firstName,
    lastName: keyfob.lastName,
    affix: keyfob.affix,
    role: keyfob.role,
  }));

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
            <Table
              table={{
                title: 'Druppels',
                columns: ['ID', 'Druppel Code', 'Gekoppelde Gebruikers ID', 'Buitengebruik'],
              }}
              data={druppels}
              searchFilters={['druppelCode']}
              sortableColumns={[0, 1, 2]}
              columnFilters={[
                {
                  column: 'buitengebruik',
                  label: 'Buiten Gebruik',
                  options: ['Ja', 'Nee'],
                  valueFormatter: (value) => value ? 'Ja' : 'Nee'
                }
              ]}
              renderRow={(druppel) => [
                druppel.druppelId,
                druppel.druppelCode,
                druppel.attached_user_id,
                druppel.buitengebruik ? 'Ja' : 'Nee',
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
          {isDruppelModalOpen && (
            <DruppelModal
              isDruppelModalOpen={isDruppelModalOpen}
              setIsDruppelModalOpen={setIsDruppelModalOpen}
              druppel={selectedDruppel!}
              onUpdate={refreshKeyfobs}
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
