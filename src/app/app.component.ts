import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { AnimatedCharacterComponent } from './animatedcharacter/animatedcharacter.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true, 
  imports: [RouterOutlet, ChatComponent, AnimatedCharacterComponent], 
})
export class AppComponent {
  title = 'chat-ia-animado';
}
