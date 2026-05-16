export type ParticipantType = 'estudante' | 'docente'

export type QuestionId =
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'q5'
  | 'q6'
  | 'q7'
  | 'q8'
  | 'q9'
  | 'q10'

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

export type Respostas = Record<QuestionId, number> & {
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
  curso: {
    idCurso: string
    nomeCurso: string
  }
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
  }
  course: {
    id: string
    name: string
  }
  subjects: SurveyApiSubject[]
}

export type Step = 'participant' | 'course' | 'subjects' | 'questionnaire' | 'confirmation'
