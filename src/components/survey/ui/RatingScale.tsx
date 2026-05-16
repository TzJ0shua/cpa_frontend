import { cx } from '../../../utils/classnames'

interface RatingScaleProps {
  value: number
  onChange: (value: number) => void
  label: string
}

export function RatingScale({ value, onChange, label }: RatingScaleProps) {
  return (
    <div className="grid gap-3">
      <p className="font-bold text-slate-800">{label}</p>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            className={cx(
              'h-12 rounded-lg border-2 text-lg font-black transition hover:-translate-y-0.5 hover:border-blue-400',
              value === rating
                ? 'border-blue-700 bg-blue-700 text-white shadow-md shadow-blue-900/20'
                : 'border-transparent bg-slate-100 text-slate-500',
            )}
            key={rating}
            onClick={() => onChange(rating)}
            type="button"
          >
            {rating}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs font-medium text-slate-500">
        <span>Muito insatisfeito</span>
        <span>Muito satisfeito</span>
      </div>
    </div>
  )
}
