export type ParticipantType = 'estudante' | 'docente'

export type QuestionId = string

export interface Pergunta {
  id: QuestionId
  texto: string
}

export interface Materia {
  id: string
  nome: string
  docente: string
}

export interface Curso {
  id: string
  nome: string
  materias: Materia[]
}

export interface Respostas {
  notas: Record<QuestionId, number>
  comentario: string
}

export interface MateriaResposta {
  idMateria: string
  nomeMateria: string
  docente: string
  respostas: Respostas
}

export interface SurveyData {
  cpf: string
  matricula: string
  participante: ParticipantType
  aceiteTermosCondicoesServico: boolean
  curso: {
    idCurso: string
    nomeCurso: string
  }
  perguntas: Pergunta[]
  materias: MateriaResposta[]
  submittedAt: string
}

export interface SurveyApiAnswer {
  questionId: QuestionId
  questionText: string
  score: number
  scoreLabel: string
}

export interface SurveyApiSubject {
  subjectId: string
  subjectName: string
  teacherName: string
  answers: SurveyApiAnswer[]
  comment: string
}

export interface SurveyApiPayload {
  schemaVersion: '2026-CPA-v1'
  submittedAt: string
  respondent: {
    cpf: string
    matricula: string
    type: ParticipantType
    aceiteTermosCondicoesServico: boolean
  }
  course: {
    id: string
    name: string
  }
  subjects: SurveyApiSubject[]
}

export type Step = 'participant' | 'course' | 'subjects' | 'questionnaire' | 'confirmation'
