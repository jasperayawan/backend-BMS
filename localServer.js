const express = require("express");
const dotenv = require("dotenv");
const ParseServer = require("parse-server").ParseServer;
const ParseDashboard = require("parse-dashboard");
const bodyParser = require("body-parser");
const cors = require("cors")
const conn = require("./db");

const authAdmin = require("./routes/admin.route")
const resetPassRoute = require('./routes/resetPass.route')


const app = express();
dotenv.config();

const port = process.env.PORT

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors({
    origin: 'http://localhost:5173'
}))


const api = new ParseServer({
    databaseURI: process.env.MONGODB_URI,
    appId: "123",
    masterKey: '1234',
    serverURL: `http://localhost:${port}/parse`,
    appName: "Barangay-system",
})

const dashboardConfig = new ParseDashboard({
    apps: [
        {
            appId: "123",
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

app.listen(port, () => {
    conn();
    console.log("server listening to port: ", port)
});