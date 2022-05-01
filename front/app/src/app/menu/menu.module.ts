import { NgModule } from '@angular/core';
import { MenuComponent } from './menu.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { PoNavbarModule, PoModule } from '@po-ui/ng-components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { DadosService } from '../dados/dados.service';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PoModule,
    PoNavbarModule,
  ],
  declarations: [MenuComponent],
  providers: [DadosService],
})
export class MenuModule {}
