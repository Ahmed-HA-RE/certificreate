export function Header() {
  return (
    <header className='flex items-center justify-between gap-4 border-b border-border px-4 py-5 md:px-8'>
      <div className='flex items-center gap-3 text-base font-bold'>
        <span
          aria-hidden='true'
          className='grid size-[26px] place-items-center rounded-sm border-[3px] border-double border-primary font-cert-display text-base leading-none font-bold text-primary-hover'
        >
          C
        </span>
        Certificreate
      </div>
      <span className='hidden text-[13px] text-muted-foreground sm:inline'>
        Everything is saved in this browser only
      </span>
    </header>
  );
}
