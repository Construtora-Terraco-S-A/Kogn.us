import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule]
})
export class VerifyEmailComponent implements OnInit {
  
  message: string = 'Redirecionando para a página de login...';
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');

    if (token && email) {
      this.router.navigate(['/login'], { queryParams: { token, email } });
    } else {
      this.error = 'Link de verificação inválido ou incompleto.';
      this.message = '';
    }
  }
}
