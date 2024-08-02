import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-subcategories-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './subcategories_list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubcategoriesListComponent implements OnInit {

  ngOnInit(): void { }

}
