import * as React from 'react';
import { PayphoneProps } from '../types';
import { usePayphone } from '../hooks/usePayphone';
import { injectStyles } from '../utils/styles';
import { getTranslation, Language } from '../i18n';

interface ButtonProps extends PayphoneProps {
    lang?: Language;
    label?: string;
    showIcon?: boolean;
}

export const PayphoneButton: React.FC<ButtonProps> = (props) => {
    const { 
        className, 
        style, 
        label, 
        lang = 'es', 
        showIcon = true,
        ...payphoneProps 
    } = props;

    const { pay, isLoading, error } = usePayphone(payphoneProps);
    const t = getTranslation(lang);

    React.useEffect(() => {
        injectStyles();
    }, []);

    const handleClick = () => {
        pay();
    };

    const defaultClass = "payphone-btn";
    const finalClass = className ? `${defaultClass} ${className}` : defaultClass;

    return (
        <button 
            className={finalClass} 
            style={style} 
            onClick={handleClick}
            disabled={isLoading}
            type="button"
        >
            {showIcon && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
            )}
            {isLoading ? t.loading : (label || t.payButton)}
            {error && <span style={{ display: 'none' }} title={error} data-testid="error-msg"></span>}
        </button>
    );
};

export default PayphoneButton;
