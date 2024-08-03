import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  SimpleChanges,
  type OnInit,
} from '@angular/core';
import { SpinnerComponent } from '../../../../components/shared/spinner/spinner.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SubcategoriesService } from '../../../../services/subcategories.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subcategories-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './subcategories_add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubcategoriesAddComponent implements OnInit {
  private subcategoriesService = inject(SubcategoriesService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public loading: boolean = false;

  public myForm: FormGroup = this.fb.group({
    name: [, [Validators.required, Validators.minLength(1)]],
    slug: [, [, Validators.minLength(1)]],
    enabled: [, []],
  });

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger a change detection cycle to repaint the HTML
    this.cdr.detectChanges();
  }

  addSubcategory(): void {
    this.loading = true;
    const { name, slug, enabled } = this.myForm.value;

    this.subcategoriesService.addSubcategory(name, slug, enabled).subscribe({
      next: (subcategory) => {
        Swal.fire(
          'Creación',
          'Creación de la subcategoría correcta',
          'success'
        );
        this.router.navigateByUrl('/admin/subcategories');
      },
      error: (message) => {
        Swal.fire('Error', message, 'error');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
