import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SubcategoriesService } from '../../../../services/subcategories.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subcategory } from '../../../../interfaces/subcategory';
import Swal from 'sweetalert2';
import { SpinnerComponent } from '../../../../components/shared/spinner/spinner.component';

@Component({
  selector: 'app-subcategories-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './subcategories_edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubcategoriesEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private subcategoriesService = inject(SubcategoriesService);
  private router = inject(Router);
  public subcategory: Subcategory | undefined;
  public loading: boolean = false;
  public firstLoading: boolean = false;

  public myForm: FormGroup = this.fb.group({
    _id: ['', [Validators.required]],
    name: ['', []],
    slug: ['', []],
    enabled: ['', []],
  });

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.getSubcategory(params.get('id'));
    });
  }

  ngOnInit(): void {
    this.subcategoriesService.setPage('participant');
  }

  ngOnDestroy(): void {
    this.subcategoriesService.setPage('');
  }

  getSubcategory(id: string | null): void {
    this.firstLoading = true;
    this.subcategoriesService.getSubcategory(id!).subscribe({
      next: (subcategory) => {
        this.subcategory = subcategory;

        this.myForm.patchValue({
          _id: subcategory._id,
          name: subcategory.name,
          slug: subcategory.slug,
          enabled: subcategory.enabled,
        });
      },
      error: (message) => {
        this.firstLoading = false;
      },
      complete: () => {
        this.firstLoading = false;
      },
    });
  }

  updateSubcategory() {
    this.loading = true;
    let { _id, name, slug, enabled } = this.myForm!.value;

    this.subcategoriesService
      .updateSubcategory(_id, name, slug, enabled)
      .subscribe({
        next: () => {
          Swal.fire(
            'Cambiar subcategoría',
            'Cambio de subcategoría correcto.',
            'success'
          );
          this.router.navigateByUrl('admin/subcategories');
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
