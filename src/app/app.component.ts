import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoadingService } from './core';
import { Header } from './components';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    CommonModule,
    ToastModule,
    RouterModule,
    ProgressSpinnerModule,
    ButtonModule,
    RippleModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'kogn.us';
  public isNotify: boolean = false;
  public isLoading: boolean = false;

  public loadingService = inject(LoadingService);

  constructor(
    private readonly messageService: MessageService
  ) {
    this.loadingService.loading$.subscribe(status => {
      this.isLoading = status;
    });

    this.messageService.messageObserver.subscribe({
      next: (message: any) => {
        if (message.key === 'block2') {
          this.isNotify = true;
        }
      }
    });
  }

  keyDown(event: any) {
    //console.log("🚀 ~ AppComponent ~ keyDown ~ event:", event)
    if (event.key === "Enter" || event.key === "Escape") {
      this.clear('block2');
    }
  }

  clear(key: string) {
    this.messageService.clear(key);
    this.isNotify = false;
  }
}
