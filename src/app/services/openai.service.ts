import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() { }

  async getChatCompletion(messages: any[]): Promise<any> {
    try {
      const response = await axios.post(this.apiUrl, {
        model: 'gpt-4o-mini',
        //model: 'gpt-4o', 
        messages: [
          { role: "system", content: "Eres un abogado especializado en la constitución mexicana y reglamentos en México. Tu tarea es redactar contratos según las indicaciones del cliente." },
          ...messages.map(msg => ({ role: "user", content: msg }))
        ]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${environment.openAIApiKey}`
        }
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error al obtener respuesta de la API:', error);
      throw error;
    }
  }

  generatePDF(content: string): void {
    const doc = new jsPDF();
    const contractContent = this.extractContractContent(content);
    const lines = contractContent.split('\n');
    let y = 10;
    const lineHeight = 10;
    const maxLineWidth = 180;
    const pageHeight = doc.internal.pageSize.height;

    lines.forEach(line => {
      if (line.trim() === '') {
        y += lineHeight;
      } else {
        const splitLines = doc.splitTextToSize(line, maxLineWidth);
        splitLines.forEach((splitLine: string) => { 
          if (y + lineHeight > pageHeight) {
            doc.addPage();
            y = 10;
          }
          doc.text(splitLine, 10, y);
          y += lineHeight;
        });
      }
    });

    doc.save('contrato.pdf');
  }

  private extractContractContent(content: string): string {
    const start = content.indexOf('---') + 3;
    const end = content.lastIndexOf('---');
    return content.substring(start, end).trim();
  }
}
