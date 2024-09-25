import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animated-character',
  templateUrl: './animatedcharacter.component.html',
  styleUrls: ['./animatedcharacter.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AnimatedCharacterComponent {
  @Input() state: 'idle' | 'talking' | 'listening' = 'idle';
}
