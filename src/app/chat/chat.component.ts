import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenaiService } from '../services/openai.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { AnimatedCharacterComponent } from '../animatedcharacter/animatedcharacter.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, AnimatedCharacterComponent],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ChatComponent implements OnInit {
  messages: { text: string; isUser: boolean; isContract?: boolean; imageUrl?: string }[] = []; // Agregar isContract opcional
  newMessage = '';
  isLoading = false; // Agregar propiedad isLoading
  characterState: 'idle' | 'talking' | 'listening' = 'idle';
  isContractReady = false; // Agregar propiedad isContractReady

  constructor(private openaiService: OpenaiService) {}

  ngOnInit(): void {}

  async sendMessage(): Promise<void> {
    if (this.newMessage.trim()) {
      this.isLoading = true; // Activar isLoading
      this.characterState = 'listening';
      this.messages.push({ text: this.newMessage, isUser: true });
      try {
        const response = await this.openaiService.getChatCompletion([this.newMessage]);
        this.characterState = 'talking';
        this.processResponse(response);
        setTimeout(() => {
          this.characterState = 'idle';
        }, 2000);
      } catch (error) {
        console.error('Error:', error);
        this.characterState = 'idle';
      } finally {
        this.isLoading = false; // Desactivar isLoading
      }
      this.newMessage = '';
    }
  }

  processResponse(response: string): void {
    const contractStart = response.indexOf('---');
    const contractEnd = response.lastIndexOf('---') + 3;

    if (contractStart !== -1 && contractEnd !== -1) {
      const beforeContract = response.substring(0, contractStart).trim();
      const contractContent = response.substring(contractStart, contractEnd).trim(); // Incluir delimitadores
      const afterContract = response.substring(contractEnd).trim();

      if (beforeContract) {
        this.messages.push({ text: beforeContract, isUser: false });
      }

      this.messages.push({ text: contractContent, isUser: false, isContract: true });

      if (afterContract) {
        this.messages.push({ text: afterContract, isUser: false });
      }
    } else {
      this.messages.push({ text: response, isUser: false });
    }
  }

  downloadPDF(contractText?: string): void {
    if (contractText) {
      console.log('Contenido del contrato:', contractText); // Agregar log
      this.openaiService.generatePDF(contractText);
    } else {
      const contractMessage = this.messages.find(msg => !msg.isUser && msg.isContract);
      if (contractMessage) {
        console.log('Contenido del contrato:', contractMessage.text); // Agregar log
        this.openaiService.generatePDF(contractMessage.text);
      } else {
        console.error('No se encontró ningún contrato para descargar.');
      }
    }
  }

  onImageSelected(event: Event): void { // Agregar método onImageSelected
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.messages.push({ text: '', isUser: true, imageUrl: e.target.result });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
