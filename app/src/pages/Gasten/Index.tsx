import { motion } from 'framer-motion';
import { FaPerson } from 'react-icons/fa6';

import Table from '../../components/Table';

interface PersonenProps {
  isLoggedIn: boolean;
}

const Personen: React.FC<PersonenProps> = ({ isLoggedIn }) => {
  // Dummy data voor gasten
  const gasten = [
    { id: 1, lastName: 'Hendriks', firstName: 'Frank', affix: 'de', tagId: '07235' },
    { id: 2, lastName: 'Visser', firstName: 'Bram', affix: '', tagId: '02645' },
    { id: 3, lastName: 'Jansen', firstName: 'Ciska', affix: '', tagId: '07294' },
    { id: 4, lastName: 'Bakker', firstName: 'Daan', affix: '', tagId: '08321' },
    { id: 5, lastName: 'Smit', firstName: 'Eva', affix: '', tagId: '09432' },
    { id: 6, lastName: 'Meijer', firstName: 'Fleur', affix: '', tagId: '01234' },
    { id: 7, lastName: 'de Vries', firstName: 'Gert', affix: 'de', tagId: '04567' },
    { id: 8, lastName: 'Mulder', firstName: 'Hanneke', affix: '', tagId: '07890' },
    { id: 9, lastName: 'Bos', firstName: 'Iris', affix: '', tagId: '03456' },
    { id: 10, lastName: 'Kramer', firstName: 'Jeroen', affix: '', tagId: '06789' },
    { id: 11, lastName: 'Dekker', firstName: 'Kim', affix: '', tagId: '09876' },
    { id: 12, lastName: 'Willems', firstName: 'Lars', affix: '', tagId: '02345' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      {isLoggedIn ? (
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
              searchFilters={['lastName', 'firstName', 'tagId']}
              renderRow={(item) => [
                item.lastName,
                item.firstName,
                item.affix || '-',
                item.tagId,
              ]}
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
