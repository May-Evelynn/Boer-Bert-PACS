import { motion } from 'framer-motion';
import { BsFillGrid1X2Fill } from "react-icons/bs";
import LaatsteScans from './components/LaatsteScans';
import Weer from './components/Weer';
import Wasruimte from './components/Wasruimte';

interface DashboardProps {
    isLoggedIn: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isLoggedIn }) => {

  const scans = [
    { id: 1, location: 'Zwembad', time: '12:30 PM', tagId: '07235' },
    { id: 2, location: 'Sauna', time: '12:15 PM', tagId: '02645' },
    { id: 3, location: 'Vlindertuin', time: '11:00 AM', tagId: '07294' },
  ];

  const wasruimte = [
    { id: 1, machine: 'Wasmachine 1', status: 'Bezet', tagId: '07235', timeRemaining: '15:11' },
    { id: 2, machine: 'Wasmachine 2', status: 'Vrij', tagId: '', timeRemaining: '' },
    { id: 3, machine: 'Wasmachine 3', status: 'Vrij', tagId: '', timeRemaining: '' },
    { id: 4, machine: 'Droger 1', status: 'Vrij', tagId: '', timeRemaining: '' },
    { id: 5, machine: 'Droger 2', status: 'Bezet', tagId: '07294', timeRemaining: '32:03' },
    { id: 6, machine: 'Droger 3', status: 'Vrij', tagId: '', timeRemaining: '' },
  ]

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
    <div className="z-10 bg-neutral-900 min-h-screen w-full h-screen p-4 flex flex-col items-center justify-start text-white">
      <motion.div 
        className='absolute bottom-16 right-16 -z-10 blur-sm'
        initial={{ opacity: 0, scale: 0.8, translateX: -50, translateY: 10 }}
        animate={{ opacity: 1, scale: 1, translateX: 0, translateY: 0 }}
        transition={{ duration: 0.8 }}
      >
        <BsFillGrid1X2Fill className="size-96 text-neutral-800 rotate-12" />
      </motion.div>
      <motion.div 
        className="w-full p-4 rounded-3xl justify-center items-center flex space-x-4 mb-8 flex-row"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <BsFillGrid1X2Fill className="w-8 h-8 text-emerald-400" />
        <h1 className="text-4xl font-semibold">Dashboard</h1>
      </motion.div>
      <motion.section 
        className="grid *:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <LaatsteScans scans={scans} variants={itemVariants} isLoggedIn={isLoggedIn} />

        <Weer variants={itemVariants} />

        <Wasruimte wasruimte={wasruimte} variants={itemVariants} isLoggedIn={isLoggedIn} />

      </motion.section>
    </div>
  );
}

export default Dashboard;
