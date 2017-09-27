const path = require('path');
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const app = express()

let secret = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET
}

if(process.env.NODE_ENV != 'production') {
  secret = require('./secret');
}

const database = {
};

app.use(passport.initialize());

passport.use(
    new GoogleStrategy({
        clientID:  secret.CLIENT_ID,
        clientSecret: secret.CLIENT_SECRET,
        callbackURL: `/api/auth/google/callback`
    },
    (accessToken, refreshToken, profile, cb) => {
        // Job 1: Set up Mongo/Mongoose, create a User model which store the
        // google id, and the access token
        // Job 2: Update this callback to either update or create the user
        // so it contains the correct access token
        const user = database[accessToken] = {
            googleId: profile.id,
            accessToken: accessToken
        };
        return cb(null, user);
    }
));

passport.use(
    new BearerStrategy(
        (token, done) => {
            // Job 3: Update this callback to try to find a user with a
            // matching access token.  If they exist, let em in, if not,
            // don't.
            if (!(token in database)) {
                return done(null, false);
            }
            return done(null, database[token]);
        }
    )
);

app.get('/api/auth/google',
    passport.authenticate('google', {scope: ['profile']}));

app.get('/api/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
        session: false
    }),
    (req, res) => {
        res.cookie('accessToken', req.user.accessToken, {expires: 0});
        res.redirect('/');
    }
);

app.get('/api/auth/logout', (req, res) => {
    req.logout();
    res.clearCookie('accessToken');
    res.redirect('/');
});

app.get('/api/me',
    passport.authenticate('bearer', {session: false}),
    (req, res) => res.json({
        googleId: req.user.googleId
    })
);

app.get('/api/questions',
    passport.authenticate('bearer', {session: false}),
    (req, res) => res.json(['Question 1', 'Question 2'])
);

//======================================================================//

const https = require('https')
var opts = {
  hostname: 'api.upcitemdb.com',
  path: '/prod/trial/search',
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "key_type": "3scale"
  }
}

var req = https.request(opts, function(res) {
  console.log('statusCode: ', res.statusCode);
  console.log('headers: ', res.headers);
  res.on('data', function(d) {
    console.log('BODY' + d);
// for (key in d) {
//     if (typeof(d[key]) != 'number' ) {
//     console.log('loop@@@', key, d[key])
//     }
// }
let parsedData = JSON.parse(d)
console.log('BUUUUUF', d)
  })
})
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
})

 req.write('{ "s": "socks" }')
// other requests
req.end()

let query;
const upcURL = `http://www.upcitemdb.com/query?s=${query}&type=2`

// app.post('/api/search/', (req, res) => {
//     const query = req.body.query;
//     const apiURL = `http://www.upcitemdb.com/query?s=${query}&type=2`
//     return fetch(apiURL, {
//       'Content-Type': 'application/json'
//     })
//       .then(results => {
//         console.log('results', results.body);
//         return results.json();
//       })
//       .then(resJson => {
//         //console.log(resJson)

//         return res.status(200).send(resJson);
//       })
//       .catch(err => {
//         console.log({err});
//         res.status(500).json({ message: 'Internal error' });
//       });
//   });


//======================================================================//

// Serve the built client
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Unhandled requests which aren't for the API should serve index.html so
// client-side routing using browserHistory can function
app.get(/^(?!\/api(\/|$))/, (req, res) => {
    const index = path.resolve(__dirname, '../client/build', 'index.html');
    res.sendFile(index);
});

let server;
function runServer(port=3001) {
    return new Promise((resolve, reject) => {
        console.log('now running on port 3001')
        server = app.listen(port, () => {
            resolve();
        }).on('error', reject);
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

if (require.main === module) {
    runServer();
}

module.exports = {
    app, runServer, closeServer
};
