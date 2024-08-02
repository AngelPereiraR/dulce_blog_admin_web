import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SpinnerComponent } from '../../../components/shared/spinner/spinner.component';

@Component({
  selector: 'auth-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public loading: boolean = false;

  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  showPassword = false;

  ngOnInit(): void {}

  login() {
    this.loading = true;
    const { email, password } = this.myForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        if (user.profile === 'admin') {
          this.router.navigateByUrl('/admin');
        } else if (user.profile === 'user') {
          this.router.navigateByUrl('/not_authorized');
        } else {
          this.router.navigateByUrl('/');
        }
      },
      error: (message) => {
        console.log(message);
        Swal.fire('Error', message, 'error');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
