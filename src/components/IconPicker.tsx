import { BRAND_ICON_OPTIONS } from '../data/brandIcons'
import { BrandIcon } from './BrandIcon'
import { cn } from '../lib/cn'

type IconPickerProps = {
  value: string
  onChange: (slug: string) => void
  inputClassName?: string
}

export function IconPicker({ value, onChange, inputClassName }: IconPickerProps) {
  const known = BRAND_ICON_OPTIONS.some((opt) => opt.slug === value)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-well">
        <BrandIcon slug={value || 'link'} className="h-4 w-4" />
      </span>
      <select
        className={cn(inputClassName, 'min-w-[10rem] flex-1')}
        value={known ? value : '__custom__'}
        onChange={(e) => {
          if (e.target.value === '__custom__') onChange('')
          else onChange(e.target.value)
        }}
        aria-label="Brand icon"
      >
        {BRAND_ICON_OPTIONS.map((opt) => (
          <option key={opt.slug} value={opt.slug}>
            {opt.label}
          </option>
        ))}
        <option value="__custom__">Custom slug…</option>
      </select>
      {!known ? (
        <input
          className={cn(inputClassName, 'min-w-[8rem] flex-1')}
          value={value}
          onChange={(e) => onChange(e.target.value.trim().toLowerCase())}
          placeholder="simpleicons slug"
          aria-label="Custom icon slug"
        />
      ) : null}
    </div>
  )
}
