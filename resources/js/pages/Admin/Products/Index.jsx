import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AdminLayout } from '@/components/admin-layout';
import { ProductEditModal } from '@/components/product-edit-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Package
} from 'lucide-react';

export default function AdminProductsIndex({ products, categories, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleSearch = () => {
        router.get(route('admin.products.index'), {
            search: searchTerm,
            category: selectedCategory === 'all' ? '' : selectedCategory,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        router.get(route('admin.products.index'));
    };

    const deleteProduct = (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('admin.products.destroy', productId));
        }
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedProduct(null);
    };

    const handleEditSuccess = () => {
        // Refresh the page to show updated data
        router.reload({ only: ['products'] });
    };

    return (
        <AdminLayout>
            <Head title="Manage Products" />

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Products</h1>
                        <p className="text-gray-600">Add, edit, and manage your product inventory</p>
                    </div>
                    <Link href={route('admin.products.create')}>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                {/* Search and Filter Section */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger>
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
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Button onClick={handleSearch} className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                Apply Filters
                            </Button>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Products ({products.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {products.data.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-6">
                                    {filters.search || filters.category
                                        ? 'Try adjusting your search criteria'
                                        : 'Start by adding your first product'
                                    }
                                </p>
                                <Link href={route('admin.products.create')}>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Product
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4">Product</th>
                                            <th className="text-left py-3 px-4">Category</th>
                                            <th className="text-left py-3 px-4">Price</th>
                                            <th className="text-left py-3 px-4">Stock</th>
                                            <th className="text-left py-3 px-4">Status</th>
                                            <th className="text-right py-3 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.data.map((product) => (
                                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                                                            <p className="text-sm text-gray-600 truncate max-w-xs">
                                                                {product.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge variant="outline">
                                                        {product.category.name}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="font-medium">${product.price}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`font-medium ${
                                                        product.stock <= 10
                                                            ? product.stock === 0
                                                                ? 'text-red-600'
                                                                : 'text-yellow-600'
                                                            : 'text-green-600'
                                                    }`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    {product.stock === 0 ? (
                                                        <Badge variant="destructive">Out of Stock</Badge>
                                                    ) : product.stock <= 10 ? (
                                                        <Badge variant="secondary">Low Stock</Badge>
                                                    ) : (
                                                        <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <Link href={route('admin.products.show', product.id)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openEditModal(product)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteProduct(product.id)}
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
                        {products.links && products.data.length > 0 && products.links.filter(link => link.url !== null).length > 1 && (
                            <div className="mt-6 flex justify-center">
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
                    </CardContent>
                </Card>
            </div>

            {/* Edit Product Modal */}
            <ProductEditModal
                product={selectedProduct}
                categories={categories}
                isOpen={editModalOpen}
                onClose={closeEditModal}
                onSuccess={handleEditSuccess}
            />
        </AdminLayout>
    );
}
