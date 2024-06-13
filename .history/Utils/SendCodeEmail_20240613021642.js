const { Resend } = require("resend");

// const resend = new Resend("re_bbkY3uM3_HnuzJV3eb8w4YpeWV5i37H4k");

// resend.apiKeys.list();
// const sendCode = async (options) => {
//   const { data, error } = await resend.emails.send({
//     from: "Educational Platform <onboarding@resend.dev>",
//     to: options.email,
//     subject: options.subject,
//     html: `<strong>Hi ${options.email}</strong><h5>We Recevid A Request To Rest Password On Your Educational Platform Account</h5> <h3>${options.digitCode} <strong>Please Enter This Code</strong></h3>  <h6>Thanks Dear</h6>`,
//   });

//   if (error) {
//     return console.log(`The Error is ${error}`);
//   }
// };
function sendCode(toEmail) {
  const randomCode = generateRandomCode();

  const mailOptions = {
    from: 'your-email@gmail.com',      // استبدل هذا بالبريد الإلكتروني الخاص بك
    to: toEmail,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${randomCode}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error sending email:', error);
    }
    console.log('Email sent: ' + info.response);
  });
}
module.exports = sendCode;
