import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaPerson } from 'react-icons/fa6';

const Personen: React.FC = () => {
  // Dummy data voor personeel en gasten
  const personeel = [
    { id: 1, lastName: 'Papendorp', firstName: 'Jan', affix: '', role: 'Schoonmaker' },
    { id: 2, lastName: 'Hendriks', firstName: 'Piet', affix: '', role: 'Schoonmaker' },
    { id: 3, lastName: 'Vaker', firstName: 'Klaas', affix: '', role: 'Receptionist' },
    { id: 4, lastName: 'Boer Bert', firstName: 'Bert', affix: '', role: 'Eigenaar' },
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

  return (
    <div className="z-10 bg-neutral-900 min-h-screen w-full p-4 flex flex-col items-center justify-start text-white">
      <motion.div
        className='absolute bottom-16 right-16 -z-10 blur-sm'
        initial={{ opacity: 0, scale: 0.8, translateX: -50, translateY: 10 }}
        animate={{ opacity: 1, scale: 1, translateX: 0, translateY: 0 }}
        transition={{ duration: 0.8 }}
      >
        <FaPerson className="size-96 text-neutral-800 rotate-12" />
      </motion.div>
      <div className="w-full bg-neutral-800 p-2 rounded-xl justify-center items-center flex space-x-4 mb-8 flex-row">
        <FaPerson className="w-8 h-8" />
        <h1 className="text-4xl">Personen</h1>
      </div>

      {/* Personeel */}
      <section className="w-full mb-8">
        <div className="bg-neutral-800 p-4 rounded-xl">
          <div className='flex justify-between items-center'>
            <h2 className="text-2xl mb-4">Personeel</h2>
            {/* Zoekbalk */}
            <input
              type="text"
              placeholder="Zoek personeel..."
              value={personeelSearch}
              onChange={(e) => setPersoneelSearch(e.target.value)}
              className="p-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left p-2 border-b border-neutral-600">Achternaam</th>
                <th className="text-left p-2 border-b border-neutral-600">Voornaam</th>
                <th className="text-left p-2 border-b border-neutral-600">Tussenvoegsel</th>
                <th className="text-left p-2 border-b border-neutral-600">Rol</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersoneel.map((persoon) => (
                <tr key={persoon.id} className="hover:bg-neutral-700">
                  <td className="p-2 border-b border-neutral-600">{persoon.lastName}</td>
                  <td className="p-2 border-b border-neutral-600">{persoon.firstName}</td>
                  <td className="p-2 border-b border-neutral-600">{persoon.affix || '-'}</td>
                  <td className="p-2 border-b border-neutral-600">{persoon.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Gasten */}
      <section className="w-full">
        <div className="bg-neutral-800 p-4 rounded-xl">
          <div className='flex justify-between items-center'>
            <h2 className="text-2xl mb-4">Gasten</h2>
            {/* Zoekbalk */}
            <input
              type="text"
              placeholder="Zoek gasten..."
              value={gastenSearch}
              onChange={(e) => setGastenSearch(e.target.value)}
              className="p-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left p-2 border-b border-neutral-600">Achternaam</th>
                <th className="text-left p-2 border-b border-neutral-600">Voornaam</th>
                <th className="text-left p-2 border-b border-neutral-600">Tussenvoegsel</th>
                <th className="text-left p-2 border-b border-neutral-600">Tag ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredGasten.map((gast) => (
                <tr key={gast.id} className="hover:bg-neutral-700">
                  <td className="p-2 border-b border-neutral-600">{gast.lastName}</td>
                  <td className="p-2 border-b border-neutral-600">{gast.firstName}</td>
                  <td className="p-2 border-b border-neutral-600">{gast.affix || '-'}</td>
                  <td className="p-2 border-b border-neutral-600">{gast.tagId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Personen;
