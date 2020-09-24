const http = require("http");
const path = require("path");
const hostname = "127.0.0.1";
const port = 3000;


const fileUpload = require("express-fileupload");
const morgan = require("morgan");

const helmet = require("helmet");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const cookieParser = require("cookie-parser");

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
        secret: "super cool",
        resave: false,
        saveUninitialized: true,
        is_logged_in: false 
    })
);

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
//const bulma

// Use Controllers
app.use("/uploads", uploadController);
app.use("/users", usersController);
app.use("/", indexController);

