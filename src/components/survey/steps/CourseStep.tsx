import { cursos } from '../../../lib/survey-data'
import type { Curso } from '../../../lib/survey-types'
import { Actions } from '../ui/Actions'
import { Button } from '../ui/Button'
import { OptionButton } from '../ui/OptionButton'
import { StepTitle } from '../ui/StepTitle'

interface CourseStepProps {
  selectedCourseId: string | null
  onCourseSelect: (courseId: Curso['id']) => void
  onNext: () => void
  onBack: () => void
}

export function CourseStep({
  selectedCourseId,
  onCourseSelect,
  onNext,
  onBack,
}: CourseStepProps) {
  return (
    <section className="survey-enter w-full max-w-2xl px-4">
      <StepTitle
        title="Selecione seu Curso"
        subtitle="Escolha o curso ao qual você pertence para visualizar as disciplinas disponíveis."
      />
      <div className="mb-7 grid gap-3">
        {cursos.map((curso) => (
          <OptionButton
            icon="CUR"
            key={curso.id}
            selected={selectedCourseId === curso.id}
            title={curso.nome}
            subtitle={`${curso.materias.length} ${curso.materias.length === 1 ? 'disciplina' : 'disciplinas'} disponíveis`}
            onClick={() => onCourseSelect(curso.id)}
          />
        ))}
      </div>
      <Actions>
        <Button variant="secondary" onClick={onBack}>Voltar</Button>
        <Button disabled={!selectedCourseId} onClick={onNext}>Próximo</Button>
      </Actions>
    </section>
  )
}
