export interface Materia {
  id: string
  nome: string
}

export interface Curso {
  id: string
  nome: string
  materias: Materia[]
}

export interface Respostas {
  didaticaProfessor: number
  organizacaoDisciplina: number
  clarezaConteudo: number
  quantidadeAtividades: number
  tirarDuvidas: number
  materialDisponibilizado: number
  comentario: string
}

export interface MateriaResposta {
  idMateria: string
  nomeMateria: string
  respostas: Respostas
}

export interface SurveyData {
  email: string
  curso: {
    idCurso: string
    nomeCurso: string
  }
  materias: MateriaResposta[]
}

export type Step = 'email' | 'course' | 'subjects' | 'questionnaire' | 'confirmation'
