import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  public loadScripts(name: any) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = name;
    script.async = false;
    script.defer = true;
    console.log('SZSCRIPT->', script);
    body.appendChild(script);
  }

  isJsonEmpty(json: any) {
    return Object.keys(json).length === 0 && json.constructor === Object;
  }

  isEmptyOrNull(val: any) {
    if (val) {
      return (val === undefined || val == null || val.length <= 0 || typeof val === 'undefined') ? true : false;
    } else {
      return true;
    }
  }

  isNumber(x: any) {
    return parseFloat(x) == x
  };

  formatTime(time: any, format: string) {
    return moment.utc(time).format(format);
  }

  toBool(a: any) {
    return Boolean(a).valueOf();
  }

  cleanString(str: string): string {
    if (str === null || str === undefined) {
      str = '';
    }
    str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
    return str.trim();
  }

  setNum(i: any) {
    if (typeof i === "string" && !Number.isNaN(Number(i))) {
      return Number(i);
    } else {
      if (this.isEmptyOrNull(i)) {
        return 0;
      } else {
        if (isNaN(i)) {
          return 0;
        } else {
          return Number(i);
        }
      }
    }
  }

  replaces(str: string, original: string, replace: string, incaseSensitive = true) {
    if (!incaseSensitive) {
      return str.split(original).join(replace);
    } else {
      // Replace this part with regex for more performance
      var strLower = str.toLowerCase();
      var findLower = String(original).toLowerCase();
      var strTemp = str.toString();

      var pos = strLower.length;
      while ((pos = strLower.lastIndexOf(findLower, pos)) != -1) {
        strTemp = strTemp.substr(0, pos) + replace + strTemp.substr(pos + findLower.length);
        pos--;
      }
      return strTemp;
    }
  };

  currentDateTime() {
    let currentdate = new Date();
    let hours = currentdate.getHours();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return (currentdate.getMonth() + 1) + "/" 
      + currentdate.getDate() + "/"
      + currentdate.getFullYear() + " "
      + hours + ":"
      + ('0'+currentdate.getMinutes()).slice(-2) + ":"
      + ('0'+currentdate.getSeconds()).slice(-2) + " "
      + ampm;
  }

  currentDbDateTime() {
    let currentdate = new Date();
    return currentdate.getFullYear() + "-" 
    + ("0" + (currentdate.getMonth() + 1)).slice(-2) + "-" 
      + ("0" + currentdate.getDate()).slice(-2) + " "
      + currentdate.getHours() + ":" 
      + currentdate.getMinutes() + ":"
      + ('0'+currentdate.getMinutes()).slice(-2) + ":"
      + ('0'+currentdate.getSeconds()).slice(-2);
  }

  // convertSha1(str: string): string {
  //   return sha1(str).toLowerCase();
  // }

  // getPreviewToken(musicId): string {
  //   const todayUtc = moment.utc().startOf('hour');
  //   console.log(todayUtc.valueOf());
  //   const str = todayUtc.valueOf() + '-' + musicId;
  //   return this.convertSha1(str) + '|' + musicId;
  // }

  // getDownloadToken(musicId, userId): string {
  //   const todayUtc = moment.utc().startOf('hour');
  //   console.log(todayUtc.valueOf());
  //   const str = todayUtc.valueOf() + '-' + musicId + '-' + userId;
  //   return this.convertSha1(str);
  // }
}
