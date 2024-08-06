import { Routes } from '@angular/router';
import { SubcategoriesListComponent } from './subcategories/subcategories_list/subcategories_list.component';
import { CategoriesListComponent } from './categories/categories_list/categories_list.component';
import { ArticlesListComponent } from './articles/articles_list/articles_list.component';
import { SubcategoriesAddComponent } from './subcategories/subcategories_add/subcategories_add.component';
import { SubcategoriesEditComponent } from './subcategories/subcategories_edit/subcategories_edit.component';
import { CategoriesAddComponent } from './categories/categories_add/categories_add.component';
import { CategoriesEditComponent } from './categories/categories_edit/categories_edit.component';

export const adminRoutes: Routes = [
  { path: 'subcategories', component: SubcategoriesListComponent },
  { path: 'subcategories/add', component: SubcategoriesAddComponent },
  { path: 'subcategories/edit/:id', component: SubcategoriesEditComponent },
  { path: 'categories', component: CategoriesListComponent },
  { path: 'categories/add', component: CategoriesAddComponent },
  { path: 'categories/edit/:id', component: CategoriesEditComponent },
  { path: 'articles', component: ArticlesListComponent },
  { path: '**', redirectTo: 'subcategories', pathMatch: 'full' },
];
