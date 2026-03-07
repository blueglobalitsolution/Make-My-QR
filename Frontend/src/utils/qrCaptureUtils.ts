import { FrameType } from '../../types';
import QRCodeStyling from 'qr-code-styling';
import html2canvas from 'html2canvas';

export interface FrameConfig {
    id: FrameType;
    style: string;
    label?: string;
    labelStyle?: string;
    wrapperClass?: string;
    labelClass?: string;
    showIcon?: boolean;
    iconName?: string;
    renderCustom?: (qrContainer: HTMLElement) => HTMLElement;
}

const HAND_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 32px; height: 32px;"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0a2 2 0 0 0-2 2v0"></path><path d="M18 11v6a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5"></path><path d="M7 11V5a2 2 0 0 1 2-2v0a2 2 0 0 1 2 2v0"></path></svg>`;
const MAIL_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`;
const BIKE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;"><circle cx="18.5" cy="17.5" r="3.5"></circle><circle cx="5.5" cy="17.5" r="3.5"></circle><circle cx="15" cy="5" r="1"></circle><path d="M12 17.5V14l-3-3 4-3 2 3h2"></path></svg>`;

export const FRAME_CONFIGS: Record<string, FrameConfig> = {
    'none': {
        id: 'none',
        style: '',
        wrapperClass: 'p-4 bg-white rounded-2xl'
    },
    'basic-label': {
        id: 'basic-label',
        style: 'border: 3px solid black; background: white; display: flex; flex-direction: column; align-items: center;',
        label: 'Scan Me!',
        labelStyle: 'width: 100%; background: black; color: white; padding: 6px 0; text-align: center; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;'
    },
    'rounded-label': {
        id: 'rounded-label',
        style: 'border: 3px solid black; border-radius: 32px; background: white; display: flex; flex-direction: column; align-items: center; overflow: hidden;',
        label: 'Scan Me!',
        labelStyle: 'width: 100%; background: black; color: white; padding: 6px 0; text-align: center; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;'
    },
    'thick-label': {
        id: 'thick-label',
        style: 'border: 6px solid black; background: white; display: flex; flex-direction: column; align-items: center;',
        label: 'Scan Me!',
        labelStyle: 'width: 100%; background: black; color: white; padding: 6px 0; text-align: center; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em;'
    },
    'bubble': {
        id: 'bubble',
        style: 'padding: 12px; border: 4px solid black; border-radius: 40px; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; justify-content: center; position: relative; margin-top: 60px;',
        label: 'Scan Me!',
        renderCustom: (qr) => {
            const wrap = document.createElement('div');
            wrap.style.display = 'flex';
            wrap.style.flexDirection = 'column';
            wrap.style.alignItems = 'center';
            wrap.style.gap = '16px';
            wrap.style.marginTop = '40px';

            const bubble = document.createElement('div');
            bubble.style.cssText = 'background: black; color: white; padding: 12px 24px; border-radius: 9999px; font-weight: 900; font-size: 16px; text-transform: uppercase; letter-spacing: 0.1em; position: relative;';
            bubble.textContent = 'Scan Me!';

            const arrow = document.createElement('div');
            arrow.style.cssText = 'position: absolute; top: 100%; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 12px solid black;';
            bubble.appendChild(arrow);
            wrap.appendChild(bubble);

            const qrWrap = document.createElement('div');
            qrWrap.style.cssText = 'padding: 16px; border: 4px solid black; border-radius: 48px; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
            qrWrap.appendChild(qr);
            wrap.appendChild(qrWrap);
            return wrap;
        }
    },
    'shopping': {
        id: 'shopping',
        style: '',
        label: 'Shop Now!',
        renderCustom: (qr) => {
            const wrap = document.createElement('div');
            wrap.style.display = 'flex';
            wrap.style.flexDirection = 'column';
            wrap.style.alignItems = 'center';
            wrap.style.marginTop = '32px';

            const handle = document.createElement('div');
            handle.style.cssText = 'width: 100px; height: 50px; border: 4px solid black; border-bottom: 0; border-radius: 50px 50px 0 0; margin-bottom: -4px; z-index: 10;';
            wrap.appendChild(handle);

            const body = document.createElement('div');
            body.style.cssText = 'border: 4px solid black; background: white; padding: 24px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; border-radius: 4px;';
            body.appendChild(qr);

            const label = document.createElement('div');
            label.style.cssText = 'margin-top: 20px; background: black; color: white; padding: 8px 24px; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px;';
            label.textContent = 'Shop Now!';
            body.appendChild(label);
            wrap.appendChild(body);
            return wrap;
        }
    },
    'hands': {
        id: 'hands',
        style: '',
        label: 'Scan To Interact',
        renderCustom: (qr) => {
            const wrap = document.createElement('div');
            wrap.style.position = 'relative';
            wrap.style.display = 'flex';
            wrap.style.flexDirection = 'column';
            wrap.style.alignItems = 'center';
            wrap.style.padding = '0 80px';

            const leftHand = document.createElement('div');
            leftHand.style.cssText = 'position: absolute; left: 15px; top: 50%; transform: translateY(-50%) rotate(90deg); opacity: 0.3; color: black;';
            leftHand.innerHTML = HAND_ICON;
            wrap.appendChild(leftHand);

            const rightHand = document.createElement('div');
            rightHand.style.cssText = 'position: absolute; right: 15px; top: 50%; transform: translateY(-50%) rotate(-90deg); opacity: 0.3; color: black;';
            rightHand.innerHTML = HAND_ICON;
            wrap.appendChild(rightHand);

            const body = document.createElement('div');
            body.style.cssText = 'padding: 24px; border: 3px solid #e2e8f0; background: white; border-radius: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);';
            body.appendChild(qr);
            wrap.appendChild(body);

            const label = document.createElement('div');
            label.style.cssText = 'margin-top: 20px; font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: black;';
            label.textContent = 'Scan To Interact';
            wrap.appendChild(label);
            return wrap;
        }
    },
    'ribbon': {
        id: 'ribbon',
        style: '',
        label: 'Save Discount!',
        renderCustom: (qr) => {
            const wrap = document.createElement('div');
            wrap.style.display = 'flex';
            wrap.style.flexDirection = 'column';
            wrap.style.alignItems = 'center';

            const body = document.createElement('div');
            body.style.cssText = 'border: 4px solid black; background: white; padding: 24px;';
            body.appendChild(qr);
            wrap.appendChild(body);

            const ribbonWrap = document.createElement('div');
            ribbonWrap.style.cssText = 'margin-top: -12px; position: relative; z-index: 10;';

            const ribbon = document.createElement('div');
            ribbon.style.cssText = 'background: black; color: white; padding: 8px 32px; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; box-shadow: 0 4px 10px rgba(0,0,0,0.2); position: relative;';
            ribbon.textContent = 'Save Discount!';

            // Ribbons often have those skewy ends
            const leftEnd = document.createElement('div');
            leftEnd.style.cssText = 'position: absolute; top: 0; left: -10px; height: 100%; width: 10px; background: #222; transform: skewY(20deg); transform-origin: right; z-index: -1;';
            ribbon.appendChild(leftEnd);

            const rightEnd = document.createElement('div');
            rightEnd.style.cssText = 'position: absolute; top: 0; right: -10px; height: 100%; width: 10px; background: #222; transform: skewY(-20deg); transform-origin: left; z-index: -1;';
            ribbon.appendChild(rightEnd);

            ribbonWrap.appendChild(ribbon);
            wrap.appendChild(ribbonWrap);
            return wrap;
        }
    },
    'gift': {
        id: 'gift',
        style: '',
        label: 'Open Gift!',
        renderCustom: (qr) => {
            const wrap = document.createElement('div');
            wrap.style.display = 'flex';
            wrap.style.flexDirection = 'column';
            wrap.style.alignItems = 'center';
            wrap.style.marginTop = '24px';

            const ribbon = document.createElement('div');
            ribbon.style.cssText = 'display: flex; gap: 4px; margin-bottom: -4px; z-index: 20;';
            ribbon.innerHTML = `
                <div style="width: 24px; height: 24px; border: 4px solid black; border-radius: 50%; transform: rotate(-45deg); background: white;"></div>
                <div style="width: 24px; height: 24px; border: 4px solid black; border-radius: 50%; transform: rotate(45deg); background: white;"></div>
            `;
            wrap.appendChild(ribbon);

            const body = document.createElement('div');
            body.style.cssText = 'border: 4px solid black; background: white; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative; display: flex; flex-direction: column; align-items: center; overflow: hidden;';

            const stripe = document.createElement('div');
            stripe.style.cssText = 'position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 8px; height: 100%; background: rgba(0,0,0,0.1);';
            body.appendChild(stripe);

            const qrContainer = document.createElement('div');
            qrContainer.style.position = 'relative';
            qrContainer.style.zIndex = '10';
            qrContainer.appendChild(qr);
            body.appendChild(qrContainer);

            const label = document.createElement('div');
            label.style.cssText = 'margin-top: 16px; background: black; color: white; padding: 6px 20px; font-size: 12px; font-weight: 900; text-transform: uppercase; border-radius: 2px; position: relative; z-index: 10;';
            label.textContent = 'Open Gift!';
            body.appendChild(label);

            wrap.appendChild(body);
            return wrap;
        }
    },
    'mail': {
        id: 'mail',
        style: '',
        label: 'Read Me!',
        renderCustom: (qr) => {
            const wrap = document.createElement('div');
            wrap.style.display = 'flex';
            wrap.style.flexDirection = 'column';
            wrap.style.alignItems = 'center';
            wrap.style.gap = '16px';

            const body = document.createElement('div');
            body.style.cssText = 'padding: 24px; border: 4px solid black; bg: white; border-radius: 12px; shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;';

            const bgIcon = document.createElement('div');
            bgIcon.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.05; color: black;';
            bgIcon.innerHTML = MAIL_ICON;
            bgIcon.firstChild && ((bgIcon.firstChild as HTMLElement).style.width = '120px');
            bgIcon.firstChild && ((bgIcon.firstChild as HTMLElement).style.height = '120px');
            body.appendChild(bgIcon);

            const qrContainer = document.createElement('div');
            qrContainer.style.position = 'relative';
            qrContainer.style.zIndex = '10';
            qrContainer.appendChild(qr);
            body.appendChild(qrContainer);
            wrap.appendChild(body);

            const label = document.createElement('div');
            label.style.cssText = 'background: black; color: white; padding: 6px 24px; border-radius: 9999px; font-weight: 900; font-size: 12px; text-transform: uppercase; display: flex; align-items: center; gap: 8px;';
            label.innerHTML = MAIL_ICON + ' <span>Read Me!</span>';
            wrap.appendChild(label);
            return wrap;
        }
    },
    'delivery': {
        id: 'delivery',
        style: '',
        label: 'Fast Delivery!',
        renderCustom: (qr) => {
            const wrap = document.createElement('div');
            wrap.style.display = 'flex';
            wrap.style.flexDirection = 'column';
            wrap.style.alignItems = 'center';

            const body = document.createElement('div');
            body.style.cssText = 'padding: 24px; border: 4px solid black; background: white; border-radius: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
            body.appendChild(qr);
            wrap.appendChild(body);

            const label = document.createElement('div');
            label.style.cssText = 'margin-top: -16px; background: black; color: white; padding: 10px 24px; border-radius: 24px; font-weight: 900; font-size: 12px; text-transform: uppercase; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 20;';
            label.innerHTML = BIKE_ICON + ' <span>Fast Delivery!</span>';
            wrap.appendChild(label);
            return wrap;
        }
    },
    'service': {
        id: 'service',
        style: '',
        label: 'Menu',
        renderCustom: (qr) => {
            const wrap = document.createElement('div');
            wrap.style.display = 'flex';
            wrap.style.flexDirection = 'column';
            wrap.style.alignItems = 'center';

            const body = document.createElement('div');
            body.style.cssText = 'padding: 32px; border: 4px solid black; background: white; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.1); position: relative; overflow: hidden;';

            const shadow = document.createElement('div');
            shadow.style.cssText = 'position: absolute; bottom: 0; left: 0; width: 100%; height: 33%; background: rgba(0,0,0,0.05);';
            body.appendChild(shadow);

            const qrWrap = document.createElement('div');
            qrWrap.style.position = 'relative';
            qrWrap.style.zIndex = '10';
            qrWrap.appendChild(qr);
            body.appendChild(qrWrap);
            wrap.appendChild(body);

            const labelWrap = document.createElement('div');
            labelWrap.style.cssText = 'margin-top: 24px; display: flex; align-items: center; gap: 16px;';
            labelWrap.innerHTML = `
                <div style="height: 2px; width: 40px; background: black;"></div>
                <span style="font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.2em; color: black;">Menu</span>
                <div style="height: 2px; width: 40px; background: black;"></div>
            `;
            wrap.appendChild(labelWrap);
            return wrap;
        }
    }
};

export const getFrameConfig = (frame: FrameType): FrameConfig => {
    return FRAME_CONFIGS[frame] || FRAME_CONFIGS['none'];
};

export const generateQRWithFrame = async (qrValue: string, config: any): Promise<string | null> => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.background = config.bgColor || '#ffffff';
    container.style.padding = '40px';
    document.body.appendChild(container);

    const qrContainer = document.createElement('div');
    const qr = new QRCodeStyling({
        width: 600,
        height: 600,
        data: qrValue,
        dotsOptions: { color: config.fgColor, type: config.pattern },
        backgroundOptions: { color: config.bgColor },
        cornersSquareOptions: { type: config.cornersSquareType || 'square', color: config.cornersSquareColor || config.fgColor },
        cornersDotOptions: { type: config.cornersDotType || 'square', color: config.cornersDotColor || config.fgColor },
        image: config.logoUrl,
        imageOptions: { crossOrigin: "anonymous", margin: 10 }
    });
    qr.append(qrContainer);

    await new Promise(resolve => setTimeout(resolve, 300));

    const frame = config.frame || 'none';

    if (frame === 'none') {
        qrContainer.style.padding = '20px';
        qrContainer.style.background = 'white';
        qrContainer.style.borderRadius = '16px';
        container.appendChild(qrContainer);
    } else {
        const conf = FRAME_CONFIGS[frame] || FRAME_CONFIGS['basic-label'];

        if (conf.renderCustom) {
            const customElement = conf.renderCustom(qrContainer);
            container.appendChild(customElement);
        } else {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = conf.style;

            qrContainer.style.display = 'flex';
            qrContainer.style.justifyContent = 'center';
            qrContainer.style.alignItems = 'center';
            qrContainer.style.padding = '20px';

            wrapper.appendChild(qrContainer);

            if (conf.label) {
                const label = document.createElement('div');
                label.style.cssText = conf.labelStyle || '';
                label.textContent = conf.label;
                wrapper.appendChild(label);
            }

            container.appendChild(wrapper);
        }
    }

    try {
        const canvas = await html2canvas(container, {
            backgroundColor: config.bgColor || '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
        });
        return canvas.toDataURL('image/png');
    } catch (err) {
        console.error('Error generating QR with frame:', err);
        return null;
    } finally {
        document.body.removeChild(container);
    }
};
