
/**
 * Types representing the strict API structure required by Payphone.
 * All monetary values are in cents (polymorphic integers).
 */
export interface PayphoneApiRequest {
    /** Total amount to charge (sum of all other components). In cents. */
    amount: number;
    /** Amount not subject to tax. In cents. */
    amountWithoutTax: number;
    /** Amount subject to tax (excluding the tax itself). In cents. */
    amountWithTax: number;
    /** Tax amount. In cents. */
    tax: number;
    /** Service charce amount. In cents. */
    service: number;
    /** Tip amount. In cents. */
    tip: number;
    /** ISO 4217 Currency code (e.g., "USD") */
    currency: string;
    /** Reference for the payment (max 100 chars) */
    reference: string;
    /** Unique transaction ID (max 15 chars). Optional in API, but recommended. */
    clientTransactionId?: string;
    /** Store ID from Payphone Developer */
    storeId: string;
    /** Additional data (max 250 chars) */
    additionalData?: string;
    /** If true, link works only once. */

    responseUrl: string;

    oneTime?: boolean;
    /** Expiration in hours. 0 = no expiration ?? (Verify docs, usually implies duration) */
    expireIn?: number;
    /** Allow amount to be editable */
    isAmountEditable?: boolean;
}

/**
 * structure for the response from Payphone prepare link
 */
export interface PayphonePrepareApiResponse {
    paymentId: string;
    payWithCard: string;
    payWithPayPhone: string;
}


export interface PayphonePaymentApiResponse {
    id: string | null;
    clientTransactionId: string;
    transactionStatus: string;

    msg?: string | null;
}


/**
 * Friendly props for the React Component.
 * These are "Human Readable" and allow decimals.
 * We map these to the API request internally.
 */
export interface PayphoneProps {
    /** API Token */
    token: string;

    /** Total amount in USD (e.g. 10.50). If not provided, will be calculated from subcomponents if possible. */
    amount: number;
    /** Amount not subject to tax (0% VAT) in USD. */
    amountZeroIva?: number; // Friendly name for amountWithoutTax
    /** Taxable base amount in USD. */
    amountTaxable?: number; // Friendly name for amountWithTax
    /** Tax amount in USD (e.g. 15% value). */
    taxValue?: number; // Friendly name for tax
    /** Service charge in USD. */
    serviceValue?: number; // Friendly name for service
    /** Tip amount in USD. */
    tipValue?: number; // Friendly name for tip

    /** Standard ISO Currency */
    currency?: string;

    /** Payment reference/description */
    reference: string;
    /** Unique ID for transaction. If not provided, one will be generated. */
    transactionId?: string; // Friendly name for clientTransactionId

    /** Store Identifier */
    storeId: string;

    /** Any extra data string */
    extraData?: string; // Friendly name for additionalData

    /** If true, the link expires after one successful payment */
    singleUse?: boolean; // Friendly name for oneTime

    /** Expiration time in minutes? Or hours? API says hours usually. Let's document as hours. */
    expireHours?: number; // Friendly name for expireIn

    /** Allow user to edit amount on Payphone page */
    amountEditable?: boolean;

    /** Callback when payment flow is completed (success or failure mechanism depends on implementation) */
    /** Callback when payment link is prepared (optional) */
    onPreparated?: (response: PayphonePrepareApiResponse) => void;

    /** Callback when payment link is generated and process starts. (Legacy onCompletion usage) */
    onPayment?: (response: PayphonePaymentApiResponse) => void;

    /** Callback when payment is confirmed (via auto-confirm) */
    onConfirm?: (response: PayphoneConfirmResponse) => void;

    /** Callback when internal error or API error occurs */
    onError?: (error: string | PayphoneConfirmError | any) => void;

    /** CSS class for the button */
    className?: string;

    /** Styles override */
    style?: React.CSSProperties;

    /** Auto-redirect or open in popup? */
    responseUrl: string;


    /** If true, opens the payment link in a new popup window instead of redirecting
     * Default: true
     */
    popup?: boolean;

    /** 
     * If true, automatically calls the confirm endpoint after a successful payment in popup mode.
     * Default: true
     */
    autoConfirm?: boolean;

    /** Client Phone Number for Box/Express Checkout */
    phoneNumber?: string;
    /** Client Email for Box/Express Checkout */
    email?: string;
    /** Client Document/ID for Box/Express Checkout */
    documentId?: string;
}

export interface PayphoneState {
    isLoading: boolean;
    url?: string;
    error?: string;
}

export interface PayphoneConfirmRequest {
    id: number;
    clientTxId: string;
}

export interface PayphoneConfirmResponse {
    email: string;
    cardType: string;
    bin: string;
    lastDigits: string;
    deferredCode: string;
    deferred: boolean;
    cardBrandCode: string;
    cardBrand: string;
    amount: number;
    clientTransactionId: string;
    phoneNumber: string;
    statusCode: number; // 2 = Cancelado, 3 = Aprobada
    transactionStatus: "Approved" | "Canceled" | string;
    authorizationCode: string;
    message?: string;
    messageCode: number;
    transactionId: number;
    document: string;
    currency: string;
    optionalParameter3?: string;
    optionalParameter4?: string;
    storeName: string;
    date: string;
    regionIso: string;
    transactionType: string;
    reference: string;
}

export interface PayphoneConfirmError {
    message: string;
    errorCode: number;
}
