/**
 * The approved Bridgeframe V2 is used as one consistent company symbol.
 * Source artwork: public/brand/bridgeframe-icon-on-*.svg
 * Keep the geometry in sync with the exported master vectors.
 */
export function BrandSymbol({ onDark = false, size = 40 }: { onDark?: boolean; size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 128 128" fill="none" aria-hidden="true" focusable="false">
      <path d="M16 16H80V32H32V80H16Z" fill={onDark ? '#F8FAFC' : '#0A2836'} />
      <path d="M96 48H112V112H48V96H96Z" fill={onDark ? '#10B981' : '#059669'} />
      <path d="M43 73L73 43L85 55L55 85Z" fill="#F4B843" />
    </svg>
  );
}

export function BrandLogo() {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Joeltech Geek Systems">
      <span className="shrink-0 dark:hidden"><BrandSymbol size={37} /></span>
      <span className="hidden shrink-0 dark:block"><BrandSymbol size={37} onDark /></span>
      <span className="flex min-w-0 flex-col justify-center uppercase leading-none" aria-hidden="true">
        <span className="whitespace-nowrap text-base font-extrabold tracking-tight text-[#0A2836] dark:text-[#F8FAFC]">JOELTECH</span>
        <span className="mt-1 whitespace-nowrap text-[9px] font-bold tracking-[0.16em] text-[#059669] dark:text-[#10B981]">GEEK SYSTEMS</span>
      </span>
    </span>
  );
}
