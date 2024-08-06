import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  OnChanges,
  signal,
  SimpleChanges,
  type OnInit,
} from '@angular/core';
import { switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Category } from '../../../../interfaces';
import { CategoriesService } from '../../../../services/categories.service';
import { SpinnerComponent } from '../../../../components/shared/spinner/spinner.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './categories_list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesListComponent implements OnInit, OnChanges {
  private categoriesService = inject(CategoriesService);
  private _categories = signal<Category[] | undefined>(undefined);
  public categories = computed(() => this._categories());
  private _position = signal<number>(0);
  public position = computed(() => this._position());
  private _totalCategories = signal<number>(0);
  public totalCategories = computed(() => this._totalCategories());
  public totalPages: number = 0;
  public loading: boolean = false;
  public firstLoading: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
    this.getCategories(this.position());
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger a change detection cycle to repaint the HTML
    this.cdr.detectChanges();
  }

  getPageNumbers(): number[] {
    this.totalPages = Math.ceil(this.totalCategories() / 8);
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  getCategories(position: number): void {
    this.loading = true;
    if (position <= this.totalPages - 1 && position >= 0) {
      this._position.set(position);
    }
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this._totalCategories.set(categories.length);
        for (let i = 0; i <= this.position(); i++) {
          let categoriesList: Category[] = [];
          for (let j = 0; j < 8; j++) {
            if (categories[8 * i + j] !== undefined && i <= this.position()) {
              categoriesList.push(categories[8 * i + j]);
            }
          }
          this._categories.set(categoriesList);
        }
        // Trigger ngOnChanges to repaint the HTML
        this.ngOnChanges({});
      },
      error: (message) => {
        this.loading = false;
        this.firstLoading = false;
        this.ngOnChanges({});
      },
      complete: () => {
        this.loading = false;
        this.firstLoading = false;
        this.ngOnChanges({});
      },
    });
  }

  removeCategory(id: string | null): void {
    this.loading = true;
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriesService
          .getCategory(id!)
          .pipe(
            switchMap(() => this.categoriesService.removeCategory(id!)),
            tap(() => this.getCategories(this.position()))
          )
          .subscribe({
            error: (message) => {
              this.loading = false;
            },
            complete: () => {
              this.loading = false;
            },
          });
      } else {
        this.loading = false;
      }
    });
  }
}
