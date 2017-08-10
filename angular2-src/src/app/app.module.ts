//modules imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule,Routes} from '@angular/router';
import {FlashMessagesModule} from 'angular2-flash-messages'
import { MomentModule } from 'angular2-moment';
import { Ng2UploaderModule } from 'ng2-uploader';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgxGalleryModule } from 'ngx-gallery';




//components and services deckeration
import {ApiService} from './services/api.service'
import {getPostsService} from './services/getPosts.service'
import {PostEditService} from './services/post-edit.service'
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
import { TesterComponent } from './tester/tester.component';
import {changeBG} from './services/changeBG.service';
import { SearchResaultComponent } from './components/search-resault/search-resault.component';
import { UserResaultComponent } from './components/user-resault/user-resault.component';
import { NewPostComponent } from './components/new-post/new-post.component'
import {PublishPostService} from './services/publish-post.service';
import { CommentComponent } from './components/comment/comment.component';
import { ImageSliderComponent } from './components/image-slider/image-slider.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';

const appRoutes: Routes = [
  {path:'',component:HomeComponent},
  {path:'register',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent, canActivate:[AuthGuard]},
  {path:'profile/:username',component:ProfileComponent,canActivate:[AuthGuard]},
  {path:'post',component:PostComponent},
  {path:'test',component:TesterComponent},
  {path:'EditPost/:post_id',component:EditPostComponent},
  {path:'searchResault/:searchQuery/:selectedValue',component:SearchResaultComponent},
  {path:'newPost',component:NewPostComponent,canActivate:[AuthGuard]}

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
    TesterComponent,
    SearchResaultComponent,
    UserResaultComponent,
    NewPostComponent,
    CommentComponent,
    ImageSliderComponent,
    EditPostComponent,



  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    MomentModule,
    Ng2UploaderModule,
    CarouselModule.forRoot(),
    NgxGalleryModule,
    ReactiveFormsModule



  ],
  providers: [
    ApiService,
    AuthenticateService,
    ValidateService,
    AuthGuard,
    changeBG,
    PublishPostService,
    getPostsService,
    PostEditService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
