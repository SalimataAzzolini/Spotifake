import nodemailer from "nodemailer";
const mailObject = "[NO_REPLY]Spotifake";

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: String(process.env.EMAIL),
        pass: String(process.env.EMAIL_PASS)
    }
});

const sendValidationMail = async (email: string, name: string, token: string) => {

    const mailOptions = {
        from: {
            name: "Spotifake",
            address: String(process.env.EMAIL),
        },
        to: email,
        subject: mailObject,
        html: `
                <div>
                    <p>Bonjour M/Mme ${name}</p>
                    <br/>
                    <p>Vous venez de vous inscrire sur SpotiFake, bienvenue à vous.</p>
                    <p>Merci de cliquer sur ce lien pour valider votre compte :</p>
                    <br/>
                    <a href="${String(process.env.FRONT_URL)}/validate?token=${token}">Valider le compte</a>
                    <div><i>L'équipe Spotifake.</i></div>
                </div>
            `,
    };

    // Trying to send mail
    try {
        await transporter.sendMail(mailOptions);
        console.log("mail success");
        return "Email sent";
    } catch (err) {
        console.log(err);
        return "Error on mail sending";
    }
};

export { sendValidationMail };
