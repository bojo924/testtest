import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    Users,
    ShoppingCart,
    Clock,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    Eye,
    Palette
} from 'lucide-react';

export default function AdminDashboard({ stats }) {
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

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        <span className="text-orange-500">CLICKTEE</span> Admin Dashboard
                    </h1>
                    <p className="text-gray-600">Overview of your custom t-shirt store</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_products}</div>
                            <Link href={route('admin.products.index')}>
                                <Button variant="link" size="sm" className="p-0 h-auto text-orange-600 hover:text-orange-700">
                                    Manage Products
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                            <Users className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_customers}</div>
                            <p className="text-xs text-gray-500">Registered users</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Regular Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.regular_orders}</div>
                            <Link href={route('admin.orders.regular')}>
                                <Button variant="link" size="sm" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                                    View Regular
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Custom T-Shirts</CardTitle>
                            <Palette className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.custom_orders}</div>
                            <Link href={route('admin.orders.custom')}>
                                <Button variant="link" size="sm" className="p-0 h-auto text-orange-600 hover:text-orange-700">
                                    View Custom
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending_orders}</div>
                            <p className="text-xs text-gray-500">Need attention</p>
                        </CardContent>
                    </Card>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Orders</CardTitle>
                            <Link href={route('admin.orders.index')}>
                                <Button variant="outline" size="sm">
                                    View All Orders
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {stats.recent_orders.length === 0 ? (
                                <div className="text-center py-8">
                                    <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No recent orders</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {stats.recent_orders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <p className="font-medium">#{order.order_number}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {order.user.name} • {order.total_amount} DH
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </Badge>
                                                <Link href={route('admin.orders.show', order.id)}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Custom Orders */}
                    <Card className="border-orange-200">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-orange-700">
                                <Palette className="h-5 w-5" />
                                Recent Custom T-Shirts
                            </CardTitle>
                            <Link href={route('admin.orders.custom')}>
                                <Button variant="outline" size="sm" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                                    View All Custom
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {stats.recent_custom_orders.length === 0 ? (
                                <div className="text-center py-8">
                                    <Palette className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No custom orders yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {stats.recent_custom_orders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 border border-orange-100 rounded-lg bg-orange-25">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <p className="font-medium text-orange-800">🎨 #{order.order_number}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {order.user.name} • {order.total_amount} DH
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </p>
                                                        {order.order_items && order.order_items.length > 0 && (
                                                            <div className="mt-1">
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                                    {order.order_items[0].custom_color} T-shirt
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={getStatusColor(order.status)}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </Badge>
                                                <Link href={route('admin.orders.show', order.id)}>
                                                    <Button variant="ghost" size="sm" className="text-orange-600 hover:bg-orange-50">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Low Stock Products */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                Low Stock Alert
                            </CardTitle>
                            <Link href={route('admin.products.index')}>
                                <Button variant="outline" size="sm">
                                    Manage Inventory
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {stats.low_stock_products.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">All products are well stocked</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {stats.low_stock_products.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                                    {product.image ? (
                                                        <img
                                                            src={`/storage/${product.image}`}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            📷
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{product.name}</p>
                                                    <p className="text-sm text-gray-600">${product.price}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="destructive">
                                                    {product.stock} left
                                                </Badge>
                                                <Link href={route('admin.products.edit', product.id)}>
                                                    <Button variant="ghost" size="sm" className="ml-2">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                {/* <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Link href={route('admin.products.create')}>
                                <Button className="w-full h-20 flex flex-col items-center gap-2">
                                    <Package className="h-6 w-6" />
                                    Add Product
                                </Button>
                            </Link>
                            <Link href={route('admin.categories.create')}>
                                <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                                    <Package className="h-6 w-6" />
                                    Add Category
                                </Button>
                            </Link>
                            <Link href={route('admin.orders.index')}>
                                <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                                    <ShoppingCart className="h-6 w-6" />
                                    View Orders
                                </Button>
                            </Link>
                            <Link href={route('admin.products.index')}>
                                <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                                    <Package className="h-6 w-6" />
                                    Manage Products
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card> */}
            </div>
        </AdminLayout>
    );
}
