import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, DollarSign, Eye } from 'lucide-react';

export default function OrdersIndex({ orders }) {
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
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <AppShell>
            <Head title="Order History" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
                    <p className="text-gray-600">Track and manage your orders</p>
                </div>

                {orders.data.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-600 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                        <Link href={route('products.index')}>
                            <Button size="lg">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.data.map((order) => (
                            <Card key={order.id} className="overflow-hidden">
                                <CardHeader className="bg-gray-50">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <CardTitle className="text-lg">
                                                Order #{order.order_number}
                                            </CardTitle>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {formatDate(order.created_at)}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4" />
                                                    ${order.total_amount}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                            <Link href={route('orders.show', order.id)}>
                                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                    <Eye className="h-4 w-4" />
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        {order.order_items.slice(0, 3).map((item) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.product_image ? (
                                                        <img
                                                            src={`/storage/${item.product_image}`}
                                                            alt={item.product_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                                            📷
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.product_name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Quantity: {item.quantity} × ${item.price}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        ${(item.quantity * item.price).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {order.order_items.length > 3 && (
                                            <div className="text-center py-2">
                                                <p className="text-sm text-gray-500">
                                                    +{order.order_items.length - 3} more item{order.order_items.length - 3 !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Status Timeline */}
                                    <div className="mt-6 pt-4 border-t">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className={`flex items-center gap-2 ${
                                                ['pending', 'confirmed', 'shipped', 'delivered'].includes(order.status)
                                                    ? 'text-green-600'
                                                    : 'text-gray-400'
                                            }`}>
                                                <div className={`w-2 h-2 rounded-full ${
                                                    ['pending', 'confirmed', 'shipped', 'delivered'].includes(order.status)
                                                        ? 'bg-green-600'
                                                        : 'bg-gray-400'
                                                }`} />
                                                Order Placed
                                            </div>

                                            <div className={`flex items-center gap-2 ${
                                                ['confirmed', 'shipped', 'delivered'].includes(order.status)
                                                    ? 'text-green-600'
                                                    : 'text-gray-400'
                                            }`}>
                                                <div className={`w-2 h-2 rounded-full ${
                                                    ['confirmed', 'shipped', 'delivered'].includes(order.status)
                                                        ? 'bg-green-600'
                                                        : 'bg-gray-400'
                                                }`} />
                                                Confirmed
                                            </div>

                                            <div className={`flex items-center gap-2 ${
                                                ['shipped', 'delivered'].includes(order.status)
                                                    ? 'text-green-600'
                                                    : 'text-gray-400'
                                            }`}>
                                                <div className={`w-2 h-2 rounded-full ${
                                                    ['shipped', 'delivered'].includes(order.status)
                                                        ? 'bg-green-600'
                                                        : 'bg-gray-400'
                                                }`} />
                                                Shipped
                                            </div>

                                            <div className={`flex items-center gap-2 ${
                                                order.status === 'delivered'
                                                    ? 'text-green-600'
                                                    : 'text-gray-400'
                                            }`}>
                                                <div className={`w-2 h-2 rounded-full ${
                                                    order.status === 'delivered'
                                                        ? 'bg-green-600'
                                                        : 'bg-gray-400'
                                                }`} />
                                                Delivered
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Pagination */}
                        {orders.links && orders.links.filter(link => link.url !== null).length > 1 && (
                            <div className="flex justify-center mt-8">
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
                    </div>
                )}
            </div>
        </AppShell>
    );
}
