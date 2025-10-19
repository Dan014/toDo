import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    pathMatch: 'full',
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./pages/categories/categories.page').then(
        (m) => m.CategoriesPage
      ),
  },
  {
    path: 'tasks/:categoryId',
    loadComponent: () =>
      import('./pages/task/tasks.page').then((m) => m.TasksPage),
  },
  {
    path: 'add-task',
    loadComponent: () =>
      import('./pages/add-task/add-task.page').then((m) => m.AddTaskPage),
  },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
