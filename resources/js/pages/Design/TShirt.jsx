import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, X, ShoppingCart } from 'lucide-react';

export default function TShirtDesign() {
    // T-shirt customization state
    const [selectedColor, setSelectedColor] = useState('white');
    const [uploadedDesign, setUploadedDesign] = useState(null);
    const [designPreview, setDesignPreview] = useState(null);

    const handleDesignUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedDesign(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setDesignPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeDesign = () => {
        setUploadedDesign(null);
        setDesignPreview(null);
    };

    const addToCart = () => {
        if (!selectedColor || !uploadedDesign) {
            alert('Please select a t-shirt color and upload a design.');
            return;
        }

        const formData = new FormData();
        formData.append('color', selectedColor);
        formData.append('design', uploadedDesign);
        formData.append('quantity', 1);

        router.post(route('custom.tshirt.add-to-cart'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                // Reset form after successful submission
                setSelectedColor('white');
                setUploadedDesign(null);
                setDesignPreview(null);
            },
            onError: (errors) => {
                console.error('Error adding to cart:', errors);
            }
        });
    };

    return (
        <AppShell>
            <Head title="Design Your T-Shirt" />

            <div className="bg-white min-h-screen">
                <div className="container mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={route('products.index')}
                            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors font-medium mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Products
                        </Link>

                        <div className="text-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Design Your Custom T-Shirt
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Create your unique t-shirt design. Choose your color, upload your artwork, and bring your vision to life.
                            </p>
                        </div>
                    </div>

                    {/* Main Design Section */}
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white border-2 border-orange-200 rounded-3xl p-8 md:p-12 shadow-xl">

                            {/* T-Shirt Visual Selection */}
                            <div className="space-y-8">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 1: Choose Your T-Shirt Color</h2>
                                    <p className="text-gray-600 mb-8">Select between classic white or bold black</p>

                                    <div className="flex justify-center gap-12">
                                        {/* White T-Shirt */}
                                        <div
                                            onClick={() => setSelectedColor('white')}
                                            className={`cursor-pointer transition-all duration-300 ${
                                                selectedColor === 'white'
                                                    ? 'transform scale-105 ring-4 ring-orange-300'
                                                    : 'hover:transform hover:scale-102'
                                            }`}
                                        >
                                            <div className="relative">
                                                <div className="w-40 h-48 rounded-3xl shadow-xl relative overflow-hidden">
                                                    {/* T-Shirt Image */}
                                                    <img
                                                        src="/images/white.jpg"
                                                        alt="White T-shirt"
                                                        className="w-full h-full object-cover rounded-3xl"
                                                    />
                                                    {/* Design Preview */}
                                                    {designPreview && selectedColor === 'white' && (
                                                        <div className="absolute inset-6 flex items-center justify-center">
                                                            <div className="bg-white/95 rounded-lg p-2 shadow-xl border border-gray-200">
                                                                <img
                                                                    src={designPreview}
                                                                    alt="Design preview"
                                                                    className="w-24 h-24 object-contain"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <p className="font-bold text-lg text-gray-900">White T-Shirt</p>
                                                    <p className="text-sm text-gray-600">Classic & Clean</p>
                                                    {selectedColor === 'white' && (
                                                        <Badge className="mt-2 bg-orange-500 text-white">✓ Selected</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Black T-Shirt */}
                                        <div
                                            onClick={() => setSelectedColor('black')}
                                            className={`cursor-pointer transition-all duration-300 ${
                                                selectedColor === 'black'
                                                    ? 'transform scale-105 ring-4 ring-orange-300'
                                                    : 'hover:transform hover:scale-102'
                                            }`}
                                        >
                                            <div className="relative">
                                                <div className="w-40 h-48 rounded-3xl shadow-xl relative overflow-hidden">
                                                    {/* T-Shirt Image */}
                                                    <img
                                                        src="/images/black.jpg"
                                                        alt="Black T-shirt"
                                                        className="w-full h-full object-cover rounded-3xl"
                                                    />
                                                    {/* Design Preview */}
                                                    {designPreview && selectedColor === 'black' && (
                                                        <div className="absolute inset-6 flex items-center justify-center">
                                                            <div className="bg-white/95 rounded-lg p-2 shadow-xl border border-gray-200">
                                                                <img
                                                                    src={designPreview}
                                                                    alt="Design preview"
                                                                    className="w-24 h-24 object-contain"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <p className="font-bold text-lg text-gray-900">Black T-Shirt</p>
                                                    <p className="text-sm text-gray-600">Bold & Modern</p>
                                                    {selectedColor === 'black' && (
                                                        <Badge className="mt-2 bg-orange-500 text-white">✓ Selected</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Design Upload Section */}
                                <div className="border-t border-gray-200 pt-8">
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Upload Your Design</h2>
                                        <p className="text-gray-600">Add your custom artwork to make it uniquely yours</p>
                                    </div>

                                    {!designPreview ? (
                                        <div className="border-2 border-dashed border-orange-300 rounded-2xl p-12 text-center hover:border-orange-400 transition-colors bg-orange-50">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleDesignUpload}
                                                className="hidden"
                                                id="design-upload"
                                            />
                                            <label htmlFor="design-upload" className="cursor-pointer">
                                                <Upload className="h-20 w-20 text-orange-400 mx-auto mb-6" />
                                                <h3 className="text-gray-900 font-bold text-2xl mb-3">Click to upload your design</h3>
                                                <p className="text-gray-600 text-lg mb-2">PNG, JPG up to 10MB</p>
                                                <p className="text-orange-600 font-medium">💡 Tip: For best results, use high-resolution images with transparent backgrounds</p>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
                                            <div className="flex items-center justify-center gap-8">
                                                <img
                                                    src={designPreview}
                                                    alt="Design preview"
                                                    className="w-32 h-32 object-cover rounded-2xl border-2 border-green-300 shadow-lg"
                                                />
                                                <div className="text-center">
                                                    <h3 className="font-bold text-green-800 text-2xl mb-2">✓ Design Uploaded!</h3>
                                                    <p className="text-green-600 text-lg mb-4">Your design is ready to be printed</p>
                                                    <Button
                                                        variant="outline"
                                                        onClick={removeDesign}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        Remove Design
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                {designPreview && (
                                    <div className="border-t border-gray-200 pt-8 text-center">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: Complete Your Order</h2>
                                        <div className="space-y-4">
                                            <Button
                                                size="lg"
                                                onClick={addToCart}
                                                className="w-full max-w-md py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200 text-white border-0"
                                            >
                                                <ShoppingCart className="h-5 w-5 mr-2" />
                                                Add Custom T-Shirt to Cart - 299 DH
                                            </Button>
                                            <p className="text-gray-600">
                                                Your custom {selectedColor} t-shirt with your unique design
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
