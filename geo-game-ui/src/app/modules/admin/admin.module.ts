import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routedComponents, AdminRoutingModule } from './admin-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [routedComponents],
  imports: [
    CommonModule,
    RouterModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class AdminModule { }
