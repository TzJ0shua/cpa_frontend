import { useCallback, useEffect, useMemo, useState } from 'react'
import { buildDefaultRespostas } from '../../lib/survey-data'
import type {
  Curso,
  MateriaResposta,
  ParticipantType,
  Pergunta,
  Respostas,
  Step,
  SurveyData,
} from '../../lib/survey-types'
import { buildSurveyApiPayload } from '../../lib/survey-payload'
import { fetchFormCourses } from '../../services/form-data-api'
import { fetchQuestions } from '../../services/question-api'
import { submitSurvey, type SubmitSurveyResult } from '../../services/survey-api'
import { scrollToTop } from '../../utils/scroll-to-top'
import { ConfirmationStep } from './steps/ConfirmationStep'
import { CourseStep } from './steps/CourseStep'
import { ParticipantStep } from './steps/ParticipantStep'
import { QuestionnaireStep } from './steps/QuestionnaireStep'
import { SubjectStep } from './steps/SubjectStep'
import { SurveyProgress } from './SurveyProgress'
import { stepLabels } from './survey-steps'

const stepMap: Record<Step, string> = {
  participant: 'Identificação',
  course: 'Curso',
  subjects: 'Disciplinas',
  questionnaire: 'Avaliação',
  confirmation: 'Conclusão',
}

export function SurveyForm() {
  const [currentStep, setCurrentStep] = useState<Step>('participant')
  const [cpf, setCpf] = useState('')
  const [matricula, setMatricula] = useState('')
  const [participantType, setParticipantType] = useState<ParticipantType | null>(null)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [cursos, setCursos] = useState<Curso[]>([])
  const [perguntas, setPerguntas] = useState<Pergunta[]>([])
  const [isLoadingFormData, setIsLoadingFormData] = useState(false)
  const [formDataError, setFormDataError] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([])
  const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(0)
  const [respostasMap, setRespostasMap] = useState<Record<string, Respostas>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitResult, setSubmitResult] = useState<SubmitSurveyResult | null>(null)

  const selectedCourse = useMemo(
    () => cursos.find((curso) => curso.id === selectedCourseId) ?? null,
    [cursos, selectedCourseId],
  )

  const selectedMaterias = useMemo(
    () => selectedCourse?.materias.filter((materia) => selectedSubjectIds.includes(materia.id)) ?? [],
    [selectedCourse, selectedSubjectIds],
  )

  const currentMateria = selectedMaterias[currentQuestionnaireIndex] ?? null

  const goToStep = useCallback((step: Step) => {
    setCurrentStep(step)
  }, [])

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => scrollToTop())

    return () => window.cancelAnimationFrame(animationFrame)
  }, [currentStep, currentQuestionnaireIndex])

  const loadFormData = useCallback(async () => {
    setIsLoadingFormData(true)
    setFormDataError('')

    try {
      const [nextCursos, nextPerguntas] = await Promise.all([
        fetchFormCourses(),
        fetchQuestions(),
      ])
      setCursos(nextCursos)
      setPerguntas(nextPerguntas)
      setSelectedCourseId((currentCourseId) =>
        nextCursos.some((curso) => curso.id === currentCourseId) ? currentCourseId : null,
      )
    } catch (error) {
      setCursos([])
      setPerguntas([])
      setSelectedCourseId(null)
      setSelectedSubjectIds([])
      setFormDataError(error instanceof Error ? error.message : 'Não foi possível carregar os dados do formulário.')
    } finally {
      setIsLoadingFormData(false)
    }
  }, [])

  useEffect(() => {
    void loadFormData()
  }, [loadFormData])

  const handleCourseSelect = useCallback((courseId: Curso['id']) => {
    setSelectedCourseId(courseId)
    setSelectedSubjectIds([])
    setRespostasMap({})
    setCurrentQuestionnaireIndex(0)
    setSubmitResult(null)
  }, [])

  const handleSubjectToggle = useCallback((subjectId: string) => {
    setSubmitError('')
    setSubmitResult(null)
    setSelectedSubjectIds((previous) =>
      previous.includes(subjectId)
        ? previous.filter((id) => id !== subjectId)
        : [...previous, subjectId],
    )
  }, [])

  const canContinueFromParticipant = Boolean(
    participantType &&
    acceptedTerms &&
    cpf.replace(/\D/g, '').length === 11 &&
    matricula.replace(/\D/g, '').length === 10,
  )

  const buildSurveyData = useCallback((): SurveyData | null => {
    if (!selectedCourse || !participantType || !acceptedTerms) return null

    const materias: MateriaResposta[] = selectedMaterias.map((materia) => ({
      idMateria: materia.id,
      nomeMateria: materia.nome,
      docente: materia.docente,
      respostas: respostasMap[materia.id] ?? buildDefaultRespostas(perguntas),
    }))

    return {
      cpf,
      matricula,
      participante: participantType,
      aceiteTermosCondicoesServico: acceptedTerms,
      curso: {
        idCurso: selectedCourse.id,
        nomeCurso: selectedCourse.nome,
      },
      perguntas,
      materias,
      submittedAt: new Date().toISOString(),
    }
  }, [acceptedTerms, cpf, matricula, participantType, perguntas, respostasMap, selectedCourse, selectedMaterias])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    setSubmitError('')
    setSubmitResult(null)

    const payload = buildSurveyData()
    if (!payload) {
      setSubmitResult({
        ok: false,
        status: 0,
        message: 'Não foi possível montar os dados da pesquisa.',
      })
      goToStep('confirmation')
      setIsSubmitting(false)
      return
    }

    try {
      const result = await submitSurvey(buildSurveyApiPayload(payload))
      setSubmitResult(result)
      goToStep('confirmation')
    } catch (error) {
      setSubmitResult({
        ok: false,
        status: 0,
        message: error instanceof Error ? error.message : 'Não foi possível enviar a avaliação.',
      })
      goToStep('confirmation')
    } finally {
      setIsSubmitting(false)
    }
  }, [buildSurveyData, goToStep])

  const resetForm = useCallback(() => {
    goToStep('participant')
    setCpf('')
    setMatricula('')
    setParticipantType(null)
    setAcceptedTerms(false)
    setSelectedCourseId(null)
    setSelectedSubjectIds([])
    setCurrentQuestionnaireIndex(0)
    setRespostasMap({})
    setSubmitError('')
    setSubmitResult(null)
  }, [goToStep])

  const stepNumber = stepLabels.findIndex((label) => label === stepMap[currentStep]) + 1

  return (
    <>
      {currentStep !== 'confirmation' ? <SurveyProgress currentStep={stepNumber} /> : null}

      <main className="grid flex-1 place-items-center px-0 py-8">
        {currentStep === 'participant' ? (
          <ParticipantStep
            cpf={cpf}
            matricula={matricula}
            participantType={participantType}
            acceptedTerms={acceptedTerms}
            onCpfChange={setCpf}
            onMatriculaChange={setMatricula}
            onParticipantTypeChange={setParticipantType}
            onAcceptedTermsChange={setAcceptedTerms}
            onNext={() => {
              if (canContinueFromParticipant) goToStep('course')
            }}
          />
        ) : null}

        {currentStep === 'course' ? (
          <CourseStep
            cursos={cursos}
            selectedCourseId={selectedCourseId}
            onCourseSelect={handleCourseSelect}
            isLoading={isLoadingFormData}
            error={formDataError}
            onRetry={() => void loadFormData()}
            onNext={() => goToStep('subjects')}
            onBack={() => goToStep('participant')}
          />
        ) : null}

        {currentStep === 'subjects' && selectedCourse ? (
          <SubjectStep
            materias={selectedCourse.materias}
            selectedSubjectIds={selectedSubjectIds}
            onSubjectToggle={handleSubjectToggle}
            onNext={() => {
              setCurrentQuestionnaireIndex(0)
              goToStep('questionnaire')
            }}
            onBack={() => goToStep('course')}
          />
        ) : null}

        {currentStep === 'questionnaire' && currentMateria ? (
          <QuestionnaireStep
            materia={currentMateria}
            perguntas={perguntas}
            respostas={respostasMap[currentMateria.id] ?? buildDefaultRespostas(perguntas)}
            onRespostasChange={(respostas) => {
              setSubmitError('')
              setSubmitResult(null)
              setRespostasMap((previous) => ({ ...previous, [currentMateria.id]: respostas }))
            }}
            currentIndex={currentQuestionnaireIndex}
            totalMaterias={selectedMaterias.length}
            onPrevious={() => {
              if (currentQuestionnaireIndex === 0) {
                goToStep('subjects')
              } else {
                setCurrentQuestionnaireIndex((previous) => previous - 1)
              }
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
            submitError={submitError}
          />
        ) : null}

        {currentStep === 'confirmation' ? (
          <ConfirmationStep
            cpf={cpf}
            matricula={matricula}
            submitResult={submitResult}
            totalMaterias={selectedMaterias.length}
            onNewResponse={resetForm}
          />
        ) : null}
      </main>
    </>
  )
}
