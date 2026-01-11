import { motion } from 'framer-motion';
import { FaPerson } from 'react-icons/fa6';

import Table from '../../components/Table';

import { User } from '../../types';

interface PersonenProps {
  user: User | null;
}

const Personen: React.FC<PersonenProps> = ({ user }) => {
  // Dummy data voor gasten
  const gasten = [
    { id: 1, last_name: 'Hendriks', first_name: 'Frank', affix: 'de', tag_id: '07235' },
    { id: 2, last_name: 'Visser', first_name: 'Bram', affix: '', tag_id: '02645' },
    { id: 3, last_name: 'Jansen', first_name: 'Ciska', affix: '', tag_id: '07294' },
    { id: 4, last_name: 'Bakker', first_name: 'Daan', affix: '', tag_id: '08321' },
    { id: 5, last_name: 'Smit', first_name: 'Eva', affix: '', tag_id: '09432' },
    { id: 6, last_name: 'Meijer', first_name: 'Fleur', affix: '', tag_id: '01234' },
    { id: 7, last_name: 'de Vries', first_name: 'Gert', affix: 'de', tag_id: '04567' },
    { id: 8, last_name: 'Mulder', first_name: 'Hanneke', affix: '', tag_id: '07890' },
    { id: 9, last_name: 'Bos', first_name: 'Iris', affix: '', tag_id: '03456' },
    { id: 10, last_name: 'Kramer', first_name: 'Jeroen', affix: '', tag_id: '06789' },
    { id: 11, last_name: 'Dekker', first_name: 'Kim', affix: '', tag_id: '09876' },
    { id: 12, last_name: 'Willems', first_name: 'Lars', affix: '', tag_id: '02345' }
  ];

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
            className="w-full p-4 rounded-3xl justify-center items-center flex space-x-4 mb-8 flex-row"
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
                columns: ['Achternaam', 'Voornaam', 'Tussenvoegsel', 'Tag ID'],
              }}
              data={gasten}
              searchFilters={['last_name', 'first_name', 'tag_id']}
              renderRow={(item) => [
                item.last_name,
                item.first_name,
                item.affix || '-',
                <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                  {item.tag_id}
                </span>,
              ]}
              emptyMessage="Geen gasten gevonden."
              variants={itemVariants}
            />
          </motion.section>
        </div>
      ) : (
        <motion.div
          className="z-10 bg-neutral-900 min-h-screen w-full p-4 flex flex-col items-center justify-center text-white h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl mb-4">Toegang Geweigerd</h1>
          <p className="text-neutral-400 mb-2">Je moet ingelogd zijn om de personen te bekijken.</p>
        </motion.div>
      )}
    </>
  );
}

export default Personen;
