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
    // LegendsOnly resize endpoint: GET /api/Image?img=<file>&path=<app>&max=<dimension>
    // (single proportional max dimension; the legacy crop/default flags are not supported).
    const base = environment.legendsApi + '/api/Image';
    const app = Config.app;
    let image: any;
    if (value == null || value === undefined) {
      // Fallback icon, served from the app's upload folder.
      image = `${base}?img=icon-${app}.png&path=${app}`;
    } else if (value.toLowerCase().indexOf('http') !== -1) {
      image = value;
    } else {
      const max = Math.max(width, height);
      image = `${base}?img=${value}&path=${app}`;
      if (max > 0) {
        image += '&max=' + max;
      }
    }
    return this.domSanitizer.bypassSecurityTrustUrl(image) as any;
  }

}
