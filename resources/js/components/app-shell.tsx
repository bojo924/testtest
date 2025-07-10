import { SidebarProvider } from '@/components/ui/sidebar';
import { Navbar } from '@/components/navbar';
import ErrorBoundary from '@/components/error-boundary';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;
    const { flash } = usePage().props;

    if (variant === 'header') {
        return (
            <ErrorBoundary>
                <div className="flex min-h-screen w-full flex-col">
                    <Navbar />

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mx-4 mt-4 rounded">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-4 rounded">
                            {flash.error}
                        </div>
                    )}

                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </ErrorBoundary>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
