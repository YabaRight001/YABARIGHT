'use client';

import React, { useState } from 'react';
import { Sparkles, Check, Info, ShieldCheck, Ruler, User, Flame } from 'lucide-react';

export interface BodyTypeInfo {
  id: 'Small' | 'Medium' | 'Large' | 'XL' | 'XXL' | 'XXXL';
  label: string;
  name: string;
  chest: string;
  waist: string;
  height: string;
  description: string;
  build: string;
  svgColor: string;
  // Stylized anatomical SVG path for shirtless torso archetype
  svgPath: string;
  shoulderWidth: number;
  waistWidth: number;
  chestDepth: number;
}

export const BODY_TYPES: BodyTypeInfo[] = [
  {
    id: 'Small',
    label: 'S',
    name: 'Small (Lean / Slim Fit)',
    chest: '34" – 36" (86 – 91 cm)',
    waist: '28" – 30" (71 – 76 cm)',
    height: '5\'4" – 5\'8"',
    description: 'Slender, narrow frame with streamlined shoulders and tapered waist.',
    build: 'Ectomorph / Slim Torso',
    svgColor: '#38bdf8',
    shoulderWidth: 64,
    waistWidth: 42,
    chestDepth: 48,
    svgPath: 'M50 15 C40 15 36 28 32 38 C28 48 30 75 33 95 L67 95 C70 75 72 48 68 38 C64 28 60 15 50 15 Z',
  },
  {
    id: 'Medium',
    label: 'M',
    name: 'Medium (Athletic / Regular)',
    chest: '38" – 40" (96 – 101 cm)',
    waist: '31" – 33" (78 – 84 cm)',
    height: '5\'7" – 5\'11"',
    description: 'Balanced athletic build, V-taper chest with defined natural proportions.',
    build: 'Mesomorph / Athletic Torso',
    svgColor: '#4ade80',
    shoulderWidth: 74,
    waistWidth: 48,
    chestDepth: 56,
    svgPath: 'M50 14 C38 14 32 26 28 38 C24 50 27 75 31 95 L69 95 C73 75 76 50 72 38 C68 26 62 14 50 14 Z',
  },
  {
    id: 'Large',
    label: 'L',
    name: 'Large (Broad / Muscular)',
    chest: '41" – 43" (104 – 109 cm)',
    waist: '34" – 36" (86 – 91 cm)',
    height: '5\'9" – 6\'2"',
    description: 'Wide shoulder span, muscular upper torso and solid chest prominence.',
    build: 'Robust Mesomorph / Broad Build',
    svgColor: '#FFD700',
    shoulderWidth: 84,
    waistWidth: 54,
    chestDepth: 64,
    svgPath: 'M50 13 C35 13 28 25 24 38 C20 52 24 75 29 95 L71 95 C76 75 80 52 76 38 C72 25 65 13 50 13 Z',
  },
  {
    id: 'XL',
    label: 'XL',
    name: 'XL (Solid / Heavy Build)',
    chest: '44" – 46" (112 – 117 cm)',
    waist: '37" – 39" (94 – 99 cm)',
    height: '5\'10" – 6\'3"',
    description: 'Deep chest depth, wide ribcage with substantial torso presence.',
    build: 'Solid Frame / Endomorph-Meso',
    svgColor: '#fb923c',
    shoulderWidth: 90,
    waistWidth: 62,
    chestDepth: 72,
    svgPath: 'M50 12 C32 12 25 25 21 38 C17 54 22 75 27 95 L73 95 C78 75 83 54 79 38 C75 25 68 12 50 12 Z',
  },
  {
    id: 'XXL',
    label: 'XXL',
    name: 'XXL (Fuller / Heavy-Set)',
    chest: '47" – 50" (119 – 127 cm)',
    waist: '40" – 43" (101 – 109 cm)',
    height: '5\'10" – 6\'4"',
    description: 'Generous torso circumference, wide waistline and broad chest clearance.',
    build: 'Endomorph / Full Torso Build',
    svgColor: '#f87171',
    shoulderWidth: 96,
    waistWidth: 70,
    chestDepth: 80,
    svgPath: 'M50 12 C30 12 22 25 18 39 C14 56 19 75 25 95 L75 95 C81 75 86 56 82 39 C78 25 70 12 50 12 Z',
  },
  {
    id: 'XXXL',
    label: 'XXXL',
    name: 'XXXL (Plus / Extra-Full)',
    chest: '51" – 54" (130 – 137 cm)',
    waist: '44" – 48" (112 – 122 cm)',
    height: '5\'10" – 6\'5"',
    description: 'Maximal torso depth and width for relaxed comfort and unrestricted drape.',
    build: 'Plus Size / Maximum Frame',
    svgColor: '#c084fc',
    shoulderWidth: 100,
    waistWidth: 78,
    chestDepth: 88,
    svgPath: 'M50 11 C28 11 19 25 15 40 C11 58 17 75 23 95 L77 95 C83 75 89 58 85 40 C81 25 72 11 50 11 Z',
  },
];

interface BodyTypeVisualizerProps {
  selectedBodyTypes?: ('Small' | 'Medium' | 'Large' | 'XL' | 'XXL' | 'XXXL')[];
  onChange?: (types: ('Small' | 'Medium' | 'Large' | 'XL' | 'XXL' | 'XXXL')[]) => void;
  readOnly?: boolean;
  compact?: boolean;
}

export function BodyTypeVisualizer({
  selectedBodyTypes = [],
  onChange,
  readOnly = false,
  compact = false,
}: BodyTypeVisualizerProps) {
  const [activePreview, setActivePreview] = useState<BodyTypeInfo>(BODY_TYPES[1]); // Default Medium

  const handleToggle = (id: 'Small' | 'Medium' | 'Large' | 'XL' | 'XXL' | 'XXXL') => {
    if (readOnly || !onChange) return;
    if (selectedBodyTypes.includes(id)) {
      onChange(selectedBodyTypes.filter((t) => t !== id));
    } else {
      onChange([...selectedBodyTypes, id]);
    }
  };

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-[#161616] p-4 sm:p-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFD700]/15 border border-[#FFD700]/30 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#FFD700]">
              <Sparkles className="h-3 w-3" />
              AI Body Sizing Guide
            </span>
            <span className="text-xs text-gray-400">Torso Silhouette Archetypes</span>
          </div>
          <h3 className="text-base font-black text-white mt-1">
            {readOnly ? 'Recommended Body Type Fits' : 'Select Target Body Types for this Product'}
          </h3>
        </div>
        {!readOnly && (
          <span className="text-xs text-gray-400">
            Click cards to tag recommended body builds
          </span>
        )}
      </div>

      {/* Grid of Body Types */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        {BODY_TYPES.map((type) => {
          const isSelected = selectedBodyTypes.includes(type.id);
          const isHovered = activePreview.id === type.id;

          return (
            <div
              key={type.id}
              onClick={() => {
                setActivePreview(type);
                if (!readOnly) handleToggle(type.id);
              }}
              onMouseEnter={() => setActivePreview(type)}
              className={`relative cursor-pointer rounded-2xl border p-3.5 transition-all flex flex-col items-center text-center ${
                isSelected
                  ? 'border-[#FFD700] bg-[#FFD700]/10 shadow-lg shadow-[#FFD700]/10 scale-[1.02]'
                  : isHovered
                  ? 'border-white/30 bg-white/5'
                  : 'border-white/5 bg-black/40 hover:border-white/20'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-[#FFD700] text-black flex items-center justify-center shadow-sm">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              )}

              {/* Archetype Torso Visual Representation */}
              <div className="relative w-20 h-24 my-2 flex items-center justify-center">
                <svg viewBox="0 0 100 110" className="w-full h-full drop-shadow-md">
                  {/* Outer glow */}
                  <defs>
                    <radialGradient id={`glow-${type.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={type.svgColor} stopOpacity="0.3" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>
                  
                  {/* Background Torso Shadow */}
                  <circle cx="50%" cy="50%" r="45%" fill={`url(#glow-${type.id})`} />
                  
                  {/* Torso Silhouette Outline (Shirtless anatomical archetype) */}
                  <path
                    d={type.svgPath}
                    fill={isSelected ? type.svgColor : '#222222'}
                    fillOpacity={isSelected ? 0.35 : 0.6}
                    stroke={isSelected ? '#FFD700' : type.svgColor}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    strokeLinejoin="round"
                  />
                  
                  {/* Chest / Pectoral & Ab Definition lines */}
                  <path
                    d="M38 35 Q50 40 62 35"
                    stroke={type.svgColor}
                    strokeWidth="1.2"
                    strokeOpacity="0.7"
                    fill="none"
                  />
                  <path
                    d="M50 25 L50 70"
                    stroke={type.svgColor}
                    strokeWidth="1"
                    strokeOpacity="0.4"
                    fill="none"
                  />
                  <path
                    d="M42 55 Q50 58 58 55"
                    stroke={type.svgColor}
                    strokeWidth="1"
                    strokeOpacity="0.5"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Label & Measurements */}
              <span className="text-xs font-black uppercase tracking-wider text-white">
                {type.id}
              </span>
              <span className="text-[10px] font-bold text-[#FFD700] mt-0.5">
                Chest {type.chest.split(' ')[0]}
              </span>
              <span className="text-[9px] text-gray-400 mt-0.5 truncate max-w-full">
                Waist {type.waist.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Dynamic Detail Card of Active Preview */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-black/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center border font-black text-lg shadow-md flex-shrink-0"
            style={{
              backgroundColor: `${activePreview.svgColor}15`,
              borderColor: activePreview.svgColor,
              color: activePreview.svgColor,
            }}
          >
            {activePreview.label}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white">{activePreview.name}</h4>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-gray-300">
                {activePreview.build}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{activePreview.description}</p>
          </div>
        </div>

        {/* Specifications Matrix */}
        <div className="flex items-center gap-4 text-xs font-mono bg-white/[0.03] border border-white/5 px-4 py-2 rounded-xl flex-shrink-0">
          <div>
            <span className="text-gray-400 block text-[9px] uppercase">Chest:</span>
            <span className="font-bold text-white">{activePreview.chest}</span>
          </div>
          <div className="border-l border-white/10 pl-4">
            <span className="text-gray-400 block text-[9px] uppercase">Waist:</span>
            <span className="font-bold text-[#FFD700]">{activePreview.waist}</span>
          </div>
          <div className="border-l border-white/10 pl-4 hidden md:block">
            <span className="text-gray-400 block text-[9px] uppercase">Height:</span>
            <span className="font-bold text-gray-300">{activePreview.height}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
