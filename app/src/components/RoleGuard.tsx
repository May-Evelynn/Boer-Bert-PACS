import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { DataContext, DataContextType } from '../types';

export type UserRole = 'Eigenaar' | 'Manager' | 'Receptionist' | 'Schoonmaker';

export const ROLE_PERMISSIONS: Record<string, UserRole[]> = {
    '/dashbert': ['Eigenaar', 'Manager', 'Receptionist', 'Schoonmaker'],
    '/gasten': ['Eigenaar', 'Manager', 'Receptionist'],
    '/personeel': ['Eigenaar', 'Manager'],
    '/druppels': ['Eigenaar', 'Manager', 'Receptionist'],
    '/faciliteiten': ['Eigenaar', 'Manager'],
};

export const hasRoleAccess = (userRole: string | undefined, path: string): boolean => {
    if (path === '/') return true;
    if (!userRole) return false;
    const allowedRoles = ROLE_PERMISSIONS[path];
    if (!allowedRoles) return true;
    return allowedRoles.includes(userRole as UserRole);
};

export const getAccessiblePaths = (userRole: string | undefined): string[] => {
    if (!userRole) return [];
    return Object.entries(ROLE_PERMISSIONS)
        .filter(([_, roles]) => roles.includes(userRole as UserRole))
        .map(([path]) => path);
};

interface RoleGuardProps {
    children: React.ReactNode;
    requiredRoles?: UserRole[];
    path?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, requiredRoles, path }) => {
    const { user } = useContext<DataContextType>(DataContext);

    if (!user) {
        return (
            <motion.div
                className="z-10 bg-neutral-900 min-h-screen w-full p-4 flex flex-col items-center justify-center text-white h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <FaLock className="size-16 text-neutral-500 mb-4" />
                <h1 className="text-3xl mb-4">Niet Ingelogd</h1>
                <p className="text-neutral-400 mb-2">Je moet ingelogd zijn om deze pagina te bekijken.</p>
            </motion.div>
        );
    }

    let hasAccess = true;

    if (requiredRoles && requiredRoles.length > 0) {
        hasAccess = requiredRoles.includes(user.role as UserRole);
    } else if (path) {
        hasAccess = hasRoleAccess(user.role, path);
    }

    if (!hasAccess) {
        return (
            <motion.div
                className="z-10 bg-neutral-900 min-h-screen w-full p-4 flex flex-col items-center justify-center text-white h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <FaLock className="size-16 text-amber-500 mb-4" />
                <h1 className="text-3xl mb-4">Toegang Geweigerd</h1>
                <p className="text-neutral-400 mb-2">Je hebt niet de juiste rechten om deze pagina te bekijken.</p>
                <p className="text-neutral-500 text-sm">Jouw rol: {user.role}</p>
            </motion.div>
        );
    }

    return <>{children}</>;
};

export default RoleGuard;
