const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const operation = require('../data_access/user.js').collection;


passport.serializeUser(function(user, done) {
    done(null, user._id)
})

passport.deserializeUser(function(_id, done) {

      operation.queryUserById(_id).then(function(user) {
        done(null, user);
      });
})


passport.use(new LocalStrategy(function(username, password, done) {

    operation.queryUser(username).then(function(user) {
        if (user && user.password == password && user.status=='ACTIVE' ){
            done(null, user);

        } else {

            done(null, false, { message: 'Incorrect user name or password!' });

        }

    });

}))

exports.passport = passport;
