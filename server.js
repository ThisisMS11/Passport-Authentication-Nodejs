const express = require('express');
const app = express();
const ejs = require('ejs');

const { connectMongoose, User, isAuthenticated } = require('./db.js')
const passport = require('passport');
const expressSession = require("express-session");

const { initializingPassport } = require('./passportConfig');

initializingPassport(passport);

connectMongoose();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* This part should be above the below two lines always. */
app.use(expressSession({
    secret: "Mohit",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.set("view engine", "ejs");


app.get('/', (req, res) => {
    res.render("index");
})

app.get('/register', (req, res) => {
    res.render("register");
})

app.get('/login', (req, res) => {
    res.render("login");
})


/* This Code will trigger the passportConfig and find the user using the credentials from login form*/

app.post('/login', passport.authenticate("local", { failureMessage: "User Not Authenticated", successRedirect: "/" }), (req, res) => {
    res.render("login");
})

app.post('/register', async (req, res) => {

    console.log('req.body => ', req.body);

    const user = await User.findOne({ username: req.body.username });

    if (user) return res.status(400).send("User already exists");

    const newUser = await User.create(req.body);


    res.status(400).send(newUser)
})

app.get("/profile", isAuthenticated, (req, res) => {
    res.send(req.user);
})

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.send('Logged out successful');
    });
});


app.listen(3000, () => {
    console.log("Hello to the world of computers.");
})