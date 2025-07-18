import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Home,
    Tag,
    Palette
} from 'lucide-react';

export function AdminSidebar() {
    const { auth, url } = usePage().props;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({});

    const logout = () => {
        router.post(route('logout'));
    };

    const toggleMenu = (menuKey) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuKey]: !prev[menuKey]
        }));
    };

    const isActive = (routeName) => {
        if (!url) return false;
        try {
            return url.startsWith(route(routeName));
        } catch (error) {
            return false;
        }
    };

    const menuItems = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            route: 'admin.dashboard',
            active: url && (() => {
                try {
                    return url === route('admin.dashboard');
                } catch (error) {
                    return false;
                }
            })()
        },
        {
            key: 'products',
            label: 'Products',
            icon: Package,
            expandable: true,
            active: url && url.includes('/admin/products'),
            children: [
                { label: 'All Products', route: 'admin.products.index' },
                { label: 'Add Product', route: 'admin.products.create' }
            ]
        },

        {
            key: 'orders',
            label: 'Orders',
            icon: ShoppingCart,
            expandable: true,
            active: url && url.includes('/admin/orders'),
            children: [
                { label: 'All Orders', route: 'admin.orders.index' },
                { label: 'Regular Orders', route: 'admin.orders.regular' },
                { label: 'Custom T-Shirts', route: 'admin.orders.custom' }
            ]
        }
    ];

    return (
        <div className={`bg-black text-white h-screen flex flex-col transition-all duration-300 ${
            isCollapsed ? 'w-16' : 'w-64'
        }`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                    {!isCollapsed && (
                        <div className="flex items-center space-x-2">
                            <Package className="h-8 w-8 text-orange-500" />
                            <div>
                                <span className="text-xl font-bold text-orange-500">CLICKTEE</span>
                                <p className="text-xs text-gray-400">Admin Panel</p>
                            </div>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* User Info */}
            {/* {!isCollapsed && (
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-medium">{auth.user.name}</p>
                            <p className="text-sm text-gray-400">Administrator</p>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <div key={item.key}>
                        {item.expandable ? (
                            <>
                                <button
                                    onClick={() => toggleMenu(item.key)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                                        item.active
                                            ? 'bg-orange-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon className="h-5 w-5" />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </div>
                                    {!isCollapsed && (
                                        expandedMenus[item.key]
                                            ? <ChevronDown className="h-4 w-4" />
                                            : <ChevronRight className="h-4 w-4" />
                                    )}
                                </button>

                                {!isCollapsed && expandedMenus[item.key] && (
                                    <div className="ml-8 mt-2 space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.route}
                                                href={route(child.route)}
                                                className={`block p-2 rounded-lg transition-colors ${
                                                    url && (() => {
                                                        try {
                                                            return url === route(child.route);
                                                        } catch (error) {
                                                            return false;
                                                        }
                                                    })()
                                                        ? 'bg-orange-500 text-white'
                                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                                }`}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                href={route(item.route)}
                                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                    item.active
                                        ? 'bg-orange-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {!isCollapsed && <span>{item.label}</span>}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 space-y-2">
                <Link
                    href={route('home')}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                    <Home className="h-5 w-5" />
                    {!isCollapsed && <span>View Store</span>}
                </Link>

                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}
