const { Resend } = require("resend");

const resend = new Resend("re_Qg2r2eNC_DAjj2rsxujY5AzzQmdHQtcxP");

resend.apiKeys.list();
const sendCode = async (options) => {
  const { data, error } = await resend.emails.send({
    from: "Educational Platform <onboarding@resend.dev>",
    to: options.email,
    subject: options.subject,
    html: `<strong>Hi ${options.email}</strong><h5>We Recevid A Request To Rest Password On Your Educational Platform Account</h5> <h3>${options.digitCode} <strong>Please Enter This Code</strong></h3>  <h6>Thanks Dear</h6>`,
  });
  await redisClient.setEx(options.email, 600, digitCode);
  if (error) {
    return console.log(`The Error is ${error}`);
  }
};
module.exports = sendCode;
