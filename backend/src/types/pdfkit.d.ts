declare module 'pdfkit' {
  class PDFDocument {
    constructor(options?: any)
    pipe(stream: any): void
    fontSize(size: number): this
    text(text: string, x?: number, y?: number, options?: any): this
    moveDown(lines?: number): this
    end(): void
    on(event: string, callback: (buffer: Buffer) => void): this
  }
  export = PDFDocument
}
