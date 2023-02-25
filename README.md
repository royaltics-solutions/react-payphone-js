# react-payphone-js

> A Button react.js for payphone checkout

[![NPM](https://img.shields.io/npm/v/react-payphone-js.svg)](https://www.npmjs.com/package/react-payphone-js) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-payphone-js
```

## Usage

```tsx
import React, { Component } from 'react'

import {PayphoneButton} from 'react-payphone-js'
import 'react-payphone-js/dist/index.css'

class Example extends Component {
  render() {
    return <PayphoneButton reference='React Payphone Plataform'
                        order={{
                          amount: 10,
                          amountWithoutTax: 10,
                          currency: "USD",
                          email: "asdas@gmail.com",
                          documentId: "1",
                          phoneNumber: "+593968452XXX"
                        }}
                        options={{
                          token: "yqweqweqwe......",
                          responseUrl: "http://react-payphone.com/onsuccess",
                          cancellationUrl: undefined,
                          disableCard: false,
                          debug: true
                        }} />
  }
}
```

## License

MIT © [royaltics-solutions](https://github.com/royaltics-solutions)
