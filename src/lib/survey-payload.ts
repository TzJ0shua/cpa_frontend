import { escalaAvaliacao } from './survey-data'
import type { SurveyApiPayload, SurveyData } from './survey-types'

export function buildSurveyApiPayload(surveyData: SurveyData): SurveyApiPayload {
  return {
    schemaVersion: '2026-CPA-v1',
    submittedAt: surveyData.submittedAt,
    respondent: {
      cpf: surveyData.cpf.replace(/\D/g, ''),
      matricula: surveyData.matricula.trim(),
      type: surveyData.participante,
      aceiteTermosCondicoesServico: surveyData.aceiteTermosCondicoesServico,
    },
    course: {
      id: surveyData.curso.idCurso,
      name: surveyData.curso.nomeCurso,
    },
    subjects: surveyData.materias.map((materia) => ({
      subjectId: materia.idMateria,
      subjectName: materia.nomeMateria,
      teacherName: materia.docente,
      answers: surveyData.perguntas.map((pergunta) => {
        const score = materia.respostas.notas[pergunta.id]
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
