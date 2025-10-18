import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-edit-modal',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-content class="ion-padding">
      <ng-container *ngIf="mode === 'edit'; else deleteTemplate">
        <h2>Editar categoría</h2>
        <ion-item>
          <ion-label position="stacked">Nuevo nombre</ion-label>
          <ion-input [(ngModel)]="newName" placeholder="Ingresa el nuevo nombre"></ion-input>
        </ion-item>

        <ion-button expand="block" color="primary" (click)="confirmEdit()">Guardar</ion-button>
        <ion-button expand="block" fill="clear" color="medium" (click)="close()">Cancelar</ion-button>
      </ng-container>

      <ng-template #deleteTemplate>
        <h2>Eliminar categoría</h2>
        <p>¿Deseas eliminar la categoría <strong>{{ category?.name }}</strong>?</p>
        <ion-button expand="block" color="danger" (click)="confirmDelete()">Eliminar</ion-button>
        <ion-button expand="block" fill="clear" color="medium" (click)="close()">Cancelar</ion-button>
      </ng-template>
    </ion-content>
  `,
  styles: [`
    ion-content {
      text-align: center;
    }
    h2 {
      margin-bottom: 1rem;
      font-weight: 600;
    }
    p {
      margin: 1rem 0;
      color: var(--ion-color-medium);
    }
  `]
})
export class CategoryEditModalComponent {
  @Input() category: any;
  @Input() mode: 'edit' | 'delete' = 'edit';
  newName = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    if (this.mode === 'edit' && this.category) {
      this.newName = this.category.name;
    }
  }

  confirmEdit() {
    if (!this.newName.trim()) return;
    this.modalCtrl.dismiss({ newName: this.newName }, 'confirm');
  }

  confirmDelete() {
    this.modalCtrl.dismiss(null, 'confirm');
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
