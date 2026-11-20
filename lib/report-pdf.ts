import {
  InvalidPDFException,
  PDFParse,
  PasswordException,
  type PageTextResult,
} from "pdf-parse";

export const maxReportBytes = 12 * 1024 * 1024;
export const maxReportPages = 300;
export const maxExtractedCharacters = 140_000;
export const maxChunkCharacters = 12_000;
export const maxReportChunks = 12;

export interface ReportTextChunk {
  pageStart: number;
  pageEnd: number;
  text: string;
}

export class ReportPdfError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ReportPdfError";
    this.status = status;
  }
}

export async function extractPdfPages(data: Uint8Array) {
  const parser = new PDFParse({
    data,
    isEvalSupported: false,
  });

  try {
    const result = await parser.getText({
      first: maxReportPages + 1,
      lineEnforce: true,
      cellSeparator: " | ",
    });

    return {
      pages: result.pages,
      totalPages: result.total,
    };
  } catch (error) {
    if (error instanceof PasswordException) {
      throw new ReportPdfError(
        "This PDF is password-protected. Upload an unlocked copy to continue.",
        422,
      );
    }

    if (error instanceof InvalidPDFException) {
      throw new ReportPdfError(
        "This file could not be read as a valid PDF.",
        422,
      );
    }

    throw new ReportPdfError(
      "The PDF could not be processed. Try exporting it again as a standard PDF.",
      422,
    );
  } finally {
    await parser.destroy();
  }
}

function findChunkEnd(text: string, start: number, maxLength: number) {
  let end = Math.min(start + maxLength, text.length);
  if (end < text.length) {
    const lineBreak = text.lastIndexOf("\n", end);
    if (lineBreak > start + maxLength * 0.6) {
      end = lineBreak;
    }
  }
  return end > start ? end : Math.min(start + maxLength, text.length);
}

export function chunkReportPages(
  pages: PageTextResult[],
): ReportTextChunk[] {
  const chunks: ReportTextChunk[] = [];
  let currentText = "";
  let pageStart = 0;
  let pageEnd = 0;

  function flushChunk() {
    if (!currentText.trim()) return;
    chunks.push({ pageStart, pageEnd, text: currentText.trim() });
    currentText = "";
    pageStart = 0;
    pageEnd = 0;
  }

  for (const page of pages) {
    const pageText = page.text.replace(/\0/g, "").trim();
    if (!pageText) continue;

    let offset = 0;
    let partNumber = 0;
    while (offset < pageText.length) {
      const marker =
        partNumber === 0
          ? `[Page ${page.num}]\n`
          : `[Page ${page.num}, continued]\n`;

      if (currentText.length + marker.length >= maxChunkCharacters) {
        flushChunk();
      }

      const available = maxChunkCharacters - marker.length;
      const end = findChunkEnd(pageText, offset, available);
      const segment = `${marker}${pageText.slice(offset, end).trim()}\n`;

      if (
        currentText.length > 0 &&
        currentText.length + segment.length > maxChunkCharacters
      ) {
        flushChunk();
      }

      if (pageStart === 0) pageStart = page.num;
      pageEnd = page.num;
      currentText += segment;
      offset = end;
      partNumber += 1;
    }
  }

  flushChunk();
  return chunks;
}

export function hasReadableFinancialText(text: string) {
  const readableCharacters = text.match(/[\p{L}\p{N}]/gu)?.length ?? 0;
  if (readableCharacters < 40) {
    return {
      readable: false,
      error:
        "No readable text was found. This may be a scanned, image-only PDF; OCR is not configured, so convert it to a text-searchable PDF and try again.",
    };
  }

  const hasFinancialTerms =
    /\b(revenue|income|profit|expense|asset|liabilit|equity|cash flow|debt|financial statements?|balance sheet|earnings|turnover)\b/i.test(
      text,
    );
  const hasFigures = /\d/.test(text);

  if (!hasFinancialTerms || !hasFigures) {
    return {
      readable: false,
      error:
        "Readable text was found, but it does not appear to contain financial figures or statement terms.",
    };
  }

  return { readable: true, error: null };
}

export function splitReportIntoChunks(
  pages: PageTextResult[],
): ReportTextChunk[] {
  const textLength = pages.reduce(
    (total, page) => total + page.text.length,
    0,
  );
  if (textLength > maxExtractedCharacters) {
    throw new ReportPdfError(
      "This report contains more extracted text than the current analysis limit. Split it into smaller sections and upload them separately.",
      413,
    );
  }

  const chunks = chunkReportPages(pages);
  if (chunks.length === 0) {
    throw new ReportPdfError("No readable report text was found.", 422);
  }
  if (chunks.length > maxReportChunks) {
    throw new ReportPdfError(
      "This report is too long to analyze in one request. Split it into smaller sections and upload them separately.",
      413,
    );
  }

  return chunks;
}
