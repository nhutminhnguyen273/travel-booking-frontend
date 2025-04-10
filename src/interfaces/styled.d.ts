import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
      muted: string;
      border: string;
      error: string;
      success: string;
      gradient: {
        primary: string;
        secondary: string;
      };
    };

    fontSizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      xxl: string;
      xxxl: string;
    };

    fonts: {
      heading: string;
      body: string;
    };

    spacing: {
      xxs: string;
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      xxl: string;
      xxxl: string;
    };

    breakpoints: {
      mobile: string;
      tablet: string;
      laptop: string;
      desktop: string;
      wide: string;
    };

    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      round: string;
    };

    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      hover: string;
    };
    
    animations: {
      fast: string;
      normal: string;
      slow: string;
    };
    
    maxWidth: {
      content: string;
      text: string;
    };
    
    grid: {
      columns: number;
      gap: string;
    };
  }
}