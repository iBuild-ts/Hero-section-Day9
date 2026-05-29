import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Award, RotateCcw, ArrowRight, HeartPulse, ShieldAlert, CheckCircle } from 'lucide-react';
import { Question } from '../types';

const QUESTIONS: Question[] = [
  {
    id: 'vibe',
    text: 'What atmospheric envelope matches your mood tonight?',
    options: [
      {
        label: 'Sunset Yacht Party',
        description: 'Brisk sea breeze, glittering amber horizons, and golden house music.',
        points: { orange: 3, strawberry: 1, chocolate: 0 }
      },
      {
        label: 'Gala Opera VIP box',
        description: 'Crisp tuxedo silk, crimson carpet pathways, and celebratory fizz.',
        points: { orange: 1, strawberry: 3, chocolate: 0 }
      },
      {
        label: 'Velvet Midnight Lounge',
        description: 'Deep vinyl acoustics, dark mahogany tables, and smoky warm lowtones.',
        points: { orange: 0, strawberry: 1, chocolate: 3 }
      }
    ]
  },
  {
    id: 'base',
    text: 'Select your preferred botanical trigger or scent notes:',
    options: [
      {
        label: 'Tangerine & Zesty Herbs',
        description: 'Bright citrus peels, crushed ginger roots, and dry cedar bark.',
        points: { orange: 3, strawberry: 0, chocolate: 0 }
      },
      {
        label: 'Wild Berry Blossom & Jasmine',
        description: 'Sugared strawberries, organic lavender buds, and crisp apple mists.',
        points: { orange: 0, strawberry: 3, chocolate: 0 }
      },
      {
        label: 'Burnt Caramel & Dark Roast Espresso',
        description: 'Rich roasted cacao pods, vanilla bean resins, and direct toasted cardamom.',
        points: { orange: 0, strawberry: 0, chocolate: 3 }
      }
    ]
  },
  {
    id: 'sensation',
    text: 'The ideal texture and finish you look for on the palate:',
    options: [
      {
        label: 'Effervescent & Zippy',
        description: 'A carbonated rush that cleanses tongue cells and awakens focus.',
        points: { orange: 3, strawberry: 1, chocolate: 0 }
      },
      {
        label: 'Smooth, Fruity & Velvet',
        description: 'Rich succulent juice that glides softly with natural balanced sugars.',
        points: { orange: 1, strawberry: 3, chocolate: 1 }
      },
      {
        label: 'Dense, Decadent Cream Wash',
        description: 'A full-bodied viscosity that matches truffles and high-end cigars.',
        points: { orange: 0, strawberry: 1, chocolate: 3 }
      }
    ]
  }
];

interface ProfileResult {
  dominantFlavor: 'Orange' | 'Strawberry' | 'Chocolate';
  title: string;
  description: string;
  intensity: string;
  pairingAdvice: string;
  scores: { orange: number; strawberry: number; chocolate: number };
  glowColor: string;
  cardBg: string;
  image: string;
}

export default function FlavorGenerator() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [scores, setScores] = useState({ orange: 0, strawberry: 0, chocolate: 0 });
  const [selectedInStep, setSelectedInStep] = useState<number | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleOptionSelect = (idx: number) => {
    setSelectedInStep(idx);
  };

  const handleNextStep = () => {
    if (selectedInStep === null) return;

    const chosenOption = QUESTIONS[currentStep].options[selectedInStep];
    
    // Accumulate points
    setScores(prev => ({
      orange: prev.orange + chosenOption.points.orange,
      strawberry: prev.strawberry + chosenOption.points.strawberry,
      chocolate: prev.chocolate + chosenOption.points.chocolate
    }));

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedInStep(null);
    } else {
      setCompleted(true);
    }
  };

  const calculateResult = (): ProfileResult => {
    const { orange, strawberry, chocolate } = scores;
    
    // Find highest
    let dominant: 'Orange' | 'Strawberry' | 'Chocolate' = 'Orange';
    let highest = orange;

    if (strawberry > highest) {
      dominant = 'Strawberry';
      highest = strawberry;
    }
    if (chocolate > highest) {
      dominant = 'Chocolate';
      highest = chocolate;
    }

    if (dominant === 'Orange') {
      return {
        dominantFlavor: 'Orange',
        title: 'Amber Sovereign Aristocrat',
        description: 'You are an absolute seeker of radiant sunlight, crisp luxury transitions, and aromatic citrus horizons. You prioritize zesty focus triggers and high-energy conversations.',
        intensity: 'Vivid • Citric Focus (Level 4.2)',
        pairingAdvice: 'Pair with crystal volcanic ice chunks, citrus oil flame mist, and acoustic house lounge spaces.',
        scores,
        glowColor: 'shadow-orange-500/10 border-orange-500/20',
        cardBg: 'from-orange-950/20 via-neutral-900 to-luxury-black',
        image: 'https://www.image2url.com/r2/default/images/1780037140284-15cae61c-3317-4482-9c00-8f7965105e84.png'
      };
    } else if (dominant === 'Strawberry') {
      return {
        dominantFlavor: 'Strawberry',
        title: 'Satin Crimson Luminary',
        description: 'You possess a refined, sophisticated and playful sweet aura. You thrive in high-society VIP boxes, enjoying sparkling bubbles paired with fresh clarified woodland berry elixirs.',
        intensity: 'Fruity Bliss • High Effervescence (Level 4.8)',
        pairingAdvice: 'Flawlessly served alongside Brut Champagne toppers, rose-water rinsed flutes, and organic edible orchids.',
        scores,
        glowColor: 'shadow-rose-500/10 border-rose-500/25',
        cardBg: 'from-rose-950/25 via-neutral-900 to-luxury-black',
        image: 'https://www.image2url.com/r2/default/images/1780037248537-196d07e7-7b48-4cbd-b950-7d012976b445.png'
      };
    } else {
      return {
        dominantFlavor: 'Chocolate',
        title: 'Imperial Cocoa Alchemist',
        description: 'You are drawn to absolute heavy-bodied depth, dark cacao viscosity, and classical luxury woodiness. You appreciate velvet complexity and slow organic conversation tempo.',
        intensity: 'Dense • Decadent Cocoa Roast (Level 5.0)',
        pairingAdvice: 'Superb when paired with single-origin Venezuelan dark truffle shards and hand-pressed mountain mint oil vapors.',
        scores,
        glowColor: 'shadow-yellow-600/10 border-yellow-700/20',
        cardBg: 'from-amber-950/25 via-neutral-900 to-luxury-black',
        image: 'https://www.image2url.com/r2/default/images/1780037152057-c2077f10-55ce-4411-bc9d-d3dc93e68dab.png'
      };
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setScores({ orange: 0, strawberry: 0, chocolate: 0 });
    setSelectedInStep(null);
    setCompleted(false);
  };

  const currentQuestion = QUESTIONS[currentStep];
  const progressPercent = Math.round(((currentStep) / QUESTIONS.length) * 100);

  return (
    <section className="py-24 px-4 md:px-8 border-y border-gold-800/20 bg-luxury-black relative" id="profile">
      {/* Background soft ambiance lights */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-radial-[circle] from-gold-950/15 via-transparent to-transparent blur-4xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Intro */}
        <div className="text-center mb-16">
          <span className="text-gold-300 font-display text-xs tracking-[0.25em] uppercase block mb-3">Bespoke Profiling</span>
          <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-4">
            Flavor Profile <span className="gold-gradient-text font-serif italic">Generator</span>
          </h2>
          <p className="text-zinc-400 font-light max-w-xl mx-auto text-sm md:text-base">
            Deconstruct your atmospheric preferences to receive your customized royal fluid portrait, mapped out by core taste parameters.
          </p>
        </div>

        {/* Outer Frame */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden min-h-[460px] flex flex-col justify-between bento-glow">
          
          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.35 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  {/* Step indicator */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest bg-gold-950/50 px-2.5 py-1 rounded-md border border-gold-400/10">
                      Metric Layer {currentStep + 1} of {QUESTIONS.length}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      Assessment: {progressPercent}%
                    </span>
                  </div>

                  {/* Question */}
                  <h3 className="text-xl md:text-2xl font-display font-medium text-white mb-6">
                    {currentQuestion.text}
                  </h3>

                  {/* Options Stack */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((opt, idx) => {
                      const isSelected = selectedInStep === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col gap-1.5 relative ${
                            isSelected
                              ? 'bg-[#1b1007]/40 border-gold-400/80 shadow-lg shadow-gold-500/5'
                              : 'bg-black/30 border-white/5 hover:border-white/20'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={`text-sm md:text-base font-display font-semibold ${isSelected ? 'text-gold-300' : 'text-zinc-200'}`}>
                              {opt.label}
                            </span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-gold-500 border-gold-500 text-luxury-black' : 'border-zinc-750'
                            }`}>
                              {isSelected && <CheckCircle className="w-2.5 h-2.5 stroke-[4]" />}
                            </div>
                          </div>
                          <p className={`text-xs leading-relaxed max-w-xl ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>
                            {opt.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Progress bar + Next button */}
                <div className="mt-8 pt-6 border-t border-gold-400/10 flex items-center justify-between">
                  <div className="w-1/3 bg-zinc-850 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-gold-500 h-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  
                  <button
                    onClick={handleNextStep}
                    disabled={selectedInStep === null}
                    className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 disabled:opacity-40 disabled:cursor-not-allowed text-luxury-black font-display font-bold text-xs tracking-wider uppercase rounded-xl flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
                  >
                    Next Layer <ArrowRight className="w-3.5" />
                  </button>
                </div>

              </motion.div>
            ) : (
              /* Profile Evaluation Results Page */
              (() => {
                const result = calculateResult();
                const totalScore = result.scores.orange + result.scores.strawberry + result.scores.chocolate;
                
                return (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="flex flex-col gap-8"
                  >
                    
                    {/* Header */}
                    <div className="text-center">
                      <div className="inline-flex items-center gap-1 bg-gold-400/10 border border-gold-400/35 px-3 py-1 rounded-full text-gold-300 text-[10px] uppercase tracking-widest mb-3">
                        <Award className="w-3.5" /> Dynamic Flavor Certificate Locked
                      </div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Your Signature Archetype</h4>
                    </div>

                    {/* Result Content Card */}
                    <div className={`border rounded-2xl p-6 md:p-8 bg-gradient-to-b ${result.cardBg} ${result.glowColor} transition-all duration-500 flex flex-col md:flex-row gap-8 items-center`}>
                      
                      {/* Left: Glass graphic visualization */}
                      <div className="flex-shrink-0 w-36 h-36 relative flex items-center justify-center bg-zinc-950/40 rounded-full border border-gold-400/10 p-4">
                        <img 
                          src={result.image} 
                          alt={result.dominantFlavor} 
                          className="max-h-28 object-contain drop-shadow-[0_10px_20px_rgba(214,184,112,0.3)] animate-bounce duration-3000"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Right: Text parameters */}
                      <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                          <span className="text-[10px] text-gold-400 font-mono tracking-widest uppercase block mb-1">
                            {result.intensity}
                          </span>
                          <h4 className="text-2xl md:text-3xl font-display font-medium text-white">
                            {result.title}
                          </h4>
                        </div>

                        <p className="text-zinc-300 text-xs md:text-sm font-light leading-relaxed">
                          {result.description}
                        </p>

                        <div className="border-t border-gold-400/10 my-4" />

                        {/* Pairing rule */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-gold-300 font-display uppercase tracking-widest block font-bold">Recommended Service Specs:</span>
                          <p className="text-zinc-400 text-xs italic">
                            {result.pairingAdvice}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Scores Metrics Breakdown (Bento Grid Style) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      <div className="p-4 bg-luxury-black border border-gold-400/5 rounded-xl flex flex-col justify-between">
                        <span className="text-[10px] text-orange-400 font-mono uppercase tracking-widest">Citrus Core</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-display text-white">{scores.orange}</span>
                          <span className="text-zinc-650 text-[10px]">pts</span>
                        </div>
                        <div className="w-full bg-zinc-850 h-1 rounded-full overflow-hidden mt-3">
                          <div className="bg-orange-500 h-full" style={{ width: `${Math.min(100, (scores.orange / totalScore) * 100)}%` }} />
                        </div>
                      </div>

                      <div className="p-4 bg-luxury-black border border-gold-400/5 rounded-xl flex flex-col justify-between">
                        <span className="text-[10px] text-rose-400 font-mono uppercase tracking-widest">Berry Index</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-display text-white">{scores.strawberry}</span>
                          <span className="text-zinc-650 text-[10px]">pts</span>
                        </div>
                        <div className="w-full bg-zinc-850 h-1 rounded-full overflow-hidden mt-3">
                          <div className="bg-rose-500 h-full" style={{ width: `${Math.min(100, (scores.strawberry / totalScore) * 100)}%` }} />
                        </div>
                      </div>

                      <div className="p-4 bg-luxury-black border border-gold-400/5 rounded-xl flex flex-col justify-between">
                        <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest">Cacao Density</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-display text-white">{scores.chocolate}</span>
                          <span className="text-zinc-650 text-[10px]">pts</span>
                        </div>
                        <div className="w-full bg-zinc-850 h-1 rounded-full overflow-hidden mt-3">
                          <div className="bg-amber-600 h-full" style={{ width: `${Math.min(100, (scores.chocolate / totalScore) * 100)}%` }} />
                        </div>
                      </div>

                    </div>

                    {/* Action Bar */}
                    <div className="border-t border-gold-400/10 pt-6 flex justify-between items-center">
                      <p className="text-[11px] text-zinc-500 font-mono">
                        Reference Hash: WP-{result.dominantFlavor.toUpperCase()}-{Date.now().toString(36).substr(-4)}
                      </p>
                      <button
                        onClick={handleReset}
                        className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-gold-400/15 text-gold-300 hover:text-white rounded-xl text-xs font-display tracking-widest uppercase cursor-pointer flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3" /> Re-Assess Profile
                      </button>
                    </div>

                  </motion.div>
                );
              })()
            )}
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
