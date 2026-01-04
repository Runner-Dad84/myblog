require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");

const path = require("path");
const userRouter = require("./routes/userRouter")
const postRouter = require("./routes/postRouter")
const commentRouter = require("./routes/commentRouter")
const authRouter = require("./routes/authRouter")

// load the passport strategy
if (process.env.NODE_ENV !== "test") {
  console.log("Loading REAL Local Strategy");
  require("./passport/localStrategy")(passport);
} else {
  console.log("Skipping Local Strategy (TEST MODE)");
}

const app = express();
const PORT = process.env.PORT || 3011;

// sessions middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "test_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", userRouter);
app.use("/", postRouter);
app.use('/', commentRouter);
app.use("/", authRouter);

// start server
if (process.env.NODE_ENV !== 'test'){
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
}

module.exports = app;

