const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// sgMail.send({
//   to: 'zhitnikr@gmail.com',
//   from: 'zhitnikr@gmail.com',
//   subject: 'Buy proper stamps',
//   text: 'And an envelope'
// })

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'zhitnikr@gmail.com',
    subject: 'Welcome',
    text: `Another welcome to ${name}`
  })
}

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'zhitnikr@gmail.com',
    subject: 'Goodbye',
    text: `Sad to see ${name} go!`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
}