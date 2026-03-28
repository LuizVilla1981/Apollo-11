import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#030305] px-6 text-center text-white">
          <div>
            <h1 className="mb-4 text-3xl font-bold">Algo deu errado</h1>
            <p className="mb-6 text-white/60">Tente recarregar a página.</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-[#E67E22] px-6 py-3 font-bold text-white transition-colors hover:brightness-110"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
