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
import { SubcategoriesService } from '../../../../services/subcategories.service';
import { Subcategory } from '../../../../interfaces/subcategory';
import { switchMap, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { SpinnerComponent } from '../../../../components/shared/spinner/spinner.component';

@Component({
  selector: 'app-subcategories-list',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './subcategories_list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubcategoriesListComponent implements OnInit, OnChanges {
  private subcategoriesService = inject(SubcategoriesService);
  private _subcategories = signal<Subcategory[] | undefined>(undefined);
  public subcategories = computed(() => this._subcategories());
  private _position = signal<number>(0);
  public position = computed(() => this._position());
  private _totalSubcategories = signal<number>(0);
  public totalSubcategories = computed(() => this._totalSubcategories());
  public totalPages: number = 0;
  public loading: boolean = false;
  public firstLoading: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.firstLoading = true;
    this.getSubcategories(this.position());
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger a change detection cycle to repaint the HTML
    this.cdr.detectChanges();
  }

  getPageNumbers(): number[] {
    this.totalPages = Math.ceil(this.totalSubcategories() / 8);
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  getSubcategories(position: number): void {
    this.loading = true;
    if (position <= this.totalPages - 1 && position >= 0) {
      this._position.set(position);
    }
    this.subcategoriesService.getSubcategories().subscribe({
      next: (subcategories) => {
        this._totalSubcategories.set(subcategories.length);
        for (let i = 0; i <= this.position(); i++) {
          let subcategoriesList: Subcategory[] = [];
          for (let j = 0; j < 8; j++) {
            if (
              subcategories[8 * i + j] !== undefined &&
              i <= this.position()
            ) {
              subcategoriesList.push(subcategories[8 * i + j]);
            }
          }
          this._subcategories.set(subcategoriesList);
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

  removeSubcategory(id: string | null): void {
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
        this.subcategoriesService
          .getSubcategory(id!)
          .pipe(
            switchMap(() => this.subcategoriesService.removeSubcategory(id!)),
            tap(() => this.getSubcategories(this.position()))
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
