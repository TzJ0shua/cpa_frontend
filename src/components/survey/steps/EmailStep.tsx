import { useState, type FormEvent } from 'react'
import { cx } from '../../../utils/classnames'
import { Button } from '../ui/Button'
import { IconBadge } from '../ui/IconBadge'

interface EmailStepProps {
  email: string
  onEmailChange: (email: string) => void
  onNext: () => void
}

function AnonymityBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
      <span aria-hidden="true">OK</span>
      Pesquisa Anônima
    </div>
  )
}

export function EmailStep({ email, onEmailChange, onNext }: EmailStepProps) {
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  const validateEmail = (value: string) => {
    if (!value.trim()) return 'O e-mail é obrigatório'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Digite um e-mail válido'
    return ''
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const validationError = validateEmail(email)
    setError(validationError)
    setTouched(true)
    if (!validationError) onNext()
  }

  const handleEmailChange = (value: string) => {
    onEmailChange(value)
    if (touched) setError(validateEmail(value))
  }

  return (
    <section className="survey-enter w-full max-w-xl px-4">
      <div className="mb-8 text-center">
        <AnonymityBadge />
        <h1 className="mt-6 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
          Pesquisa de Satisfação Acadêmica
        </h1>
        <p className="mt-3 text-lg text-slate-600">Sua opinião ajuda a melhorar a qualidade do ensino.</p>
      </div>

      <form
        className="rounded-lg border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-900/10 sm:p-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-relaxed text-slate-600">
          <IconBadge tone="soft">ID</IconBadge>
          <p>
            As respostas desta pesquisa são tratadas de forma <strong className="text-slate-950">anônima</strong>.
            Seu e-mail será usado apenas para confirmar a participação.
          </p>
        </div>

        <label className="grid gap-2 text-sm font-bold text-slate-700">
          E-mail
          <input
            className={cx(
              'h-12 rounded-lg border bg-white px-4 text-base text-slate-950 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10',
              error && touched ? 'border-red-400' : 'border-slate-300',
            )}
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onBlur={() => setTouched(true)}
            onChange={(event) => handleEmailChange(event.target.value)}
          />
          {error && touched ? <small className="font-semibold text-red-600">{error}</small> : null}
        </label>

        <Button className="mt-6 w-full" type="submit">Continuar</Button>
        <small className="mt-5 block text-center text-xs font-medium text-slate-500">
          Suas respostas são protegidas e anônimas
        </small>
      </form>
    </section>
  )
}
