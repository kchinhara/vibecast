import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Download, Building, DollarSign, Users, TrendingUp, Home, Factory, Trees, Info } from 'lucide-react';

const LVTSimulatorAnimation = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Game state
  const [gridSize] = useState({ width: 20, height: 15 });
  const [cells, setCells] = useState([]);
  const [time, setTime] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  
  // Tax rates
  const [lvtRate, setLvtRate] = useState(0);
  const [incomeTaxRate, setIncomeTaxRate] = useState(25);
  const [salesTaxRate, setSalesTaxRate] = useState(8);
  
  // Economic metrics
  const [metrics, setMetrics] = useState({
    totalLandValue: 0,
    totalDevelopment: 0,
    governmentRevenue: 0,
    economicActivity: 0,
    prosperityIndex: 50,
    speculationLevel: 0,
    affordabilityIndex: 50
  });
  
  // Building types
  const buildingTypes = {
    empty: { icon: '⬜', name: 'Empty Land', cost: 0, productivity: 0, color: '#f0f0f0' },
    house: { icon: '🏠', name: 'House', cost: 100, productivity: 1, color: '#87CEEB' },
    apartment: { icon: '🏢', name: 'Apartment', cost: 300, productivity: 3, color: '#4682B4' },
    shop: { icon: '🏪', name: 'Shop', cost: 200, productivity: 2, color: '#FFD700' },
    office: { icon: '🏢', name: 'Office', cost: 500, productivity: 5, color: '#FF6347' },
    factory: { icon: '🏭', name: 'Factory', cost: 1000, productivity: 10, color: '#808080' },
    park: { icon: '🌳', name: 'Park', cost: 50, productivity: 0.5, color: '#228B22' }
  };
  
  // Initialize grid
  useEffect(() => {
    const newCells = [];
    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        const isCenter = Math.abs(x - gridSize.width/2) < 3 && Math.abs(y - gridSize.height/2) < 3;
        const distanceFromCenter = Math.sqrt(Math.pow(x - gridSize.width/2, 2) + Math.pow(y - gridSize.height/2, 2));
        
        newCells.push({
          x,
          y,
          type: 'empty',
          landValue: isCenter ? 1000 : Math.max(100, 1000 - distanceFromCenter * 50),
          improvement: 0,
          owner: null,
          isSpeculative: false,
          developmentAge: 0
        });
      }
    }
    setCells(newCells);
  }, [gridSize]);
  
  // Calculate metrics
  const calculateMetrics = useCallback(() => {
    let totalLandValue = 0;
    let totalDevelopment = 0;
    let economicActivity = 0;
    let speculativeCount = 0;
    let developedCount = 0;
    
    cells.forEach(cell => {
      totalLandValue += cell.landValue;
      if (cell.type !== 'empty') {
        totalDevelopment += buildingTypes[cell.type].cost;
        economicActivity += buildingTypes[cell.type].productivity * (cell.developmentAge / 10 + 1);
        developedCount++;
      }
      if (cell.isSpeculative) speculativeCount++;
    });
    
    // Calculate government revenue based on tax system
    let governmentRevenue = 0;
    if (lvtRate > 0) {
      // Land Value Tax system
      governmentRevenue += (totalLandValue * lvtRate / 100);
    }
    if (incomeTaxRate > 0) {
      // Income tax on economic activity
      governmentRevenue += (economicActivity * 10 * incomeTaxRate / 100);
    }
    if (salesTaxRate > 0) {
      // Sales tax on transactions
      governmentRevenue += (economicActivity * 5 * salesTaxRate / 100);
    }
    
    // Calculate prosperity index (0-100)
    const developmentRatio = developedCount / cells.length;
    const speculationRatio = speculativeCount / Math.max(1, cells.length - developedCount);
    const taxBurden = (incomeTaxRate + salesTaxRate) / 100;
    
    let prosperityIndex = 50;
    prosperityIndex += developmentRatio * 30; // Development increases prosperity
    prosperityIndex -= speculationRatio * 20; // Speculation decreases prosperity
    prosperityIndex -= taxBurden * 20; // High income/sales taxes decrease prosperity
    prosperityIndex += (lvtRate > 30 ? 10 : 0); // Moderate LVT increases prosperity
    
    // Calculate affordability (inverse of speculation)
    const affordabilityIndex = Math.max(0, 100 - speculationRatio * 100);
    
    setMetrics({
      totalLandValue,
      totalDevelopment,
      governmentRevenue: Math.round(governmentRevenue),
      economicActivity: Math.round(economicActivity),
      prosperityIndex: Math.max(0, Math.min(100, Math.round(prosperityIndex))),
      speculationLevel: Math.round(speculationRatio * 100),
      affordabilityIndex: Math.round(affordabilityIndex)
    });
  }, [cells, lvtRate, incomeTaxRate, salesTaxRate]);
  
  // Update land values based on development
  const updateLandValues = useCallback(() => {
    const newCells = [...cells];
    
    // Update land values based on nearby development
    newCells.forEach((cell, index) => {
      let neighborValue = 0;
      let neighborCount = 0;
      
      // Check all neighbors
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (dx === 0 && dy === 0) continue;
          
          const nx = cell.x + dx;
          const ny = cell.y + dy;
          
          if (nx >= 0 && nx < gridSize.width && ny >= 0 && ny < gridSize.height) {
            const neighborIndex = ny * gridSize.width + nx;
            const neighbor = newCells[neighborIndex];
            
            if (neighbor.type !== 'empty') {
              const distance = Math.sqrt(dx * dx + dy * dy);
              neighborValue += buildingTypes[neighbor.type].productivity / distance;
              neighborCount++;
            }
          }
        }
      }
      
      // Update land value based on neighbors
      if (neighborCount > 0) {
        cell.landValue = Math.min(5000, cell.landValue * 1.01 + neighborValue * 10);
      }
      
      // Speculation logic
      if (cell.type === 'empty' && cell.landValue > 500) {
        // With low/no LVT, speculation is profitable
        if (lvtRate < 20 && Math.random() < 0.01) {
          cell.isSpeculative = true;
        }
        // With high LVT, speculation is unprofitable
        if (lvtRate > 50 && cell.isSpeculative && Math.random() < 0.1) {
          cell.isSpeculative = false;
        }
      }
      
      // Auto-development based on profitability
      if (cell.type === 'empty' && !cell.isSpeculative && Math.random() < 0.005) {
        const developmentCost = cell.landValue * (incomeTaxRate + salesTaxRate) / 100;
        const lvtCost = cell.landValue * lvtRate / 100;
        
        // More likely to develop with LVT than income/sales tax
        if (lvtCost < developmentCost || Math.random() < 0.3) {
          const types = ['house', 'apartment', 'shop', 'office'];
          cell.type = types[Math.floor(Math.random() * types.length)];
          cell.developmentAge = 0;
        }
      }
      
      // Age developments
      if (cell.type !== 'empty') {
        cell.developmentAge = Math.min(100, cell.developmentAge + 1);
      }
    });
    
    setCells(newCells);
  }, [cells, lvtRate, incomeTaxRate, salesTaxRate, gridSize]);
  
  // Handle cell click
  const handleCellClick = (index) => {
    const cell = cells[index];
    setSelectedCell(index);
    
    // Cycle through building types
    const types = Object.keys(buildingTypes);
    const currentIndex = types.indexOf(cell.type);
    const nextIndex = (currentIndex + 1) % types.length;
    
    const newCells = [...cells];
    newCells[index] = {
      ...cell,
      type: types[nextIndex],
      isSpeculative: false,
      developmentAge: 0
    };
    setCells(newCells);
  };
  
  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = setInterval(() => {
        setTime(t => t + 1);
        updateLandValues();
        calculateMetrics();
      }, 100);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying, updateLandValues, calculateMetrics]);
  
  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const cellSize = 30;
    
    canvas.width = gridSize.width * cellSize;
    canvas.height = gridSize.height * cellSize;
    
    // Clear canvas
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw cells
    cells.forEach((cell, index) => {
      const x = cell.x * cellSize;
      const y = cell.y * cellSize;
      
      // Draw land value as background heat map
      const valueIntensity = Math.min(255, Math.floor(cell.landValue / 20));
      ctx.fillStyle = `rgb(255, ${255 - valueIntensity}, ${255 - valueIntensity})`;
      ctx.fillRect(x, y, cellSize, cellSize);
      
      // Draw building
      if (cell.type !== 'empty') {
        ctx.fillStyle = buildingTypes[cell.type].color;
        ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
        
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(buildingTypes[cell.type].icon, x + cellSize/2, y + cellSize/2);
      }
      
      // Draw speculation indicator
      if (cell.isSpeculative) {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
      
      // Draw selection
      if (index === selectedCell) {
        ctx.strokeStyle = '#0066CC';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
      
      // Draw grid
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellSize, cellSize);
    });
    
    // Draw compare mode split
    if (compareMode) {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      
      // Labels
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Current System', canvas.width / 4, 20);
      ctx.fillText('Single Tax (LVT)', 3 * canvas.width / 4, 20);
    }
  }, [cells, selectedCell, compareMode, gridSize]);
  
  // Export as image
  const exportImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'lvt-simulation.png';
    link.href = canvas.toDataURL();
    link.click();
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setIsPlaying(false);
    setTime(0);
    setSelectedCell(null);
    
    // Reinitialize grid
    const newCells = [];
    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        const isCenter = Math.abs(x - gridSize.width/2) < 3 && Math.abs(y - gridSize.height/2) < 3;
        const distanceFromCenter = Math.sqrt(Math.pow(x - gridSize.width/2, 2) + Math.pow(y - gridSize.height/2, 2));
        
        newCells.push({
          x,
          y,
          type: 'empty',
          landValue: isCenter ? 1000 : Math.max(100, 1000 - distanceFromCenter * 50),
          improvement: 0,
          owner: null,
          isSpeculative: false,
          developmentAge: 0
        });
      }
    }
    setCells(newCells);
  };
  
  // Store coordination data
  useEffect(() => {
    if (time % 50 === 0 && time > 0) {
      const pattern = {
        lvtRate,
        incomeTaxRate,
        salesTaxRate,
        metrics,
        developmentRatio: cells.filter(c => c.type !== 'empty').length / cells.length,
        timestamp: Date.now()
      };
      
      // Store pattern in memory
      if (window.npx) {
        window.npx('claude-flow@alpha', ['hooks', 'notification', '--message', JSON.stringify(pattern)]);
      }
    }
  }, [time, lvtRate, incomeTaxRate, salesTaxRate, metrics, cells]);
  
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Interactive Land Value Tax Simulator</h2>
            <p className="text-gray-600">
              Experience Henry George's Single Tax theory in action! 
              Click cells to build, adjust tax rates, and watch the economy evolve.
            </p>
          </div>
          
          {/* Main Canvas */}
          <div className="flex justify-center">
            <div className="relative">
              <canvas
                ref={canvasRef}
                onClick={(e) => {
                  const rect = canvasRef.current.getBoundingClientRect();
                  const x = Math.floor((e.clientX - rect.left) / 30);
                  const y = Math.floor((e.clientY - rect.top) / 30);
                  const index = y * gridSize.width + x;
                  if (index >= 0 && index < cells.length) {
                    handleCellClick(index);
                  }
                }}
                className="border-2 border-gray-300 rounded cursor-pointer"
              />
              
              {/* Legend */}
              <div className="absolute top-2 right-2 bg-white/90 p-2 rounded shadow">
                <div className="text-xs space-y-1">
                  <div className="font-bold">Land Value</div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500"></div>
                    <span>High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500"></div>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200"></div>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-4 h-4 border-2 border-red-500"></div>
                    <span>Speculation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tax Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Tax Rates
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium">Land Value Tax</label>
                    <span className="text-sm font-bold text-green-600">{lvtRate}%</span>
                  </div>
                  <Slider
                    value={[lvtRate]}
                    onValueChange={([value]) => setLvtRate(value)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium">Income Tax</label>
                    <span className="text-sm font-bold text-orange-600">{incomeTaxRate}%</span>
                  </div>
                  <Slider
                    value={[incomeTaxRate]}
                    onValueChange={([value]) => setIncomeTaxRate(value)}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium">Sales Tax</label>
                    <span className="text-sm font-bold text-purple-600">{salesTaxRate}%</span>
                  </div>
                  <Slider
                    value={[salesTaxRate]}
                    onValueChange={([value]) => setSalesTaxRate(value)}
                    max={25}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Preset Scenarios */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Quick Scenarios:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setLvtRate(0);
                      setIncomeTaxRate(30);
                      setSalesTaxRate(8);
                    }}
                  >
                    Current System
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setLvtRate(85);
                      setIncomeTaxRate(0);
                      setSalesTaxRate(0);
                    }}
                  >
                    Single Tax
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setLvtRate(30);
                      setIncomeTaxRate(15);
                      setSalesTaxRate(5);
                    }}
                  >
                    Mixed System
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setLvtRate(50);
                      setIncomeTaxRate(0);
                      setSalesTaxRate(0);
                    }}
                  >
                    Moderate LVT
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Metrics Display */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Economic Metrics
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600">Total Land Value</div>
                  <div className="text-lg font-bold">${(metrics.totalLandValue / 1000).toFixed(1)}K</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-600">Development Value</div>
                  <div className="text-lg font-bold">${(metrics.totalDevelopment / 1000).toFixed(1)}K</div>
                </div>
                
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-xs text-gray-600">Gov Revenue/Year</div>
                  <div className="text-lg font-bold text-green-600">${metrics.governmentRevenue}</div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-xs text-gray-600">Economic Activity</div>
                  <div className="text-lg font-bold text-blue-600">{metrics.economicActivity}</div>
                </div>
              </div>
              
              {/* Progress Bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Citizen Prosperity</span>
                    <span className="text-sm font-bold">{metrics.prosperityIndex}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${metrics.prosperityIndex}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Speculation Level</span>
                    <span className="text-sm font-bold">{metrics.speculationLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${metrics.speculationLevel}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Housing Affordability</span>
                    <span className="text-sm font-bold">{metrics.affordabilityIndex}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${metrics.affordabilityIndex}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Control Buttons */}
          <div className="flex justify-center items-center gap-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant={isPlaying ? "secondary" : "default"}
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            
            <Button
              onClick={resetSimulation}
              variant="outline"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            
            <Button
              onClick={() => setCompareMode(!compareMode)}
              variant="outline"
            >
              <Users className="w-4 h-4 mr-2" />
              {compareMode ? 'Single View' : 'Compare Mode'}
            </Button>
            
            <Button
              onClick={exportImage}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">How the Single Tax Works:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• <strong>High LVT + No Income/Sales Tax:</strong> Encourages development, discourages speculation</li>
                  <li>• <strong>Land values rise</strong> near productive developments (shops, offices, parks)</li>
                  <li>• <strong>Speculation (red borders)</strong> holds land idle, reducing prosperity</li>
                  <li>• <strong>Government revenue</strong> comes from land rent, not labor or trade</li>
                  <li>• Watch how different tax systems affect development patterns!</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Building Types Guide */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-2">Building Types (click cells to build):</h4>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2 text-xs">
              {Object.entries(buildingTypes).map(([key, building]) => (
                <div key={key} className="flex items-center gap-1">
                  <span className="text-lg">{building.icon}</span>
                  <span>{building.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LVTSimulatorAnimation;