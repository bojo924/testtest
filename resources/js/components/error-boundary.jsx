import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console for debugging
        console.error('Error caught by boundary:', error, errorInfo);
        
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <CardTitle className="text-xl text-gray-900">
                                Something went wrong
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="text-gray-600">
                                We're sorry, but something unexpected happened. Please try refreshing the page.
                            </p>
                            
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="text-left bg-gray-100 p-3 rounded text-sm">
                                    <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                                        Error Details (Development)
                                    </summary>
                                    <div className="space-y-2">
                                        <div>
                                            <strong>Error:</strong>
                                            <pre className="whitespace-pre-wrap text-red-600 mt-1">
                                                {this.state.error.toString()}
                                            </pre>
                                        </div>
                                        {this.state.errorInfo && (
                                            <div>
                                                <strong>Component Stack:</strong>
                                                <pre className="whitespace-pre-wrap text-gray-600 mt-1 text-xs">
                                                    {this.state.errorInfo.componentStack}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                </details>
                            )}
                            
                            <div className="flex gap-3 justify-center">
                                <Button onClick={this.handleReset} variant="outline">
                                    Try Again
                                </Button>
                                <Button onClick={this.handleReload} className="flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4" />
                                    Reload Page
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
