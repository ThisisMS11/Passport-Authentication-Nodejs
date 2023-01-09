const LocalStrategy = require("passport-local").Strategy;
const { User } = require('./db');

exports.initializingPassport = (passport) => {

    // What will this do ?
    /*
    This will check the credentials of the user and check whether the user exists in the database or not and if it does it will make req.user = information of the user accessible for further use (see profile route).
    */
    passport.use(
        new LocalStrategy(async (username, password, done) => {

            try {
                const user = await User.findOne({ username });

                if (!user) return done(null, false);

                if (user.password !== password) return done(null, false);

                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        })
    )
    
    // It creates user.id with the help of user.
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    })
    
    // It finds the user with the help of id.
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    })
}