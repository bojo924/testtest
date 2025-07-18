import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, DollarSign, Eye, ShoppingBag, Palette } from 'lucide-react';
import { useState } from 'react';

export default function OrdersIndex({ regularOrders, customOrders }) {
    const [activeTab, setActiveTab] = useState('regular');
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

                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('regular')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'regular'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <ShoppingBag className="h-4 w-4 inline mr-2" />
                                Regular Orders ({regularOrders.total})
                            </button>
                            <button
                                onClick={() => setActiveTab('custom')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'custom'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Palette className="h-4 w-4 inline mr-2" />
                                Custom T-Shirt Orders ({customOrders.total})
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Regular Orders Tab */}
                {activeTab === 'regular' && (
                    <div>
                        {regularOrders.data.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                                <h2 className="text-2xl font-semibold text-gray-600 mb-2">No regular orders yet</h2>
                                <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                                <Link href={route('products.index')}>
                                    <Button size="lg">
                                        Start Shopping
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {regularOrders.data.map((order) => (
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
                                {regularOrders.links && regularOrders.links.filter(link => link.url !== null).length > 1 && (
                                    <div className="flex justify-center mt-8">
                                        <div className="flex gap-2">
                                            {regularOrders.links
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
                )}

                {/* Custom Orders Tab */}
                {activeTab === 'custom' && (
                    <div>
                        {customOrders.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Palette className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                                <h2 className="text-2xl font-semibold text-gray-600 mb-2">No custom t-shirt orders yet</h2>
                                <p className="text-gray-500 mb-6">Design your first custom t-shirt to see orders here</p>
                                <Link href={route('custom.tshirt')}>
                                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                                        Design Custom T-Shirt
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {customOrders.data.map((order) => (
                                    <Card key={order.id} className="overflow-hidden border-orange-200">
                                        <CardHeader className="bg-orange-50">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div>
                                                    <CardTitle className="text-lg text-orange-800">
                                                        🎨 Custom Order #{order.order_number}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
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
                                                    <Link href={route('orders.show', order.id)}>
                                                        <Button variant="outline" size="sm" className="flex items-center gap-2 border-orange-300 text-orange-600 hover:bg-orange-50">
                                                            <Eye className="h-4 w-4" />
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {/* Order Items */}
                                            <div className="space-y-4 mb-6">
                                                {order.order_items.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-4 p-4 bg-orange-25 rounded-lg border border-orange-100">
                                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-gray-200">
                                                            {item.is_custom ? (
                                                                <>
                                                                    {/* T-shirt base */}
                                                                    <img
                                                                        src={`/images/${item.custom_color === 'black' ? 'black.jpg' : 'white.jpg'}`}
                                                                        alt={`${item.custom_color} T-shirt`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    {/* Custom design overlay - clearer */}
                                                                    {item.custom_design_path && (
                                                                        <div className="absolute inset-2 bg-white/95 rounded flex items-center justify-center shadow-md border border-gray-200">
                                                                            <img
                                                                                src={`/storage/${item.custom_design_path}`}
                                                                                alt="Custom Design"
                                                                                className="max-w-full max-h-full object-contain"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    {/* Custom indicator */}
                                                                    <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                                                                        🎨
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <img
                                                                    src={`/storage/${item.product_image}`}
                                                                    alt={item.product_name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-orange-800">{item.product_name}</h4>
                                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                            {item.is_custom && (
                                                                <div className="mt-1">
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                                        🎨 Custom Design • {item.custom_color} T-shirt
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-orange-600">{item.price} DH</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order Status Timeline */}
                                            <div className="border-t pt-6">
                                                <h4 className="font-medium text-gray-900 mb-4">Order Status</h4>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className={`flex items-center gap-2 ${
                                                        ['pending', 'confirmed', 'shipped', 'delivered'].includes(order.status)
                                                            ? 'text-orange-600'
                                                            : 'text-gray-400'
                                                    }`}>
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            ['pending', 'confirmed', 'shipped', 'delivered'].includes(order.status)
                                                                ? 'bg-orange-600'
                                                                : 'bg-gray-400'
                                                        }`} />
                                                        Order Placed
                                                    </div>

                                                    <div className={`flex items-center gap-2 ${
                                                        ['confirmed', 'shipped', 'delivered'].includes(order.status)
                                                            ? 'text-orange-600'
                                                            : 'text-gray-400'
                                                    }`}>
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            ['confirmed', 'shipped', 'delivered'].includes(order.status)
                                                                ? 'bg-orange-600'
                                                                : 'bg-gray-400'
                                                        }`} />
                                                        Confirmed
                                                    </div>

                                                    <div className={`flex items-center gap-2 ${
                                                        ['shipped', 'delivered'].includes(order.status)
                                                            ? 'text-orange-600'
                                                            : 'text-gray-400'
                                                    }`}>
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            ['shipped', 'delivered'].includes(order.status)
                                                                ? 'bg-orange-600'
                                                                : 'bg-gray-400'
                                                        }`} />
                                                        Shipped
                                                    </div>

                                                    <div className={`flex items-center gap-2 ${
                                                        order.status === 'delivered'
                                                            ? 'text-orange-600'
                                                            : 'text-gray-400'
                                                    }`}>
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            order.status === 'delivered'
                                                                ? 'bg-orange-600'
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
                                {customOrders.links && customOrders.links.filter(link => link.url !== null).length > 1 && (
                                    <div className="flex justify-center mt-8">
                                        <div className="flex gap-2">
                                            {customOrders.links
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
                                                        className={link.active ? "bg-orange-500 hover:bg-orange-600" : "border-orange-300 text-orange-600 hover:bg-orange-50"}
                                                    />
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppShell>
    );
}
