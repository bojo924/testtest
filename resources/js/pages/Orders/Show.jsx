import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    ArrowLeft, 
    MapPin, 
    Phone, 
    Calendar,
    Package,
    DollarSign,
    Truck,
    CheckCircle
} from 'lucide-react';

export default function OrderShow({ order }) {
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
        <AppShell>
            <Head title={`Order #${order.order_number}`} />
            
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link 
                        href={route('orders.index')}
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Order #{order.order_number}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Placed on {formatDate(order.created_at)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    Total: ${order.total_amount}
                                </div>
                            </div>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                    </div>
                </div>

                {/* Order Status Timeline */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className={`flex flex-col items-center text-center ${
                                ['pending', 'confirmed', 'shipped', 'delivered'].includes(order.status) 
                                    ? 'text-green-600' 
                                    : 'text-gray-400'
                            }`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                    ['pending', 'confirmed', 'shipped', 'delivered'].includes(order.status)
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-300 text-gray-600'
                                }`}>
                                    <Package className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium">Order Placed</span>
                            </div>
                            
                            <div className={`flex-1 h-1 mx-4 ${
                                ['confirmed', 'shipped', 'delivered'].includes(order.status)
                                    ? 'bg-green-600'
                                    : 'bg-gray-300'
                            }`} />
                            
                            <div className={`flex flex-col items-center text-center ${
                                ['confirmed', 'shipped', 'delivered'].includes(order.status)
                                    ? 'text-green-600'
                                    : 'text-gray-400'
                            }`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                    ['confirmed', 'shipped', 'delivered'].includes(order.status)
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-300 text-gray-600'
                                }`}>
                                    <CheckCircle className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium">Confirmed</span>
                            </div>
                            
                            <div className={`flex-1 h-1 mx-4 ${
                                ['shipped', 'delivered'].includes(order.status)
                                    ? 'bg-green-600'
                                    : 'bg-gray-300'
                            }`} />
                            
                            <div className={`flex flex-col items-center text-center ${
                                ['shipped', 'delivered'].includes(order.status)
                                    ? 'text-green-600'
                                    : 'text-gray-400'
                            }`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                    ['shipped', 'delivered'].includes(order.status)
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-300 text-gray-600'
                                }`}>
                                    <Truck className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium">Shipped</span>
                            </div>
                            
                            <div className={`flex-1 h-1 mx-4 ${
                                order.status === 'delivered'
                                    ? 'bg-green-600'
                                    : 'bg-gray-300'
                            }`} />
                            
                            <div className={`flex flex-col items-center text-center ${
                                order.status === 'delivered'
                                    ? 'text-green-600'
                                    : 'text-gray-400'
                            }`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                    order.status === 'delivered'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-300 text-gray-600'
                                }`}>
                                    <CheckCircle className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-medium">Delivered</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.order_items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.product_image ? (
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
                                                <h4 className="font-medium">{item.product_name}</h4>
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
                    </div>

                    {/* Order Details */}
                    <div className="space-y-6">
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

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{order.phone}</p>
                            </CardContent>
                        </Card>

                        {/* Order Notes */}
                        {order.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-700">{order.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
