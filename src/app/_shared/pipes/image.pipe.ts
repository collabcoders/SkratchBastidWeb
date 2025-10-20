import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Config } from '@shared/config';
import { environment } from '@env/environment';
@Pipe({
  name: 'imageUrl'
})
export class ImagePipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) { }

  transform(value: any, width: number = 0, height: number = 0, crop: boolean = false): string {
    let image: any;
    if (value == null || value === undefined) {
      image = environment.api + '/Helpers/ImageHandler.ashx?app=' + Config.app + '&default=icon-' + Config.app + '.png';
    } else {
      if (value.toLowerCase().indexOf('http') !== -1) {
        image = value;
      } else {
        image = environment.api + '/Helpers/ImageHandler.ashx?app=' + Config.app;
        if (width > 0) {
          image += '&width=' + width;
        }
        if (height > 0) {
          image += '&height=' + height;
        }
        if (crop) {
          image += '&crop=true';
        }
        image += '&default=icon-' + Config.app + '.png&img=' + value;
      }
    }
    return this.domSanitizer.bypassSecurityTrustUrl(image) as any;
  }

}
