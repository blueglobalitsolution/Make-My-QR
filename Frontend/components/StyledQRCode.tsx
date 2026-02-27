import React from 'react';
import QRCodeStyling from 'qr-code-styling';

export const StyledQRCode: React.FC<{ options: any; size?: number; qrRef?: React.RefObject<HTMLDivElement> }> = ({ options, size = 200, qrRef: externalRef }) => {
    const localRef = React.useRef<HTMLDivElement>(null);
    const qrRef = externalRef || localRef;
    const qrInstance = React.useRef<QRCodeStyling | null>(null);

    React.useEffect(() => {
        if (!qrInstance.current) {
            qrInstance.current = new QRCodeStyling({
                ...options,
                width: size,
                height: size
            });
            if (qrRef.current) qrInstance.current.append(qrRef.current);
        } else {
            qrInstance.current.update({
                ...options,
                width: size,
                height: size
            });
        }
    }, [options, size, qrRef]);

    return <div ref={qrRef} className="flex items-center justify-center" />;
};
