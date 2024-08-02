import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnInit,
} from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-authorized',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not_authorized.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotAuthorizedComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
