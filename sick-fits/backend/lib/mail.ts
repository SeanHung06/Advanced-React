import { createTransport, getTestMessageUrl } from 'nodemailer'; 




const transport = createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function makeANiceEmail(text: string): string {
  return `
        <div style="
            border: 1px solid black;
            padding: 20px;
            font-familty: sans-serif;
            line-height: 2;
            font-size: 20px;
        ">
           <h2>Hello There!</h2>
           <p>${text}</p>
           <p>From Sean</p>
        </div>
    
    `;
}


export interface MailResponse {
  accepted?: (string)[] | null;
  rejected?: (null)[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}
export interface Envelope {
  from: string;
  to?: (string)[] | null;
}

export async function sendPasswordResetEmail(resetToken: string, to: string) : Promise<void> {
  // email User the Token

  const info = (await transport.sendMail({
    to,
    from: 'Sean@123456789',
    subject: 'Password reset token!',
    html: makeANiceEmail(`Your Password Reset Token is here
        <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}"
        > Click Here to reset</a>        
        `),
  })) as MailResponse;

  if(process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`💌 Message Sent!  Preview it at ${getTestMessageUrl(info)}`);

  }
}
