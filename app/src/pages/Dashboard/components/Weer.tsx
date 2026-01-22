import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import {
    FaSun,
    FaCloud,
    FaCloudSun,
    FaCloudRain,
    FaCloudShowersHeavy,
    FaSnowflake,
    FaWind,
    FaSpinner,
    FaTint,
} from 'react-icons/fa';
import { weatherService } from '../../../services/weatherService';
import { WeatherData } from '../../../types';

interface WeerProps {
    variants?: Variants;
}

type WeatherCondition = 'zonnig' | 'bewolkt' | 'deels_bewolkt' | 'regen' | 'buien' | 'sneeuw' | 'winderig';

interface WeatherIcon {
    icon: React.ReactNode;
    color: string;
    label: string;
}

const Weer: React.FC<WeerProps> = ({ variants }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                const data = await weatherService.getWeather();
                setWeather(data);
                setLastUpdated(new Date());
                setError(null);
            } catch (err) {
                console.error('Failed to fetch weather:', err);
                setError('Kon weer niet laden');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();

        const interval = setInterval(fetchWeather, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getWeatherCondition = (data: WeatherData['current']): WeatherCondition => {
        if (data.snowfall > 0) return 'sneeuw';
        if (data.showers > 0 || data.rain > 2) return 'buien';
        if (data.rain > 0 || data.precipitation > 0) return 'regen';
        if (data.cloud_cover > 80) return 'bewolkt';
        if (data.cloud_cover > 30) return 'deels_bewolkt';
        if (data.wind_speed_10m > 40) return 'winderig';
        return 'zonnig';
    };

    const getWeatherIcon = (condition: WeatherCondition): WeatherIcon => {
        const iconSize = 56;

        const icons: Record<WeatherCondition, WeatherIcon> = {
            zonnig: {
                icon: <FaSun size={iconSize} />,
                color: 'text-amber-400',
                label: 'Zonnig',
            },
            deels_bewolkt: {
                icon: <FaCloudSun size={iconSize} />,
                color: 'text-amber-300',
                label: 'Deels bewolkt',
            },
            bewolkt: {
                icon: <FaCloud size={iconSize} />,
                color: 'text-neutral-400',
                label: 'Bewolkt',
            },
            regen: {
                icon: <FaCloudRain size={iconSize} />,
                color: 'text-blue-400',
                label: 'Regen',
            },
            buien: {
                icon: <FaCloudShowersHeavy size={iconSize} />,
                color: 'text-blue-500',
                label: 'Buien',
            },
            sneeuw: {
                icon: <FaSnowflake size={iconSize} />,
                color: 'text-sky-300',
                label: 'Sneeuw',
            },
            winderig: {
                icon: <FaWind size={iconSize} />,
                color: 'text-teal-400',
                label: 'Winderig',
            },
        };

        return icons[condition];
    };

    const getWindDirection = (degrees: number): string => {
        const directions = ['N', 'NO', 'O', 'ZO', 'Z', 'ZW', 'W', 'NW'];
        const index = Math.round(degrees / 45) % 8;
        return directions[index];
    };

    const formatLastUpdated = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Zojuist bijgewerkt';
        if (diffMins === 1) return '1 minuut geleden';
        if (diffMins < 60) return `${diffMins} minuten geleden`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours === 1) return '1 uur geleden';
        return `${diffHours} uur geleden`;
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="bg-neutral-900 rounded-2xl px-6 flex items-center justify-center min-h-28">
                    <FaSpinner className="mx-auto mb-4 size-12 text-neutral-500 animate-spin" />
                    <p className="text-neutral-400">Laden...</p>
                </div>
            );
        }

        if (error || !weather) {
            return (
                <div className="bg-neutral-900 rounded-2xl px-6 text-center min-h-28">
                    <p className="text-red-400">{error || 'Geen weerdata beschikbaar'}</p>
                </div>
            );
        }

        const current = weather.current;
        const condition = getWeatherCondition(current);
        const weatherIcon = getWeatherIcon(condition);

        return (
            <div className="flex items-center justify-between bg-neutral-900 rounded-2xl p-2 space-x-3">
                {/* Main weer ding */}
                <div className="flex items-center justify-between space-x-2">
                    <motion.div
                        className={weatherIcon.color}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {weatherIcon.icon}
                    </motion.div>
                    <div>
                        <p className="text-3xl font-light text-white">
                            {Math.round(current.temperature_2m)}°C
                        </p>
                        <p className="text-neutral-400 mt-1">{weatherIcon.label}</p>
                        <p className="text-neutral-500 text-sm mt-0.5">
                            Voelt als {Math.round(current.apparent_temperature)}°C
                        </p>
                    </div>
                </div>

                {/* Details over weer */}
                <div className="flex flex-col items-center justify-between gap-2">
                    <div className="grid grid-cols-3 gap-3 pl-2 border-l border-neutral-800">
                        {/* Wind */}
                        <div className="flex flex-col items-center text-center">
                            <FaWind className="text-teal-400 mb-1" size={18} />
                            <span className="text-white text-sm font-medium">
                                {Math.round(current.wind_speed_10m)} km/u
                            </span>
                            <span className="text-neutral-500 text-xs">
                                {getWindDirection(current.wind_direction_10m)}
                            </span>
                        </div>

                        {/* Regen */}
                        <div className="flex flex-col items-center text-center">
                            <FaTint className="text-blue-400 mb-1" size={18} />
                            <span className="text-white text-sm font-medium">
                                {current.precipitation} mm
                            </span>
                            <span className="text-neutral-500 text-xs">Neerslag</span>
                        </div>

                        {/* Wolken */}
                        <div className="flex flex-col items-center text-center">
                            <FaCloud className="text-neutral-400 mb-1" size={18} />
                            <span className="text-white text-sm font-medium">
                                {current.cloud_cover}%
                            </span>
                            <span className="text-neutral-500 text-xs">Bewolking</span>
                        </div>
                    </div>
                    {lastUpdated && (
                        <p className="text-xs font-semibold text-neutral-500">
                            Laatst bijgewerkt: {formatLastUpdated(lastUpdated)}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <motion.div
            className="flex flex-col bg-neutral-950 border border-neutral-700 p-2 rounded-3xl justify-between"
            variants={variants}
        >
            <div>
                {renderContent()}
            </div>
        </motion.div>
    );
};

export default Weer;
