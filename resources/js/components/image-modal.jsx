import { useState } from 'react';
import { X } from 'lucide-react';

export function ImageModal({ src, alt, children }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!src) return children;

    return (
        <>
            {/* Trigger */}
            <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                {children}
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="relative max-w-4xl max-h-full">
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <X className="h-8 w-8" />
                        </button>
                        
                        {/* Image */}
                        <img
                            src={src}
                            alt={alt}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                        
                        {/* Image info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 rounded-b-lg">
                            <p className="text-center font-medium">{alt}</p>
                            <p className="text-center text-sm text-gray-300 mt-1">Click outside to close</p>
                        </div>
                    </div>
                    
                    {/* Click outside to close */}
                    <div 
                        className="absolute inset-0 -z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                </div>
            )}
        </>
    );
}
