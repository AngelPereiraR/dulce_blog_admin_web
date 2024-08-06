import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  signal,
  SimpleChanges,
  type OnInit,
} from '@angular/core';
import { Category, Subcategory } from '../../../../interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../../../services/categories.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { SubcategoriesService } from '../../../../services/subcategories.service';
import { SpinnerComponent } from '../../../../components/shared/spinner/spinner.component';

@Component({
  selector: 'app-categories-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './categories_edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoriesService = inject(CategoriesService);
  private subcategoriesService = inject(SubcategoriesService);
  private router = inject(Router);
  public category: Category | undefined;
  private _subcategories = signal<Subcategory[] | undefined>(undefined);
  public subcategories = computed(() => this._subcategories());
  public loading: boolean = false;
  public firstLoading: boolean = false;

  public myForm: FormGroup = this.fb.group({
    _id: ['', [Validators.required]],
    name: ['', []],
    slug: ['', []],
    subcategories: [[], [Validators.required, Validators.minLength(1)]],
    enabled: ['', []],
  });

  constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute) {
    this.firstLoading = true;
    this.route.paramMap.subscribe((params) => {
      this.getCategory(params.get('id'));
    });
    this.getSubcategories();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger a change detection cycle to repaint the HTML
    this.cdr.detectChanges();
  }

  getSubcategories() {
    this.loading = true;
    this.subcategoriesService.getSubcategories().subscribe({
      next: (subcategories) => {
        this._subcategories.set(subcategories);
        this.loading = false;
        this.firstLoading = false;
        // Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
      error: (message) => {
        this.loading = false;
        this.firstLoading = false;
      },
      complete: () => {
        this.loading = false;
        this.firstLoading = false;
      },
    });
  }

  getCategory(id: string | null): void {
    this.categoriesService.getCategory(id!).subscribe({
      next: (category) => {
        this.category = category;

        this.myForm.patchValue({
          _id: category._id,
          name: category.name,
          slug: category.slug,
          subcategories: category.subcategories,
          enabled: category.enabled,
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

  updateCategory() {
    this.loading = true;
    let { _id, name, slug, subcategories, enabled } = this.myForm!.value;

    this.categoriesService
      .updateCategory(_id, name, slug, subcategories, enabled)
      .subscribe({
        next: () => {
          Swal.fire(
            'Cambiar categoría',
            'Cambio de categoría correcto.',
            'success'
          );
          this.router.navigateByUrl('admin/categories');
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
