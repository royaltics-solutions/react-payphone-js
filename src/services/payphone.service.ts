import { PayphoneApiRequest,  PayphonePrepareApiResponse, PayphoneProps } from "../types";
import { toCents, generateId } from "../utils/math";

export class PayphoneService {
    private static BASE_URL = "https://pay.payphonetodoesposible.com/api/button/Prepare";

    /**
     * Prepares the data for sending to the API.
     * Maps the friendly props to the strict API structure.
     */
    private static prepareRequestData(props: PayphoneProps): PayphoneApiRequest {
        const {
            amount,
            amountZeroIva,
            amountTaxable,
            taxValue,
            serviceValue,
            tipValue,
            currency = "USD",
            reference,
            transactionId,
            storeId,
            extraData,
            singleUse = true, // Default true as per common security practice
            expireHours,
            amountEditable = false,
            responseUrl
        } = props;

        // Convert all to cents
        const amountDisplay = toCents(amount);
        const amountWithoutTax = toCents(amountZeroIva);
        const amountWithTax = toCents(amountTaxable);
        const tax = toCents(taxValue);
        const service = toCents(serviceValue);
        const tip = toCents(tipValue);

        // Validation: Ensure total matches components if provided
        const calculatedTotal = amountWithoutTax + amountWithTax + tax + service + tip;

        // If amountDisplay is provided, use it. But ideally it should match parts.
        // If amountDisplay is 0/undefined but parts exist, use sum.
        const finalAmount = amountDisplay > 0 ? amountDisplay : calculatedTotal;

        if (finalAmount <= 0) {
            throw new Error("Total amount must be greater than 0");
        }

        return {
            amount: finalAmount,
            amountWithoutTax,
            amountWithTax,
            tax,
            service,
            tip,
            currency,
            reference,
            responseUrl,
            clientTransactionId: transactionId || generateId(),
            storeId,
            additionalData: extraData,
            oneTime: singleUse,
            expireIn: expireHours,
            isAmountEditable: amountEditable
        };
    }

    /**
     * Calls the Payphone API to generate a payment link.
     */
    static async createPaymentLink(props: PayphoneProps): Promise<PayphonePrepareApiResponse> {
        const requestData = this.prepareRequestData(props);

        if (!requestData.responseUrl) throw new Error("responseUrl is required");

        const response = await fetch(this.BASE_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${props.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Payphone API Error: ${response.statusText}`);
        }

        return response.json();
    }

    private static CONFIRM_URL = "https://pay.payphonetodoesposible.com/api/button/V2/Confirm";

    /**
     * Confirms the status of a transaction.
     */
    static async confirmPayment(token: string, id: number, clientTxId: string): Promise<import("../types").PayphoneConfirmResponse> {
        const response = await fetch(this.CONFIRM_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, clientTxId })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Payphone Confirmation Error: ${response.statusText}`);
        }

        return response.json();
    }
}
