import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-noir text-pearl flex flex-col items-center justify-center p-10">
          <h1 className="text-3xl font-serif mb-4 text-amber">Something went wrong</h1>
          <p className="font-mono text-sm text-cream/60 max-w-lg break-all">
            {this.state.error?.message || 'Unknown error'}
          </p>
          <p className="font-mono text-xs text-cream/30 mt-6">
            Check the browser console for details.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
