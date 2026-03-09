import React, { useEffect } from 'react';

interface FontLoaderProps {
    fonts: (string | undefined)[];
}

export const FontLoader: React.FC<FontLoaderProps> = ({ fonts }) => {
    useEffect(() => {
        // Filter out undefined and duplicates
        const uniqueFonts = Array.from(new Set(fonts.filter((f): f is string => !!f))) as string[];
        if (uniqueFonts.length === 0) return;

        // Build family query: family=Font+Name:wght@400;500;700;900
        const familyQuery = uniqueFonts
            .map(f => `family=${f.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800;900`)
            .join('&');

        const href = `https://fonts.googleapis.com/css2?${familyQuery}&display=swap`;

        // Find or create the link tag
        const existingLinks = document.head.querySelectorAll('link[rel="stylesheet"]');
        const alreadyLoaded = Array.from(existingLinks).some((link: any) => link.href === href);

        if (!alreadyLoaded) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.appendChild(link);
        }
    }, [fonts]);

    return null;
};
