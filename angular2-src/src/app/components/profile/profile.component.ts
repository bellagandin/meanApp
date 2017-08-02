import { Component, OnInit } from '@angular/core';
import { AuthenticateService} from '../../services/authenticate.service'
import {Router} from '@angular/router'
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object

  constructor(private auth : AuthenticateService,
              private router : Router) { }

  ngOnInit() {
    this.auth.getProfile().subscribe(
      profile=>{
        console.log(profile.user);
        this.user=profile.user;

      },
    err=>{
      console.log(err);
    });
  }

}
