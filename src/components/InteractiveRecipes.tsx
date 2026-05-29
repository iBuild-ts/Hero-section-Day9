import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, GlassWater, Flame, Compass, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { Recipe } from '../types';

interface InteractiveRecipesProps {
  onSelectedFlavor?: (flavor: 'Orange' | 'Strawberry' | 'Chocolate') => void;
}

const RECIPES_DATA: Recipe[] = [
  {
    id: 'orange',
    name: 'Liquid Amber Sovereign',
    tagline: 'A royal blend of charred citrus and liquid gold',
    flavorProfile: 'Bold Citrus • Smoked Zest • Warm Oak',
    story: 'Designed as a liquid crown, the Sovereign combines cold-pressed tangerine essences with premium gold-flecked cognac, leaving a warm amber trail of citrus-infused smoke.',
    ingredients: [
      '2.0 oz Grand Orange Cognac Reserve',
      '1.0 oz Cold-pressed Mandarin Cordial',
      '0.5 oz Smoked Citrus Oleo Saccharum',
      '2 Drops House Bitters (Orange & Cardamom)',
      '1 Flamed Orange Peel & Golden Flakes'
    ],
    instructions: [
      'Pre-chill an elegant crystal tulip glass with volcanic black ice.',
      'In a custom golden mixing pitcher, stir liquid state ingredients with crystal glacier ice for 30 rotations.',
      'Strain meticulously into the chilled glass over a single geometric sphere.',
      'Squeeze the orange peel over a small flame to release essential oils onto the liquid surface.',
      'Garnish delicately with a cluster of gold leaf flakes.'
    ],
    strength: 'Balanced',
    sweetness: 4,
    acidity: 3,
    richness: 2,
    imageUrl: 'https://www.image2url.com/r2/default/images/1780037140284-15cae61c-3317-4482-9c00-8f7965105e84.png',
    accentColor: 'from-amber-600 to-orange-400',
    glowColor: 'shadow-orange-500/10'
  },
  {
    id: 'strawberry',
    name: 'Royale Crimson Velvet',
    tagline: 'Glenda of wild forest berries and chilled champagne mist',
    flavorProfile: 'Luscious Sweet • Crisp Berry • Effervescent',
    story: 'A highly sophisticated tribute to the legendary Crimson fields. Wild high-country strawberries are clarified over 24 hours to extract an pristine syrup, pairing flawlessly with high-altitude vintage champagne.',
    ingredients: [
      '1.5 oz Diamond-Filtered Botanical Gin',
      '1.0 oz Clarified Wild Strawberry Nectar',
      '2.0 oz Vintage Brut Champagne Topper',
      '0.25 oz Fresh Meyer Lemon Essence',
      '1 Glazed Crimson Berry & Rose Petals'
    ],
    instructions: [
      'Rinse a chilled flute with organic rosewater.',
      'Combine botanical gin, clarified strawberry nectar, and lemon essence in a gold shaker with crushed ice.',
      'Shake vigorously with premium rhythm for exactly 15 seconds.',
      'Double strain into the flute, ensuring a pristine ruby liquid.',
      'Top slowly with vintage champagne to create a golden crimson foam layer.',
      'Garnish with a single glazed strawberry and organic petals.'
    ],
    strength: 'Gentle',
    sweetness: 5,
    acidity: 4,
    richness: 2,
    imageUrl: 'https://www.image2url.com/r2/default/images/1780037248537-196d07e7-7b48-4cbd-b950-7d012976b445.png',
    accentColor: 'from-rose-600 to-pink-500',
    glowColor: 'shadow-rose-500/10'
  },
  {
    id: 'chocolate',
    name: 'Imperial Cocoa Seduction',
    tagline: 'Rich melted dark chocolate with cooled mountain mint',
    flavorProfile: 'Velvety Chocolate • Minty Whisper • Decadent',
    story: 'The ultimate royal dessert elixir. A dense reduction of 85% single-origin Venezuelan cocoa, married with barrel-aged dark rum and a refreshing vapor of hand-pressed wild spearmint.',
    ingredients: [
      '2.0 oz Custom Oak-Aged Dark Rum',
      '1.25 oz Single-Origin Liquid Dark Cocoa',
      '0.5 oz White Mint Glacier Infusion',
      '0.5 oz Heavy Almond Cream Float',
      'Grated Chocolate Shavings & Fresh Mint Leaf'
    ],
    instructions: [
      'Warm the base goblet slightly to prepare for velvety fluid.',
      'Melt the chocolate reduction and dark rum together, stirring in circular orbits until unified.',
      'Stir in the mountain mint infusion to release key aromatics.',
      'Float a delicate layer of chilled almond cream over the hot base mixture.',
      'Garnish with premium dark chocolate dust and a single, perfectly slapped fresh mint leaf.'
    ],
    strength: 'Bold',
    sweetness: 3,
    acidity: 1,
    richness: 5,
    imageUrl: 'https://www.image2url.com/r2/default/images/1780037152057-c2077f10-55ce-4411-bc9d-d3dc93e68dab.png',
    accentColor: 'from-amber-950 to-amber-700',
    glowColor: 'shadow-yellow-700/10'
  }
];

export default function InteractiveRecipes({ onSelectedFlavor }: InteractiveRecipesProps) {
  const [activeTab, setActiveTab] = useState<'orange' | 'strawberry' | 'chocolate'>('orange');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [shaking, setShaking] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [preparationComplete, setPreparationComplete] = useState(false);

  const activeRecipe = RECIPES_DATA.find((r) => r.id === activeTab)!;

  const toggleStep = (stepIndex: number) => {
    const key = `${activeTab}-${stepIndex}`;
    setCompletedSteps((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const currentTabCompletedCount = activeRecipe.instructions.filter(
    (_, i) => completedSteps[`${activeTab}-${i}`]
  ).length;

  const progressPercent = Math.round(
    (currentTabCompletedCount / activeRecipe.instructions.length) * 100
  );

  const startShakingDemo = () => {
    setShaking(true);
    setShakeCount(0);
    setPreparationComplete(false);
    
    const interval = setInterval(() => {
      setShakeCount((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setShaking(false);
          setPreparationComplete(true);
          // Auto complete all steps to reward the user!
          activeRecipe.instructions.forEach((_, i) => {
            setCompletedSteps((prevSteps) => ({
              ...prevSteps,
              [`${activeTab}-${i}`]: true
            }));
          });
          return 6;
        }
        return prev + 1;
      });
    }, 250);
  };

  const handleTabChange = (tab: 'orange' | 'strawberry' | 'chocolate') => {
    setActiveTab(tab);
    setPreparationComplete(false);
    if (onSelectedFlavor) {
      onSelectedFlavor(tab === 'orange' ? 'Orange' : tab === 'strawberry' ? 'Strawberry' : 'Chocolate');
    }
  };

  return (
    <section className="py-20 px-4 md:px-8 border-t border-gold-800/20 bg-luxury-charcoal/40 backdrop-blur-md relative overflow-hidden" id="recipes">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_120%] from-gold-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold-300 font-display text-sm tracking-[0.25em] block mb-3 uppercase">Royal Formulas</span>
          <h2 className="text-4xl md:text-5xl font-display font-medium mb-4 text-white">
            Interactive <span className="gold-gradient-text font-serif italic">Recipes</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base font-light">
            Select a custom drink personality to view ingredients, prepare step-by-step, or run the virtual shaker to unlock gold status presets.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex justify-center mb-12">
          <div className="bg-luxury-black/80 border border-gold-400/20 p-1.5 rounded-full flex gap-2 max-w-md w-full">
            {(['orange', 'strawberry', 'chocolate'] as const).map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 py-3 text-xs md:text-sm font-display tracking-widest uppercase transition-all duration-300 rounded-full cursor-pointer relative ${
                    isSelected ? 'text-luxury-black font-semibold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="recipeTabActive"
                      className="absolute inset-0 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
          
          {/* Left Side: Drink Presentation Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className={`relative w-full max-w-sm rounded-3xl border p-8 shadow-2xl transition-all duration-500 ${
              activeRecipe.id === 'orange' ? 'bg-[#1c120a]/95 border-orange-900/40 shadow-orange-500/5' :
              activeRecipe.id === 'strawberry' ? 'bg-[#1a0a0c]/95 border-rose-950/40 shadow-rose-500/5' :
              'bg-[#120e0a]/95 border-stone-850/60 shadow-amber-950/10'
            } transition-all duration-500`}>
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-gold-300 to-gold-600 text-luxury-black text-[10px] font-display font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 border border-gold-200/25">
                <Award className="w-3 animate-spin duration-3000" /> Signature
              </div>

              {/* Glowing Ambient Background */}
              <div className="absolute inset-x-0 top-1/4 h-32 bg-radial-[circle] from-gold-500/10 to-transparent blur-2xl pointer-events-none" />

              <div className="h-72 w-full flex items-center justify-center relative mb-8">
                <motion.img
                  key={activeRecipe.id}
                  src={activeRecipe.imageUrl}
                  alt={activeRecipe.name}
                  initial={{ y: 20, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="max-h-64 object-contain drop-shadow-[0_20px_40px_rgba(198,159,78,0.3)] select-none hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-xs text-gold-400 uppercase tracking-widest font-mono block mb-1">
                    {activeRecipe.flavorProfile}
                  </span>
                  <h3 className="text-2xl font-display text-white tracking-wide">{activeRecipe.name}</h3>
                  <p className="text-zinc-400 text-xs italic mt-2 px-4 leading-relaxed">
                    "{activeRecipe.tagline}"
                  </p>
                </div>

                <div className="border-t border-gold-400/10 my-4" />

                {/* Characteristics Sliders */}
                <div className="space-y-3 px-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-300">
                      <span>Citrus Sweetness</span>
                      <span className="text-gold-300 font-mono">{activeRecipe.sweetness}/5</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gold-500 to-gold-300"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeRecipe.sweetness * 20}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-300">
                      <span>Tropical Acidity</span>
                      <span className="text-gold-300 font-mono">{activeRecipe.acidity}/5</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gold-500 to-gold-300"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeRecipe.acidity * 20}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-300">
                      <span>Rich Decadence</span>
                      <span className="text-gold-300 font-mono">{activeRecipe.richness}/5</span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gold-500 to-gold-300"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeRecipe.richness * 20}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs mt-6 pt-4 border-t border-gold-400/10 text-zinc-400 px-2">
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 text-red-500" />
                    <span>ABV: 18.5%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GlassWater className="w-3.5 text-cyan-400" />
                    <span>{activeRecipe.strength} Strength</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Virtual Gold Shaker Widget */}
            <div className="mt-6 w-full max-w-sm rounded-2xl p-4 bg-luxury-gray/40 border border-gold-400/10 flex flex-col items-center">
              <span className="text-[10px] text-orange-200 font-display tracking-widest uppercase mb-2">Instantly Prepare</span>
              <button
                onClick={startShakingDemo}
                disabled={shaking}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 disabled:opacity-50 text-luxury-black font-display font-bold text-xs py-2.5 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                {shaking ? (
                  <span className="animate-pulse">SHAKING MIXER ({shakeCount}/6)...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5" /> ACTIVATE VIRTUAL SHAKER
                  </>
                )}
              </button>
              {preparationComplete && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-gold-300 mt-2 text-center font-mono"
                >
                  ✓ Blend optimized. Standard steps checked!
                </motion.p>
              )}
            </div>
          </div>

          {/* Right Side: Step-by-Step Preparation Deck */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 p-6 md:p-8 flex flex-col h-full shadow-2xl bento-glow relative overflow-hidden">
              
              {/* Story */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-950/40 text-gold-300 text-[10px] font-mono tracking-wider mb-2">
                  <Compass className="w-3" /> Brand Chronicles
                </div>
                <h4 className="text-xl font-display text-white mb-2">Heritage Origin</h4>
                <p className="text-zinc-300 text-sm leading-relaxed font-serif italic font-light">
                  {activeRecipe.story}
                </p>
              </div>

              <div className="border-t border-gold-400/10 my-6" />

              {/* Recipe Ingredients */}
              <div className="mb-8">
                <h4 className="text-lg font-display text-white mb-3">Royal Elixirs Required</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeRecipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-luxury-gray/40 border border-gold-400/5 hover:border-gold-400/10 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-gold-400" />
                      <span className="text-zinc-300 text-xs md:text-sm font-light">{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preparation Steps Selector */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-display text-white">Artisanal Sequence</h4>
                  <div className="text-xs font-mono text-gold-300 bg-gold-400/5 px-2 py-1 rounded-md border border-gold-400/10">
                    {progressPercent}% Cleared
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 w-full bg-zinc-800 rounded-full mb-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 through-gold-300 to-gold-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="space-y-3.5">
                  {activeRecipe.instructions.map((step, idx) => {
                    const stepKey = `${activeTab}-${idx}`;
                    const isCompleted = completedSteps[stepKey] || false;
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex gap-4 ${
                          isCompleted
                            ? 'bg-gold-950/20 border-gold-400/40 opacity-80'
                            : 'bg-luxury-gray/20 border-gold-400/5 hover:-translate-y-0.5 hover:border-gold-400/15'
                        }`}
                      >
                        <button
                          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isCompleted
                              ? 'bg-gold-500 border-gold-500 text-luxury-black'
                              : 'border-zinc-500 text-transparent'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </button>

                        <div className="flex-1 space-y-1">
                          <span className={`text-[10px] font-mono uppercase tracking-widest ${isCompleted ? 'text-gold-400' : 'text-zinc-500'}`}>
                            Stage {idx + 1}
                          </span>
                          <p className={`text-xs md:text-sm leading-relaxed ${isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-100'}`}>
                            {step}
                          </p>
                        </div>

                        <ChevronRight className={`w-4 h-4 mt-1 self-center transition-transform ${isCompleted ? 'rotate-90 text-gold-500' : 'text-zinc-500'}`} />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
