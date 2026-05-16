import type { SurveyData } from '../lib/survey-types'

export async function submitSurvey(payload: SurveyData) {
  // Future REST integration point:
  // return fetch('/api/surveys', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // })
  console.log('Survey data submitted:', JSON.stringify(payload, null, 2))
  await new Promise((resolve) => window.setTimeout(resolve, 800))
}
