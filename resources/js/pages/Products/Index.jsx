import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Filter, Star, Heart, Eye } from 'lucide-react';

export default function ProductsIndex({ products, categories, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');

    const handleSearch = () => {
        router.get(route('products.index'), {
            search: searchTerm,
            category: selectedCategory === 'all' ? '' : selectedCategory,
            min_price: minPrice,
            max_price: maxPrice,
            sort_by: sortBy,
            sort_order: sortOrder,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setMinPrice('');
        setMaxPrice('');
        setSortBy('created_at');
        setSortOrder('desc');
        router.get(route('products.index'));
    };

    const addToCart = (productId) => {
        router.post(route('cart.add', productId), {
            quantity: 1
        }, {
            preserveScroll: true,
        });
    };

    return (
        <AppShell>
            <Head title="Products" />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-gray-50 via-orange-50 to-gray-100 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

                <div className="relative container mx-auto px-6 py-12">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="mb-6">
                            <span className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                🎨 Design & Shop
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Discover Amazing
                            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> Products</span>
                            <br />
                            <span className="text-2xl md:text-3xl text-gray-700">& Design Custom T-Shirts</span>
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                            Shop premium quality items or create your own custom t-shirt designs
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Link
                                href={route('custom.tshirt')}
                                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                            >
                                🎽 Design Custom T-Shirt
                            </Link>
                            <button
                                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                                onClick={() => document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' })}
                            >
                                Browse Products
                            </button>
                        </div>

                        {/* Quick Search */}
                        <div className="max-w-xl mx-auto">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                                <div className="relative bg-white rounded-xl shadow-lg border border-gray-200">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-12 pr-28 py-8 border-0 rounded-xl focus:ring-2 focus:ring-orange-500 bg-transparent text-base"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-8 left-8 w-12 h-12 bg-orange-200 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-8 right-8 w-16 h-16 bg-gray-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-12 w-8 h-8 bg-orange-300 rounded-full opacity-30 animate-pulse delay-500"></div>
            </div>

            <div id="products-section" className="container mx-auto px-6 py-8">
                {/* Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-8 mx-4 md:mx-0">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-orange-500" />
                            <span className="font-medium text-gray-900">Filters:</span>
                        </div>

                        {/* Custom T-Shirt Quick Access */}
                        <div className="hidden sm:flex items-center gap-2 ml-auto">
                            <Link
                                href={route('custom.tshirt')}
                                className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                🎨 Design your  T-Shirt
                            </Link>
                        </div>

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-32"
                            />
                            <span className="text-gray-400">-</span>
                            <Input
                                type="number"
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-32"
                            />
                        </div>

                        <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                            const [field, order] = value.split('-');
                            setSortBy(field);
                            setSortOrder(order);
                        }}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at-desc">Newest First</SelectItem>
                                <SelectItem value="created_at-asc">Oldest First</SelectItem>
                                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleSearch}
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                                Apply
                            </Button>
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                size="sm"
                                className="border-gray-300 hover:border-orange-500 hover:bg-orange-50 text-gray-900"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-0">
                    {products.data.map((product) => (
                        <Card key={product.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl border-0 shadow-lg">
                            <CardHeader className="p-0 relative">
                                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden rounded-t-2xl">
                                    {product.image ? (
                                        <img
                                            src={`/storage/${product.image}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <div className="text-center">
                                                <div className="text-6xl mb-2">📦</div>
                                                <p className="text-sm">No Image</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Status Badges */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                                        {product.stock <= 10 && product.stock > 0 && (
                                            <Badge variant="destructive" className="shadow-lg">
                                                Low Stock
                                            </Badge>
                                        )}
                                        {product.stock === 0 && (
                                            <Badge variant="secondary" className="shadow-lg">
                                                Out of Stock
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Quick Actions Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white"
                                                asChild
                                            >
                                                <Link href={route('products.show', product.id)}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="rounded-full w-10 h-10 p-0 bg-white/90 hover:bg-white"
                                            >
                                                <Heart className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-6">
                                <div className="mb-3">
                                    <Badge variant="outline" className="text-xs mb-2">
                                        {product.category.name}
                                    </Badge>
                                    <CardTitle className="text-lg font-bold mb-2 line-clamp-1">
                                        <Link
                                            href={route('products.show', product.id)}
                                            className="hover:text-blue-600 transition-colors"
                                        >
                                            {product.name}
                                        </Link>
                                    </CardTitle>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-2xl font-bold text-orange-500">
                                            {product.price} DH
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Stock</p>
                                        <p className={`text-sm font-medium ${product.stock <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                                            {product.stock} left
                                        </p>
                                    </div>
                                </div>

                                {/* Rating Stars (placeholder) */}
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    <span className="text-sm text-gray-500 ml-1">(4.5)</span>
                                </div>
                            </CardContent>

                            <CardFooter className="p-6 pt-0">
                                <Button
                                    onClick={() => addToCart(product.id)}
                                    disabled={product.stock === 0}
                                    className="w-full flex items-center bg-orange-500 gap-2 rounded-xl py-3 font-medium transition-all duration-200 hover:shadow-lg"
                                    size="lg"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {products.links && products.links.filter(link => link.url !== null).length > 1 && (
                    <div className="mt-8 flex justify-center px-4 md:px-0">
                        <div className="flex gap-2">
                            {products.links
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

                {products.data.length === 0 && (
                    <div className="text-center py-12 px-4 md:px-0">
                        <div className="max-w-md mx-auto">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500 mb-6">We couldn't find any products matching your criteria. Try adjusting your filters.</p>
                            <Button onClick={clearFilters} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                Clear All Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppShell>
    );
}
