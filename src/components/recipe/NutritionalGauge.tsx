
import { motion } from 'framer-motion'
import { NUTRIENT_TARGETS } from '../../types/recipe'
import { getNutrientStatus } from '../../utils/nutritionCalculator'
interface NutritionalGaugeProps {
  nutrientKey: string
  value: number
  label: string
}
export function NutritionalGauge({
  nutrientKey,
  value,
  label,
}: NutritionalGaugeProps) {
  const target = NUTRIENT_TARGETS[nutrientKey]
  const status = getNutrientStatus(nutrientKey, value)
  // Calculate percentage for needle (clamped 0-100 based on min/max)
  const percentage = Math.min(
    100,
    Math.max(0, ((value - target.min) / (target.max - target.min)) * 100),
  )
  const rotation = -90 + (percentage / 100) * 180 // -90 to 90 degrees
  const statusColors = {
    optimal: '#22c55e',
    caution: '#eab308',
    warning: '#ef4444', // red-500
  }
  const color = statusColors[status]
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="relative w-32 h-16 overflow-hidden mb-2">
        {/* Background Arc */}
        <div className="absolute w-32 h-32 rounded-full border-12px border-gray-100 top-0 left-0 box-border" />

        {/* Active Arc - Using SVG for precise control */}
        <svg
          className="absolute top-0 left-0 w-32 h-32 rotate-180"
          viewBox="0 0 128 128"
        >
          {/* We only want the top half, but since we rotated the container, we draw the bottom half of the circle in SVG logic */}
          <motion.circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray="182" // Approx circumference of half circle (2*pi*58 / 2)
            strokeDashoffset={182 - (182 * percentage) / 100}
            strokeLinecap="round"
            className="transition-colors duration-500"
            initial={{
              strokeDashoffset: 182,
            }}
            animate={{
              strokeDashoffset: 182 - (182 * percentage) / 100,
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-1 h-14 origin-bottom bg-gray-800 rounded-full z-10"
          initial={{
            rotate: -90,
          }}
          animate={{
            rotate: rotation,
          }}
          transition={{
            type: 'spring',
            stiffness: 60,
            damping: 15,
          }}
          style={{
            x: '-50%',
          }}
        />

        {/* Center Pivot */}
        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gray-800 rounded-full -translate-x-1/2 translate-y-1/2 z-20 border-2 border-white" />
      </div>

      <div className="text-center">
        <h4 className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">
          {label}
        </h4>
        <div className="flex items-baseline justify-center gap-1">
          <span
            className={`text-xl font-bold transition-colors duration-300`}
            style={{
              color,
            }}
          >
            {value.toFixed(nutrientKey === 'energy' ? 0 : 1)}
          </span>
          <span className="text-xs text-gray-400">{target.unit}</span>
        </div>
        <div className="text-[10px] text-gray-400 mt-1">
          Target: {target.idealMin}-{target.idealMax}
        </div>
      </div>
    </div>
  )
}
