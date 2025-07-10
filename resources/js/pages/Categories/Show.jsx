import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export default function CategoriesShow({ category }) {
    const addToCart = (productId) => {
        router.post(route('cart.add', productId), {
            quantity: 1
        }, {
            preserveScroll: true,
        });
    };

    return (
        <AppShell>
            <Head title={category.name} />

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link
                        href={route('categories.index')}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Categories
                    </Link>
                </div>

                {/* Category Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
                    {category.description && (
                        <p className="text-gray-600 text-lg">{category.description}</p>
                    )}
                    <div className="mt-4">
                        <Badge variant="outline" className="text-sm">
                            {category.products.length} product{category.products.length !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                </div>

                {/* Products Grid */}
                {category.products.length === 0 ? (
                    <div className="text-center py-12">
                        <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-600 mb-2">No products in this category</h2>
                        <p className="text-gray-500 mb-6">Products will appear here once they are added to this category</p>
                        <Link href={route('products.index')}>
                            <Button>
                                Browse All Products
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {category.products.map((product) => (
                            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardHeader className="p-0">
                                    <div className="aspect-square bg-gray-100 relative">
                                        {product.image ? (
                                            <img
                                                src={`/storage/${product.image}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                        {product.stock <= 10 && product.stock > 0 && (
                                            <Badge variant="destructive" className="absolute top-2 right-2">
                                                Low Stock
                                            </Badge>
                                        )}
                                        {product.stock === 0 && (
                                            <Badge variant="secondary" className="absolute top-2 right-2">
                                                Out of Stock
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <CardTitle className="text-lg mb-2">
                                        <Link
                                            href={route('products.show', product.id)}
                                            className="hover:text-blue-600 transition-colors"
                                        >
                                            {product.name}
                                        </Link>
                                    </CardTitle>
                                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-green-600">
                                            {product.price} DH
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Stock: {product.stock}
                                    </p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button
                                        onClick={() => addToCart(product.id)}
                                        disabled={product.stock === 0}
                                        className="w-full flex items-center gap-2"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}
