import { useEffect } from 'react';

const ImgTypeMap = {
    SVG: 'image/svg+xml',
    ICO: 'image/x-icon',
    GIF: 'image/gif',
    PNG: 'image/png',
};

type ImgTypes = keyof typeof ImgTypeMap;

const useFavicon = (href: string) => {
    useEffect(() => {
        if (!href) return;

        const cutUrl = href.split('.');
        const imgSuffix = cutUrl[cutUrl.length - 1].toLocaleUpperCase() as ImgTypes;

        const link: HTMLLinkElement =
            document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = ImgTypeMap[imgSuffix];
        link.href = href;
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }, [])
}

export default useFavicon;