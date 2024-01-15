const express = require("express");
require("dotenv").config();
const fs = require("fs");
const WebSocket = require("ws");
const path = require("path");
const user = require("./routes/user.route");
const post = require("./routes/post.route");
const passportRoute = require("./routes/passport.route");
const passport = require("passport");
const passportLocal = require("passport-local");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.use(
  require("express-session")({
    secret: process.env.APP_SECRET || "$sekretny $sekret",
    resave: false,
    saveUninitialized: true,
  })
);
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

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await userModel.findById(id);
  try {
    done(null, {
      id: user._id,
      email: user.email,
      password: user.password,
    });
  } catch (error) {
    console.dir(`Błąd: ${error}`);
    done(error);
  }
});

app.use("/api", passportRoute);
app.use(
  "/api/users",
  passport.authenticate("local", {
    session: false,
  }),
  user
);
app.use("/api/posts", post);

server.listen(process.env.PORT, () => {
  console.log(`Serwer Express działa na porcie ${process.env.PORT | 3044}`);
});
