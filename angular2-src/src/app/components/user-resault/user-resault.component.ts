import { Component, OnInit} from '@angular/core';
import {AuthenticateService} from '../../services/authenticate.service'
@Component({
  selector: 'app-user-resault',
  templateUrl: './user-resault.component.html',
  styleUrls: ['./user-resault.component.css']
})
export class UserResaultComponent implements OnInit {
  user: Object;
  constructor(private auth:AuthenticateService) { }

  ngOnInit() {
    this.user=this.auth.getLogoedInUser();

  }

}
