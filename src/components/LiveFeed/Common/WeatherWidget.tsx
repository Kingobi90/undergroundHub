import React, { useState } from 'react';
import { useLiveFeed } from '../../../contexts/LiveFeedContext';
import { FaSun, FaCloud, FaCloudRain, FaCloudSun } from 'react-icons/fa';

const WeatherWidget: React.FC = () => {
  const { weather } = useLiveFeed();
  const [showForecast, setShowForecast] = useState(false);
  
  if (!weather) return <div>Loading weather data...</div>;

  // Helper function to get the appropriate weather icon
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <FaSun className="text-yellow-400" />;
      case 'partly cloudy':
        return <FaCloudSun className="text-gray-300" />;
      case 'cloudy':
        return <FaCloud className="text-gray-400" />;
      case 'rain':
        return <FaCloudRain className="text-blue-300" />;
      default:
        return <FaSun className="text-yellow-400" />;
    }
  };

  return (
    <div>
      {/* Current weather */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-3xl mr-2">
            {getWeatherIcon(weather.condition)}
          </div>
          <div>
            <div className="text-xl font-bold">{weather.temperature}°F</div>
            <div className="text-sm text-gray-400">{weather.condition}</div>
          </div>
        </div>
        <button 
          onClick={() => setShowForecast(!showForecast)}
          className="text-xs text-yellow-400 hover:underline"
        >
          {showForecast ? 'Hide forecast' : '5-day forecast'}
        </button>
      </div>

      {/* Forecast (collapsible) */}
      {showForecast && (
        <div className="mt-3 border-t border-gray-700 pt-2">
          {weather.forecast.map((day, index) => (
            <div key={index} className="flex justify-between items-center py-1 text-sm">
              <div className="flex items-center">
                <div className="mr-2">
                  {getWeatherIcon(day.condition)}
                </div>
                <span>
                  {index === 0 ? 'Today' : day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
              <div>
                <span className="font-medium">{day.high}°</span>
                <span className="text-gray-400 ml-1">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
