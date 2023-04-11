// import React from "react";
// import StripeCheckout from "react-stripe-checkout";

// export default class Stripe extends React.Component {
//   onToken = (token) => {
//     fetch("/save-stripe-token", {
//       method: "POST",
//       body: JSON.stringify(token),
//     }).then((response) => {
//       response.json().then((data) => {
//         alert(`We are in business, ${data.email}`);
//       });
//     });
//   };

//   // ...

//   render() {
//     return (
//       <StripeCheckout
//         amount={100}
//         currency="USD"
//         token={this.onToken}
//         stripeKey="pk_test_51MvOTQLhGAqNc30vaCPHwOYngRS0iERaK2A9QymnF3g6Y0VUDpNBiB5Wveb9Vt62YZ3NyXMWwjonuaKiOBHl4mZQ00gY6bvm8D"
//       />
//     );
//   }
// }
