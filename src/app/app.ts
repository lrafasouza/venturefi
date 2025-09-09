import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicModalComponent } from './shared/components/modal/dynamic-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DynamicModalComponent],
  template: `
    <router-outlet></router-outlet>
    <app-dynamic-modal></app-dynamic-modal>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'VentureFi';
}