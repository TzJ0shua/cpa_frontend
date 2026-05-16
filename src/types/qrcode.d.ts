declare module 'qrcode' {
  interface QRCodeToDataURLOptions {
    color?: {
      dark?: string
      light?: string
    }
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    margin?: number
    scale?: number
    width?: number
  }

  interface QRCodeStatic {
    toDataURL(text: string, options?: QRCodeToDataURLOptions): Promise<string>
  }

  const QRCode: QRCodeStatic
  export default QRCode
}
