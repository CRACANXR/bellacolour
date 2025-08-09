// TypeScript declaration for the 'model-viewer' custom element
import * as React from 'react';
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        style?: React.CSSProperties | string;
        exposure?: string | number;
      };
    }
  }
}
