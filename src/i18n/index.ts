export type Language = 'en' | 'es';

const translations = {
    es: {
        payButton: "Pagar con Payphone",
        loading: "Procesando...",
        error: "Error al iniciar pago",
        redirecting: "Redirigiendo a Payphone...",
    },
    en: {
        payButton: "Pay with Payphone",
        loading: "Processing...",
        error: "Error initiating payment",
        redirecting: "Redirecting to Payphone...",
    }
};

export const getTranslation = (lang: Language = 'es') => {
    return translations[lang] || translations.es;
};
