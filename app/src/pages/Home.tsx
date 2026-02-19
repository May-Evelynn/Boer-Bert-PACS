import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaHome, FaUser } from "react-icons/fa";
import { MdLogin } from "react-icons/md";

import { DataContext, DataContextType } from '../types';

const Home: React.FC = () => {
  const { user } = useContext<DataContextType>(DataContext);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };


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

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Eigenaar': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'Manager': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Receptionist': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Schoonmaker': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };
    return colors[role] || 'bg-neutral-600/20 text-neutral-400 border-neutral-500/30';
  };

  return (
    <div className="z-10 bg-neutral-900 min-h-screen w-full p-4 flex flex-col items-center justify-start text-white">
      <motion.div
        className='absolute bottom-16 right-16 -z-10 blur-sm'
        initial={{ opacity: 0, scale: 0.8, translateX: -50, translateY: 10 }}
        animate={{ opacity: 1, scale: 1, translateX: 0, translateY: 0 }}
        transition={{ duration: 0.8 }}
      >
        <FaHome className="size-96 text-neutral-800 rotate-12" />
      </motion.div>

      <motion.div
        className="w-full p-4 rounded-3xl justify-center items-center flex space-x-4 mb-8 flex-row"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <FaHome className="w-8 h-8 text-emerald-400" />
        <h1 className="text-4xl font-semibold">Home</h1>
      </motion.div>

      {user ? (
        <motion.div
          className="w-full max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-neutral-950 border border-neutral-700 p-6 rounded-t-3xl"
            variants={itemVariants}
          >
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-full p-4">
                <FaUser className="size-8 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">
                  Welkom terug, {user.first_name}!
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className="text-neutral-400">@{user.username}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-neutral-950 border border-neutral-700 p-6 rounded-b-3xl"
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <span className="text-lg capitalize">{formatDate(currentTime)}</span>
              <span className="text-2xl font-mono">{formatTime(currentTime)}</span>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-neutral-950 border border-neutral-700 p-8 rounded-3xl text-center">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-full p-4 w-fit mx-auto mb-6">
              <MdLogin className="size-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Welkom bij Boer DashBert</h2>
            <p className="text-neutral-400 mb-6">
              Log in via de zijbalk om toegang te krijgen tot het systeem.
            </p>
            <div className="flex items-center justify-center gap-2 text-neutral-500">
              <span className="capitalize">{formatDate(currentTime)}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Home;
