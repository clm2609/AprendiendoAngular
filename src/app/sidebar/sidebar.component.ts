declare function require(path: string);
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslationService } from '../translation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  translate: TranslateService;

  currentUrl: string;
  esFlag = require('../../assets/images/ES.png');
  enFlag = require('../../assets/images/EN.png');
  constructor(private router: Router, private translation: TranslationService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = _.url)
  }


  ngOnInit() {
    this.translate = this.translation.getTranslation();
  }

  changeLang(newLang){
    this.translation.changeLanguage(newLang);
  }

}
