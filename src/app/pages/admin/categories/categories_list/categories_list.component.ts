import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './categories_list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesListComponent implements OnInit {

  ngOnInit(): void { }

}
