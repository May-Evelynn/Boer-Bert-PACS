import motion from 'framer-motion';

const Personen: React.FC = () => {

  return (
    <main className="bg-neutral-900 min-h-screen w-full p-4 flex flex-col items-center justify-start text-white">
      <div className="w-full bg-neutral-800 p-2 rounded-xl justify-center items-center flex space-x-4 mb-8 flex-row">
        <img
          src="/tauri.svg"
          alt="Boer Bert Logo"
          className="w-8 h-8"
        />
        <h1 className="text-4xl">Personen</h1>
      </div>
      

      <p>Log in om te beginnen</p>

    </main>
  );
}

export default Personen;
