import { IconBadge } from '../survey/ui/IconBadge'

export function AppHeader() {
  return (
    <header className="px-4 pb-4 pt-6 sm:pt-8">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-3">
        <IconBadge>CPA</IconBadge>
        <div className="leading-tight">
          <strong className="block text-lg font-black text-slate-950 sm:text-xl">FeMASS</strong>
          <span className="text-xs font-medium text-slate-500">Faculdade Municipal Miguel Ângelo da Silva Santos</span>
        </div>
      </div>
    </header>
  )
}
