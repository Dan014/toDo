import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="splash-container" [class.fade-out]="fadeOut">
      <img src="assets/logo.png" alt="Logo" class="splash-logo" />
    </div>
  `,
  styleUrls: ['./splash-screen.component.css'],
})
export class SplashScreenComponent {
  fadeOut = false;

  startFadeOut() {
    this.fadeOut = true;
  }
}
