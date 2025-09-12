import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dream-pursuit-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1>Dream Pursuit Test Component</h1>
      <p>This is a test component to verify imports work correctly.</p>
    </div>
  `,
  styles: [`
    div {
      padding: 2rem;
      background: white;
      border-radius: 8px;
      margin: 1rem;
    }
    
    h1 {
      color: #1e293b;
      margin: 0 0 1rem 0;
    }
  `]
})
export class DreamPursuitTestComponent {
  
}