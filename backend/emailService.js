const sgMail = require("@sendgrid/mail");

class EmailService {

    constructor(config) {
        this.sg = sgMail.setApiKey(
            config.sg.apikey
        );
    }

    sendMail({to,bodytext, bodyhtml}) {
        const msg = {
            to: to, 
            from: 'info@grepsoft.com', 
            subject: 'Confirmation: Ticket express',
            text: bodytext,
            html: bodyhtml,
          }

          return this.sg.send(msg);
    }
}

module.exports = EmailService;