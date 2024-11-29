const express = require("express");
const dotenv = require("dotenv");
const ParseServer = require("parse-server").ParseServer;
const ParseDashboard = require("parse-dashboard");
const bodyParser = require("body-parser");
const cors = require("cors")
const conn = require("./db");
const cloudinary = require("cloudinary");

const fs = require("fs");
const https = require("https");
const path = require("path");

const authAdmin = require("./routes/admin.route")
const resetPassRoute = require('./routes/resetPass.route');
const userRoute = require('./routes/user.route')
const organizationRoute = require('./routes/organization')
const contactusRoute = require('./routes/contactus.route')
const galleryRoute = require('./routes/gallery.route')
const servicesRoute = require('./routes/services.route')
const employeeRoute = require('./routes/employee.route')
const patientRoute = require('./routes/patient.route')
const prenatalRoute = require('./routes/prenatal.route')
const immunizationRoute = require('./routes/immunization.route')
const csrfProtection = require("./middleware/middleware");



const app = express();
dotenv.config();

const options = {
    key: fs.readFileSync("private.key"),
    cert: fs.readFileSync("certificate.crt"),
};

const port = process.env.PORT


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    origin: 'https://barangay-management-system.netlify.app',
}))

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


const api = new ParseServer({
    databaseURI: process.env.MONGODB_URI,
    appId: "app_barangaysystem_xmP5S0OBWpQPtloue4Zr7bz15Yo7BPjg",
    masterKey: '1234',
    serverURL: `https://54.79.236.189/parse`,
    appName: "Barangay-system",
    cloud: './cloud/main.js'
})

const dashboardConfig = new ParseDashboard({
    apps: [
        {
            appId: "app_barangaysystem_xmP5S0OBWpQPtloue4Zr7bz15Yo7BPjg",
            masterKey: '1234',
            serverURL: `https://54.79.236.189/parse`,
            appName: "Barangay-system",
        }
    ]
})
api.start();

app.use("/parse", api.app);
app.use("/dashboard", dashboardConfig)
app.use('/api/admin', authAdmin)
app.use('/api/resetpass', resetPassRoute)
app.use('/api/user', userRoute)
app.use('/api/organization', organizationRoute)
app.use('/api/contactus', contactusRoute)
app.use('/api/gallery', galleryRoute)
app.use('/api/services', servicesRoute)
app.use('/api/employee', employeeRoute)
app.use('/api/patient', patientRoute)
app.use('/api/prenatal', prenatalRoute)
app.use('/api/immunization', immunizationRoute)

app.get('/', (req, res) => {
    res.send("Hello world!!")
})

// app.get('/.well-known/pki-validation/7DD9A6E8AEFE9FB7AA972A8716CA976C.txt', (req, res) => {
//     res.sendFile('/home/ubuntu/backend-BMS/7DD9A6E8AEFE9FB7AA972A8716CA976C.txt')
// })


const server = https.createServer(options, app);
server.listen(443, () => console.log('Server running on port 443'));
