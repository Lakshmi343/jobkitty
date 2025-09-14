import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

const InteractiveBarChart = ({ data = [], title, height = 300 }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  // Filter data based on selected period
  const getFilteredData = () => {
    if (!data || data.length === 0) return [];
    
    const monthsToShow = selectedPeriod === '3months' ? 3 : selectedPeriod === '6months' ? 6 : 12;
    return data.slice(-monthsToShow);
  };

  const chartData = getFilteredData();
  const maxValue = chartData.length > 0 ? Math.max(...chartData.map(item => Math.max(item.jobs || 0, item.applications || 0))) : 100;

  const periods = [
    { value: '3months', label: '3M' },
    { value: '6months', label: '6M' },
    { value: '1year', label: '1Y' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg p-2">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{title || 'Job & Application Analytics'}</h3>
              <p className="text-blue-100 text-sm">Interactive monthly overview</p>
            </div>
          </div>
          
          {/* Period Selector */}
          <div className="flex bg-white/20 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  selectedPeriod === period.value
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-600">Jobs Posted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-600">Applications</span>
            </div>
          </div>
          
          {hoveredBar && (
            <div className="bg-gray-50 rounded-lg px-3 py-2 border">
              <div className="text-sm font-medium text-gray-900">{hoveredBar.month}</div>
              <div className="text-xs text-gray-600">
                Jobs: {hoveredBar.jobs} | Apps: {hoveredBar.applications}
              </div>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="relative" style={{ height: `${height}px` }}>
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No data available</p>
                <p className="text-sm text-gray-400">Data will appear once jobs and applications are created</p>
              </div>
            </div>
          ) : (
            <div className="flex items-end justify-between h-full gap-2">
              {chartData.map((item, index) => {
              const jobHeight = (item.jobs / maxValue) * (height - 40);
              const appHeight = (item.applications / maxValue) * (height - 40);
              
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
                  onMouseEnter={() => setHoveredBar(item)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Bars Container */}
                  <div className="flex items-end gap-1 w-full justify-center">
                    {/* Jobs Bar */}
                    <div
                      className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-300 group-hover:from-blue-700 group-hover:to-blue-500 shadow-sm"
                      style={{ 
                        height: `${jobHeight}px`,
                        width: '40%',
                        minHeight: '4px'
                      }}
                    />
                    
                    {/* Applications Bar */}
                    <div
                      className="bg-gradient-to-t from-green-600 to-green-400 rounded-t-md transition-all duration-300 group-hover:from-green-700 group-hover:to-green-500 shadow-sm"
                      style={{ 
                        height: `${appHeight}px`,
                        width: '40%',
                        minHeight: '4px'
                      }}
                    />
                  </div>
                  
                  {/* Month Label */}
                  <div className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                    {item.month}
                  </div>
                </div>
              );
            })}
            </div>
          )}
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-8">
            <span>{maxValue}</span>
            <span>{Math.round(maxValue * 0.75)}</span>
            <span>{Math.round(maxValue * 0.5)}</span>
            <span>{Math.round(maxValue * 0.25)}</span>
            <span>0</span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Total Jobs</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {chartData.reduce((sum, item) => sum + item.jobs, 0)}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Avg: {Math.round(chartData.reduce((sum, item) => sum + item.jobs, 0) / chartData.length)} per month
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Total Applications</span>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {chartData.reduce((sum, item) => sum + item.applications, 0)}
            </div>
            <div className="text-xs text-green-600 mt-1">
              Avg: {Math.round(chartData.reduce((sum, item) => sum + item.applications, 0) / chartData.length)} per month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveBarChart;
