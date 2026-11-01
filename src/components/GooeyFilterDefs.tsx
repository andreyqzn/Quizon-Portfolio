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
          x="-60%"
          y="-60%"
          width="220%"
          height="220%"
          colorInterpolationFilters="sRGB"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 19 -9
            "
          />
        </filter>
      </defs>
    </svg>
  )
}
