import React from 'react';

const LineChart = ({ data, title, height = 300, width = 600 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;
  
  
  const chartHeight = height - 80; 
  const chartWidth = width - 80; 
  const leftPadding = 60;
  const bottomPadding = 40;
  const topPadding = 20;

  // Calculate points for the line
  const points = data.map((item, index) => {
    const x = leftPadding + (index * chartWidth) / (data.length - 1);
    const y = topPadding + chartHeight - ((item.value - minValue) / range) * chartHeight;
    return { x, y, value: item.value, label: item.shortMonth || item.month };
  });

  // Create path for the line
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  // Create area fill path
  const areaPath = `${pathData} L ${points[points.length - 1].x} ${topPadding + chartHeight} L ${leftPadding} ${topPadding + chartHeight} Z`;

  // Y-axis ticks
  const yTicks = [];
  const tickCount = 5;
  for (let i = 0; i <= tickCount; i++) {
    const value = minValue + (range * i) / tickCount;
    const y = topPadding + chartHeight - (i * chartHeight) / tickCount;
    yTicks.push({ value: Math.round(value), y });
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      
      <div className="relative">
        <svg width={width} height={height} className="overflow-visible">
          {/* Grid lines */}
          {yTicks.map((tick, index) => (
            <line
              key={index}
              x1={leftPadding}
              y1={tick.y}
              x2={leftPadding + chartWidth}
              y2={tick.y}
              stroke="#f0f0f0"
              strokeWidth="1"
            />
          ))}
          
          {/* Y-axis */}
          <line
            x1={leftPadding}
            y1={topPadding}
            x2={leftPadding}
            y2={topPadding + chartHeight}
            stroke="#d1d5db"
            strokeWidth="2"
          />
          
          {/* X-axis */}
          <line
            x1={leftPadding}
            y1={topPadding + chartHeight}
            x2={leftPadding + chartWidth}
            y2={topPadding + chartHeight}
            stroke="#d1d5db"
            strokeWidth="2"
          />
          
          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#gradient)"
            opacity="0.3"
          />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
     
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all duration-200 cursor-pointer"
              />
            
              <g className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                <rect
                  x={point.x - 20}
                  y={point.y - 35}
                  width="40"
                  height="25"
                  fill="rgba(0,0,0,0.8)"
                  rx="4"
                />
                <text
                  x={point.x}
                  y={point.y - 18}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {point.value}
                </text>
              </g>
            </g>
          ))}
          
          {/* Y-axis labels */}
          {yTicks.map((tick, index) => (
            <text
              key={index}
              x={leftPadding - 10}
              y={tick.y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {tick.value}
            </text>
          ))}
          
          {/* X-axis labels */}
          {points.map((point, index) => (
            <text
              key={index}
              x={point.x}
              y={topPadding + chartHeight + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
              transform={`rotate(-45, ${point.x}, ${topPadding + chartHeight + 20})`}
            >
              {point.label}
            </text>
          ))}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 w-full text-center">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Total Jobs</div>
          <div className="text-lg font-bold text-blue-600">
            {data.reduce((sum, item) => sum + item.value, 0)}
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Peak Month</div>
          <div className="text-lg font-bold text-green-600">
            {maxValue}
          </div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Avg/Month</div>
          <div className="text-lg font-bold text-purple-600">
            {Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineChart;
