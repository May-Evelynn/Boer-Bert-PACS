import { motion } from 'framer-motion';
import { FaCogs } from 'react-icons/fa';

const Druppels: React.FC = () => {

  return (
    <div className="z-10 bg-neutral-900 min-h-screen w-full p-4 flex flex-col items-center justify-start text-white">
      <motion.div 
        className='absolute bottom-16 right-16 -z-10 blur-sm'
        initial={{ opacity: 0, scale: 0.8, translateX: -50, translateY: 10 }}
        animate={{ opacity: 1, scale: 1, translateX: 0, translateY: 0 }}
        transition={{ duration: 0.8 }}
      >
        <FaCogs className="size-96 text-neutral-800 rotate-12" />
      </motion.div>
      <div className="w-full bg-neutral-800 p-2 rounded-xl justify-center items-center flex space-x-4 mb-8 flex-row">
        <img
          src="/tauri.svg"
          alt="Boer Bert Logo"
          className="w-8 h-8"
        />
        <h1 className="text-4xl">Druppels</h1>
      </div>
      <p>Log in om te beginnen</p>
    </div>
  );
}

export default Druppels;
