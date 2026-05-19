export function AppHeader() {
  return (
    <header className="px-4 pb-4 pt-6 sm:pt-8">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3">
        <img
          className="h-14 w-auto rounded-md object-contain sm:h-16"
          src="/logo_femass.svg"
          alt="FeMASS"
        />
        <div className="leading-tight">
          <strong className="block text-lg font-black text-slate-950 sm:text-xl">FeMASS</strong>
          <span className="text-xs font-medium text-slate-500">Faculdade Municipal Miguel Ângelo da Silva Santos</span>
        </div>
      </div>
    </header>
  )
}
