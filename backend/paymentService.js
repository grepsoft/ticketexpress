const braintree = require("braintree");

class PaymentService {
  constructor(config) {
    this.gateway = new braintree.BraintreeGateway({
      environment: braintree.Environment.Sandbox,
      merchantId: config.braintree.merchantid,
      publicKey: config.braintree.publickey,
      privateKey: config.braintree.privatekey,
    });
    
  }

  /**
   * Perform a sale transaction
   * @param {Object} param0
   * @returns Promise
   */
  sale({ amount, nonce }) {
    
    return this.gateway.transaction.sale({
      amount: `${amount}`,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });
  }
}

module.exports = PaymentService;
