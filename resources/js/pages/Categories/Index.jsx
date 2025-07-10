import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

export default function CategoriesIndex({ categories }) {
    return (
        <AppShell>
            <Head title="Categories" />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h1>
                    <p className="text-gray-600">Browse our product categories</p>
                </div>

                {categories.data.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-600 mb-2">No categories available</h2>
                        <p className="text-gray-500">Categories will appear here once they are added</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.data.map((category) => (
                            <Link key={category.id} href={route('categories.show', category.id)}>
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardHeader>
                                        <CardTitle className="text-xl">{category.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 mb-4">
                                            {category.description || 'No description available'}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline">
                                                {category.products_count || 0} products
                                            </Badge>
                                            <span className="text-blue-600 font-medium">
                                                View Products →
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {categories.links && categories.data.length > 0 && categories.links.filter(link => link.url !== null).length > 1 && (
                    <div className="mt-8 flex justify-center">
                        <div className="flex gap-2">
                            {categories.links
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
        </AppShell>
    );
}
