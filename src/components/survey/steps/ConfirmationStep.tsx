import { Button } from '../ui/Button'
import { IconBadge } from '../ui/IconBadge'

interface ConfirmationStepProps {
  email: string
  totalMaterias: number
  onNewResponse: () => void
}

export function ConfirmationStep({
  email,
  totalMaterias,
  onNewResponse,
}: ConfirmationStepProps) {
  return (
    <section className="survey-enter w-full max-w-xl px-4">
      <div className="mb-8 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-4xl font-black text-emerald-600">
          OK
        </div>
        <h2 className="mt-6 text-3xl font-black text-slate-950 sm:text-4xl">Participação Registrada!</h2>
        <p className="mt-3 text-lg text-slate-600">Obrigado por contribuir com a melhoria do ensino.</p>
      </div>

      <div className="mb-5 rounded-lg border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-900/10">
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-slate-600">
          <IconBadge tone="success">ID</IconBadge>
          <p>
            <strong className="text-slate-950">Código de Confirmação</strong>
            <br />
            Um código de confirmação será enviado para <strong className="text-slate-950">{email}</strong>.
          </p>
        </div>
        <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
          Você respondeu pesquisas para <strong className="font-black text-blue-700">{totalMaterias}</strong>{' '}
          {totalMaterias === 1 ? 'matéria' : 'matérias'}.
        </p>
      </div>

      <Button className="w-full" onClick={onNewResponse}>Nova Resposta</Button>
      <small className="mt-4 block text-center text-xs font-medium text-slate-500">
        Você pode fechar esta página ou iniciar uma nova pesquisa.
      </small>
    </section>
  )
}
