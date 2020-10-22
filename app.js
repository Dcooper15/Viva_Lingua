const http = require("http");
const path = require("path");
const hostname = "127.0.0.1";
const port = 3000;

const multer = require("multer");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");

const helmet = require("helmet");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const cookieParser = require("cookie-parser");
const fs = require("fs");
const logger = morgan("tiny");

const express = require('express');
const es6Renderer = require("express-es6-template-engine");
const app = express();

app.use(logger);
app.use(helmet());
app.engine("html", es6Renderer);
app.set("views", "./views");
app.set("view engine", "html");


app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    session({
        // store: new FileStore(),
        secret: "super cool",
        resave: false,
        saveUninitialized: true,
        is_logged_in: false 
    })
);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'media/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


app.use(fileUpload({

}));



const server = http.createServer(app);



server.listen(port, hostname, () => {
    console.log(`Server Running at http://${hostname}:${port}`)
});

// Controller Creator
const usersController = require("./routes/usersRoute");
const indexController = require("./routes/index");
const uploadController = require("./routes/contentRoute");



// Use Controllers
app.use("/uploads", uploadController);
app.use("/users", usersController);
app.use("/", indexController);




