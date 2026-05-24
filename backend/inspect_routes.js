const paymentRoutes = require('./routes/payment');
console.log('Payment router keys:', Object.keys(paymentRoutes));
// If exported as router, show stack
if (paymentRoutes && paymentRoutes.stack) {
  console.log('Routes:');
  paymentRoutes.stack.forEach((r) => console.log(r.route ? r.route.path : r));
} else {
  console.log('Exported value:', paymentRoutes);
}
