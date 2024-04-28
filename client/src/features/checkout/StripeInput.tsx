// import React, { ForwardedRef, forwardRef, useImperativeHandle, useRef } from "react";
// import { CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";

// export const StripeInput = forwardRef(function StripeInput(props, ref) {
//     const stripe = useStripe();
//     const elements = useElements();
//     const elementRef = useRef(null);

//     useImperativeHandle(ref, () => ({
//         focus: () => {
//             if (elementRef.current) {
//                 elementRef.current.focus();
//             }
//         }
//     }));

//     return (
//         <CardNumberElement
//             {...props}
//             options={{
//                 style: {
//                     base: {
//                         fontSize: '16px',
//                         color: '#424770',
//                         '::placeholder': {
//                             color: '#aab7c4',
//                         },
//                     },
//                     invalid: {
//                         color: '#9e2146',
//                     },
//                 },
//             }}
//             onReady={(element) => {
//                 elementRef.current = element;
//             }}
//         />
//     );
// });

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useElements } from "@stripe/react-stripe-js";

interface StripeInputProps {
  elementType: 'cardNumber' | 'cardExpiry' | 'cardCvc'; // Define the elementType prop
}

export const StripeInput = forwardRef(function StripeInput(props: StripeInputProps, ref) {
    const elements = useElements();
    const elementRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            if (elementRef.current) {
                elementRef.current.focus();
            }
        }
    }));

    const { elementType, ...otherProps } = props;

    // Determine which Stripe element to render based on the elementType prop
    let stripeElement;
    switch (elementType) {
        case 'cardNumber':
            stripeElement = <CardNumberElement {...otherProps} />;
            break;
        case 'cardExpiry':
            stripeElement = <CardExpiryElement {...otherProps} />;
            break;
        case 'cardCvc':
            stripeElement = <CardCvcElement {...otherProps} />;
            break;
        default:
            stripeElement = null;
    }

    return (
        <>
            {stripeElement && React.cloneElement(stripeElement, {
                options: {
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                },
                onReady: (element) => {
                    elementRef.current = element;
                }
            })}
        </>
    );
});
