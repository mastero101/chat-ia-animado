import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  getResponse(message: string): Observable<string> {
    // Implementa la lógica para obtener la respuesta
    return of('Respuesta del servidor');
  }
}
