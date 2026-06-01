import { Injectable } from "@angular/core";
import { HttpClient, HttpRequest, HttpEventType, HttpEvent } from "@angular/common/http";
import { map, tap, last } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";
import { Config } from "@shared/config";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  public progressSource = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }

  uploadPlaylist(file: File, id: number = 0, section: string = 'playlist') {
    let formData = new FormData();
    // LegendsOnly /api/UploadImage expects: image (file), id, section, app
    formData.append("image", file);
    formData.append("id", String(id));
    formData.append("section", section);
    formData.append("app", Config.app);

    const req = new HttpRequest(
      "POST",
      environment.legendsApi + "/api/UploadImage",
      formData,
      {
        reportProgress: true
      }
    );

    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      tap((envelope: any) => this.processProgress(envelope)),
      last()
    );
  }

  upload(file: File, id: number = 0, section: string = 'members') {
    let formData = new FormData();
    // LegendsOnly /api/UploadImage expects: image (file), id, section, app
    formData.append("image", file);
    formData.append("id", String(id));
    formData.append("section", section);
    formData.append("app", Config.app);

    const req = new HttpRequest(
      "POST",
      environment.legendsApi + "/api/",
      formData,
      {
        reportProgress: true
      }
    );

    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      tap((envelope: any) => this.processProgress(envelope)),
      last()
    );
  }

  processProgress(envelope: any): void {
    if (typeof envelope === "number") {
      console.log(envelope);
      this.progressSource.next(envelope);
    }
  }

  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file...`;
        //return `Uploading file "${file.name}" of size ${file.size}.`;
      case HttpEventType.UploadProgress:
        return Math.round((100 * event.loaded) / event.total!);
      case HttpEventType.Response: {
        const body = event.body || {};
        // MixApps returned { error, msg, data }; LegendsOnly returns { success, message, data }
        if (body.error || body.success === false) {
          return `Server Error: ` + (body.msg || body.message || 'upload failed');
        }
        return body.data;
      }
      default:
        return ``;
        //return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }
}
