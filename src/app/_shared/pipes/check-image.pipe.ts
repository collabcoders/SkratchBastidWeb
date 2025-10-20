import { PipeTransform, Pipe, SecurityContext } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer } from "@angular/platform-browser";
import { catchError, map } from 'rxjs/operators';

@Pipe({
  name: 'checkImage'
})
export class CheckImagePipe implements PipeTransform {

  defaultUrl: string = "https://magmob.skratchbastid.com/content/user.png";

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  transform(url: string): Observable<any> {
    return this.http
    // load the image as a blob
    .get(url, {responseType: 'blob'})
    // create an object url of that blob that we can use in the src attribute
    .pipe(map((e: any) => { 
      //URL.createObjectURL(e) 
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }),
    catchError((err: any) => {
      console.log('refresh error')
      const returnUrl = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(this.defaultUrl)) as string;
      return returnUrl;
      //return throwError(err);  //<-- insert this 
    }))
  }

}
