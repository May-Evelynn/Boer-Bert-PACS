import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaPerson } from 'react-icons/fa6';

interface PersonenProps {
  isLoggedIn: boolean;
}

const Personen: React.FC<PersonenProps> = ({ isLoggedIn }) => {
  // Dummy data voor personeel en gasten
  const personeel = [
    { id: 1, lastName: 'Papendorp', firstName: 'Jan', affix: '', role: 'Schoonmaker' },
    { id: 2, lastName: 'Hendriks', firstName: 'Piet', affix: '', role: 'Schoonmaker' },
    { id: 3, lastName: 'Vaker', firstName: 'Klaas', affix: '', role: 'Receptionist' },
    { id: 4, lastName: 'Boer', firstName: 'Bert', affix: 'de', role: 'Eigenaar' },
  ];

  const gasten = [
    { id: 1, lastName: 'Hendriks', firstName: 'Frank', affix: 'de', tagId: '07235' },
    { id: 2, lastName: 'Visser', firstName: 'Bram', affix: '', tagId: '02645' },
    { id: 3, lastName: 'Jansen', firstName: 'Ciska', affix: '', tagId: '07294' },
  ];

  const [personeelSearch, setPersoneelSearch] = useState('');
  const [gastenSearch, setGastenSearch] = useState('');

  const filteredPersoneel = personeel.filter((persoon) =>
    persoon.lastName.toLowerCase().includes(personeelSearch.toLowerCase()) ||
    persoon.role.toLowerCase().includes(personeelSearch.toLowerCase())
  );

  const filteredGasten = gasten.filter((gast) =>
    gast.lastName.toLowerCase().includes(gastenSearch.toLowerCase()) ||
    gast.tagId.toLowerCase().includes(gastenSearch.toLowerCase())
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
      { isLoggedIn ? (
        <div className="z-10 bg-neutral-900 min-h-screen w-full p-4 flex flex-col items-center justify-start text-white h-screen overflow-auto">
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
            <h1 className="text-4xl font-semibold">Personen</h1>
          </motion.div>
          <motion.section
            className="flex flex-col w-full gap-8 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Personeel */}
            <motion.div
              className="w-full mb-8"
              variants={itemVariants}
            >
              <div className="bg-neutral-950 border border-neutral-700 p-4 rounded-3xl">
                <div className='flex justify-between items-center mb-4'>
                  <h2 className="text-2xl">Personeel</h2>
                  {/* Zoekbalk */}
                  <input
                    type="text"
                    placeholder="Zoek personeel..."
                    value={personeelSearch}
                    onChange={(e) => setPersoneelSearch(e.target.value)}
                    className="p-2 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className='bg-neutral-900 rounded-2xl overflow-hidden'>
                  <table className="w-full table-auto">
                    <thead>
                      <tr className='bg-neutral-800/50'>
                        <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Achternaam</th>
                        <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Voornaam</th>
                        <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Tussenvoegsel</th>
                        <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPersoneel.map((persoon, index) => (
                        <motion.tr
                          key={persoon.id}
                          className="hover:bg-neutral-800/50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                        >
                          <td className="p-3 border-b border-neutral-800 text-neutral-300">{persoon.lastName}</td>
                          <td className="p-3 border-b border-neutral-800 text-neutral-300">{persoon.firstName}</td>
                          <td className="p-3 border-b border-neutral-800 text-neutral-300">{persoon.affix || '-'}</td>
                          <td className="p-3 border-b border-neutral-800 text-neutral-300">{persoon.role}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Gasten */}
            <motion.div
              className="w-full"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-neutral-950 border border-neutral-700 p-4 rounded-3xl">
                <div className='flex justify-between items-center mb-4'>
                  <h2 className="text-2xl mb-4">Gasten</h2>
                  {/* Zoekbalk */}
                  <input
                    type="text"
                    placeholder="Zoek gasten..."
                    value={gastenSearch}
                    onChange={(e) => setGastenSearch(e.target.value)}
                    className="p-2 rounded-lg bg-neutral-800 border border-neutral-600 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className='bg-neutral-900 rounded-2xl overflow-hidden'>
                  <table className="w-full table-auto">
                    <thead>
                      <tr className='bg-neutral-800/50'>
                        <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Achternaam</th>
                        <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Voornaam</th>
                        <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Tussenvoegsel</th>
                        <th className="text-left p-3 border-b border-neutral-700 text-neutral-400 font-medium text-sm uppercase tracking-wide">Tag ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGasten.map((gast, index) => (
                        <motion.tr
                          key={gast.id}
                          className="hover:bg-neutral-800/50 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                        >
                          <td className="p-3 border-b border-neutral-800 text-neutral-300">{gast.lastName}</td>
                          <td className="p-3 border-b border-neutral-800 text-neutral-300">{gast.firstName}</td>
                          <td className="p-3 border-b border-neutral-800 text-neutral-300">{gast.affix || '-'}</td>
                          <td className="p-3 border-b border-neutral-800 text-neutral-300">{gast.tagId}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
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
          <p className="text-neutral-400 mb-2">Je moet ingelogd zijn om de druppels te bekijken.</p>
        </motion.div>
      )}
    </>
  );
}

export default Personen;
