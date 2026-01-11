import { useState } from 'react';
import { userService } from '../../../services/userService';

const UserCreation: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [affix, setAffix] = useState('');
    const [role, setRole] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            await userService.createUser({
                first_name,
                last_name,
                affix,
                email,
                username: username || createUsername(first_name, last_name),
                role
            });
            
            setMessage({ type: 'success', text: 'Gebruiker succesvol aangemaakt!' });
            setUsername('');
            setEmail('');
            setFirstName('');
            setLastName('');
            setAffix('');
            setRole('');
        } catch (error: any) {
            console.error('Error creating user:', error);
            setMessage({ type: 'error', text: error.message || 'Er is een fout opgetreden bij het aanmaken van de gebruiker.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Gebruikersnaam maken op basis van voor- en achternaam
    // Moet nog aangepast worden om duplicates te voorkomen
    const createUsername = (first_name: string, last_name: string) => {
        if (!first_name && !last_name) return '';
        // Verwijder spaties uit voornaam
        const sanitizedFirstName = first_name.replace(/\s+/g, '');
        const sanitizedLastName = last_name.replace(/\s+/g, '');
        return (sanitizedFirstName.charAt(0) + '.' + sanitizedLastName).toLowerCase();
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-neutral-950 border border-neutral-600 p-6 rounded-3xl mb-8">
            <h2 className="text-2xl mb-4 text-white">Nieuwe Gebruiker Aanmaken</h2>
            <div className="flex space-x-4">
                <div className="mb-4">
                    <label className="block text-white mb-2">Voornaam</label>
                    <input
                        type="text"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-2 rounded-2xl bg-neutral-800 border border-neutral-600 text-white"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white mb-2">Tussenvoegsel</label>
                    <input
                        type="text"
                        value={affix}
                        onChange={(e) => setAffix(e.target.value)}
                        className="w-full p-2 rounded-2xl bg-neutral-800 border border-neutral-600 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white mb-2">Achternaam</label>
                    <input
                        type="text"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-2 rounded-2xl bg-neutral-800 border border-neutral-600 text-white"
                        required
                    />
                </div>
            </div>
            <div className="mb-4">
                <label className="block text-white mb-2">Gebruikersnaam</label>
                <input
                    type="text"
                    value={username || createUsername(first_name, last_name)}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 rounded-2xl bg-neutral-800 border border-neutral-600 text-white"
                    placeholder={createUsername(first_name, last_name)}
                    required
                />
            </div>
            <div className='mb-4'>
                <label className="block text-white mb-2">E-mail</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-2xl bg-neutral-800 border border-neutral-600 text-white"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-white mb-2">Rol</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 rounded-2xl bg-neutral-800 border border-neutral-600 text-white"
                    required
                >
                    <option value="" disabled>-- Selecteer een rol --</option>
                    <option value="Schoonmaker">Schoonmaker</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Manager">Manager</option>
                    <option value="Eigenaar">Eigenaar</option>
                </select>
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500/20 border border-blue-500/50 hover:bg-blue-500/50 transition-colors rounded-xl p-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Bezig...' : 'Maak Gebruiker Aan'}
            </button>
            {message && (
                <div className={`mt-4 p-3 rounded-xl ${message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'}`}>
                    {message.text}
                </div>
            )}
        </form>
    );
}

export default UserCreation;