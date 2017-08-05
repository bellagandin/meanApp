import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule,Routes} from '@angular/router';
import {FlashMessagesModule} from 'angular2-flash-messages'

import {ApiService} from './services/api.service'
import {AuthenticateService} from './services/authenticate.service'
import {ValidateService} from './services/Validate.service'
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import {AuthGuard} from './guards/auth.guard';
import { PostComponent } from './components/post/post.component';
import { Carousel } from './components/image_carusal/carousel/carousel.component';
import { Slide} from './components/image_carusal/slide/slide.component';
import { TesterComponent } from './tester/tester.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { printSlide } from './components/carousel/printSlide';

const appRoutes: Routes = [
  {path:'',component:HomeComponent},
  {path:'register',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent, canActivate:[AuthGuard]},
  {path:'profile',component:ProfileComponent/*,canActivate:[AuthGuard]*/},
  {path:'post',component:PostComponent},
  {path:'test',component:TesterComponent},
  
  
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    PostComponent,
    Carousel,
    Slide,
    TesterComponent,
    CarouselComponent,
    printSlide
    
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule

  ],
  providers: [
    ApiService,
    AuthenticateService,
    ValidateService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
