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
  email: string
  participante: ParticipantType
  curso: {
    idCurso: string
    nomeCurso: string
  }
  materias: MateriaResposta[]
  confirmationCode: string
  submittedAt: string
}

export type Step = 'participant' | 'course' | 'subjects' | 'questionnaire' | 'confirmation'
