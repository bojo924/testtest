import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, MapPin, User } from 'lucide-react';

export default function Checkout({ cartItems, total, user }) {
    const [sameAsBilling, setSameAsBilling] = useState(true);

    const { data, setData, post, processing, errors } = useForm({
        shipping_address: {
            street: user.address || '',
            city: '',
            state: '',
            zip: ''
        },
        billing_address: {
            street: user.address || '',
            city: '',
            state: '',
            zip: ''
        },
        phone: user.phone || '',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // If same as billing, copy shipping to billing
        if (sameAsBilling) {
            setData('billing_address', data.shipping_address);
        }
        
        post(route('orders.store'));
    };

    const updateShippingAddress = (field, value) => {
        setData('shipping_address', {
            ...data.shipping_address,
            [field]: value
        });
        
        // If same as billing, also update billing
        if (sameAsBilling) {
            setData('billing_address', {
                ...data.shipping_address,
                [field]: value
            });
        }
    };

    const updateBillingAddress = (field, value) => {
        setData('billing_address', {
            ...data.billing_address,
            [field]: value
        });
    };

    return (
        <AppShell>
            <Head title="Checkout" />
            
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                    <p className="text-gray-600">Complete your order</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Customer Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={user.name}
                                                disabled
                                                className="bg-gray-50"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                value={user.email}
                                                disabled
                                                className="bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            required
                                        />
                                        {errors.phone && (
                                            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Shipping Address */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Shipping Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="shipping_street">Street Address</Label>
                                        <Input
                                            id="shipping_street"
                                            value={data.shipping_address.street}
                                            onChange={(e) => updateShippingAddress('street', e.target.value)}
                                            required
                                        />
                                        {errors['shipping_address.street'] && (
                                            <p className="text-red-600 text-sm mt-1">{errors['shipping_address.street']}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="shipping_city">City</Label>
                                            <Input
                                                id="shipping_city"
                                                value={data.shipping_address.city}
                                                onChange={(e) => updateShippingAddress('city', e.target.value)}
                                                required
                                            />
                                            {errors['shipping_address.city'] && (
                                                <p className="text-red-600 text-sm mt-1">{errors['shipping_address.city']}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="shipping_state">State</Label>
                                            <Input
                                                id="shipping_state"
                                                value={data.shipping_address.state}
                                                onChange={(e) => updateShippingAddress('state', e.target.value)}
                                                required
                                            />
                                            {errors['shipping_address.state'] && (
                                                <p className="text-red-600 text-sm mt-1">{errors['shipping_address.state']}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="shipping_zip">ZIP Code</Label>
                                            <Input
                                                id="shipping_zip"
                                                value={data.shipping_address.zip}
                                                onChange={(e) => updateShippingAddress('zip', e.target.value)}
                                                required
                                            />
                                            {errors['shipping_address.zip'] && (
                                                <p className="text-red-600 text-sm mt-1">{errors['shipping_address.zip']}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Billing Address */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Billing Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="same-as-shipping"
                                            checked={sameAsBilling}
                                            onCheckedChange={setSameAsBilling}
                                        />
                                        <Label htmlFor="same-as-shipping">
                                            Same as shipping address
                                        </Label>
                                    </div>

                                    {!sameAsBilling && (
                                        <>
                                            <div>
                                                <Label htmlFor="billing_street">Street Address</Label>
                                                <Input
                                                    id="billing_street"
                                                    value={data.billing_address.street}
                                                    onChange={(e) => updateBillingAddress('street', e.target.value)}
                                                    required
                                                />
                                                {errors['billing_address.street'] && (
                                                    <p className="text-red-600 text-sm mt-1">{errors['billing_address.street']}</p>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <Label htmlFor="billing_city">City</Label>
                                                    <Input
                                                        id="billing_city"
                                                        value={data.billing_address.city}
                                                        onChange={(e) => updateBillingAddress('city', e.target.value)}
                                                        required
                                                    />
                                                    {errors['billing_address.city'] && (
                                                        <p className="text-red-600 text-sm mt-1">{errors['billing_address.city']}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="billing_state">State</Label>
                                                    <Input
                                                        id="billing_state"
                                                        value={data.billing_address.state}
                                                        onChange={(e) => updateBillingAddress('state', e.target.value)}
                                                        required
                                                    />
                                                    {errors['billing_address.state'] && (
                                                        <p className="text-red-600 text-sm mt-1">{errors['billing_address.state']}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label htmlFor="billing_zip">ZIP Code</Label>
                                                    <Input
                                                        id="billing_zip"
                                                        value={data.billing_address.zip}
                                                        onChange={(e) => updateBillingAddress('zip', e.target.value)}
                                                        required
                                                    />
                                                    {errors['billing_address.zip'] && (
                                                        <p className="text-red-600 text-sm mt-1">{errors['billing_address.zip']}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Order Notes */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Notes (Optional)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-md resize-none"
                                        rows="3"
                                        placeholder="Any special instructions for your order..."
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-4">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Cart Items */}
                                    <div className="space-y-3">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{item.product.name}</p>
                                                    <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-medium">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Shipping</span>
                                            <span>Free</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>Tax</span>
                                            <span>$0.00</span>
                                        </div>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>

                                    <Button 
                                        type="submit"
                                        size="lg" 
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing ? 'Processing...' : 'Place Order'}
                                    </Button>

                                    <p className="text-xs text-gray-500 text-center">
                                        By placing your order, you agree to our terms and conditions.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppShell>
    );
}
