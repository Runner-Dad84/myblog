require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const configurePassport = require("./passportConfig");
const path = require("path");
const userRouter = require("./routes/userRouter")
const postRouter = require("./routes/postRouter")

// load the passport strategy
require("./passport/localStrategy")(passport);

const app = express();
const PORT = process.env.PORT || 3011;

// sessions middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// Configure passport strategies
configurePassport(passport);


app.use("/", userRouter);
app.use("/", postRouter);

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;

