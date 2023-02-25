import * as React from 'react'
import "./styles.module.css";
import Http from "./lib/Http";
import { Base64 } from "js-base64";
import { CreditCardIcon, PlayCircleIcon } from "@heroicons/react/24/solid";


export interface PayphoneButtonProps {
    reference: string,
    order: SimpleOrderProps,
    onApprove?: Function,
    onSuccess?: Function,
    onReady?: Function,
    catchError?: Function,
    onError?: Function,
    createOrder?: Function,
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
}

export interface PayphoneButtonState {
    isReady: boolean,
    payWithPayPhone: string,
    payWithCard: string,
    transaction_id: number,
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

class PayphoneButton extends React.Component<PayphoneButtonProps, PayphoneButtonState> {


    static defaultProps = {
        style: {},
        options: {
            currency: "USD"
        },
    }

    constructor(props: PayphoneButtonProps) {
        super(props);

        this.state = {
            isReady: false,
            payWithPayPhone: "",
            payWithCard: "",
            transaction_id: 0,
        };
    }

    componentDidMount() {
        if (typeof window !== "undefined" && window !== undefined) {
            this.sendRequestPayphone();
            //Verify Status Transaction Payphone
            const query = new URL(window.location.href).searchParams;
            if (query && query.get("clientTransactionId") != null) {
                this.setState({
                    transaction_id: parseInt(query.get("id") ?? "0"),
                    clientTransactionId: query.get("clientTransactionId"),
                })
                Http('https://pay.payphonetodoesposible.com/api/button/Confirm', {
                    id: query.get("id"),
                    clientTransactionId: query.get("clientTransactionId")
                }, 'POST', (resp) => {
                    if (resp.clientTransactionId) {
                        const total = resp.amount / 100;
                        if (this.props.onApprove) this.props.onApprove(resp, total);
                    } else {
                        console.log(resp);
                        if (this.props.onError) this.props.onError("Ah ocurrido un error " + resp.message)
                    }

                }, { Authorization: "Bearer " + this.props.options?.token, 'Content-Type': 'application/json' }).catch(err => {
                    if (this.props.onError) this.props.onError(err)
                })
            }
        }


    }

    create(order: Order, details: OrderDetails[]) {
        //const { currency, options, amount } = this.props;
        return {
            billTo: order,
            lineItems: details
        };
    }

    sendRequestPayphone() {
        const { responseUrl, cancellationUrl } = this.props.options;
        const { reference, onReady, onError, options, order, createOrder } = this.props;
        if (order) {
            let fullOrder = undefined;
            const { transactionId, amount, amountWithTax = 0, amountWithoutTax = 0, tax = 0, email } = order;

            //Verificar if desea armar orden completa
            if(createOrder){
                fullOrder = createOrder(this);
            }

            Http('https://pay.payphonetodoesposible.com/api/button/Prepare', {
                amount: Math.ceil(amount * 100),
                amountWithoutTax: Math.ceil(amountWithoutTax * 100),
                amountWithTax: Math.ceil(amountWithTax * 100),
                tax: Math.floor(tax * 100),
                clientTransactionId: transactionId || Base64.encode(new Date().getTime().toString()),
                reference: reference,
                responseUrl: responseUrl,
                cancellationUrl: cancellationUrl,
                email: email,
                order: fullOrder
            }, 'POST', (resp) => {
                console.log(resp);
                if (resp.paymentId) {
                    if (onReady) {
                        onReady({
                            payWithPayPhone: resp.payWithPayPhone,
                            payWithCard: resp.payWithCard,
                            isReady: true,
                        });
                    }
                    this.setState({
                        payWithPayPhone: resp.payWithPayPhone,
                        payWithCard: resp.payWithCard,
                        isReady: true
                    })

                } else {
                    if (onError) onError(resp.message + ": " + resp.errors[0].errorDescriptions[0])
                }

            }, { Authorization: "Bearer " + options?.token, 'Content-Type': 'application/json' }).catch(err => {
                if (onError) onError(err)
            })
        } else {
            if (onError) onError("No se ha recibido el attributo order={}")
        }
    }

    openWindowPayphone(url: string) {
        window.location.href = url;
    }


    render() {

        const { isReady } = this.state;

        if (!isReady || typeof window === "undefined") {
            return null;
        }

        const Button = (props: any) => {
            return (
                <button id={props.id} onClick={() => this.openWindowPayphone(props.link)} title={props.title} disabled={this.props.options.disableCard}>
                    {props.children}
                    <span>{props.caption}</span>
                </button>
            )
        }

        return (
            <div className={"payphone-btns " + this.props.className}>
                <Button id="btn-credit-card" link={this.state.payWithCard} caption="PAGAR CON TARJETA DE CREDITO" title="Pagar con T/C">
                    <CreditCardIcon />
                </Button>
                <Button id="btn-payphone-balance" link={this.state.payWithPayPhone} caption="PAGAR CON SALDO PAYPHONE" title="Pagar con Saldo">
                    <PlayCircleIcon />
                </Button>
            </div>
        );
    }

}

export { PayphoneButton };