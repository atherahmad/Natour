import nodemailer from "nodemailer"

// install package nodemailer
// we need a transporter, the options, and send function
// log in to "mailtrap.io" for testing sending emails. When we hit the route ".../forgotPassword" we can se the email which we send on "mailtrap.io"
const sendEmail = async options => {

    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        // service: "Gmail",
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user:process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        // Activate in gmail "less secure app" option
    })

    // 2) Define the email options --> 
    const mailOptions = {
        from: "Jonas Schmedtmann <test@hotmail.de>",
        to: options.email,
        subject: options.subject,
        text: options.message
        //html:
    }

    // 3) Actually send the email
    await transporter.sendMail(mailOptions) // sendMail is a build in method of the package nodemailer. As parameter it takes the mailOptions (info for the email you want to send)
}


export default sendEmail