import { Injectable } from '@angular/core';

type HiveQueuedFn = ((...args: any[]) => void) & { q?: any[] };

declare global {
  interface Window {
    HIVE_SDK?: HiveQueuedFn;
    HiveSDKObject?: string;
  }
}

@Injectable({
  providedIn: 'root',
})
export class HiveService {
  private scriptLoadingPromise?: Promise<void>;
  private initializedSwids = new Set<number>();

  private get hiveSdk(): HiveQueuedFn | undefined {
    if (typeof window === 'undefined') {
      return undefined;
    }

    return window.HIVE_SDK;
  }

  private loadHiveSdkScript(): Promise<void> {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    if (typeof window.HIVE_SDK === 'function') {
      return Promise.resolve();
    }

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    this.scriptLoadingPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById('HIVE_SDK');
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.text = `
        (function(h,i,v,e,s,d,k){h.HiveSDKObject=s;h[s]=h[s]||function(){(h[s].q=h[s].q||[]).push(arguments)},d=i.createElement(v),k=i.getElementsByTagName(v)[0];d.async=1;d.id=s;d.src=e+'?r='+parseInt(new Date()/60000);k.parentNode.insertBefore(d,k)})(window,document,'script','https://cdn-prod.hive.co/static/js/sdk-loader.js','HIVE_SDK')
      `;
      script.id = 'HIVE_SDK_BOOTSTRAP';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Hive SDK'));
      document.head.appendChild(script);
      resolve();
    });

    return this.scriptLoadingPromise;
  }

  async ensureInitialized(swid: number): Promise<void> {
    if (this.initializedSwids.has(swid)) {
      return;
    }

    await this.loadHiveSdkScript();

    const sdk = window.HIVE_SDK;
    if (!sdk) {
      throw new Error('Hive SDK did not initialize');
    }

    sdk('init', swid, () => {
      // Hive init complete.
    });
    this.initializedSwids.add(swid);
  }

  private runHiveSdk(...args: any[]): Promise<any> {
    const sdk = window.HIVE_SDK;

    if (!sdk) {
      console.warn('Hive SDK is not available. Skipping Hive event.', args[0]);
      return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
      try {
        sdk(...args, resolve, reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  sendMemberDataToHive(member: any) {
    const contactData = {
      email: member?.email,
      firstName: member?.firstName,
      lastName: member?.lastName,
    };

    return this.runHiveSdk('emailSignup', contactData);
  }

  sendEmailSignup(email: string) {
    console.log('Sending email signup to Hive');
    const contactData = {
      email,
    };

    return this.runHiveSdk('emailSignup', contactData);
  }

  sendToHive(formData: any) {
    console.log('Sending data to Hive.co:', formData);

    const contactData = {
      email: formData.email,
      firstName: formData.name || formData.firstName,
      phoneNumber: formData.phone || formData.phoneNumber,
      zipCode: formData.zip,
      city: formData.city,
      didOptIn: true,
    };

    return Promise.all([
      this.runHiveSdk('emailSignup', contactData),
      this.runHiveSdk('addToSegment', `BBQ Buyers - ${contactData.city || 'Unknown'}`),
    ]).then(() => {
      console.log('Successfully signed up to Hive and added to segment.');
    }).catch((error) => {
      console.error('Error sending data to Hive:', error);
      throw error;
    });
  }

  sendToHiveCTA(formElement: any) {
    console.log('Sending signup form to Hive...', formElement);
    return this.runHiveSdk('submitSignupForm', formElement);
  }

  addProperty(property: string, value: any) {
    const customData = {
      [property]: value,
    };

    return this.runHiveSdk('customUserProperties', 'update', customData);
  }
}
