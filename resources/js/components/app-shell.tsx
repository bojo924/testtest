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

    if (variant === 'header') {
        return (
            <ErrorBoundary>
                <div className="flex min-h-screen w-full flex-col">
                    <Navbar />

                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </ErrorBoundary>
        );
    }

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}
