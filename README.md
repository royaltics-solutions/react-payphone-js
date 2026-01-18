# react-payphone-js

> A Button react.js for payphone checkout

[![NPM](https://img.shields.io/npm/v/react-payphone-js.svg)](https://www.npmjs.com/package/react-payphone-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-payphone-js
```

## Usage

```tsx
import React from 'react';
import { PayphoneButton, PayphoneButtonBox } from 'react-payphone-js';

const App = () => {

  const handleConfirm = (response: any) => {
    console.log('Payment confirmed:', response);
  };

  const handleError = (error: any) => {
    console.error('Payment error:', error);
  };

  return (
    <div>
      <h1>Payphone Integration</h1>
      
      {/* Standard Button (Redirect or Popup) */}
      <PayphoneButton
        token="YOUR_TOKEN_HERE"
        storeId="YOUR_STORE_ID"
        amount={10.00}
        amountTaxable={9.00}
        taxValue={1.00}
        currency="USD"
        reference="Payment Reference"
        responseUrl="http://your-site.com/response"
        popup={true}
        autoConfirm={true}
        onPreparated={(links) => console.log('Links generated', links)}
        onPayment={(order) => console.log('Payment started', order)}
        onConfirm={handleConfirm}
        onError={handleError}
      />

       {/* Custom Box Button (Embed) */}
       <PayphoneButtonBox
        token="YOUR_TOKEN_HERE"
        storeId="YOUR_STORE_ID"
        amount={10.00}
        reference="Box Payment"
        onPayment={(data) => console.log('Box message:', data)}
        onError={handleError}
      />
    </div>
  );
};

export default App;
```

## Props

| Prop | Type | Description |
|Obs |------|-------------|
| `token` | `string` | Your Payphone API Token |
| `storeId` | `string` | Your Payphone Store ID |
| `amount` | `number` | Total amount to charge (in USD/decimals) |
| `amountTaxable` | `number` | Taxable base amount |
| `taxValue` | `number` | Tax amount |
| `currency` | `string` | Currency code (default "USD") |
| `reference` | `string` | Payment reference |
| `popup` | `boolean` | If true, opens in a popup window (default false) |
| `autoConfirm` | `boolean` | If true, automatically verifies transaction status on completion (default true) |
| `responseUrl` | `string` | URL to redirect after payment |
| `onPreparated` | `(response) => void` | Called when payment links are ready |
| `onPayment` | `(response) => void` | Called when payment process initiates |
| `onConfirm` | `(response) => void` | Called when payment is confirmed (success) |
| `onError` | `(error) => void` | Called on failure |

## License

MIT © [royaltics-solutions](https://github.com/royaltics-solutions)
