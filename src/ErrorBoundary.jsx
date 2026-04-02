import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { console.error('ErrorBoundary:', err); }
  render() {
    if (this.state.hasError) {
      return <div className="p-10 font-mono text-red-600"><h1>Something went wrong.</h1></div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
