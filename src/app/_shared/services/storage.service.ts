import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor() { }

  setData(id: string, data: any) {
    const now = new Date().getTime();
    const setupTime = localStorage.getItem(id + '-time');
    if (setupTime == null || setupTime === undefined) {
      this.setItem(id + '-time', now.toString());
    } else {
      this.removeItem(id + 'time');
      this.setItem(id + '-time', now.toString());
    }
    localStorage.setItem(id, JSON.stringify(data))
  }

  getData(id: string, expireHours: number = 0) {
    if (expireHours > 0) {
      const setupTime = this.getItem(id + '-time');
      if (setupTime == null || setupTime === undefined) {
        return null;
      }
      const now = new Date().getTime();
      // console.log(id + ' setup time:' + (now - +setupTime).toString() + ' - ' + id +
      // ' expire time:' + (expireHours * 60 * 60 * 1000).toString());
      if (now - +setupTime > expireHours * 60 * 60 * 1000) {
        return null;
      } else {
        return localStorage.getItem(id);
      }
    } else {
      return localStorage.getItem(id);
    }
  }

  clearData(id: string) {
    localStorage.removeItem(id);
    localStorage.removeItem(id + 'time');
  }

  defaultVal(id: any, defaultVal: any) {
    if (localStorage.getItem(id) === null) {
      return defaultVal;
    } else {
      return localStorage.getItem(id);
    }
  }

  setObject(id: string, data: any) {
    localStorage.setItem(id, JSON.stringify(data));
  }

  getObject(id: string) {
    let ret = localStorage.getItem(id);
    if (ret === null) {
      ret = "[]";
    }
    return JSON.parse(ret);
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, value);
  }
  
  getItem(key: string) {
    return localStorage.getItem(key);
  }
  
  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  clearAll() {
    localStorage.clear();
  }
}
