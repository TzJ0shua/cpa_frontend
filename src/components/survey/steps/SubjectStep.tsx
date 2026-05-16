import type { Materia } from '../../../lib/survey-types'
import { Actions } from '../ui/Actions'
import { Button } from '../ui/Button'
import { OptionButton } from '../ui/OptionButton'
import { StepTitle } from '../ui/StepTitle'

interface SubjectStepProps {
  materias: Materia[]
  selectedSubjectIds: string[]
  onSubjectToggle: (subjectId: string) => void
  onNext: () => void
  onBack: () => void
}

export function SubjectStep({
  materias,
  selectedSubjectIds,
  onSubjectToggle,
  onNext,
  onBack,
}: SubjectStepProps) {
  return (
    <section className="survey-enter w-full max-w-2xl px-4">
      <StepTitle
        title="Selecione as Matérias"
        subtitle="Escolha uma ou mais matérias que você deseja avaliar."
      />
      {selectedSubjectIds.length > 0 ? (
        <div className="mx-auto mb-5 w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
          {selectedSubjectIds.length} {selectedSubjectIds.length === 1 ? 'matéria selecionada' : 'matérias selecionadas'}
        </div>
      ) : null}

      <div className="mb-7 grid gap-3">
        {materias.map((materia) => {
          const selected = selectedSubjectIds.includes(materia.id)

          return (
            <OptionButton
              icon={selected ? 'OK' : 'MAT'}
              key={materia.id}
              selected={selected}
              title={materia.nome}
              onClick={() => onSubjectToggle(materia.id)}
            />
          )
        })}
      </div>

      <Actions>
        <Button variant="secondary" onClick={onBack}>Voltar</Button>
        <Button disabled={selectedSubjectIds.length === 0} onClick={onNext}>Iniciar Questionário</Button>
      </Actions>
    </section>
  )
}
