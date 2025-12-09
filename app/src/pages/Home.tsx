import { motion } from "framer-motion";
import { SiTauri } from "react-icons/si";

interface HomeProps {
  isLoggedIn: boolean;
}

const Home: React.FC<HomeProps> = ({ isLoggedIn }) => {

  return (
    <div className="z-10 bg-neutral-900 min-h-screen w-full p-4 flex flex-col items-center justify-start text-white">
      <motion.div
        className='absolute bottom-16 right-16 -z-10 blur-sm'
        initial={{ opacity: 0, scale: 0.8, translateX: -50, translateY: 10 }}
        animate={{ opacity: 1, scale: 1, translateX: 0, translateY: 0 }}
        transition={{ duration: 0.8 }}
      >
        <SiTauri className="size-96 text-neutral-800 rotate-12" />
      </motion.div>
      <motion.div
        className="w-full p-4 rounded-3xl justify-center items-center flex space-x-4 mb-8 flex-row"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SiTauri className="w-8 h-8 text-emerald-400" />
        <h1 className="text-4xl font-semibold">Welkom Terug!</h1>
      </motion.div>
      {isLoggedIn ? (
        <p>Je bent ingelogd, ga naar het dashboard om te beginnen</p>
      ) : (
        <p>Log in om te beginnen</p>
      )}
    </div>
  );
}

export default Home;
