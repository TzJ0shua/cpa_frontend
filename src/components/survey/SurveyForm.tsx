import { useCallback, useMemo, useState } from 'react'
import {
  cursos,
  defaultRespostas,
} from '../../lib/survey-data'
import type {
  Curso,
  MateriaResposta,
  Respostas,
  Step,
  SurveyData,
} from '../../lib/survey-types'
import { ConfirmationStep } from './steps/ConfirmationStep'
import { CourseStep } from './steps/CourseStep'
import { EmailStep } from './steps/EmailStep'
import { QuestionnaireStep } from './steps/QuestionnaireStep'
import { SubjectStep } from './steps/SubjectStep'
import { SurveyProgress } from './SurveyProgress'
import { stepLabels } from './survey-steps'

const stepMap: Record<Step, string> = {
  email: 'E-mail',
  course: 'Curso',
  subjects: 'Matérias',
  questionnaire: 'Avaliação',
  confirmation: 'Conclusão',
}

export function SurveyForm() {
  const [currentStep, setCurrentStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([])
  const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(0)
  const [respostasMap, setRespostasMap] = useState<Record<string, Respostas>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCourse = useMemo(
    () => cursos.find((curso) => curso.id === selectedCourseId) ?? null,
    [selectedCourseId],
  )

  const selectedMaterias = useMemo(
    () => selectedCourse?.materias.filter((materia) => selectedSubjectIds.includes(materia.id)) ?? [],
    [selectedCourse, selectedSubjectIds],
  )

  const currentMateria = selectedMaterias[currentQuestionnaireIndex] ?? null

  const handleCourseSelect = useCallback((courseId: Curso['id']) => {
    setSelectedCourseId(courseId)
    setSelectedSubjectIds([])
    setRespostasMap({})
    setCurrentQuestionnaireIndex(0)
  }, [])

  const handleSubjectToggle = useCallback((subjectId: string) => {
    setSelectedSubjectIds((previous) =>
      previous.includes(subjectId)
        ? previous.filter((id) => id !== subjectId)
        : [...previous, subjectId],
    )
  }, [])

  const buildSurveyData = useCallback((): SurveyData | null => {
    if (!selectedCourse) return null

    const materias: MateriaResposta[] = selectedMaterias.map((materia) => ({
      idMateria: materia.id,
      nomeMateria: materia.nome,
      respostas: respostasMap[materia.id] ?? defaultRespostas,
    }))

    return {
      email,
      curso: {
        idCurso: selectedCourse.id,
        nomeCurso: selectedCourse.nome,
      },
      materias,
    }
  }, [email, respostasMap, selectedCourse, selectedMaterias])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    console.log('Survey data submitted:', JSON.stringify(buildSurveyData(), null, 2))
    await new Promise((resolve) => window.setTimeout(resolve, 800))
    setIsSubmitting(false)
    setCurrentStep('confirmation')
  }, [buildSurveyData])

  const resetForm = useCallback(() => {
    setCurrentStep('email')
    setEmail('')
    setSelectedCourseId(null)
    setSelectedSubjectIds([])
    setCurrentQuestionnaireIndex(0)
    setRespostasMap({})
  }, [])

  const stepNumber = stepLabels.findIndex((label) => label === stepMap[currentStep]) + 1

  return (
    <>
      {currentStep !== 'confirmation' ? <SurveyProgress currentStep={stepNumber} /> : null}

      <main className="grid flex-1 place-items-center px-0 py-8">
        {currentStep === 'email' ? (
          <EmailStep email={email} onEmailChange={setEmail} onNext={() => setCurrentStep('course')} />
        ) : null}

        {currentStep === 'course' ? (
          <CourseStep
            selectedCourseId={selectedCourseId}
            onCourseSelect={handleCourseSelect}
            onNext={() => setCurrentStep('subjects')}
            onBack={() => setCurrentStep('email')}
          />
        ) : null}

        {currentStep === 'subjects' && selectedCourse ? (
          <SubjectStep
            materias={selectedCourse.materias}
            selectedSubjectIds={selectedSubjectIds}
            onSubjectToggle={handleSubjectToggle}
            onNext={() => {
              setCurrentQuestionnaireIndex(0)
              setCurrentStep('questionnaire')
            }}
            onBack={() => setCurrentStep('course')}
          />
        ) : null}

        {currentStep === 'questionnaire' && currentMateria ? (
          <QuestionnaireStep
            materia={currentMateria}
            respostas={respostasMap[currentMateria.id] ?? defaultRespostas}
            onRespostasChange={(respostas) =>
              setRespostasMap((previous) => ({ ...previous, [currentMateria.id]: respostas }))
            }
            currentIndex={currentQuestionnaireIndex}
            totalMaterias={selectedMaterias.length}
            onPrevious={() => {
              if (currentQuestionnaireIndex === 0) setCurrentStep('subjects')
              else setCurrentQuestionnaireIndex((previous) => previous - 1)
            }}
            onNext={() => {
              if (currentQuestionnaireIndex < selectedMaterias.length - 1) {
                setCurrentQuestionnaireIndex((previous) => previous + 1)
              } else {
                void handleSubmit()
              }
            }}
            isLast={currentQuestionnaireIndex === selectedMaterias.length - 1}
            isSubmitting={isSubmitting}
          />
        ) : null}

        {currentStep === 'confirmation' ? (
          <ConfirmationStep
            email={email}
            totalMaterias={selectedMaterias.length}
            onNewResponse={resetForm}
          />
        ) : null}
      </main>
    </>
  )
}
