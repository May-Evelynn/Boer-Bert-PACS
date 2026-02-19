import { WeatherData } from '../types';

export const weatherService = {
    async getWeather(): Promise<WeatherData> {
        const weatherData = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.0908&longitude=5.1222&current=temperature_2m,apparent_temperature,precipitation,snowfall,showers,rain,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day&timezone=auto&forecast_days=1')
            .then(response => response.json())
            .then(data => {
                return data;
            });
        return weatherData;
    }
};