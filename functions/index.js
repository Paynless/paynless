"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const logging = require("@google-cloud/logging")();

admin.initializeApp(functions.config().firebase);

const stripe = require("stripe")(functions.config().stripe.token);

const currency = functions.config().stripe.currency || "USD";

// // [START chargecustomer]
// exports.createStripeCharge = functions.firestore
//   .ref("/users/{userId}/payments/{paymentId}")
//   .onWrite(event => {
//     const payment = event.data.data();
//     const userId = event.params.userId;
//     const paymentId = event.params.paymentId;

//     // checks if payment exists or if it has already been charged
//     if (!payment || payment.charge) return;

//     // Look up the Stripe customer id written in createStripeCustomer
//     return admin
//       .firestore()
//       .doc(`/users/${userId}`)
//       .get()
//       .then(snapshot => {
//         return snapshot;
//       })
//       .then(customer => {
//         // amount must be in cents
//         const amount = payment.price * 100;
//         const idempotency_key = paymentId;
//         // prevent duplicate charges
//         const soure = payment.token.id;
//         const currency = "usd";
//         const description = "Paynless test desc...";
//         const charge = { amount, currency, source };

//         return stripe.charges.create(charge, { idempotency_key });
//       })
//       .then(charge => {
//         // If the result is successful, write it back to the database
//         admin
//           .firestore()
//           .doc(`/users/${userId}/payments/${paymentId}`)
//           .set(
//             {
//               charge: charge
//             },
//             {
//               merge: true
//             }
//           );
//       })
//       .catch(err => console.error(err));
//     // .catch(error => {
//     //   // We want to capture errors and render them in a user-friendly way, while
//     //   // still logging an exception with Stackdriver
//     //   return event.data.adminRef.child("error").set(userFacingMessage(error));
//     // })
//     // .then(() => {
//     //   return reportError(error, { user: event.params.userId });
//     // });
//   });
// // [END chargecustomer]]

// When a user is created, register them with Stripe
exports.createStripeCustomer = functions.firestore
  .document("users/{userId}")
  .onCreate(event => {
    const data = event.data.data();
    console.log("data in createStripeCustomer", data);
    return stripe.customers
      .create({
        email: data.email
      })
      .then(customer => {
        return admin
          .firestore()
          .doc(`/users/${data.uid}/stripeCollection/customer_id`)
          .set(customer.id);
      })
      .catch(err => console.log(err));
  });

// // Add a payment source (card) for a user by writing a stripe payment source token to Realtime database
// exports.addPaymentSource = functions.database
//   .ref("/users/{userId}/sources/{pushId}/token")
//   .onWrite(event => {
//     const source = event.data.val();
//     if (source === null) return null;
//     return admin
//       .database()
//       .ref(`/users/${event.params.userId}/customer_id`)
//       .once("value")
//       .then(snapshot => {
//         return snapshot.val();
//       })
//       .then(customer => {
//         return stripe.customers.createSource(customer, { source });
//       })
//       .then(
//         response => {
//           return event.data.adminRef.parent.set(response);
//         },
//         error => {
//           return event.data.adminRef.parent
//             .child("error")
//             .set(userFacingMessage(error));
//         }
//       )
//       .then(() => {
//         return reportError(error, { user: event.params.userId });
//       });
//   });

// // When a user deletes their account, clean up after them
// exports.cleanupUser = functions.auth.user().onDelete(event => {
//   return admin
//     .database()
//     .ref(`/users/${event.data.uid}`)
//     .once("value")
//     .then(snapshot => {
//       return snapshot.val();
//     })
//     .then(customer => {
//       return stripe.customers.del(customer.customer_id);
//     })
//     .then(() => {
//       return admin
//         .database()
//         .ref(`/users/${event.data.uid}`)
//         .remove();
//     });
// });

// // To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// // than simply relying on console.error. This will calculate users affected + send you email
// // alerts, if you've opted into receiving them.
// // [START reporterror]
// function reportError(err, context = {}) {
//   // This is the name of the StackDriver log stream that will receive the log
//   // entry. This name can be any valid log stream name, but must contain "err"
//   // in order for the error to be picked up by StackDriver Error Reporting.
//   const logName = "errors";
//   const log = logging.log(logName);

//   // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
//   const metadata = {
//     resource: {
//       type: "cloud_function",
//       labels: { function_name: process.env.FUNCTION_NAME }
//     }
//   };

//   // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
//   const errorEvent = {
//     message: err.stack,
//     serviceContext: {
//       service: process.env.FUNCTION_NAME,
//       resourceType: "cloud_function"
//     },
//     context: context
//   };

//   // Write the error log entry
//   return new Promise((resolve, reject) => {
//     log.write(log.entry(metadata, errorEvent), error => {
//       if (error) {
//         reject(error);
//       }
//       resolve();
//     });
//   });
// }
// // [END reporterror]

// // Sanitize the error message for the user
// function userFacingMessage(error) {
//   return error.type
//     ? error.message
//     : "An error occurred, developers have been alerted";
// }

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
