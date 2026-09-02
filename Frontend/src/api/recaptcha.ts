declare global {
    interface Window {
        grecaptcha: any;
    }
}

export const RECAPTCHA_SITE_KEY = '6LeTr6QtAAAAAAI6ulX2f3nY2nEj_1ggVnKgc3R0';

export async function getRecaptchaToken(action: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (!window.grecaptcha) {
            reject(new Error('CAPTCHA unavailable. Please refresh and try again.'));
            return;
        }
        window.grecaptcha.ready(() => {
            window.grecaptcha
                .execute(RECAPTCHA_SITE_KEY, { action })
                .then((token: string) => resolve(token))
                .catch((err: any) => reject(new Error('CAPTCHA verification failed. Please try again.')));
        });
    });
}
