const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const operation = require('../data_access/user.js').collection;


passport.serializeUser(function(name, done) {
    done(null, name)
})

passport.deserializeUser(function(name, done) {

    done(null, name);

/*  operation.queryUser(name).then(function(user) {
    done(null, user);
  });*/

})


passport.use(new LocalStrategy(function(username, password, done) {

    operation.queryUser(username).then(function(rs) {
        if (rs && rs.password == password) {
          done(null,rs.name);

        } else {

          done(null, false, {message:'Incorrect user name or password!'});

        }

    });

}))

exports.passport=passport;
