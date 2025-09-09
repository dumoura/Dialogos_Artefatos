import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';

// mammoth is loaded from a script tag in index.html, so we declare it globally here for TypeScript
declare const mammoth: any;

/**
 * Parses the content of a File object (PDF or DOCX) into a string.
 * @param file The File object to parse.
 * @returns A promise that resolves with the extracted text content.
 */
export const parseFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  const arrayBuffer = await file.arrayBuffer();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let textContent = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      textContent += text.items.map(item => ('str' in item ? item.str : '')).join(' ') + '\n';
    }
    return textContent;
  }

  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    if (typeof mammoth === 'undefined') {
        throw new Error('Mammoth.js library is not loaded.');
    }
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
};
