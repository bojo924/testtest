import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ShoppingCart,
    User,
    Menu,
    X,
    Package,
    History,
    LogOut,
    Settings
} from 'lucide-react';

export function Navbar() {
    const { auth, flash, cartCount } = usePage().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logout = () => {
        router.post(route('logout'));
    };

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href={route('home')} className="flex items-center space-x-3">
                        <img
                            src="/images/Picsart_25-06-27_11-57-09-084.png"
                            alt="ClickTee"
                            className="h-10 w-auto"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <span className="text-3xl font-bold text-orange-500 tracking-tight">
                            CLICKTEE
                        </span>
                    </Link>


                    {/* Desktop Navigation */}
                    {/* <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href={route('products.index')}
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            Products
                        </Link>
                        <Link
                            href={route('categories.index')}
                            className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            Categories
                        </Link>
                    </div> */}

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        <Link href={route('cart.index')}>
                            <Button variant="ghost" size="sm" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px]"
                                    >
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        {/* User Menu */}
                        {auth.user ? (
                            <div className="relative">
                                <div className="hidden md:flex items-center space-x-4">
                                    {auth.user.role === 'admin' && (
                                        <Link href={route('admin.dashboard')}>
                                            <Button variant="outline" size="sm">
                                                Admin Panel
                                            </Button>
                                        </Link>
                                    )}

                                    {/* <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-gray-600" />
                                        <span className="text-sm text-gray-700">{auth.user.name}</span>
                                    </div> */}

                                    <div className="flex items-center space-x-2">
                                        {/* <Link href={route('dashboard')}>
                                            <Button variant="ghost" size="sm">
                                                Dashboard
                                            </Button>
                                        </Link> */}
                                        <Link href={route('orders.index')}>
                                            <Button variant="ghost" size="sm">
                                                <History className="h-4 w-4 mr-1" />
                                                Orders
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="sm" onClick={logout}>
                                            <LogOut className="h-4 w-4 mr-1" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Link href={route('login')}>
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href={route('register')}>
                                    <Button size="sm">
                                        Register
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t bg-white">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {/* <Link
                                href={route('products.index')}
                                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Products
                            </Link>
                            <Link
                                href={route('categories.index')}
                                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Categories
                            </Link> */}

                            {auth.user ? (
                                <>
                                    <div className="px-3 py-2 border-t">
                                        {/* <div className="flex items-center space-x-2 mb-2">
                                            <User className="h-4 w-4 text-gray-600" />
                                            <span className="text-sm font-medium text-gray-700">{auth.user.name}</span>
                                        </div> */}

                                        {auth.user.role === 'admin' && (
                                            <Link
                                                href={route('admin.dashboard')}
                                                className="block py-1 text-sm text-blue-600 hover:text-blue-800"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Admin Panel
                                            </Link>
                                        )}

                                        {/* <Link
                                            href={route('dashboard')}
                                            className="block py-1 text-sm text-gray-700 hover:text-blue-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link> */}
                                        <Link
                                            href={route('orders.index')}
                                            className="block py-1 text-sm text-gray-700 hover:text-blue-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Order History
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMenuOpen(false);
                                            }}
                                            className="block py-1 text-sm text-red-600 hover:text-red-800"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="px-3 py-2 border-t space-y-2">
                                    <Link
                                        href={route('login')}
                                        className="block text-center py-2 text-gray-700 hover:text-blue-600"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="block text-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
