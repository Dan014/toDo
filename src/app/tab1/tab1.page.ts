import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexStroke,
  ApexFill,
  ApexLegend,
} from 'ng-apexcharts';

// Firebase SDK nativo (no usar AngularFire aquí)
import { fetchAndActivate, getBoolean, getRemoteConfig } from 'firebase/remote-config';
// 🔥 Firebase SDK nativo
import { initializeApp, getApps, getApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
}
interface ChartOptions {
  chart: ApexChart;
  labels: string[];
  colors: string[];          // 👈 AÑADIR ESTA LÍNEA
  fill: ApexFill;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive[];
}


@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page {
  private _storage: Storage | null = null;

  categories: Category[] = [];
  tasks: Task[] = [];
pastelColors = [
  '#E3F2FD', // azul muy claro (casi blanco)
  '#BBDEFB', // azul pastel suave
  '#90CAF9', // azul cielo
  '#64B5F6', // azul suave medio
  '#42A5F5', // azul vivo pastel
  '#2196F3', // azul principal (Material Blue)
  '#1E88E5', // azul un poco más fuerte
  '#1976D2', // azul intenso (para contraste)
];

  searchTerm = '';
  showDashboard = true; // valor local por defecto

 constructor(
    private storage: Storage,
    private router: Router,
  ) {}

  
async ngOnInit() {
  await this.loadData();
  this.updateChart();

  // 🔥 Inicializar Firebase si aún no está inicializado
  const app = getApps().length ? getApp() : initializeApp(environment.firebase);
  const remoteConfig = getRemoteConfig(app);
  remoteConfig.settings.minimumFetchIntervalMillis = 10000; // 10s para pruebas

  // 👇 Valor por defecto antes de contactar con Firebase
  this.showDashboard = true;

 try {
  console.log('🚀 Intentando conectar a Firebase Remote Config...');
  const activated = await fetchAndActivate(remoteConfig);

  console.log('📡 Estado fetchAndActivate:', activated);
  console.log('🔍 Valores actuales de Remote Config:', remoteConfig);

  const remoteValue = getBoolean(remoteConfig, 'showDashboard');
  console.log('🎚️ Valor de showDashboard desde Firebase:', remoteValue);

  this.showDashboard = remoteValue !== undefined ? remoteValue : true;
  console.log('✅ Dashboard visible:', this.showDashboard);
  
} catch (error) {
  console.warn('⚠️ Error al obtener Remote Config:', error);
  this.showDashboard = true; // fallback
}

}



  async ionViewWillEnter() {
    await this.loadData();
    this.updateChart();
  }


  async loadData() {
  this._storage = await this.storage.create();
  this.categories = (await this._storage?.get('categories')) || [];
  this.tasks = (await this._storage?.get('tasks')) || [];

  this.updateChart(); // 👈 mover aquí garantiza sincronía
}


  /** Filtra las categorías según el término de búsqueda */
  get filteredCategories() {
    if (!this.searchTerm.trim()) return this.categories;
    return this.categories.filter(cat =>
      cat.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /** Calcula el progreso (0–1) de tareas completadas por categoría */
  getCategoryProgress(categoryId: string): number {
    const related = this.tasks.filter(t => t.categoryId === categoryId);
    if (related.length === 0) return 0;
    const done = related.filter(t => t.completed).length;
    return done / related.length;
  }

  openCategory(cat: Category) {
    this.router.navigate(['/tasks', cat.id]);
  }

  goToAddTask() {
    this.router.navigate(['/add-task']);
  }

  goToCategories() {
    this.router.navigate(['/categories']);
  }

  chartSeries: ApexNonAxisChartSeries = [];
  chartOptions: ChartOptions = {
    chart: { type: 'donut' },
    labels: [],
    colors: [],                // 👈 Y AQUÍ INICIALIZARLA
    fill: { type: 'solid' },
    stroke: { width: 0 },
    legend: { position: 'bottom' },
    responsive: [],
  };



 updateChart() {
  const data: number[] = [];
  const labels: string[] = [];
  const colors: string[] = [];

  this.categories.forEach((cat, index) => {
    const related = this.tasks.filter(t => t.categoryId === cat.id);
    const done = related.filter(t => t.completed).length;
    const percent = related.length ? (done / related.length) * 100 : 0;

    data.push(percent);
    labels.push(cat.name);
    colors.push(this.pastelColors[index % this.pastelColors.length]); // 👈 color fijo por índice
  });

  this.chartSeries = data.length ? data : [0];
  this.chartOptions = {
    chart: {
      type: 'donut',
      width: 280,
      height: 280,
    },
    labels,
    colors, // 👈 mismo arreglo que se usa en las tarjetas
    fill: {
      type: 'solid',
    },
    stroke: {
      width: 2,
      colors: ['#ffffff'], // mejora contraste
    },
    legend: {
      position: 'bottom',
      labels: {
        colors: '#333',
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 250,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };
}


  getCategoryColor(categoryId: string, index?: number): string {
    // Intentamos mantener el color fijo por orden original
    const catIndex = this.categories.findIndex(c => c.id === categoryId);
    const effectiveIndex = catIndex !== -1 ? catIndex : (index ?? 0);
    return this.pastelColors[effectiveIndex % this.pastelColors.length];
  }

}
