import type { Curso } from '../lib/survey-types'
import { fetchWithRetry } from '../utils/fetch-with-retry'

const FORM_DATA_API_ENDPOINT =
  import.meta.env.VITE_FORM_DATA_API_ENDPOINT ?? 'http://localhost:8080/dados-formulario'

interface ApiDisciplina {
  id: number
  nome: string
  professor: string
}

interface ApiCurso {
  id: number
  nome: string
  disciplinas: ApiDisciplina[]
}

interface ApiFormDataResponse {
  cursos: ApiCurso[]
}

interface ApiErrorResponse {
  error?: string
  message?: string
}

async function readResponseMessage(response: Response) {
  const responseText = await response.text()
  if (!responseText) return ''

  try {
    const responseBody = JSON.parse(responseText) as ApiErrorResponse
    return responseBody.error ?? responseBody.message ?? responseText
  } catch {
    return responseText
  }
}

function mapApiCourse(apiCourse: ApiCurso): Curso {
  return {
    id: String(apiCourse.id),
    nome: apiCourse.nome,
    materias: apiCourse.disciplinas.map((disciplina) => ({
      id: String(disciplina.id),
      nome: disciplina.nome,
      docente: disciplina.professor,
    })),
  }
}

export async function fetchFormCourses(): Promise<Curso[]> {
  let response: Response

  try {
    response = await fetchWithRetry(FORM_DATA_API_ENDPOINT)
  } catch {
    throw new Error('Não foi possível conectar ao backend após 3 tentativas.')
  }

  if (!response.ok) {
    const responseMessage = await readResponseMessage(response)
    throw new Error(responseMessage || 'Não foi possível carregar cursos e disciplinas.')
  }

  const formData = await response.json() as ApiFormDataResponse
  return formData.cursos.map(mapApiCourse)
}
