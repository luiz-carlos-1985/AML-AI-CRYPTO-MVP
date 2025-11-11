import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeWrapperProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

class QRCodeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('QR Code generation failed:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function QRCodeWrapper({ value, size = 200, level = 'M', includeMargin = true }: QRCodeWrapperProps) {
  // Validate data length
  if (!value || value.length > 2000) {
    return (
      <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 bg-slate-200 rounded-lg flex items-center justify-center">
        <p className="text-slate-500 text-xs sm:text-sm text-center">QR Code<br/>Unavailable</p>
      </div>
    );
  }

  return (
    <QRCodeErrorBoundary
      fallback={
        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 bg-slate-200 rounded-lg flex items-center justify-center">
          <p className="text-slate-500 text-xs sm:text-sm text-center">QR Code<br/>Error</p>
        </div>
      }
    >
      <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 flex items-center justify-center">
        <QRCodeSVG
          value={value}
          size={Math.min(size, 160)}
          level={level}
          includeMargin={includeMargin}
          className="max-w-full max-h-full"
        />
      </div>
    </QRCodeErrorBoundary>
  );
}