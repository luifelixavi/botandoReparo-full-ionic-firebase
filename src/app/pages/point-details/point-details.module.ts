import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PointDetailsPageRoutingModule } from './point-details-routing.module';

import { PointDetailsPage } from './point-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PointDetailsPageRoutingModule
  ],
  declarations: [PointDetailsPage]
})
export class PointDetailsPageModule {}
