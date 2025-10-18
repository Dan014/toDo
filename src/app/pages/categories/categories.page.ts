import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from 'src/app/core/services/categories.service';
import { Category } from 'src/app/core/models/category.model';
import { CategoryEditModalComponent } from './modals/categoryEditModal.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage {
  categories: Category[] = [];
  newName = '';

  constructor(
    private catSvc: CategoriesService,
    private modalCtrl: ModalController
  ) {}

  async ionViewWillEnter() {
    this.categories = await this.catSvc.list();
  }

  async addCategory() {
    if (!this.newName.trim()) return;
    await this.catSvc.create(this.newName);
    this.newName = '';
    this.categories = await this.catSvc.list();
  }

  // ✏️ Modal de edición
  async rename(cat: Category) {
    const modal = await this.modalCtrl.create({
      component: CategoryEditModalComponent,
      componentProps: { category: { ...cat }, mode: 'edit' },
      breakpoints: [0, 0.4],
      initialBreakpoint: 0.4,
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data?.newName) {
      await this.catSvc.update(cat.id, { name: data.newName });
      this.categories = await this.catSvc.list();
    }
  }

  // 🗑️ Modal de confirmación
  async remove(cat: Category) {
    const modal = await this.modalCtrl.create({
      component: CategoryEditModalComponent,
      componentProps: { category: { ...cat }, mode: 'delete' },
      breakpoints: [0, 0.3],
      initialBreakpoint: 0.3,
    });
    await modal.present();

    const { role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      await this.catSvc.remove(cat.id);
      this.categories = await this.catSvc.list();
    }
  }
}
