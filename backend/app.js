require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
//routes
const userRouter = require("./routes/userRouter")
const postRouter = require("./routes/postRouter")
const commentRouter = require("./routes/commentRouter")
const authRouter = require("./routes/authRouter")
const adminPostRoute = require("./routes/adminPostRoute")
const publicPostRoute = requore("./routes/publicPostRoute")

const app = express();


// load the passport strategy
if (process.env.NODE_ENV !== "test") {
  console.log("Loading REAL Local Strategy");
  require("./passport/localStrategy")(passport);
} else {
  console.log("Skipping Local Strategy (TEST MODE)");
}

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// sessions middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "test_secret",
    resave: false,
    saveUninitialized: false,
     cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//static files
app.use(express.static(path.join(__dirname, "public")));

//routers
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use('/api', commentRouter);
app.use("/api", authRouter);
app.use("/api", adminPostRoute);
app.use("/api", publicPostRoute);


module.exports = app;

