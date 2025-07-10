import { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save, Loader2 } from 'lucide-react';

export function ProductEditModal({ product, categories, isOpen, onClose, onSuccess }) {
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image: null
    });

    // Update form data when product changes
    useEffect(() => {
        if (product && isOpen) {
            setData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                stock: product.stock || '',
                category_id: product.category_id?.toString() || '',
                image: null
            });
        }
    }, [product, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create form data for file upload
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('stock', data.stock);
        formData.append('category_id', data.category_id);
        formData.append('_method', 'PUT');

        // Only append image if a new one is selected
        if (data.image) {
            formData.append('image', data.image);
        }

        // Use router.post with FormData for file uploads
        router.post(route('admin.products.update', product.id), formData, {
            onSuccess: () => {
                onSuccess?.();
                onClose();
                reset();
            },
            onError: (errors) => {
                // Handle validation errors
                console.error('Validation errors:', errors);
            },
            preserveScroll: true,
        });
    };

    const handleClose = () => {
        onClose();
        reset();
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Edit Product: {product?.name}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="edit_name">Product Name</Label>
                                <Input
                                    id="edit_name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Enter product name"
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="edit_category_id">Category</Label>
                                <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && (
                                    <p className="text-red-600 text-sm mt-1">{errors.category_id}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="edit_description">Description</Label>
                            <textarea
                                id="edit_description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                required
                                rows="4"
                                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter product description"
                            />
                            {errors.description && (
                                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="edit_price">Price ($)</Label>
                                <Input
                                    id="edit_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    required
                                    placeholder="0.00"
                                />
                                {errors.price && (
                                    <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="edit_stock">Stock Quantity</Label>
                                <Input
                                    id="edit_stock"
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    required
                                    placeholder="0"
                                />
                                {errors.stock && (
                                    <p className="text-red-600 text-sm mt-1">{errors.stock}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="edit_image">Update Product Image (Optional)</Label>
                            <Input
                                id="edit_image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.image && (
                                <p className="text-red-600 text-sm mt-1">{errors.image}</p>
                            )}
                            <p className="text-gray-500 text-sm mt-1">
                                Leave empty to keep current image. Supported formats: JPEG, PNG, JPG, GIF. Max size: 2MB
                            </p>

                            {/* Image Previews */}
                            <div className="mt-3 space-y-3">
                                {/* New Image Preview */}
                                {imagePreview && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">New Image Preview:</p>
                                        <img
                                            src={imagePreview}
                                            alt="New product image"
                                            className="w-20 h-20 object-cover rounded-lg border border-blue-300"
                                        />
                                    </div>
                                )}

                                {/* Current Image Preview */}
                                {product?.image && !imagePreview && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                                        <img
                                            src={`/storage/${product.image}`}
                                            alt={product.name}
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />
                                    </div>
                                )}

                                {/* Show both when new image is selected */}
                                {product?.image && imagePreview && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Current Image (will be replaced):</p>
                                        <img
                                            src={`/storage/${product.image}`}
                                            alt={product.name}
                                            className="w-20 h-20 object-cover rounded-lg border opacity-50"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 pt-4 border-t">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Update Product
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
