import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang(environment.defaultLang);
  }
  getTranslation() {
    return this.translate;
  }
  changeLanguage(newLang) {
    this.translate.use(newLang);
  }
}
