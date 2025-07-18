import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    ArrowLeft,
    User,
    MapPin,
    Phone,
    Calendar,
    Package,
    DollarSign,
    Palette
} from 'lucide-react';

export default function AdminOrderShow({ order }) {
    const updateStatus = (newStatus) => {
        router.put(route('admin.orders.update-status', order.id), {
            status: newStatus
        }, {
            preserveScroll: true,
        });
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout>
            <Head title={`Order #${order.order_number}`} />

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link
                        href={route('admin.orders.index')}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Orders
                    </Link>
                </div>

                {/* Order Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                {order.order_type === 'custom' && <Palette className="h-8 w-8 text-orange-500" />}
                                <h1 className={`text-3xl font-bold ${order.order_type === 'custom' ? 'text-orange-700' : 'text-gray-900'}`}>
                                    {order.order_type === 'custom' ? '🎨 ' : ''}Order #{order.order_number}
                                </h1>
                            </div>
                            {order.order_type === 'custom' && (
                                <div className="mb-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                        Custom T-Shirt Order
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(order.created_at)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    {order.total_amount} DH
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Items
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.order_items.map((item) => (
                                        <div key={item.id} className={`flex items-center gap-4 p-4 border rounded-lg ${
                                            item.is_custom ? 'border-orange-200 bg-orange-25' : ''
                                        }`}>
                                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-gray-200">
                                                {item.is_custom ? (
                                                    <>
                                                        {/* T-shirt base */}
                                                        <img
                                                            src={`/images/${item.custom_color === 'black' ? 'black.jpg' : 'white.jpg'}`}
                                                            alt={`${item.custom_color} T-shirt`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {/* Custom design overlay - larger and clearer for admin */}
                                                        {item.custom_design_path && (
                                                            <div className="absolute inset-2 bg-white/95 rounded flex items-center justify-center shadow-lg border border-gray-200">
                                                                <img
                                                                    src={`/storage/${item.custom_design_path}`}
                                                                    alt="Custom Design"
                                                                    className="max-w-full max-h-full object-contain cursor-pointer"
                                                                    onClick={() => window.open(`/storage/${item.custom_design_path}`, '_blank')}
                                                                    title="Click to view full size"
                                                                />
                                                            </div>
                                                        )}
                                                        {/* Custom indicator */}
                                                        <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                                                            🎨
                                                        </div>
                                                    </>
                                                ) : item.product_image ? (
                                                    <img
                                                        src={`/storage/${item.product_image}`}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        📷
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`font-medium ${item.is_custom ? 'text-orange-800' : ''}`}>
                                                    {item.product_name}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Quantity: {item.quantity} × {item.price} DH
                                                </p>
                                                {item.is_custom && (
                                                    <div className="mt-1">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                            🎨 Custom Design • {item.custom_color} T-shirt
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {(item.quantity * item.price).toFixed(2)} DH
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${order.total_amount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Tax</span>
                                        <span>$0.00</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>${order.total_amount}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Notes */}
                        {order.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700">{order.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Update Status
                                    </label>
                                    <Select value={order.status} onValueChange={updateStatus}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Customer Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="font-medium">{order.user.name}</p>
                                    <p className="text-sm text-gray-600">{order.user.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{order.phone}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Shipping Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Shipping Address
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-1">
                                    <p>{order.shipping_address.street}</p>
                                    <p>
                                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Billing Address */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Billing Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm space-y-1">
                                    <p>{order.billing_address.street}</p>
                                    <p>
                                        {order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
