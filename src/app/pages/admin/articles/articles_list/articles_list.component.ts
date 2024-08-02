import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './articles_list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesListComponent implements OnInit {

  ngOnInit(): void { }

}
