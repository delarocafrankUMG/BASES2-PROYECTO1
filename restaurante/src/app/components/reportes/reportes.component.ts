import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { ReportesService } from '../../services/reportes.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  selectedView = '';

  views = [
    { name: 'Estadísticas de Ventas', value: 'VW_ESTADISTICAS_VENTAS' },
    { name: 'Top Productos Semanales', value: 'VW_TOP_PRODUCTOS_SEMANALES' },
    { name: 'Top Productos Mensuales', value: 'VW_TOP_PRODUCTOS_MENSUALES' },
    { name: 'Top Productos Anuales', value: 'VW_TOP_PRODUCTOS_ANUALES' },
    { name: 'Ventas Diarias', value: 'VW_VENTAS_DIARIAS' },
    { name: 'Pedidos por Mesero', value: 'VW_PEDIDOS_POR_MESERO' },
    { name: 'Cierres de Caja', value: 'VW_CIERRES_CAJA' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private reportesService: ReportesService) {}

  cargarReporte(viewName: string) {
    this.selectedView = viewName;
    this.reportesService.getReporte(viewName).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.displayedColumns = Object.keys(data[0]);
        } else {
          this.displayedColumns = [];
        }

        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error al cargar reporte:', err);
      }
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
