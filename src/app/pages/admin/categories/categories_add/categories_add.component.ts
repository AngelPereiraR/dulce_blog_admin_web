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
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoriesService } from '../../../../services/categories.service';
import { Subcategory } from '../../../../interfaces';
import { SubcategoriesService } from '../../../../services/subcategories.service';
import { SpinnerComponent } from '../../../../components/shared/spinner/spinner.component';

@Component({
  selector: 'app-categories-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './categories_add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesAddComponent implements OnInit {
  private categoriesService = inject(CategoriesService);
  private subcategoriesService = inject(SubcategoriesService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private _subcategories = signal<Subcategory[] | undefined>(undefined);
  public subcategories = computed(() => this._subcategories());
  public loading: boolean = false;
  public firstLoading: boolean = false;

  public myForm: FormGroup = this.fb.group({
    name: [, [Validators.required, Validators.minLength(1)]],
    slug: [, [, Validators.minLength(1)]],
    subcategories: [[], [Validators.required, Validators.minLength(1)]],
    enabled: [, []],
  });

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
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

  addCategory(): void {
    this.loading = true;
    const { name, slug, subcategories, enabled } = this.myForm.value;

    this.categoriesService
      .addCategory(name, slug, subcategories, enabled)
      .subscribe({
        next: (category) => {
          Swal.fire('Creación', 'Creación de la categoría correcta', 'success');
          this.router.navigateByUrl('/admin/categories');
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
