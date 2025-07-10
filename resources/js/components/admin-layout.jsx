import { AdminSidebar } from '@/components/admin-sidebar';
import ErrorBoundary from '@/components/error-boundary';
import { usePage } from '@inertiajs/react';

export function AdminLayout({ children }) {
    const { flash } = usePage().props;

    return (
        <ErrorBoundary>
            <div className="flex h-screen bg-gray-100">
                <AdminSidebar />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 m-4 rounded">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
                            {flash.error}
                        </div>
                    )}

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </ErrorBoundary>
    );
}
