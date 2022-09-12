

module.exports = {
    io: null,
    database: {
        db : null,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        client: null,        
    },
    braintree: {
        merchantid: process.env.BT_MERCHANT_ID,
        publickey: process.env.BT_PUBLIC_KEY,
        privatekey: process.env.BT_PRIVATE_KEY
    },
    sg: {
        apikey: process.env.SG_API_KEY
    }
}