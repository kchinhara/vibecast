import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Building2, School, Train } from 'lucide-react';

const LandValueGradientAnimation = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [centerValue, setCenterValue] = useState(50);
  const [infrastructurePoints, setInfrastructurePoints] = useState([]);
  const canvasRef = useRef(null);
  
  // Animation phases
  const phases = [
    { 
      duration: 3000, 
      centerTarget: 50, 
      message: "Land has natural value based on its location and resources...",
      infrastructure: []
    },
    { 
      duration: 3000, 
      centerTarget: 100, 
      message: "As a city grows, central land values rise dramatically...",
      infrastructure: [{ x: 0, y: 0, type: 'city' }]
    },
    { 
      duration: 3000, 
      centerTarget: 200, 
      message: "Individual effort doesn't create this location value - it comes from community presence...",
      infrastructure: [{ x: 0, y: 0, type: 'city' }]
    },
    { 
      duration: 3000, 
      centerTarget: 300, 
      message: "Infrastructure investments raise land values in surrounding areas...",
      infrastructure: [
        { x: 0, y: 0, type: 'city' },
        { x: -150, y: 0, type: 'school' },
        { x: 150, y: 0, type: 'train' }
      ]
    },
    { 
      duration: 3000, 
      centerTarget: 400, 
      message: "Land owners capture these publicly-created values as private wealth!",
      infrastructure: [
        { x: 0, y: 0, type: 'city' },
        { x: -150, y: 0, type: 'school' },
        { x: 150, y: 0, type: 'train' },
        { x: 0, y: -150, type: 'school' },
        { x: 0, y: 150, type: 'train' }
      ]
    }
  ];

  // Draw 3D topographic land value map
  const draw3DTopography = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Create gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#e0f2fe');
    bgGradient.addColorStop(1, '#f0f9ff');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Draw 3D grid lines for perspective
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 0.5;
    
    // Horizontal grid lines (curved for 3D effect)
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      const perspective = y / height;
      const curve = perspective * 50;
      ctx.moveTo(0, y);
      ctx.quadraticCurveTo(width / 2, y - curve, width, y);
      ctx.stroke();
    }
    
    // Vertical grid lines (perspective)
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      const offset = (x - width / 2) / width;
      ctx.moveTo(x + offset * 50, 0);
      ctx.lineTo(x - offset * 20, height);
      ctx.stroke();
    }
    
    // Calculate land values based on distance from center and infrastructure
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw land value "mountain" using concentric circles
    const maxRadius = Math.min(width, height) / 2;
    const numContours = 10;
    
    for (let i = numContours; i >= 0; i--) {
      const radius = (maxRadius / numContours) * i;
      const value = centerValue * (1 - i / numContours);
      
      // Calculate color based on value
      const greenIntensity = Math.floor(255 - (value / centerValue) * 100);
      const color = `rgb(${greenIntensity}, ${255 - greenIntensity / 2}, ${greenIntensity})`;
      
      // Draw elevated contour
      ctx.save();
      ctx.translate(0, -i * 3); // 3D elevation effect
      
      // Shadow for 3D effect
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 2;
      
      // Draw contour
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.ellipse(centerX, centerY, radius * 1.2, radius * 0.8, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw contour line
      ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 + i * 0.05})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.restore();
    }
    
    // Draw infrastructure points that boost nearby values
    infrastructurePoints.forEach(point => {
      const x = centerX + point.x;
      const y = centerY + point.y;
      
      // Draw value boost radius
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 60);
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 60, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw infrastructure icon background
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });
    
    // Draw value labels at different distances
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    
    // Center value
    ctx.fillText(`$${centerValue}k/acre`, centerX, centerY);
    
    // Edge values
    const positions = [
      { x: centerX - 150, y: centerY, label: `$${Math.floor(centerValue * 0.3)}k` },
      { x: centerX + 150, y: centerY, label: `$${Math.floor(centerValue * 0.3)}k` },
      { x: centerX, y: centerY - 100, label: `$${Math.floor(centerValue * 0.5)}k` },
      { x: centerX, y: centerY + 100, label: `$${Math.floor(centerValue * 0.5)}k` },
    ];
    
    positions.forEach(pos => {
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Arial';
      ctx.fillText(pos.label, pos.x, pos.y);
    });
  };

  useEffect(() => {
    draw3DTopography();
  }, [centerValue, infrastructurePoints]);

  useEffect(() => {
    let interval;
    if (isPlaying && phase < phases.length) {
      const currentPhase = phases[phase];
      const startValue = phase === 0 ? 50 : phases[phase - 1].centerTarget;
      const valueDiff = currentPhase.centerTarget - startValue;
      
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 50;
          if (newProgress >= currentPhase.duration) {
            if (phase < phases.length - 1) {
              setPhase(phase + 1);
              setInfrastructurePoints(phases[phase + 1].infrastructure);
              return 0;
            } else {
              setIsPlaying(false);
              return currentPhase.duration;
            }
          }
          
          // Smoothly interpolate center value
          const progressRatio = newProgress / currentPhase.duration;
          const newValue = startValue + (valueDiff * progressRatio);
          setCenterValue(Math.round(newValue));
          
          return newProgress;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, phase, phases]);

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    setPhase(0);
    setCenterValue(50);
    setInfrastructurePoints([]);
  };

  const getInfrastructureIcon = (type) => {
    switch(type) {
      case 'city': return <Building2 className="w-4 h-4" />;
      case 'school': return <School className="w-4 h-4" />;
      case 'train': return <Train className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
        Land Value Topography: The Geography of Wealth
      </h2>
      
      <p className="text-center text-gray-600 mb-6">
        Watch how land values form a "mountain" as cities grow and infrastructure develops
      </p>

      {/* Main Animation Area */}
      <div className="relative bg-white rounded-lg shadow-inner mb-6 overflow-hidden">
        <canvas 
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-full"
        />
        
        {/* Infrastructure Icons Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {infrastructurePoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="absolute flex items-center justify-center w-10 h-10 text-green-700"
              style={{
                left: `${50 + (point.x / 4)}%`,
                top: `${50 + (point.y / 4)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {getInfrastructureIcon(point.type)}
            </motion.div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-lg shadow-md">
          <h4 className="text-sm font-semibold mb-2 text-gray-700">Value Drivers:</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>City Center</span>
            </div>
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-green-600" />
              <span>Schools</span>
            </div>
            <div className="flex items-center gap-2">
              <Train className="w-4 h-4 text-purple-600" />
              <span>Transit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center mb-6 h-16"
        >
          <p className="text-lg text-gray-700 font-medium">
            {phases[phase]?.message || phases[phases.length - 1].message}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={phase >= phases.length - 1 && progress >= phases[phases.length - 1].duration}
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              {phase === 0 && progress === 0 ? 'Start' : 'Resume'}
            </>
          )}
        </button>
        
        <button
          onClick={handleReset}
          className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-600"
          animate={{ width: `${((phase + (progress / phases[Math.min(phase, phases.length - 1)].duration)) / phases.length) * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Educational Note */}
      <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <h4 className="font-semibold text-emerald-800 mb-2">Key Insight:</h4>
        <p className="text-sm text-emerald-700">
          Land values form a natural "topography" based on location advantages. Central locations 
          and areas near public infrastructure (schools, transit) see dramatic value increases. 
          These values are created by the community, not individual landowners, yet landowners 
          capture all the gains. This is why Henry George proposed taxing land values to fund 
          public services.
        </p>
      </div>
    </div>
  );
};

export default LandValueGradientAnimation;