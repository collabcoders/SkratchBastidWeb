import { Pipe, PipeTransform } from '@angular/core';
import { Video } from '@shared/models/video';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'videoEmbed'
})
export class VideoPipe implements PipeTransform {

  constructor(private sanitizer:DomSanitizer) { }

  transform(value: Video, screenWidth: number, isSafe: boolean, isModal:boolean = false): any {
    let youtubeSrcBaseUrl = 'https://www.youtube.com/embed/';
    let vimeoSrcBaseUrl = 'https://player.vimeo.com/video/';
    let vimeoSrcParams = '?playsinline=0&autoplay=1&color=#0600BF&title=0&byline=0&portrait=0&muted=1';

    let w = screenWidth; // - 20;
    let h = Math.round((w/16)*9);

    if (isModal) {
      h = h - 20;
    } 

    let videoSrc = youtubeSrcBaseUrl + value.sourceId + '?rel=0&showinfo=0&autoplay=1&fs=1';
    if (value.source == 'vimeo') {
      videoSrc = vimeoSrcBaseUrl + value.sourceId + vimeoSrcParams;
    }

    // let innerHtml = '<iframe src="' + videoSrc + '" width="' + (isModal ? '100%' : w) + '" height="' + h + 
    // '" frameborder="0" class="video-embed" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

    let innerHtml = '<div class="vimeo-space" style="padding: 56.25% 0 0 0; position: relative;">' +
    '<iframe src="' + videoSrc + '" style="height: 100%; left: 0; position: absolute; top: 0; width: 100%;" ' +
    'frameborder="0" allow="autoplay; fullscreen" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

    if (isSafe) {
      return this.sanitizer.bypassSecurityTrustHtml(innerHtml);
    }
    return innerHtml;
    
  }

}
