/** Compact SVG gooey filter — merges sibling blobs on the theme toggle. */
export function GooeyFilterDefs() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
    >
      <defs>
        <filter
          id="gooey-oil-water"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 18 -8
            "
          />
        </filter>
      </defs>
    </svg>
  )
}
