import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Filter,
    Eye,
    Package,
    Calendar,
    DollarSign,
    User,
    Palette,
    ShoppingCart
} from 'lucide-react';

export default function AdminOrdersIndex({ orders, filters, orderType = 'all' }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

    const handleSearch = () => {
        router.get(route('admin.orders.index'), {
            search: searchTerm,
            status: selectedStatus === 'all' ? '' : selectedStatus,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedStatus('all');
        router.get(route('admin.orders.index'));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <Head title={
                orderType === 'custom' ? 'Custom T-Shirt Orders' :
                orderType === 'regular' ? 'Regular Orders' :
                'Manage Orders'
            } />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        {orderType === 'custom' && <Palette className="h-8 w-8 text-orange-500" />}
                        {orderType === 'regular' && <ShoppingCart className="h-8 w-8 text-blue-500" />}
                        {orderType === 'all' && <Package className="h-8 w-8 text-gray-500" />}
                        <h1 className={`text-3xl font-bold ${
                            orderType === 'custom' ? 'text-orange-700' :
                            orderType === 'regular' ? 'text-blue-700' :
                            'text-gray-900'
                        }`}>
                            {orderType === 'custom' ? '🎨 Custom T-Shirt Orders' :
                             orderType === 'regular' ? 'Regular Orders' :
                             'All Orders'}
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        {orderType === 'custom' ? 'Manage custom designed t-shirt orders' :
                         orderType === 'regular' ? 'Manage regular product orders' :
                         'View and manage all customer orders'}
                    </p>
                </div>

                {/* Search and Filter Section */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search by order number or customer name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Button onClick={handleSearch} className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Apply Filters
                            </Button>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Orders ({orders.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {orders.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders found</h3>
                                <p className="text-gray-500">
                                    {filters.search || filters.status
                                        ? 'Try adjusting your search criteria'
                                        : 'No orders have been placed yet'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4">Order</th>
                                            <th className="text-left py-3 px-4">Customer</th>
                                            <th className="text-left py-3 px-4">Date</th>
                                            <th className="text-left py-3 px-4">Total</th>
                                            <th className="text-left py-3 px-4">Status</th>
                                            <th className="text-right py-3 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.data.map((order) => (
                                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className={`font-medium ${order.order_type === 'custom' ? 'text-orange-700' : ''}`}>
                                                            {order.order_type === 'custom' ? '🎨 ' : ''}#{order.order_number}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            ID: {order.id}
                                                        </p>
                                                        {order.order_type === 'custom' && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                                                                Custom T-Shirt
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-gray-400" />
                                                        <div>
                                                            <p className="font-medium">{order.user.name}</p>
                                                            <p className="text-sm text-gray-600">{order.user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm">{formatDate(order.created_at)}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                                        <span className="font-medium">{order.total_amount} DH</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge className={getStatusColor(order.status)}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <Link href={route('admin.orders.show', order.id)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {orders.links && orders.data.length > 0 && orders.links.filter(link => link.url !== null).length > 1 && (
                            <div className="mt-6 flex justify-center">
                                <div className="flex gap-2">
                                    {orders.links
                                        .filter((link) => {
                                            // Hide any pagination button that doesn't have a URL
                                            return link.url !== null;
                                        })
                                        .map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                disabled={!link.url}
                                                onClick={() => link.url && router.get(link.url)}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {orders.data.filter(order => order.status === 'pending').length}
                            </div>
                            <div className="text-sm text-gray-600">Pending</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {orders.data.filter(order => order.status === 'confirmed').length}
                            </div>
                            <div className="text-sm text-gray-600">Confirmed</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {orders.data.filter(order => order.status === 'shipped').length}
                            </div>
                            <div className="text-sm text-gray-600">Shipped</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {orders.data.filter(order => order.status === 'delivered').length}
                            </div>
                            <div className="text-sm text-gray-600">Delivered</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {orders.data.filter(order => order.status === 'cancelled').length}
                            </div>
                            <div className="text-sm text-gray-600">Cancelled</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
