import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
    selector: 'app-linear-chart',
    templateUrl: './linear-chart.component.html',
    styleUrl: './linear-chart.component.scss',
    standalone: false
})
export class LinearChartComponent implements OnInit, OnChanges {
  @Input() dates: string[] = [];
  @Input() scores: number[] = [];
  
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: this.scores,
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(139, 158, 132, 1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(139, 158, 132, 0.8)',
        fill: 'origin',
      },
    ],
    labels: this.dates,
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,  // You can keep the legend if desired
      },
    },
  };

  ngOnInit(): void {
    this.lineChartData.datasets[0].data = this.scores;
    this.lineChartData.labels = this.dates;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dates']) {
      const currentValue = changes['dates'].currentValue;
      this.lineChartData.labels = currentValue;
    }
    if (changes['scores']) {
      const currentValue = changes['scores'].currentValue;
      this.lineChartData.datasets[0].data = currentValue;
    }
  }
}
