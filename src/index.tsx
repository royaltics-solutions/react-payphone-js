import * as React from 'react'
import "./styles.module.css";
import Http from "./lib/Http";
import { Base64 } from "js-base64";
import { CreditCardIcon, PlayCircleIcon } from "@heroicons/react/24/solid";

const config = {
    apiHost: Base64.decode("aHR0cHM6Ly9wYXkucGF5cGhvbmV0b2RvZXNwb3NpYmxlLmNvbS9hcGk=")
}


export interface ReadyProps {
    payWithPayPhone: string, payWithCard: string, isReady: boolean
}

export interface PayphoneButtonProps {
    reference: string,
    order: SimpleOrderProps,
    onApprove?: (data: any, amount: number | string) => void,
    onReady?: (data: ReadyProps) => void,
    onError?: (err: any) => void,
    createOrder?: (context: any) => any,
    className?: string,
    options: PayphoneButtonOptions,
}


export interface SimpleOrderProps {
    transactionId?: string,
    amount: number,
    amountWithoutTax?: number,
    amountWithTax?: number,
    tax?: number,
    service?: number,
    currency?: 'USD',
    phoneNumber?: string,
    email?: string,
    documentId?: string,
}

export interface PayphoneButtonOptions {
    token: string,
    disableCard?: boolean,
    debug?: boolean,
    responseUrl: string,
    cancellationUrl?: string,
    popup?: boolean,
}

export interface PayphoneButtonState {
    isReady?: boolean,
    payWithPayPhone?: string,
    payWithCard?: string,
    transaction_id?: number,
    clientTransactionId?: string | null,
}

export interface Order {
    address1: string,
    address2: string,
    country: 'ECUADOR' | string,
    state: string,
    locality: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    postalCode: number,
    customerId: number
}

export interface OrderDetails {
    productName: string,
    productDescription: string
    unitPrice: number,
    quantity: number,
    totalAmount: number,
    taxAmount: number,
    productSKU: string,
}

const PayphoneButton = (props: PayphoneButtonProps) => {

    const [state, setState] = React.useState<PayphoneButtonState>({
        isReady: false,
        payWithPayPhone: "",
        payWithCard: "",
        transaction_id: 0,
    })


    React.useEffect(() => {
        if (typeof window !== "undefined" && window !== undefined) {
            if (props.options.debug) console.log(props);
            //Get Urls form show buttons
            requestPayphoneUrl();

            //Verify Status Transaction Payphone
            if (!props.options.popup) {
                const query = new URL(window.location.href).searchParams;
                getVerifyTranssaction(query, true)
            }
        }
    }, [props.order.amount]);

    const getVerifyTranssaction = (query: URLSearchParams, onMount?: boolean) => {
        if (props.options.debug) console.log("Consultando, estado de transaccion", query, "clientTransactionId", query.get("clientTransactionId"), "id", query.get("id"))

        if (query && query.get("clientTransactionId") != null) {

            setState({
                transaction_id: parseInt(query.get("id") ?? "0"),
                clientTransactionId: query.get("clientTransactionId"),
            })

            //Get confirm Status 
            Http(config.apiHost + '/button/Confirm', {
                id: query.get("id"),
                clientTransactionId: query.get("clientTransactionId")
            }, 'POST', (resp) => {

                if (props.options.debug) console.log(resp);

                //SuccessFul
                if (resp.clientTransactionId) {

                    if (props.onApprove) props.onApprove(resp, resp.amount / 100);

                } else {

                    if (props.onError) props.onError("Ah ocurrido un error " + resp.message)
                }

            }, { Authorization: "Bearer " + props.options?.token, 'Content-Type': 'application/json' }).catch(err => {

                if (props.options.debug) console.log(err);
                if (props.onError) props.onError(err)

            })
        } else if (!onMount) {
            if (props.onError) props.onError("PayphoneButton => Ah ocurrido un error Query retornado Invalido " + query)
        }
    }

    const create = (order: Order, details: OrderDetails[]) => {
        //const { currency, options, amount } = props;
        return {
            billTo: order,
            lineItems: details
        };
    }

    const requestPayphoneUrl = () => {
        const { responseUrl, cancellationUrl } = props.options;
        const { reference, onReady, onError, options, order, createOrder } = props;
        if (order) {
            let fullOrder = undefined;
            const { transactionId, amount, amountWithTax = 0, amountWithoutTax = 0, tax = 0, email } = order;

            //Verificar if desea armar orden completa
            if (createOrder) {
                fullOrder = createOrder(create);

            }

            Http(config.apiHost + '/button/Prepare', {
                amount: (amount * 100).toFixed(0),
                amountWithoutTax: (amountWithoutTax * 100).toFixed(0),
                amountWithTax: (amountWithTax * 100).toFixed(0),
                tax: (tax * 100).toFixed(0),
                clientTransactionId: transactionId || Base64.encode(new Date().getTime().toString()),
                reference: reference,
                responseUrl: responseUrl,
                cancellationUrl: cancellationUrl,
                email: email,
                order: fullOrder
            }, 'POST', (resp) => {

                if (options.debug) console.log(resp);

                if (resp.paymentId) {
                    if (onReady) {
                        onReady({
                            payWithPayPhone: resp.payWithPayPhone,
                            payWithCard: resp.payWithCard,
                            isReady: true,
                        });
                    }
                    setState({
                        payWithPayPhone: resp.payWithPayPhone,
                        payWithCard: resp.payWithCard,
                        isReady: true
                    })

                } else {
                    if (onError) onError(resp.message + ": " + resp.errors[0].errorDescriptions[0])
                }

            }, { Authorization: "Bearer " + options?.token, 'Content-Type': 'application/json' }).catch(err => {
                if (options.debug) console.log(err);
                if (onError) onError(err)
            })
        } else {
            if (onError) onError("No se ha recibido el attributo order={}")
        }
    }

    const openWindowPayphone = (url: string) => {
        const { popup, debug, responseUrl, } = props.options;

        if (popup) {

            if (debug) console.log("Open popup Windows for ", url);

            const win = window.open(url, "socialPopupWindow", `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0`);
            if (win) {

                win.focus();

                var timerPayphone = setInterval(function () {
                    try {
                        if (win.location.search?.includes("clientTransactionId=")) {
                            win.close();
                            clearInterval(timerPayphone);
                            const searchParams = new URLSearchParams(win.location.search);
                            getVerifyTranssaction(searchParams);
                        } else if (win.location.href?.includes(responseUrl)) {
                            win.close();
                            clearInterval(timerPayphone);
                            if (debug) console.log(win.location.href, "Error no se ha recibido clientTransactionId en el query");
                            if (props.onError) props.onError("Error no se ha recibido clientTransactionId en el query");
                        }
                    } catch (err) {
                        if (debug) console.log(err);
                    }
                }, 1000);



            }
        } else {
            window.location.href = url;
        }

    }


    const { isReady } = state;

    if (!isReady || typeof window === "undefined") {
        return null;
    }

    const Button = ({ link, caption, id, children, title }: any) => {
        return (
            <button id={id} onClick={() => openWindowPayphone(link)} title={title} disabled={props.options.disableCard}>
                {children}
                <span>{caption}</span>
            </button>
        )
    }


    return state.isReady ?
        <div className={"payphone-btns " + (props.className ?? "")}>
            <div>
                <Button id="btn-credit-card" link={state.payWithCard} caption="PAGAR CON TARJETA DE CREDITO" title="Pagar con T/C">
                    <CreditCardIcon />
                </Button>
                <Button id="btn-payphone-balance" link={state.payWithPayPhone} caption="PAGAR CON SALDO PAYPHONE" title="Pagar con Saldo Payphone">
                    <PlayCircleIcon />
                </Button>
            </div>
        </div> : <div></div>

}

export default PayphoneButton;