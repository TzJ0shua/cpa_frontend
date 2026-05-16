import type { SurveyApiPayload } from '../lib/survey-types'

const SURVEY_API_ENDPOINT = '/api/cpa/responses'

export async function submitSurvey(payload: SurveyApiPayload) {
  // Future REST integration point. When the backend exists, replace the mock
  // block below with this request and handle non-2xx responses.
  //
  // const response = await fetch(SURVEY_API_ENDPOINT, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // })
  //
  // if (!response.ok) {
  //   throw new Error('Não foi possível enviar a avaliação.')
  // }

  console.info(`Mock POST ${SURVEY_API_ENDPOINT}`, payload)
  await new Promise((resolve) => window.setTimeout(resolve, 800))
}
