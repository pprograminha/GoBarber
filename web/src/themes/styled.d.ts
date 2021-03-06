import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    title: 'light' | 'dark';
    colors: {
      shape: '#3E3B47';
      hard: '#666360';
      sub: '#999591';
      orange: '#FF9000';
      medium: '#28262E';
      background: '#312E38';
      inputs: '#232129';
      text: '#EEEFF1';
      error: '#c53030';
      success: '#1DC970';
    };
  }
}
