declare namespace ReCaptchaV2 {
    type Theme = "light" | "dark";
    type Size = "normal" | "compact" | "invisible";
    type Badge = "bottomright" | "bottomleft" | "inline";
    type Type = "image" | "audio";
  
    interface Parameters {
      sitekey: string;
      theme?: Theme;
      size?: Size;
      badge?: Badge;
      type?: Type;
      callback?: (response: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    }
  
    interface ReCaptcha {
      render(container: string | HTMLElement, parameters: Parameters): number;
      reset(opt_widget_id?: number): void;
      execute(opt_widget_id?: number, config: any): void;
    }
  }
  
declare var grecaptcha: any;
  