const express = require("express");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const user = require("./routes/user.route");
const post = require("./routes/post.route");
const passportRoute = require("./routes/passport.route");
const passport = require("passport");
const passportLocal = require("passport-local");
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
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
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["X-Requested-With", "content-type"],
    credentials: true,
  })
);
app.use(
  cookieSession({
    name: "mysession",
    keys: ["$sekretny $sekret"],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);
app.use(
  require("express-session")({
    secret: process.env.APP_SECRET || "$sekretny $sekret",
    saveUninitialized: false,
    resave: false,
  })
);
const userModel = require("./models/user.model");

// HTTPS

// const server = require("http").createServer(app);

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
const sio = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

sio.use(
  wrap(
    require("express-session")({
      secret: process.env.APP_SECRET || "$sekretny $sekret",
      saveUninitialized: false,
      resave: false,
    })
  )
);
sio.use(
  wrap(
    cookieSession({
      name: "mysession",
      keys: ["$sekretny $sekret"],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
  )
);
sio.use(wrap(passport.initialize()));
sio.use(wrap(passport.session()));

sio.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("Brak autoryzacji!"));
  }
});

sio.on("connect", async (socket) => {
  const userModel = require("./models/user.model");
  console.log("Nowe połączenie WebSocket");
  console.log("Logged user: " + socket.request.session.passport.user);
  const userId = socket.request.session.passport.user;
  socket.join(userId);

  try {
    socket.on("created", async () => {
      const followedUsers = await userModel.findUsersThatFollow(userId);
      followedUsers.forEach(async (followedUser) => {
        const roomId = followedUser.id;
        socket.join(roomId);
        socket.to(roomId).emit("newPost");
        socket.leave(roomId);
      });
    });

    socket.on("disconnect", async () => {
      socket.leave(userId);
      console.log("Wylogowano: " + userId);
    });
  } catch (err) {
    console.log(err);
  }
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
    console.log(`Błąd walidacji użytkownika: ${err}`);
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
const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(401).send("You are not authenticated");
  } else {
    return next();
  }
};

app.use("/api/users", user);
app.use("/api/posts", authMiddleware, post);
app.use("/api", passportRoute);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(process.env.PORT, () => {
  console.log(`Serwer Express działa na porcie ${process.env.PORT || 3044}`);
});
