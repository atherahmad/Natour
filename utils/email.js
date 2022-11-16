import nodemailer from "nodemailer"
import pug from "pug"
import htmlToText from "html-to-text"
import path from "path"

const __dirname = path.resolve()


// new Email(user, url).sendWelcome()
// we create an Email class with which we can produce email Objects with belows data (property value pairs).
export class Email {
    constructor(user, url) {
        this.to = user.email
        this.firstName = user.name.split(" ")[0]
        this.url = url
        this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`
    }

    // we CREATE different TRANSPORTS for development and production
    newTransport() {
        if (process.env.NODE_ENV === "production") {
            // Sendgrid
            return 1
        }

        // it will return a nodemailer transport like below (email template) when we are
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user:process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }
    // SEND the actual EMAIL
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/views/email/${template}.pug`, { // here we are creating the connection to our pug file and define locals for pug (firstName, url, subject). Here we create the html.
            firstName: this.firstName,
            url: this.url,
            subject
        })

        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.htmlToText(html)
        }

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions)
    }

    async sendWelcome() {
        await this.send("welcome", "Welcome to the Natours Family!") // this.send("pugTemplate for email", "subject for email")
    }
}

// install package nodemailer
// we need a transporter, the options, and send function
// log in to "mailtrap.io" for testing sending emails. When we hit the route ".../forgotPassword" we can se the email which we send on "mailtrap.io"
// const sendEmail = async options => {


//     // 3) Actually send the email
//     await transporter.sendMail(mailOptions) // sendMail is a build in method of the package nodemailer. As parameter it takes the mailOptions (info for the email you want to send)
// }