import { escalaAvaliacao, perguntas } from './survey-data'
import type { SurveyApiPayload, SurveyData } from './survey-types'

export function buildSurveyApiPayload(surveyData: SurveyData): SurveyApiPayload {
  return {
    schemaVersion: '2026-CPA-v1',
    confirmationCode: surveyData.confirmationCode,
    submittedAt: surveyData.submittedAt,
    respondent: {
      email: surveyData.email,
      type: surveyData.participante,
    },
    course: {
      id: surveyData.curso.idCurso,
      name: surveyData.curso.nomeCurso,
    },
    subjects: surveyData.materias.map((materia) => ({
      subjectId: materia.idMateria,
      subjectName: materia.nomeMateria,
      teacherName: materia.docente,
      answers: perguntas.map((pergunta) => {
        const score = materia.respostas[pergunta.id]
        const scoreLabel =
          escalaAvaliacao.find((item) => item.valor === score)?.rotulo ?? ''

        return {
          questionId: pergunta.id,
          questionText: pergunta.texto,
          score,
          scoreLabel,
        }
      }),
      comment: materia.respostas.comentario.trim(),
    })),
  }
}
