// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ismock: false,
  projectid: 'skratchbastid',
  //api: 'https://www.mixapps.io',
  api: 'http://10.211.55.5:62406',
  captcha: {
      key: '6LdO8tcqAAAAAPljZtMoYFcW_SlAyeG8mLSLDunI',
  },
  stripeKey: 'pk_live_m9Ix69thAe1KiclzNNwc1QZE00waWBLKvH',
  prodId: 'prod_RvMADg6RCwpL34'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
