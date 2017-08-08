//modules imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule,Routes} from '@angular/router';
import {FlashMessagesModule} from 'angular2-flash-messages'
import { MomentModule } from 'angular2-moment';
import { Ng2UploaderModule } from 'ng2-uploader';


//components and services deckeration
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
import {changeBG} from './services/changeBG.service';
import { SearchResaultComponent } from './components/search-resault/search-resault.component';
import { UserResaultComponent } from './components/user-resault/user-resault.component';
import { NewPostComponent } from './components/new-post/new-post.component'
import {PublishPostService} from './services/publish-post.service';
import { IngridentComponent } from './components/ingrident/ingrident.component'

const appRoutes: Routes = [
  {path:'',component:HomeComponent},
  {path:'register',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent, canActivate:[AuthGuard]},
  {path:'profile/:username',component:ProfileComponent,canActivate:[AuthGuard]},
  {path:'post',component:PostComponent},
  {path:'test',component:TesterComponent},
  {path:'searchResault',component:SearchResaultComponent},
  {path:'newPost',component:NewPostComponent}

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
    printSlide,
    SearchResaultComponent,
    UserResaultComponent,
    NewPostComponent,
    IngridentComponent
    
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    MomentModule,
    Ng2UploaderModule,
    

  ],
  providers: [
    ApiService,
    AuthenticateService,
    ValidateService,
    AuthGuard,
    changeBG,
    PublishPostService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
