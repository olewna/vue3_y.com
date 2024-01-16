const express = require("express");
require("dotenv").config();
const fs = require("fs");
const WebSocket = require("ws");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const user = require("./routes/user.route");
const post = require("./routes/post.route");
const passportRoute = require("./routes/passport.route");
const passport = require("passport");
const passportLocal = require("passport-local");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://localhost:5173");
  // res.header("Access-Control-Allow-Origin", "https://172.19.160.1:5173");
  // res.header("Access-Control-Allow-Origin", "https://172.19.193.51:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(
  cors({
    origin: [
      "https://localhost:5173",
      "https://172.19.160.1:5173",
      "https://172.19.193.51:5173",
    ],
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["X-Requested-With", "content-type"],
    credentials: true,
  })
);
app.use(
  require("express-session")({
    secret: process.env.APP_SECRET || "$sekretny $sekret",
    saveUninitialized: false,
    resave: false,
    expires: 1000 * 60 * 60 * 24 * 30,
    cookie: {
      sameSite: false,
      secure: true,
      httpOnly: true,
    },
  })
);
const userModel = require("./models/user.model");

// HTTPS

const sslKeyPath = path.join(__dirname, "ssl", "example.key");
const sslCrtPath = path.join(__dirname, "ssl", "example.crt");
const server = require("https").createServer(
  {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCrtPath),
  },
  app
);

// WEBSOCKET
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Nowe połączenie WebSocket");

  // Nasłuchiwanie wiadomości od klienta WebSocket
  ws.on("message", (message) => {
    console.log(`Odebrano wiadomość: ${message}`);
  });

  // Wysyłanie wiadomości do klienta WebSocket
  ws.send("Witaj, połączono z serwerem WebSocket z SSL!");
});

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

const validateUser = async (email, password, done) => {
  const user = await userModel.findByEmail(email);
  try {
    if (user) {
      if (password === user.password) {
        console.log("Podano poprawne dane użytkownika");
        done(null, user);
      } else {
        console.log(`Podano niepoprawne dane użytkownika`);
        done(null, null);
      }
    } else {
      console.log("Nieznany użytkownik");
      done(null, null);
    }
  } catch (err) {
    console.log(`Błąd: ${err}`);
    done(err);
  }
};
passport.use(
  new passportLocal.Strategy(
    { usernameField: "email", passwordField: "password" },
    validateUser
  )
);
passport.serializeUser((user, done) => {
  console.log("Serialized id: " + user.id);
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  try {
    if (user) {
      done(null, {
        id: user._id,
        email: user.email,
        password: user.password,
      });
    }
  } catch (error) {
    console.dir(`Błąd: ${error}`);
    done(error);
  }
});

// jeśli nie zalogowany to cofa do /login
function ensureAuthenticated(req, res, next) {
  console.log("REQ: " + req.isAuthenticated());
  console.log(req.session);
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ msg: "Persmission denied!" });
}

// jeśli zalogowany to wyrzuca na /home
function forwardAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.status(405).json({ msg: "Already logged!" }); // if auth
}

app.use("/api/users", user);
app.use("/api/posts", ensureAuthenticated, post);
app.use("/api", forwardAuthenticated, passportRoute);

server.listen(process.env.PORT, () => {
  console.log(`Serwer Express działa na porcie ${process.env.PORT || 3044}`);
});
