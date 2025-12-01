require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const configurePassport = require("./passportConfig");
const path = require("path");
const userRouter = required("./routes/userRouter")
const postRouter = required("./routes/userRouter")

const app = express();
const PORT = process.env.PORT || 3011;

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Session middleware (required for passport)
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Configure passport strategies
configurePassport(passport);

// routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/", userRouter);
app.use("/", postRouter);

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

