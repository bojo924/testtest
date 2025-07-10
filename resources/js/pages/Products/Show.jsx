import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowLeft, Plus, Minus, Star, Heart, Share2, Shield, Truck, RotateCcw, LoaderCircle, Bell } from 'lucide-react';

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
            await router.post(route('cart.add'), {
                product_id: product.id,
                quantity: quantity
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
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
                            <Link href={route('products.index')} className="hover:text-blue-600 transition-colors">
                                Products
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900 font-medium">{product.name}</span>
                        </nav>
                        <Link
                            href={route('products.index')}
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium mt-2"
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
                                <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100">
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
                                                        <p className="text-lg font-medium">No Image Available</p>
                                                        <p className="text-sm text-gray-500">Product image coming soon</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Overlay Actions */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300">
                                                {/* Status Badges */}
                                                <div className="absolute top-6 right-6 flex flex-col gap-2">
                                                    {product.stock <= 10 && product.stock > 0 && (
                                                        <Badge variant="destructive" className="shadow-lg px-3 py-2 text-sm font-medium backdrop-blur-sm">
                                                            ⚠️ Low Stock
                                                        </Badge>
                                                    )}
                                                    {product.stock === 0 && (
                                                        <Badge variant="secondary" className="shadow-lg px-3 py-2 text-sm font-medium backdrop-blur-sm">
                                                            ❌ Out of Stock
                                                        </Badge>
                                                    )}
                                                    {product.stock > 10 && (
                                                        <Badge variant="default" className="shadow-lg px-3 py-2 text-sm font-medium backdrop-blur-sm bg-green-600">
                                                            ✅ In Stock
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="absolute top-6 left-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="rounded-full w-12 h-12 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
                                                    >
                                                        <Heart className="h-5 w-5 text-red-500" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="rounded-full w-12 h-12 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
                                                    >
                                                        <Share2 className="h-5 w-5 text-blue-500" />
                                                    </Button>
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
                                        className={`aspect-square rounded-xl overflow-hidden border-3 ${i === 1 ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'} cursor-pointer transition-all duration-200 group`}
                                    >
                                        {product.image ? (
                                            <img
                                                src={`/storage/${product.image}`}
                                                alt={`View ${i}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
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
                                    <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 px-3 py-1">
                                        {product.category?.name || 'General'}
                                    </Badge>
                                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 px-3 py-1">
                                        Free Shipping
                                    </Badge>
                                    <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50 px-3 py-1">
                                        Premium Quality
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
                            <div className="flex items-center gap-8 py-4 border-y border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <span className="text-gray-900 font-semibold text-lg">4.8</span>
                                    <span className="text-gray-500">(128 reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Truck className="h-4 w-4" />
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
                                    <Badge variant="destructive" className="px-3 py-2 text-sm font-semibold">
                                        20% OFF
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-green-600 font-medium">💰 Save {(product.price * 0.25).toFixed(2)} DH today!</span>
                                    <span className="text-gray-500">• Limited time offer</span>
                                    <span className="text-orange-600">⏰ Ends in 2 days</span>
                                </div>
                            </div>

                            {/* Stock & Availability */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
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
                                            <p className="text-sm text-green-600 font-medium">Ready to ship</p>
                                            <p className="text-xs text-gray-500">Delivery in 2-3 days</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Separator className="my-8" />

                        {/* Product Features */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-900">Why Choose This Product?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                    <div className="p-2 bg-blue-600 rounded-lg">
                                        <Truck className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Free Fast Shipping</h4>
                                        <p className="text-sm text-gray-600">Free delivery on orders over 200 DH</p>
                                        <p className="text-xs text-blue-600 font-medium mt-1">Usually arrives in 2-3 days</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                                    <div className="p-2 bg-green-600 rounded-lg">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Secure Payment</h4>
                                        <p className="text-sm text-gray-600">100% secure checkout process</p>
                                        <p className="text-xs text-green-600 font-medium mt-1">SSL encrypted & protected</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                                    <div className="p-2 bg-orange-600 rounded-lg">
                                        <RotateCcw className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Easy Returns</h4>
                                        <p className="text-sm text-gray-600">30-day hassle-free returns</p>
                                        <p className="text-xs text-orange-600 font-medium mt-1">No questions asked policy</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                    <div className="p-2 bg-purple-600 rounded-lg">
                                        <Star className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Premium Quality</h4>
                                        <p className="text-sm text-gray-600">Carefully crafted materials</p>
                                        <p className="text-xs text-purple-600 font-medium mt-1">Quality guaranteed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-8" />

                        {/* Purchase Section */}
                        {product.stock > 0 ? (
                            <div className="space-y-8">
                                {/* Quantity Selector */}
                                <div className="space-y-4">
                                    <label className="block text-xl font-bold text-gray-900">
                                        Select Quantity
                                    </label>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center bg-gray-100 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-colors">
                                            <Button
                                                variant="ghost"
                                                size="lg"
                                                onClick={() => handleQuantityChange(-1)}
                                                disabled={quantity <= 1}
                                                className="rounded-l-xl rounded-r-none px-4 py-3 hover:bg-gray-200"
                                            >
                                                <Minus className="h-5 w-5" />
                                            </Button>
                                            <div className="px-6 py-3 bg-white border-x-2 border-gray-200">
                                                <span className="text-xl font-bold text-gray-900">{quantity}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="lg"
                                                onClick={() => handleQuantityChange(1)}
                                                disabled={quantity >= product.stock}
                                                className="rounded-r-xl rounded-l-none px-4 py-3 hover:bg-gray-200"
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
                                        className="w-full py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
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

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="py-3 rounded-xl border-2 hover:bg-gray-50"
                                        >
                                            <Heart className="h-5 w-5 mr-2" />
                                            Wishlist
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="py-3 rounded-xl border-2 hover:bg-gray-50"
                                        >
                                            <Share2 className="h-5 w-5 mr-2" />
                                            Share
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 text-center p-8 bg-gray-50 rounded-xl">
                                <div className="text-6xl mb-4">😔</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Out of Stock</h3>
                                <p className="text-gray-600 mb-6">This product is currently unavailable</p>
                                <div className="space-y-3">
                                    <Button disabled size="lg" className="w-full py-4 text-lg rounded-xl">
                                        Out of Stock
                                    </Button>
                                    <Button variant="outline" size="lg" className="w-full py-3 rounded-xl">
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
