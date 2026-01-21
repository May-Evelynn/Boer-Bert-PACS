import { motion } from 'framer-motion';
import { useEffect, useState, useContext } from 'react';
import { BsFillGrid1X2Fill } from "react-icons/bs";
import LaatsteScans from './components/LaatsteScans';
import Weer from './components/Weer';
import Faciliteiten from './components/Faciliteiten';
import ScanGrafiek from './components/ScanGrafiek';
import { scanService } from '../../services/scanService';
import { facilityService } from '../../services/facilityService';

import { DataContext, DataContextType } from '../../types';

const Dashboard: React.FC = () => {
  const { user, scans, setScans, facilities, setFacilities } = useContext<DataContextType>(DataContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const [scansData, facilitiesData] = await Promise.all([
          scanService.getScans(),
          facilityService.getFacilities()
        ]);
        setScans(scansData);
        setFacilities(facilitiesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, setScans, setFacilities]);

  const displayScans = scans.slice(0, 4).map((scan) => {
    const facility = facilities.find(f => f.facilities_id === scan.facility_id);
    return {
      id: scan.id,
      location: facility?.facility_type || `Facility ${scan.facility_id}`,
      time: new Date((scan.timestamp * 1000)).toLocaleString('nl-NL', { year: 'numeric', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      tagId: String(scan.keyfob_id).padStart(5, '0')
    };
  });

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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8 items-start"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <LaatsteScans scans={displayScans} variants={itemVariants} loading={loading} />

        <ScanGrafiek scans={scans} facilities={facilities} variants={itemVariants} loading={loading} />

        <Weer variants={itemVariants} />

        <Faciliteiten facilities={facilities} variants={itemVariants} loading={loading} />
      </motion.section>
    </div>
  );
}

export default Dashboard;
