import { useState, type FormEvent } from 'react'
import type { ParticipantType } from '../../../lib/survey-types'
import { cx } from '../../../utils/classnames'
import { Button } from '../ui/Button'
import { IconBadge } from '../ui/IconBadge'

interface ParticipantStepProps {
  cpf: string
  matricula: string
  participantType: ParticipantType | null
  onCpfChange: (cpf: string) => void
  onMatriculaChange: (matricula: string) => void
  onParticipantTypeChange: (participantType: ParticipantType) => void
  onNext: () => void
}

const participantOptions: Array<{
  value: ParticipantType
  title: string
  description: string
}> = [
  {
    value: 'estudante',
    title: 'Estudante',
    description: 'Estou respondendo como discente da FeMASS.',
  },
  {
    value: 'docente',
    title: 'Docente',
    description: 'Estou respondendo como professor(a) da FeMASS.',
  },
]

function AnonymityBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
      <span aria-hidden="true">OK</span>
      Pesquisa confidencial
    </div>
  )
}

const onlyDigits = (value: string) => value.replace(/\D/g, '')

const formatCpf = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function ParticipantStep({
  cpf,
  matricula,
  participantType,
  onCpfChange,
  onMatriculaChange,
  onParticipantTypeChange,
  onNext,
}: ParticipantStepProps) {
  const [cpfError, setCpfError] = useState('')
  const [matriculaError, setMatriculaError] = useState('')
  const [participantError, setParticipantError] = useState('')
  const [touched, setTouched] = useState(false)

  const validateCpf = (value: string) => {
    const digits = onlyDigits(value)
    if (!digits) return 'O CPF é obrigatório'
    if (digits.length !== 11) return 'Digite um CPF com 11 dígitos'
    return ''
  }

  const validateMatricula = (value: string) => {
    const digits = onlyDigits(value)
    if (!digits) return 'A matrícula é obrigatória'
    if (digits.length !== 10) return 'Digite uma matrícula com 10 dígitos'
    return ''
  }

  const validateForm = () => {
    const nextCpfError = validateCpf(cpf)
    const nextMatriculaError = validateMatricula(matricula)
    const nextParticipantError = participantType ? '' : 'Selecione o tipo de participante'

    setCpfError(nextCpfError)
    setMatriculaError(nextMatriculaError)
    setParticipantError(nextParticipantError)
    setTouched(true)

    return !nextCpfError && !nextMatriculaError && !nextParticipantError
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (validateForm()) onNext()
  }

  const handleCpfChange = (value: string) => {
    const nextCpf = formatCpf(value)
    onCpfChange(nextCpf)
    if (touched) setCpfError(validateCpf(nextCpf))
  }

  const handleMatriculaChange = (value: string) => {
    const nextMatricula = onlyDigits(value).slice(0, 10)
    onMatriculaChange(nextMatricula)
    if (touched) setMatriculaError(validateMatricula(nextMatricula))
  }

  const handleParticipantTypeChange = (value: ParticipantType) => {
    onParticipantTypeChange(value)
    if (touched) setParticipantError('')
  }

  return (
    <section className="survey-enter w-full max-w-2xl px-4">
      <div className="mb-8 text-center">
        <AnonymityBadge />
        <h1 className="mt-6 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
          Pesquisa de Satisfação Acadêmica
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
          Informe seu CPF, sua matrícula e selecione como você participará da avaliação.
        </p>
      </div>

      <form
        className="rounded-lg border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-900/10 sm:p-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-relaxed text-slate-600">
          <IconBadge tone="soft">ID</IconBadge>
          <p>
            As respostas são confidenciais e utilizadas exclusivamente para avaliação institucional e melhoria acadêmica.
            CPF e matrícula serão usados apenas para identificar a participação.
          </p>
        </div>

        <div className="grid gap-6">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            CPF
            <input
              className={cx(
                'h-12 rounded-lg border bg-white px-4 text-base text-slate-950 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10',
                cpfError && touched ? 'border-red-400' : 'border-slate-300',
              )}
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpf}
              aria-invalid={Boolean(cpfError && touched)}
              aria-describedby={cpfError && touched ? 'cpf-error' : undefined}
              onBlur={() => {
                setTouched(true)
                setCpfError(validateCpf(cpf))
              }}
              onChange={(event) => handleCpfChange(event.target.value)}
            />
            {cpfError && touched ? (
              <small className="font-semibold text-red-600" id="cpf-error">
                {cpfError}
              </small>
            ) : null}
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Matrícula
            <input
              className={cx(
                'h-12 rounded-lg border bg-white px-4 text-base text-slate-950 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10',
                matriculaError && touched ? 'border-red-400' : 'border-slate-300',
              )}
              type="text"
              inputMode="numeric"
              placeholder="Informe sua matrícula"
              value={matricula}
              aria-invalid={Boolean(matriculaError && touched)}
              aria-describedby={matriculaError && touched ? 'matricula-error' : undefined}
              onBlur={() => {
                setTouched(true)
                setMatriculaError(validateMatricula(matricula))
              }}
              onChange={(event) => handleMatriculaChange(event.target.value)}
            />
            {matriculaError && touched ? (
              <small className="font-semibold text-red-600" id="matricula-error">
                {matriculaError}
              </small>
            ) : null}
          </label>

          <fieldset className="grid gap-3">
            <legend className="text-sm font-bold text-slate-700">Tipo de participante</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {participantOptions.map((option) => {
                const selected = participantType === option.value

                return (
                  <button
                    className={cx(
                      'rounded-lg border p-4 text-left transition hover:border-blue-300 hover:bg-blue-50',
                      selected
                        ? 'border-blue-700 bg-blue-50 ring-4 ring-blue-700/10'
                        : 'border-slate-200 bg-white',
                    )}
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleParticipantTypeChange(option.value)}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={cx(
                          'mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 text-[10px] font-black',
                          selected ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 text-transparent',
                        )}
                        aria-hidden="true"
                      >
                        OK
                      </span>
                      <span>
                        <strong className="block text-slate-950">{option.title}</strong>
                        <small className="mt-1 block text-sm font-medium text-slate-500">{option.description}</small>
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
            {participantError && touched ? (
              <small className="font-semibold text-red-600">{participantError}</small>
            ) : null}
          </fieldset>
        </div>

        <Button className="mt-6 w-full" type="submit">Continuar</Button>
      </form>
    </section>
  )
}
