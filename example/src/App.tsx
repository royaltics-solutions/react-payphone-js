import { useState } from 'react';
import { PayphoneButton, PayphoneButtonBox } from 'react-payphone-js';
import './App.css';

function App() {
  const [response, setResponse] = useState<any>(null);

  const handleCompletion = (status: any) => {
    console.log('Payment status:', status);
    setResponse(status);
  };

  return (
    <div className="container">
      <h1>React Payphone JS Demo</h1>
      
      <div className="card">
        <h2>Example Product</h2>
        <p className="price">$11.20</p>
        <div className="details">
          <p>Subtotal: $10.00</p>
          <p>VAT (12%): $1.20</p>
        </div>

        <div className="payment-section">
          <PayphoneButton
            token="QsaUa3ldOsmW_vbPHLyRwS6s54Wg1NWNRYcK8TlxIytxdLRJjAD1WBDtRdRHcNBJRoNmAy7FBq9JtGxHq3wyBqz60KVLjH4VSHjSVnDowPWN4Xt1gCG8B6urdF6SaJxazVo0EGSeFa7FdXuuf9xOeXETXXc7XI8UCS2tgvX3Ln67dDDCej1K3qPimBrJjSvRt0RYK6s0GjMsiRdOOIR9GrFOasfkFIQjSszP8GVvsKalCL-AzKyHqu6WBQfdBgymDxSuysx7pP6FPryv0qLrCcmI9Rtgj3qXQNoS1BpttedlPZxkw8BBQCaI4n7WL4Dwk8suyw"
            storeId="d69d3dc7-ff54-496f-b2f4-e24686c9093b"
            //121651
            popup
            amount={11.20}
            amountTaxable={10.00}
            taxValue={1.20}
            currency="USD"
            reference="Demo Payment"

            responseUrl="http://localhost/response"
            onPreparated={(res) => console.log('Links created:', res)}
            onPayment={(res) => console.log('Payment created:', res)}
            onConfirm={handleCompletion}
            onError={(err) => console.error('Error:', err)}
          />
        </div>

         <div className="payment-section" style={{ marginTop: '20px' }}>
          <PayphoneButtonBox
            token="QsaUa3ldOsmW_vbPHLyRwS6s54Wg1NWNRYcK8TlxIytxdLRJjAD1WBDtRdRHcNBJRoNmAy7FBq9JtGxHq3wyBqz60KVLjH4VSHjSVnDowPWN4Xt1gCG8B6urdF6SaJxazVo0EGSeFa7FdXuuf9xOeXETXXc7XI8UCS2tgvX3Ln67dDDCej1K3qPimBrJjSvRt0RYK6s0GjMsiRdOOIR9GrFOasfkFIQjSszP8GVvsKalCL-AzKyHqu6WBQfdBgymDxSuysx7pP6FPryv0qLrCcmI9Rtgj3qXQNoS1BpttedlPZxkw8BBQCaI4n7WL4Dwk8suyw"
            storeId="d69d3dc7-ff54-496f-b2f4-e24686c9093b"
            //121651
            popup
            amount={11.20}
            amountTaxable={10.00}
            taxValue={1.20}
            currency="USD"
            reference="Demo Payment"

            responseUrl="http://localhost/response"
            onPreparated={(res) => console.log('Links created:', res)}
            onPayment={(res) => console.log('Payment created:', res)}
            onConfirm={handleCompletion}
            onError={(err) => console.error('Error:', err)}
          />
        </div>


        {response && (
          <div className="response">
            <h3>Response:</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>

      <p className="read-the-docs">
        Check the console for payment events.
      </p>
    </div>
  );
}

export default App;
