import { AdminSidebar } from '@/components/admin-sidebar';
import ErrorBoundary from '@/components/error-boundary';
import { usePage } from '@inertiajs/react';

export function AdminLayout({ children }) {
    const { flash } = usePage().props;

    return (
        <ErrorBoundary>
            <div className="flex h-screen bg-white">
                <AdminSidebar />

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 m-4 rounded-lg">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 m-4 rounded-lg">
                            {flash.error}
                        </div>
                    )}

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto bg-gray-50">
                        {children}
                    </main>
                </div>
            </div>
        </ErrorBoundary>
    );
}
