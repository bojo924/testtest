import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, LoaderCircle, Bell, Truck } from 'lucide-react';

export default function ProductShow({ product }) {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);



    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= product.stock) {
            setQuantity(newQuantity);
        }
    };



    const handleAddToCart = async () => {
        setIsLoading(true);
        try {
            router.post(route('cart.add', product.id), {
                quantity: quantity
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally refresh the page to show updated stock
                    router.reload({ only: ['product'] });
                },
                onFinish: () => {
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            setIsLoading(false);
        }
    };

    return (
        <AppShell>
            <Head title={product.name} />

            <div className="bg-white min-h-screen">
                <div className="container mx-auto px-6 py-8">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <nav className="flex items-center space-x-2 text-sm text-gray-500">
                            <Link href={route('products.index')} className="hover:text-orange-500 transition-colors">
                                Products
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">{product.name}</span>
                        </nav>
                        <Link
                            href={route('products.index')}
                            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors font-medium mt-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Products
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Product Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="relative group">
                                <Card className="overflow-hidden border border-gray-200 shadow-2xl rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100">
                                    <CardContent className="p-0">
                                        <div className="aspect-square relative overflow-hidden">
                                            {product.image ? (
                                                <img
                                                    src={`/storage/${product.image}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                                                    <div className="text-center">
                                                        <div className="text-8xl mb-4 opacity-50">📦</div>
                                                        <p className="text-lg font-medium text-gray-900">No Image Available</p>
                                                        <p className="text-sm text-gray-500">Product image coming soon</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Overlay Actions */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300">
                                                {/* Status Badges */}
                                                <div className="absolute top-6 right-6 flex flex-col gap-2">
                                                    {product.stock <= 10 && product.stock > 0 && (
                                                        <Badge className="shadow-lg px-3 py-2 text-sm font-medium backdrop-blur-sm bg-orange-600 hover:bg-orange-700 text-white border-0">
                                                            ⚠️ Low Stock
                                                        </Badge>
                                                    )}
                                                    {product.stock === 0 && (
                                                        <Badge className="shadow-lg px-3 py-2 text-sm font-medium backdrop-blur-sm bg-gray-600 text-white border-0">
                                                            ❌ Out of Stock
                                                        </Badge>
                                                    )}
                                                    {product.stock > 10 && (
                                                        <Badge className="shadow-lg px-3 py-2 text-sm font-medium backdrop-blur-sm bg-orange-500 hover:bg-orange-600 text-white border-0">
                                                            ✅ In Stock
                                                        </Badge>
                                                    )}
                                                </div>


                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Thumbnail Gallery */}
                            <div className="grid grid-cols-4 gap-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`aspect-square rounded-xl overflow-hidden border-2 ${i === 1 ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-gray-300 hover:border-orange-400'} cursor-pointer transition-all duration-200 group`}
                                    >
                                        {product.image ? (
                                            <img
                                                src={`/storage/${product.image}`}
                                                alt={`View ${i}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                                                <span className="text-gray-400 text-xs font-medium">No Image</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    {/* Product Information */}
                    <div className="space-y-8">
                        {/* Header Section */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 px-3 py-1">
                                        {product.category?.name || 'General'}
                                    </Badge>


                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                                    {product.name}
                                </h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {product.description || "Premium quality product designed for your lifestyle. Experience the perfect blend of style, functionality, and durability with this exceptional item."}
                                </p>
                            </div>



                            {/* Rating & Social Proof */}
                            <div className="flex items-center gap-8 py-4 border-y border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-orange-400 text-orange-400" />
                                        ))}
                                    </div>
                                    <span className="text-gray-900 font-semibold text-lg">4.8</span>
                                    <span className="text-gray-600">(128 reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Truck className="h-4 w-4 text-orange-500" />
                                    <span>Fast delivery available</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>🔥</span>
                                    <span>15 sold in last 24h</span>
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="space-y-4">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-5xl font-bold text-gray-900">
                                        {product.price} DH
                                    </span>
                                    <span className="text-2xl text-gray-500 line-through">
                                        {(product.price * 1.25).toFixed(2)} DH
                                    </span>
                                    <Badge className="px-3 py-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white border-0">
                                        20% OFF
                                    </Badge>
                                </div>

                            </div>

                            {/* Stock & Availability */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full ${product.stock > 10 ? 'bg-orange-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                        <div>
                                            <span className="font-semibold text-gray-900">
                                                {product.stock > 10 ? '✅ In Stock' : product.stock > 0 ? '⚠️ Low Stock' : '❌ Out of Stock'}
                                            </span>
                                            <p className="text-sm text-gray-600">
                                                {product.stock} units available
                                            </p>
                                        </div>
                                    </div>
                                    {product.stock > 0 && (
                                        <div className="text-right">
                                            <p className="text-sm text-orange-600 font-medium">Ready to ship</p>
                                            <p className="text-xs text-gray-500">Delivery in 2-3 days</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Purchase Section */}
                        {product.stock > 0 ? (
                            <div className="space-y-8">
                                {/* Quantity Selector */}
                                <div className="space-y-4">
                                    <label className="block text-xl font-bold text-gray-900">
                                        Select Quantity
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center bg-gray-100 rounded-xl border-2 border-gray-200 hover:border-orange-500 transition-colors">
                                            <Button
                                                variant="ghost"
                                                size="lg"
                                                onClick={() => handleQuantityChange(-1)}
                                                disabled={quantity <= 1}
                                                className="rounded-l-xl rounded-r-none px-4 py-3 hover:bg-gray-200 text-gray-900"
                                            >
                                                <Minus className="h-5 w-5" />
                                            </Button>
                                            <div className="px-6 py-3 bg-white border-x-2 border-gray-200">
                                                <span className="text-xl font-bold text-black">{quantity}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="lg"
                                                onClick={() => handleQuantityChange(1)}
                                                disabled={quantity >= product.stock}
                                                className="rounded-r-xl rounded-l-none px-4 py-3 hover:bg-gray-200 text-gray-900"
                                            >
                                                <Plus className="h-5 w-5" />
                                            </Button>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p className="font-medium">Available: {product.stock} units</p>
                                            <p>Total: <span className="font-bold text-gray-900">{(product.price * quantity).toFixed(2)} DH</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-4">
                                    <Button
                                        onClick={handleAddToCart}
                                        disabled={isLoading}
                                        size="lg"
                                        className="w-full py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200 text-white border-0"
                                    >
                                        {isLoading ? (
                                            <>
                                                <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                                                Adding to Cart...
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingCart className="h-5 w-5 mr-2" />
                                                Add to Cart - {(product.price * quantity).toFixed(2)} DH
                                            </>
                                        )}
                                    </Button>


                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="text-6xl mb-4">😔</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Out of Stock</h3>
                                <p className="text-gray-600 mb-6">This product is currently unavailable</p>
                                <div className="space-y-3">
                                    <Button disabled size="lg" className="w-full py-4 text-lg rounded-xl bg-gray-200 text-gray-500">
                                        Out of Stock
                                    </Button>
                                    <Button variant="outline" size="lg" className="w-full py-3 rounded-xl border-gray-300 text-gray-900 hover:bg-gray-100">
                                        <Bell className="h-5 w-5 mr-2" />
                                        Notify When Available
                                    </Button>
                                </div>
                            </div>
                        )}



                    </div>
                </div>
            </div>
        </div>
        </AppShell>
    );
}
