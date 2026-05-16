import { perguntas } from '../../../lib/survey-data'
import type { Materia, Respostas } from '../../../lib/survey-types'
import { Actions } from '../ui/Actions'
import { Button } from '../ui/Button'
import { IconBadge } from '../ui/IconBadge'
import { RatingScale } from '../ui/RatingScale'

interface QuestionnaireStepProps {
  materia: Materia
  respostas: Respostas
  onRespostasChange: (respostas: Respostas) => void
  currentIndex: number
  totalMaterias: number
  onPrevious: () => void
  onNext: () => void
  isLast: boolean
  isSubmitting: boolean
}

export function QuestionnaireStep({
  materia,
  respostas,
  onRespostasChange,
  currentIndex,
  totalMaterias,
  onPrevious,
  onNext,
  isLast,
  isSubmitting,
}: QuestionnaireStepProps) {
  const allQuestionsAnswered = perguntas.every((pergunta) => respostas[pergunta.id] > 0)

  const handleRatingChange = (key: keyof Respostas, value: number) => {
    onRespostasChange({ ...respostas, [key]: value })
  }

  return (
    <section className="survey-enter w-full max-w-2xl px-4">
      <div className="mb-6 text-center">
        <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
          Matéria {currentIndex + 1} de {totalMaterias}
        </span>
        <h2 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">Avaliação da Matéria</h2>
      </div>

      <div className="mb-6 grid gap-7 rounded-lg border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-900/10 sm:p-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
          <IconBadge>MAT</IconBadge>
          <h3 className="text-xl font-black text-slate-950">{materia.nome}</h3>
        </div>

        {perguntas.map((pergunta) => (
          <RatingScale
            key={pergunta.id}
            label={pergunta.texto}
            value={respostas[pergunta.id]}
            onChange={(value) => handleRatingChange(pergunta.id, value)}
          />
        ))}

        <label className="grid gap-3 border-t border-slate-200 pt-5 text-sm font-bold text-slate-700">
          Comentários adicionais (opcional)
          <textarea
            className="min-h-28 resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-base font-normal text-slate-950 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-700/10"
            placeholder="Deixe aqui seus comentários, sugestões ou observações sobre a matéria..."
            value={respostas.comentario}
            onChange={(event) =>
              onRespostasChange({ ...respostas, comentario: event.target.value })
            }
          />
        </label>
      </div>

      <Actions>
        <Button variant="secondary" onClick={onPrevious}>
          {currentIndex === 0 ? 'Voltar' : 'Matéria Anterior'}
        </Button>
        <Button disabled={!allQuestionsAnswered || isSubmitting} onClick={onNext}>
          {isSubmitting ? 'Enviando...' : isLast ? 'Finalizar Pesquisa' : 'Próxima Matéria'}
        </Button>
      </Actions>
      {!allQuestionsAnswered ? (
        <p className="mt-4 text-center text-sm font-medium text-slate-500">Responda todas as perguntas para continuar</p>
      ) : null}
    </section>
  )
}
