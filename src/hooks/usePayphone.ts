import { useState, useCallback } from 'react';
import { PayphoneProps, PayphoneState } from '../types';
import { PayphoneService } from '../services/payphone.service';

/**
 * Hook to interact with Payphone API.
 */
export const usePayphone = (defaultProps?: Partial<PayphoneProps>) => {
    const [state, setState] = useState<PayphoneState>({
        isLoading: false,
    });

    /**
     * Initiates the payment process.
     * Can override props passed to the hook.
     */
    const pay = useCallback(async (overrideProps?: Partial<PayphoneProps>) => {
        const props = { popup: true, ...defaultProps, ...overrideProps } as PayphoneProps;

        if (!props.token || !props.storeId) {
            setState({ isLoading: false, error: "Missing required configuration (token or storeId)" });
            return;
        }

        setState({ isLoading: true, error: undefined });

        try {
            const response = await PayphoneService.createPaymentLink(props);
            setState({ isLoading: false, url: response.payWithCard });


            if (response.payWithCard) {


                if (props.onPreparated) {
                    props.onPreparated(response);
                }

                if (props.popup) {
                    const width = 600;
                    const height = 700;
                    const left = (window.screen.width - width) / 2;
                    const top = (window.screen.height - height) / 2;
                    const popup = window.open(
                        response.payWithCard,
                        'PayphoneCheckout',
                        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
                    );

                    if (popup) {
                        const timer = setInterval(() => {
                            if (popup.closed) {
                                clearInterval(timer);
                                return;
                            }

                            try {
                                const currentUrl = popup.location.href;
                                if (currentUrl && currentUrl !== 'about:blank' && !currentUrl.includes('pay.payphonetodoesposible.com')) {
                                    const url = new URL(currentUrl);
                                    const id = url.searchParams.get('id');
                                    const clientTxId = url.searchParams.get('clientTransactionId');

                                    if (id || clientTxId) {
                                        popup.close();
                                        clearInterval(timer);

                                        if (props.onPayment) {
                                            props.onPayment(response);
                                        }

                                        const autoConfirm = props.autoConfirm !== false;

                                        if (autoConfirm && props.token && id) {
                                            PayphoneService.confirmPayment(props.token, Number(id), clientTxId || '')
                                                .then((confirmResponse) => {
                                                    if (confirmResponse.transactionStatus === 'Canceled') {
                                                        if (props.onError) {
                                                            return props.onError({ ...confirmResponse, message: 'Payment canceled' });
                                                        }
                                                    }

                                                    if (props.onConfirm) props.onConfirm(confirmResponse);

                                                })
                                                .catch((err) => {
                                                    console.error("Auto-confirm failed", err);
                                                    if (props.onError) {
                                                        props.onError(err);
                                                    }
                                                });
                                        }
                                    }
                                }
                            } catch (e) {
                                // Ignore CORS errors
                            }
                        }, 1000);
                    }

                } else {
                    window.location.href = response.payWithCard;

                }
            }
        } catch (error: any) {
            setState({ isLoading: false, error: error.message });
            if (props.onError) {
                props.onError(error);
            }
            console.error("Payphone Error:", error);
        }
    }, [defaultProps]);

    /**
     * Confirms the payment status manually.
     */
    const confirm = useCallback(async (id: number, clientTxId: string) => {
        const props = { ...defaultProps } as PayphoneProps;
        if (!props.token) {
            throw new Error("Missing token for confirmation");
        }
        return PayphoneService.confirmPayment(props.token, id, clientTxId);
    }, [defaultProps]);

    return {
        ...state,
        pay,
        confirm
    };
};
