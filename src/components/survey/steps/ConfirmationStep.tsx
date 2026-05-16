import type { SubmitSurveyResult } from '../../../services/survey-api'
import { Button } from '../ui/Button'
import { IconBadge } from '../ui/IconBadge'
import { QRCodeImage } from '../ui/QRCodeImage'

interface ConfirmationStepProps {
  cpf: string
  matricula: string
  submitResult: SubmitSurveyResult | null
  totalMaterias: number
  onNewResponse: () => void
}

export function ConfirmationStep({
  cpf,
  matricula,
  submitResult,
  totalMaterias,
  onNewResponse,
}: ConfirmationStepProps) {
  const wasSubmitted = submitResult?.ok === true
  const statusText = submitResult?.status ? `Status ${submitResult.status}` : 'Sem resposta HTTP'
  const qrCodeValue = submitResult?.qrCodeValue
  const validationCode = submitResult?.validationCode

  return (
    <section className="survey-enter w-full max-w-xl px-4">
      <div className="mb-8 text-center">
        <div
          className={
            wasSubmitted
              ? 'mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-4xl font-black text-emerald-600'
              : 'mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-50 text-4xl font-black text-red-600'
          }
        >
          {wasSubmitted ? 'OK' : '!'}
        </div>
        <h2 className="mt-6 text-3xl font-black text-slate-950 sm:text-4xl">
          {wasSubmitted ? 'Participação Registrada!' : 'Envio Não Concluído'}
        </h2>
        <p className="mt-3 text-lg text-slate-600">
          {wasSubmitted
            ? 'Obrigado por contribuir com a melhoria do ensino.'
            : 'O backend retornou um erro ao processar a avaliação.'}
        </p>
      </div>

      <div className="mb-5 rounded-lg border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-900/10">
        <div
          className={
            wasSubmitted
              ? 'mb-4 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-slate-600'
              : 'mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-slate-600'
          }
        >
          <IconBadge tone={wasSubmitted ? 'success' : 'soft'}>ID</IconBadge>
          <p>
            <strong className="text-slate-950">
              {wasSubmitted ? 'Código de Confirmação' : 'Resposta da API'}
            </strong>
            <br />
            {submitResult?.message ?? 'Não foi possível obter a resposta do servidor.'}
          </p>
        </div>

        {wasSubmitted ? (
          <>
            <div className="mb-4 grid justify-items-center gap-4 rounded-lg border border-blue-200 bg-blue-50 p-5 text-center">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">QR Code de confirmação</span>
              {qrCodeValue ? (
                <QRCodeImage value={qrCodeValue} />
              ) : (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
                  Código não retornado pelo backend.
                </div>
              )}
              <p className="max-w-sm text-sm font-bold text-slate-700">
                Tire um print desta tela para guardar seu comprovante de participação.
              </p>
              {validationCode ? (
                <p className="max-w-sm break-all font-mono text-xs font-semibold text-slate-500">
                  {validationCode}
                </p>
              ) : null}
            </div>
            <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
              Participação identificada por CPF <strong className="text-slate-950">{cpf}</strong> e matrícula{' '}
              <strong className="text-slate-950">{matricula}</strong>. Você respondeu pesquisas para{' '}
              <strong className="font-black text-blue-700">{totalMaterias}</strong>{' '}
              {totalMaterias === 1 ? 'disciplina' : 'disciplinas'}.
            </p>
          </>
        ) : (
          <p className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
            {statusText}. Revise os dados informados ou tente enviar novamente.
          </p>
        )}
      </div>

      <Button className="w-full" onClick={onNewResponse}>
        {wasSubmitted ? 'Nova Resposta' : 'Responder Novamente'}
      </Button>
      <small className="mt-4 block text-center text-xs font-medium text-slate-500">
        {wasSubmitted
          ? 'Você pode fechar esta página ou iniciar uma nova pesquisa.'
          : 'Nenhuma confirmação foi gerada para este envio com erro.'}
      </small>
    </section>
  )
}
