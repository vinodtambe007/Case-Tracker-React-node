const express = require('express');
const mongoose = require('mongoose');
const caselist_route = require('./routes/caselist_route');
const user_route = require('./routes/user_route')
const cors = require('cors')

const app = express();  

app.use(cors())

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log("HTTP method = " + req.method + " , URL - " + req.url);
    next();
});

// Path
app.use("/api/caselist", caselist_route);
app.use("/api/user", user_route);

mongoose.connect("mongodb+srv://gofood:gofood@cluster0.cpcbi2a.mongodb.net/casetracker?retryWrites=true&w=majority&appName=Cluster0")
.then(() => app.listen(5000))
.then(() => console.log("Connected to MongoDB and listening to port 5000"))
.catch((err) => console.log(err));
