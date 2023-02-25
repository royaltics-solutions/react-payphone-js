import React from 'react'

import { PayphoneButton } from 'react-payphone-js'
import 'react-payphone-js/dist/index.css'

const App = () => {
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

export default App
