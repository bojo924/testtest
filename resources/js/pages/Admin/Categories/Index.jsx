import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Edit,
    Trash2,
    Tag
} from 'lucide-react';

export default function AdminCategoriesIndex({ categories }) {
    const deleteCategory = (categoryId) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.categories.destroy', categoryId));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Categories" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Categories</h1>
                        <p className="text-gray-600">Organize your products with categories</p>
                    </div>
                    <Link href={route('admin.categories.create')}>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Category
                        </Button>
                    </Link>
                </div>

                {/* Categories Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Categories ({categories.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {categories.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Tag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No categories found</h3>
                                <p className="text-gray-500 mb-6">Start by adding your first category</p>
                                <Link href={route('admin.categories.create')}>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Category
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4">Name</th>
                                            <th className="text-left py-3 px-4">Description</th>
                                            <th className="text-left py-3 px-4">Products</th>
                                            <th className="text-left py-3 px-4">Created</th>
                                            <th className="text-right py-3 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.data.map((category) => (
                                            <tr key={category.id} className="border-b hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <Tag className="h-5 w-5 text-gray-400" />
                                                        <div>
                                                            <p className="font-medium">{category.name}</p>
                                                            <p className="text-sm text-gray-600">
                                                                Slug: {category.slug}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-sm text-gray-600 max-w-xs truncate">
                                                        {category.description || 'No description'}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge variant="outline">
                                                        {category.products_count || 0} products
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-sm text-gray-600">
                                                        {new Date(category.created_at).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <Link href={route('admin.categories.edit', category.id)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteCategory(category.id)}
                                                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {categories.links && categories.data.length > 0 && categories.links.filter(link => link.url !== null).length > 1 && (
                            <div className="mt-6 flex justify-center">
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
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
