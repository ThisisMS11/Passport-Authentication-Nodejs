const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');
//! to connect with mongoDB compass
const mongouri = "mongodb://localhost:27017/PassPort?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"

exports.connectMongoose = () => {
    mongoose.connect(mongouri).then((e) => {
        console.log(`Connected to MongoDB: ${e.connection.host}`);
    }).catch((e) => {
        console.log(e);
    })
}

const userSchema = new mongoose.Schema({
    username: String,
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        unique:true
    }
});

// userSchema.plugin(passportLocalMongoose);

exports.User = mongoose.model("User", userSchema);

exports.isAuthenticated = (req, res, next) => {
    if (req.user) return next();

    res.redirect("/login");
}