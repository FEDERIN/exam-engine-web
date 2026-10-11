import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(
      "Unexpected application error:",
      error,
      info.componentStack,
    );
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    const { error } = this.state;

    if (error === null) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-slate-100">
        <section className="w-full max-w-lg rounded-2xl border border-red-500/40 bg-slate-900 p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm text-slate-400">
            The app could not load correctly. This is usually
            caused by invalid data in the question bank.
          </p>

          <pre className="mt-4 overflow-auto rounded-lg bg-slate-800 p-4 text-left text-xs text-red-300">
            {error.message}
          </pre>

          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            Reload
          </button>
        </section>
      </main>
    );
  }
}
