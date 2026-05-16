import type { SurveyApiPayload } from '../lib/survey-types'

const SURVEY_API_ENDPOINT =
  import.meta.env.VITE_SURVEY_API_ENDPOINT ?? 'http://localhost:8080/formulario'

interface ApiErrorResponse {
  error?: string
  message?: string
}

export interface SubmitSurveyResult {
  ok: boolean
  status: number
  message: string
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

export async function submitSurvey(payload: SurveyApiPayload): Promise<SubmitSurveyResult> {
  const response = await fetch(SURVEY_API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const responseMessage = await readResponseMessage(response)

  if (response.ok) {
    return {
      ok: true,
      status: response.status,
      message: responseMessage || 'Avaliação enviada com sucesso.',
    }
  }

  return {
    ok: false,
    status: response.status,
    message: responseMessage || 'Não foi possível enviar a avaliação.',
  }
}
