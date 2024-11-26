const express = require("express");
const dotenv = require("dotenv");
const ParseServer = require("parse-server").ParseServer;
const ParseDashboard = require("parse-dashboard");
const bodyParser = require("body-parser");
const cors = require("cors")
const conn = require("./db");
const cloudinary = require("cloudinary");

const authAdmin = require("./routes/admin.route")
const resetPassRoute = require('./routes/resetPass.route');
const userRoute = require('./routes/user.route')
const organizationRoute = require('./routes/organization')
const contactusRoute = require('./routes/contactus.route')
const galleryRoute = require('./routes/gallery.route')
const servicesRoute = require('./routes/services.route')
const employeeRoute = require('./routes/employee.route')

const csrfProtection = require("./middleware/middleware");



const app = express();
dotenv.config();

const port = process.env.PORT


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    origin: 'http://localhost:5173'
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
    serverURL: `http://localhost:${port}/parse`,
    appName: "Barangay-system",
    cloud: './cloud/main.js'
})

const dashboardConfig = new ParseDashboard({
    apps: [
        {
            appId: "app_barangaysystem_xmP5S0OBWpQPtloue4Zr7bz15Yo7BPjg",
            masterKey: '1234',
            serverURL: `http://localhost:${port}/parse`,
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

app.get('/', (req, res) => {
    res.send("Hello world!!")
})

app.listen(80, () => {
    conn();
    console.log("server listening to port: 80")
});