import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { FormsModule } from '@angular/forms';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexStroke,
  ApexFill,
  ApexLegend,
} from 'ng-apexcharts';

import {
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
} from 'firebase/remote-config';
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
  colors: string[];
  fill: ApexFill;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  tooltip?: ApexTooltip; // 👈 agrega esta línea
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  private _storage: Storage | null = null;
  @ViewChild('chart') chart!: ChartComponent;

  categories: Category[] = [];
  tasks: Task[] = [];
  pastelColors = [
    '#A7C7E7', // azul grisáceo claro
    '#7EA6E0', // azul acero
    '#5E8DD3', // azul medio frío
    '#4477C4', // azul profesional
    '#3664B0', // azul sobrio
    '#2B56A1', // azul oscuro elegante
    '#244A8C', // azul profundo
    '#1A3973', // azul noche
  ];

  searchTerm = '';
  showDashboard = true; // valor local por defecto

  constructor(
    private storage: Storage,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadData();
    this.updateChart();

    // 🔥 Inicializar Firebase si aún no está inicializado
    const app = getApps().length
      ? getApp()
      : initializeApp(environment.firebase);
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
      this.showDashboard = true;
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
    this.updateChart();
    this.cdr.detectChanges();
  }

  /** Filtra las categorías según el término de búsqueda */
  get filteredCategories() {
    if (!this.searchTerm.trim()) return this.categories;
    return this.categories.filter((cat) =>
      cat.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  /** Calcula el progreso (0–1) de tareas completadas por categoría */
  getCategoryProgress(categoryId: string): number {
    const related = this.tasks.filter((t) => t.categoryId === categoryId);
    if (related.length === 0) return 0;
    const done = related.filter((t) => t.completed).length;
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
    colors: [],
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
      const related = this.tasks.filter((t) => t.categoryId === cat.id);
      const done = related.filter((t) => t.completed).length;
      const percent = related.length ? (done / related.length) * 100 : 0;

      data.push(percent);
      labels.push(cat.name);
      colors.push(this.pastelColors[index % this.pastelColors.length]);
    });

    this.chartSeries = data.length ? data : [0];

    this.chartOptions = {
      chart: {
        type: 'donut',
        width: 280,
        height: 280,
        dropShadow: { enabled: false },
        background: 'transparent',
      },
      labels,
      colors,
      fill: {
        type: 'solid',
      },
      stroke: {
        width: 2,
        colors: ['#ffffff'],
      },
      legend: {
        show: false,
      },
      tooltip: {
        enabled: true,
        theme: 'light',
        fillSeriesColor: false,
        y: {
          formatter: (value: number, opts?: any) => {
            // obtiene el nombre de la categoría desde las etiquetas
            const label = opts?.w?.globals?.labels[opts?.seriesIndex] || '';
            return `${label}: ${value.toFixed(1)}%`;
          },
          title: {
            formatter: () => '',
          },
        },
        style: {
          fontSize: '14px',
          fontFamily: 'Poppins, sans-serif',
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 250,
            },
          },
        },
      ],
    };

    if (this.chart) {
      this.chart.updateSeries(this.chartSeries, true);
    }

    this.cdr.detectChanges();
  }

  getCategoryColor(categoryId: string, index?: number): string {
    const catIndex = this.categories.findIndex((c) => c.id === categoryId);
    const effectiveIndex = catIndex !== -1 ? catIndex : index ?? 0;
    return this.pastelColors[effectiveIndex % this.pastelColors.length];
  }
}
