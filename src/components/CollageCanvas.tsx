import { useState, useRef, PointerEvent as ReactPointerEvent, MouseEvent as ReactMouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, Move, Layers, RotateCw, ZoomIn, Play, Sparkles, Check, 
  RefreshCw, Layers2, ArrowDown, ArrowUp, Zap, HelpCircle 
} from 'lucide-react';
import { CollageItem, ASSETS_DB } from '../types';

export default function CollageCanvas() {
  const [collageItems, setCollageItems] = useState<CollageItem[]>([
    {
      id: 'p1',
      type: 'strawberry_cup',
      name: 'Wealth Velvet Berry elixir',
      imageUrl: 'https://www.image2url.com/r2/default/images/1780037248537-196d07e7-7b48-4cbd-b950-7d012976b445.png',
      x: 50,
      y: 45,
      scale: 1.1,
      rotation: 0,
      opacity: 1.0,
      zIndex: 10
    },
    {
      id: 'p2',
      type: 'orange_fruit',
      name: 'Zesty Amber Citrus',
      imageUrl: 'https://www.image2url.com/r2/default/images/1780037146628-ed9818cf-d38d-4de9-a9f7-ab86f3340244.png',
      x: 25,
      y: 65,
      scale: 0.8,
      rotation: -15,
      opacity: 0.9,
      zIndex: 5
    },
    {
      id: 'p3',
      type: 'chocolate_extra',
      name: 'Grand Reserve Truffle Shaker',
      imageUrl: 'https://www.image2url.com/r2/default/images/1780037156895-a7ecabb9-3e9f-4fca-ae7a-23a43c7984ca.png',
      x: 75,
      y: 60,
      scale: 0.9,
      rotation: 20,
      opacity: 0.85,
      zIndex: 4
    }
  ]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>('p1');
  const [artworkName, setArtworkName] = useState<string>('My Wealth Masterpiece');
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; itemX: number; itemY: number } | null>(null);
  const activeDragIdRef = useRef<string | null>(null);

  // Add asset from the catalog to the center of the canvas
  const addAssetToCanvas = (assetType: CollageItem['type']) => {
    const assetMeta = ASSETS_DB.find(a => a.type === assetType);
    if (!assetMeta) return;

    // Calculate a unique z-index
    const maxZ = collageItems.length > 0 ? Math.max(...collageItems.map(item => item.zIndex)) : 0;
    
    // Add offset variance so assets don't stack directly on top of each other
    const offsetVariance = (collageItems.length % 5) * 4 - 8;

    const newItem: CollageItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: assetType,
      imageUrl: assetMeta.imageUrl,
      name: assetMeta.name,
      x: 50 + offsetVariance,
      y: 50 + offsetVariance,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
      zIndex: maxZ + 1
    };

    setCollageItems(prev => [...prev, newItem]);
    setSelectedItemId(newItem.id);
  };

  // Modify currently selected item values
  const updateSelectedItem = (updater: Partial<CollageItem>) => {
    if (!selectedItemId) return;
    setCollageItems(prev => prev.map(item => {
      if (item.id === selectedItemId) {
        return { ...item, ...updater };
      }
      return item;
    }));
  };

  const getSelectedItem = () => {
    return collageItems.find(item => item.id === selectedItemId) || null;
  };

  // Layering management
  const adjustLayer = (direction: 'front' | 'back' | 'up' | 'down') => {
    if (!selectedItemId) return;
    
    setCollageItems(prev => {
      const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
      const currentIndex = sorted.findIndex(item => item.id === selectedItemId);
      if (currentIndex === -1) return prev;

      if (direction === 'front') {
        const highestZ = sorted[sorted.length - 1].zIndex;
        return prev.map(item => item.id === selectedItemId ? { ...item, zIndex: highestZ + 1 } : item);
      } else if (direction === 'back') {
        const lowestZ = sorted[0].zIndex;
        return prev.map(item => item.id === selectedItemId ? { ...item, zIndex: Math.max(0, lowestZ - 1) } : item);
      } else if (direction === 'up') {
        if (currentIndex === sorted.length - 1) return prev; // already top
        const targetIndex = currentIndex + 1;
        const tempZ = sorted[currentIndex].zIndex;
        sorted[currentIndex].zIndex = sorted[targetIndex].zIndex;
        sorted[targetIndex].zIndex = tempZ || tempZ + 1;
        return sorted;
      } else if (direction === 'down') {
        if (currentIndex === 0) return prev; // already bottom
        const targetIndex = currentIndex - 1;
        const tempZ = sorted[currentIndex].zIndex;
        sorted[currentIndex].zIndex = sorted[targetIndex].zIndex;
        sorted[targetIndex].zIndex = tempZ;
        return sorted;
      }
      return prev;
    });
  };

  // Remove item
  const deleteSelectedItem = () => {
    if (!selectedItemId) return;
    setCollageItems(prev => prev.filter(item => item.id !== selectedItemId));
    setSelectedItemId(null);
  };

  // Clear Canvas
  const resetCanvas = () => {
    setCollageItems([]);
    setSelectedItemId(null);
  };

  // Load a preset composition
  const loadPreset = (presetType: 'orange' | 'strawberry' | 'chocolate') => {
    if (presetType === 'orange') {
      setCollageItems([
        {
          id: 'o1',
          type: 'orange_cup',
          name: 'Wealth Orange Chalice',
          imageUrl: 'https://www.image2url.com/r2/default/images/1780037140284-15cae61c-3317-4482-9c00-8f7965105e84.png',
          x: 50,
          y: 40,
          scale: 1.15,
          rotation: 0,
          opacity: 1.0,
          zIndex: 10
        },
        {
          id: 'o2',
          type: 'orange_fruit',
          name: 'Zesty Amber Citrus',
          imageUrl: 'https://www.image2url.com/r2/default/images/1780037146628-ed9818cf-d38d-4de9-a9f7-ab86f3340244.png',
          x: 28,
          y: 62,
          scale: 0.9,
          rotation: -30,
          opacity: 0.95,
          zIndex: 11
        },
        {
          id: 'o3',
          type: 'orange_fruit',
          name: 'Zesty Amber Citrus Accent',
          imageUrl: 'https://www.image2url.com/r2/default/images/1780037146628-ed9818cf-d38d-4de9-a9f7-ab86f3340244.png',
          x: 72,
          y: 35,
          scale: 0.7,
          rotation: 45,
          opacity: 0.8,
          zIndex: 5
        }
      ]);
      setSelectedItemId('o1');
    } else if (presetType === 'strawberry') {
      setCollageItems([
        {
          id: 's1',
          type: 'strawberry_cup',
          name: 'Wealth Velvet Berry elixir',
          imageUrl: 'https://www.image2url.com/r2/default/images/1780037248537-196d07e7-7b48-4cbd-b950-7d012976b445.png',
          x: 50,
          y: 45,
          scale: 1.2,
          rotation: -5,
          opacity: 1.0,
          zIndex: 12
        },
        {
          id: 's2',
          type: 'strawberry_fruit',
          name: 'Glazed Crimson Berry',
          imageUrl: 'https://www.image2url.com/r2/default/images/1780038419280-0eb55ca0-85dc-4474-a4dd-9f30ac303f26.png',
          x: 35,
          y: 72,
          scale: 0.8,
          rotation: 12,
          opacity: 0.9,
          zIndex: 13
        },
        {
          id: 's3',
          type: 'strawberry_fruit',
          name: 'Glazed Crimson Berry Back',
          imageUrl: 'https://www.image2url.com/r2/default/images/1780038419280-0eb55ca0-85dc-4474-a4dd-9f30ac303f26.png',
          x: 68,
          y: 30,
          scale: 0.6,
          rotation: -45,
          opacity: 0.7,
          zIndex: 5
        }
      ]);
      setSelectedItemId('s1');
    } else if (presetType === 'chocolate') {
      setCollageItems([
        {
          id: 'c1',
          type: 'chocolate_cup',
          name: 'Bespoke Cocoa Mint Goblet',
          imageUrl: 'https://www.image2url.com/r2/default/images/1780037152057-c2077f10-55ce-4411-bc9d-d3dc93e68dab.png',
          x: 45,
          y: 48,
          scale: 1.1,
          rotation: 0,
          opacity: 1.0,
          zIndex: 14
        },
        {
          id: 'c2',
          type: 'chocolate_extra',
          name: 'Grand Reserve Truffle Shaker',
          imageUrl: 'https://www.image2url.com/r2/default/images/1780037156895-a7ecabb9-3e9f-4fca-ae7a-23a43c7984ca.png',
          x: 68,
          y: 52,
          scale: 1.0,
          rotation: 18,
          opacity: 0.9,
          zIndex: 15
        }
      ]);
      setSelectedItemId('c1');
    }
  };

  // Pointer Handlers for Seamless Mobile & Desktop dragging
  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>, itemId: string) => {
    e.stopPropagation();
    setSelectedItemId(itemId);
    
    const item = collageItems.find(it => it.id === itemId);
    if (!item || !canvasRef.current) return;

    // Set pointer capture to track drag events safely even if cursor leaves the box
    e.currentTarget.setPointerCapture(e.pointerId);

    activeDragIdRef.current = itemId;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      itemX: item.x,
      itemY: item.y
    };
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!activeDragIdRef.current || !dragStartRef.current || !canvasRef.current) return;

    const dragId = activeDragIdRef.current;
    const bounds = canvasRef.current.getBoundingClientRect();
    const start = dragStartRef.current;

    // Calculate delta movement in screen pixels
    const deltaX = e.clientX - start.x;
    const deltaY = e.clientY - start.y;

    // Translate pixels into width/height percentages of canvas
    const percentDeltaX = (deltaX / bounds.width) * 100;
    const percentDeltaY = (deltaY / bounds.height) * 100;

    let targetX = start.itemX + percentDeltaX;
    let targetY = start.itemY + percentDeltaY;

    // Boundary constraints (0 to 100%)
    targetX = Math.max(0, Math.min(100, targetX));
    targetY = Math.max(0, Math.min(100, targetY));

    setCollageItems(prev => prev.map(item => {
      if (item.id === dragId) {
        return { ...item, x: targetX, y: targetY };
      }
      return item;
    }));
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (activeDragIdRef.current) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    activeDragIdRef.current = null;
    dragStartRef.current = null;
  };

  const handleCanvasClick = (e: ReactMouseEvent) => {
    // If clicking directly on the canvas background, deselect item
    if (e.target === canvasRef.current || (e.target as HTMLElement).id === "canvas-grid") {
      setSelectedItemId(null);
    }
  };

  const triggerExport = () => {
    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
    }, 4500);
  };

  const selectedItem = getSelectedItem();

  return (
    <section className="py-24 px-4 md:px-8 bg-luxury-black text-white relative border-t border-gold-800/10" id="studio">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-gold-400 font-display text-xs tracking-[0.2em] uppercase block mb-2">Artisanal Workshop</span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-white">
              Collage <span className="gold-gradient-text font-serif italic">Creator</span>
            </h2>
            <p className="text-zinc-400 font-light max-w-xl text-sm md:text-base mt-2">
              Layer, rotate, scaling-zoom, alter transparency and drag-and-drop our luxury asset elements to compose your unique digital "wealth Cock" cocktail print.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setHelpOpen(!helpOpen)}
              className="px-4 py-2 border border-zinc-700 bg-zinc-900/40 rounded-xl text-zinc-300 text-xs font-display tracking-wider hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5" /> {helpOpen ? "Hide Guides" : "How to Use"}
            </button>
            <button
              onClick={resetCanvas}
              className="px-4 py-2 border border-red-500/20 bg-red-950/10 text-red-200 hover:bg-red-950/30 rounded-xl text-xs font-display tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5" /> Clear Workspace
            </button>
          </div>
        </div>

        {/* Dynamic Help Banner */}
        <AnimatePresence>
          {helpOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 border border-gold-300/20 bg-gold-950/10 p-5 rounded-2xl text-zinc-300 text-xs leading-relaxed overflow-hidden"
            >
              <h5 className="font-display text-white text-sm mb-2 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 text-gold-400" /> Interactive Collage Studio Guidelines:
              </h5>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong className="text-gold-200">Insert Elements:</strong> Tap any card in the "Luxury Asset Palette" stack below or sidebar to insert that asset directly in the center workspace.</li>
                <li><strong className="text-gold-200">Drag to Position:</strong> Drag or touch any asset directly inside the collage frame to displace its location. Unified pointer events support both touchscreen swipes and desktop click-and-drag.</li>
                <li><strong className="text-gold-200">Select & Tune:</strong> Tap a drink element once to open the tuning panel on the right. Modify its **Scale (Zoom)**, **Layer stack position (z-index)**, **Rotation**, and **Transparency (Opacity)** instantly.</li>
                <li><strong className="text-gold-200">Presets:</strong> Tap one of the royal layout presets below to populate beautiful cocktail backdrops in one click.</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Palette (Left Panel - 3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 bento-glow relative overflow-hidden">
              <h3 className="text-base font-display text-white tracking-widest uppercase border-b border-white/5 pb-3">
                Asset Palette
              </h3>

              {/* Grouped Assets categories */}
              {(['Orange', 'Strawberry', 'Chocolate'] as const).map(cat => (
                <div key={cat} className="space-y-3">
                  <span className={`text-[10px] font-display tracking-widest uppercase block border-l-2 pl-2 ${
                    cat === 'Orange' ? 'text-orange-400 border-orange-500' :
                    cat === 'Strawberry' ? 'text-rose-400 border-rose-500' :
                    'text-amber-400 border-amber-600'
                  }`}>
                    {cat} Elements
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {ASSETS_DB.filter(a => a.category === cat).map(asset => (
                      <button
                        key={asset.type}
                        onClick={() => addAssetToCanvas(asset.type)}
                        className={`p-3 border rounded-xl transition-all hover:scale-105 flex flex-col items-center gap-2 group cursor-pointer text-center ${
                          cat === 'Orange' ? 'bg-[#1c120a]/40 border-orange-950/40 hover:border-orange-500/30' :
                          cat === 'Strawberry' ? 'bg-[#1a0a0c]/40 border-rose-950/40 hover:border-rose-500/30' :
                          'bg-[#120e0a]/40 border-stone-850/30 hover:border-amber-600/30'
                        }`}
                      >
                        <div className="w-14 h-14 rounded-lg bg-black/40 flex items-center justify-center p-1.5 relative overflow-hidden">
                          <img 
                            src={asset.imageUrl} 
                            alt={asset.name} 
                            className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-110 transition-transform select-none"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[10px] text-zinc-300 font-sans tracking-tight font-medium line-clamp-1 w-full text-center">
                          {asset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Presets shortcut */}
              <div className="pt-4 border-t border-gold-400/10 space-y-3">
                <span className="text-[10px] font-display text-zinc-400 tracking-widest uppercase block">
                  Signature Arrangements
                </span>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => loadPreset('orange')}
                    className="w-full text-left px-3 py-2 text-xs bg-orange-950/20 hover:bg-orange-950/30 border border-orange-500/10 hover:border-orange-500/20 text-orange-200 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Zap className="w-3 text-orange-400" /> Orange Cascade Preset
                  </button>
                  <button
                    onClick={() => loadPreset('strawberry')}
                    className="w-full text-left px-3 py-2 text-xs bg-rose-950/20 hover:bg-rose-950/30 border border-rose-500/10 hover:border-rose-500/20 text-rose-200 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Zap className="w-3 text-rose-400" /> Velvet Berry Preset
                  </button>
                  <button
                    onClick={() => loadPreset('chocolate')}
                    className="w-full text-left px-3 py-2 text-xs bg-amber-950/20 hover:bg-amber-950/30 border border-amber-500/10 hover:border-amber-500/20 text-amber-200 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Zap className="w-3 text-amber-400" /> Cocoa Silk Preset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Viewport (Middle Panel - 6 columns) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 flex flex-col h-full shadow-2xl relative bento-glow overflow-hidden">
              
              {/* Card Meta Indicator */}
              <div className="flex items-center justify-between mb-3 px-1 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-mono text-[11px] tracking-wider uppercase font-semibold">Active Studio Canvas</span>
                </div>
                <div className="text-zinc-500 text-[10px] font-mono">
                  Items Layered: {collageItems.length}
                </div>
              </div>

              {/* Sandbox viewport */}
              <div 
                ref={canvasRef}
                onClick={handleCanvasClick}
                onPointerMove={handlePointerMove}
                className="flex-1 w-full min-h-[480px] lg:min-h-[520px] bg-[#0c0c0b] border-2 border-dashed border-gold-400/20 rounded-2xl relative overflow-hidden select-none cursor-crosshair touch-none"
                style={{ contentVisibility: 'auto' }}
              >
                {/* Background Grid Pattern */}
                <div 
                  id="canvas-grid"
                  className="absolute inset-0 bg-[linear-gradient(to_right,rgba(198,159,78,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(198,159,78,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 to-transparent pointer-events-none" />

                {collageItems.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-gold-950/30 border border-gold-400/20 flex items-center justify-center mb-4">
                      <Move className="w-6 text-gold-300 animate-pulse" />
                    </div>
                    <p className="text-gold-200 font-display text-sm tracking-widest uppercase mb-1">Canvas is empty</p>
                    <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">
                      Tap drink layers or luxury fruits on the left palette to begin drafting your design here.
                    </p>
                  </div>
                )}

                {/* Render Placed Items */}
                {collageItems.map((item) => {
                  const isSelected = selectedItemId === item.id;
                  
                  return (
                    <div
                      key={item.id}
                      onPointerDown={(e) => handlePointerDown(e, item.id)}
                      onPointerUp={handlePointerUp}
                      className="absolute group"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${item.scale})`,
                        zIndex: item.zIndex,
                        opacity: item.opacity,
                        transition: activeDragIdRef.current === item.id ? 'none' : 'transform 0.15s ease-out, opacity 0.2s',
                        cursor: activeDragIdRef.current === item.id ? 'grabbing' : 'grab'
                      }}
                    >
                      {/* Interactive Selection ring */}
                      {isSelected && (
                        <div className="absolute inset-x-0 -inset-y-2 border border-gold-300/80 rounded-xl pointer-events-none -m-4">
                          <div className="absolute top-0 left-0 w-2 h-2 bg-gold-400 border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                          <div className="absolute top-0 right-0 w-2 h-2 bg-gold-400 border border-white rounded-full translate-x-1/2 -translate-y-1/2" />
                          <div className="absolute bottom-0 left-0 w-2 h-2 bg-gold-400 border border-white rounded-full -translate-x-1/2 translate-y-1/2" />
                          <div className="absolute bottom-0 right-0 w-2 h-2 bg-gold-400 border border-white rounded-full translate-x-1/2 translate-y-1/2" />
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gold-500 text-[8px] font-mono text-luxury-black font-bold tracking-widest uppercase px-1.5 py-0.5 rounded shadow">
                            LAYER {item.zIndex}
                          </div>
                        </div>
                      )}

                      {/* Actual Asset Image */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-32 md:w-40 max-h-40 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] select-none pointer-events-none"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Master Artwork Name & Export row */}
              <div className="mt-4 flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={artworkName}
                  onChange={(e) => setArtworkName(e.target.value)}
                  placeholder="Masterpiece Name..."
                  className="flex-1 bg-luxury-black/90 border border-gold-400/20 text-gold-100 placeholder-zinc-600 rounded-xl px-4 py-3 text-xs tracking-wider outline-none focus:border-gold-300 transition-colors"
                />
                
                <button
                  onClick={triggerExport}
                  className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-luxury-black font-display font-black text-xs tracking-widest uppercase rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5" /> EXPORT COMPOSITION
                </button>
              </div>

            </div>
          </div>

          {/* Properties Editor Panel (Right Panel - 3 columns) */}
          <div className="lg:col-span-3">
            <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 shadow-2xl h-full flex flex-col bento-glow relative overflow-hidden">
              <h3 className="text-base font-display text-white tracking-widest uppercase border-b border-white/5 pb-3 mb-6">
                Tuning Deck
              </h3>

              {selectedItem ? (
                <div className="space-y-6 flex-1 flex flex-col">
                  {/* Selected Asset Header */}
                  <div className="p-3 bg-luxury-black/60 rounded-xl border border-gold-400/5 text-center">
                    <span className="text-[9px] font-mono text-gold-400 uppercase tracking-widest block mb-1">SELECTED COMPONENT</span>
                    <p className="text-xs font-display text-white font-medium line-clamp-1">{selectedItem.name}</p>
                  </div>

                  {/* Slider controls */}
                  <div className="space-y-5 flex-1">
                    
                    {/* Zoom & Scale Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-zinc-300">
                        <span className="flex items-center gap-1"><ZoomIn className="w-3 text-gold-400" /> Zoom Sizing</span>
                        <span className="font-mono text-gold-300">{selectedItem.scale.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.3"
                        max="2.5"
                        step="0.1"
                        value={selectedItem.scale}
                        onChange={(e) => updateSelectedItem({ scale: parseFloat(e.target.value) })}
                        className="w-full accent-gold-400 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Rotation Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-zinc-300">
                        <span className="flex items-center gap-1"><RotateCw className="w-3 text-gold-400" /> Rotate Orbit</span>
                        <span className="font-mono text-gold-300">{selectedItem.rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={selectedItem.rotation}
                        onChange={(e) => updateSelectedItem({ rotation: parseInt(e.target.value) })}
                        className="w-full accent-gold-400 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Opacity/Transparency Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-zinc-300">
                        <span className="flex items-center gap-1"><Layers className="w-3 text-gold-400" /> Transparency</span>
                        <span className="font-mono text-gold-300">{Math.round(selectedItem.opacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.15"
                        max="1.0"
                        step="0.05"
                        value={selectedItem.opacity}
                        onChange={(e) => updateSelectedItem({ opacity: parseFloat(e.target.value) })}
                        className="w-full accent-gold-400 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Depth & Ordering Stack controls */}
                    <div className="pt-4 border-t border-gold-400/5 space-y-3">
                      <span className="text-[10px] font-display text-zinc-400 tracking-widest uppercase block">
                        Depth Layer Controls
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => adjustLayer('up')}
                          className="px-2.5 py-2 bg-luxury-black border border-gold-400/5 hover:border-gold-300/20 rounded-xl text-[10px] font-mono hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <ArrowUp className="w-3" /> Move Up
                        </button>
                        <button
                          onClick={() => adjustLayer('down')}
                          className="px-2.5 py-2 bg-luxury-black border border-gold-400/5 hover:border-gold-300/20 rounded-xl text-[10px] font-mono hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <ArrowDown className="w-3" /> Move Down
                        </button>
                        <button
                          onClick={() => adjustLayer('front')}
                          className="px-2.5 py-2 bg-gold-950/20 border border-gold-500/10 hover:border-gold-500/30 text-gold-300 rounded-xl text-[10px] font-mono transition-colors cursor-pointer flex items-center justify-center gap-1 col-span-2"
                        >
                          <Layers2 className="w-3" /> Bring to Absolute Front
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Delete layer button at bottom */}
                  <button
                    onClick={deleteSelectedItem}
                    className="w-full mt-auto py-3 bg-red-950/20 hover:bg-red-950/30 border border-red-500/10 hover:border-red-500/30 text-red-200 text-xs font-display tracking-widest uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-3.5" /> Trash Selection
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800/40 flex items-center justify-center mb-3">
                    <Move className="w-4 text-zinc-500" />
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed max-w-xs">
                    No layered elements are selected. Touch or click any asset in the canvas viewer to bring up its customized edit handles.
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Export Celebration Modal */}
      <AnimatePresence>
        {exportSuccess && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full bg-luxury-charcoal border border-gold-300 p-8 rounded-3xl text-center shadow-2xl space-y-6 relative"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gold-300 to-gold-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-gold-500/20">
                <Check className="w-8 h-8 text-luxury-black stroke-[3]" />
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-display text-gold-400 tracking-[0.25em] block uppercase">Composition Stored</span>
                <h3 className="text-2xl font-display text-white italic font-medium">"{artworkName}"</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Your personalized cocktail mockup was calculated, textured, and safely saved. High-fleck asset layers are finalized in premium 4K resolution!
                </p>
              </div>

              {/* Render small replica collage inside modal for aesthetic feedback */}
              <div className="bg-luxury-black/90 p-4 rounded-2xl border border-gold-400/10 relative overflow-hidden h-36 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-[circle]_at_50%_50%] from-gold-500/5 to-transparent blur-xl" />
                <div className="flex gap-2 relative z-10">
                  {collageItems.slice(0, 3).map((item, idx) => (
                    <img 
                      key={idx} 
                      src={item.imageUrl} 
                      alt="" 
                      className="h-20 w-20 object-contain drop-shadow" 
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setExportSuccess(false)}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-650 text-luxury-black font-display font-bold text-xs py-3 rounded-xl tracking-widest uppercase cursor-pointer"
                >
                  Return to Studio
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
