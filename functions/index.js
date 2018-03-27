"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const logging = require("@google-cloud/logging")();

admin.initializeApp(functions.config().firebase);

const stripe = require("stripe")(functions.config().stripe.token);
const currency = functions.config().stripe.currency || "USD";

exports.createStripeCharge = functions.firestore
  .document("/Users/{docId}/payments/{paymentId}")
  .onWrite(event => {
    const payment = event.data.data();
    const docId = event.params.docId;
    const paymentId = event.params.paymentId;
    // Checks if payment exists or if it has already been charged
    if (!payment || payment.charge) return;

    // Look up the Stripe customer id
    return (
      admin
        .firestore()
        .collection("Users")
        .doc(docId)
        .get()
        .then(doc => {
          // amount must be in cents
          const amount = payment.price * 100;
          const idempotency_key = paymentId;
          // prevent duplicate charges
          const customer = doc.data().sid;
          const currency = "usd";
          const charge = { amount, currency, customer };
          return stripe.charges.create(charge, { idempotency_key });
        })
        .then(charge => {
          // If the result is successful, write it back to the database
          admin
            .firestore()
            .doc(`/Users/${docId}/payments/${paymentId}`)
            .set({ charge }, { merge: true });
        })
        .catch(err => console.error(err))
    );
  });

// When a user is created, register them with Stripe
exports.createStripeCustomer = functions.firestore
  .document("Users/{userId}")
  .onCreate(event => {
    const data = event.data.data();
    const docId = event.data.id;
    return stripe.customers
      .create({
        email: data.email
      })
      .then(customer => {
        return admin
          .firestore()
          .collection("Users")
          .doc(docId)
          .set({ sid: customer.id }, { merge: true });
      })
      .catch(err => console.log(err));
  });

// Add a payment source (card) for a user by writing a stripe payment source token
// to firestore database
exports.addPaymentSource = functions.firestore
  .document("/Users/{docId}/stripe_source/{tokens}")
  .onWrite(event => {
    const docId = event.params.docId;
    const source = event.data.data().token_id;
    if (source === null) return null;

    return admin
      .firestore()
      .collection("Users")
      .where("id", "==", docId) // .doc(docId) should work but does not here
      .get() // work-around
      .then(snap => {
        snap.forEach(doc =>
          stripe.customers.createSource(doc.data().sid, { source })
        );
      })
      .catch(err => console.error(err));
  });

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

function reportError(err, context = {}) {
  // This is the name of the StackDriver log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain "err"
  // in order for the error to be picked up by StackDriver Error Reporting.
  const logName = "errors";
  const log = logging.log(logName);

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: "cloud_function",
      labels: { function_name: process.env.FUNCTION_NAME }
    }
  };

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: "cloud_function"
    },
    context: context
  };

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), error => {
      if (error) {
        reject(error);
      }
      resolve();
    });
  });
}

// Sanitize the error message for the user
function userFacingMessage(error) {
  return error.type
    ? error.message
    : "An error occurred, developers have been alerted";
}
