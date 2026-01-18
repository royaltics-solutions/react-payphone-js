import React, { useState, useEffect } from 'react';
import { PayphoneProps } from '../types';
import { toCents, generateId } from '../utils/math';
import { getTranslation, Language } from '../i18n';
import { injectStyles } from '../utils/styles';

interface BoxProps extends PayphoneProps {
    lang?: Language;
    label?: string;
    backgroundColor?: string;
}

export const PayphoneButtonBox: React.FC<BoxProps> = (props) => {
    const {
        token,
        amount,
        amountZeroIva,
        amountTaxable,
        taxValue,
        serviceValue,
        tipValue,
        currency = 'USD',
        storeId,
        reference,
        transactionId,
        phoneNumber,
        email,
        documentId,
        extraData,
        lang = 'es',
        label,
        backgroundColor = '#ff5000',
        className,
        style,
        onPayment,
        onError
    } = props;

    const [isOpen, setIsOpen] = useState(false);
    const t = getTranslation(lang);

    useEffect(() => {
        injectStyles();
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://pay.payphonetodoesposible.com') return;

            const data = event.data;
            // data.status: 'approved' | 'rejected' | 'pending' | 'cancelled'
            
            if (data.status) {
                if (data.status === 'approved') {
                    console.log('Payment successful:', data);
                    // Map box response to something standard? Or just pass data?
                    // The Box flow is slightly different than Link flow.
                    // Ideally we should normalize, but for now passing raw data is flexible.
                    if (onPayment) onPayment(data); 
                    setIsOpen(false);
                } else if (data.status === 'cancelled') {
                    console.log('Payment cancelled:', data);
                    setIsOpen(false);
                } else {
                    console.error('Payment failed/status:', data);
                    if (onError) onError(data); 
                }
            }
        };

        if (isOpen) {
            window.addEventListener('message', handleMessage);
        }

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [isOpen, onPayment, onError]);

    const buildPaymentUrl = () => {
        const total = amount; // Assumption: Amount is already in USD, API needs it in USD not Cents for this specific Box URL? 
        // WAIT: The provided snippet used `amount.toString()`. 
        // Current SDK uses CENTS for `/api/links`. 
        // The snippet `https://pay.payphonetodoesposible.com/payment` might expect standard units or cents?
        // Analyzing snippet: `amount: this.config.amount.toString()`. User did not specify units.
        // Usually Payphone Box (iframe) also uses Cents. Let's start with CENTS to be safe or check if we can verify.
        // Re-reading user request: "internamente lo pase entero * 100".
        // SO I WILL USE CENTS.
        
        const params = new URLSearchParams();
        params.append('token', token);
        params.append('clientTransactionId', transactionId || generateId());
        params.append('amount', toCents(total).toString());
        
        if (amountZeroIva) params.append('amountWithoutTax', toCents(amountZeroIva).toString());
        if (amountTaxable) params.append('amountWithTax', toCents(amountTaxable).toString());
        if (taxValue) params.append('tax', toCents(taxValue).toString());
        if (serviceValue) params.append('service', toCents(serviceValue).toString());
        if (tipValue) params.append('tip', toCents(tipValue).toString());
        
        params.append('currency', currency);
        params.append('storeId', storeId);
        if (reference) params.append('reference', reference);
        params.append('lang', lang);
        
        if (phoneNumber) params.append('phoneNumber', phoneNumber);
        if (email) params.append('email', email);
        if (documentId) params.append('documentId', documentId);
        if (extraData) params.append('optionalParameter', extraData);

        // defaultMethod: 'card'
        // identificationType: 1
        
        return `https://pay.payphonetodoesposible.com/payment?${params.toString()}`;
    };

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const defaultClass = "payphone-btn";
    const finalClass = className ? `${defaultClass} ${className}` : defaultClass;
    
    // Inject overlay styles dynamically or use inline
    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const modalStyle: React.CSSProperties = {
        background: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 9999,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column'
    };

    return (
        <>
            <button 
                className={finalClass} 
                style={{ ...style, backgroundColor: backgroundColor }} 
                onClick={handleOpen}
                type="button"
            >
                {label || t.payButton}
            </button>

            {isOpen && (
                <div style={overlayStyle} onClick={handleClose}>
                    <div style={modalStyle} onClick={e => e.stopPropagation()}>
                        <button 
                            onClick={handleClose}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#666',
                                zIndex: 10001
                            }}
                        >
                            ×
                        </button>
                        <iframe 
                            src={buildPaymentUrl()} 
                            style={{
                                width: '100%',
                                height: '600px',
                                border: 'none'
                            }}
                            title="Payphone Payment"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
