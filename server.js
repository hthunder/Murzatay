const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

require('dotenv').config();

const blogRoutes = require('./routes/blog');

const db = require('./models');
const Role = db.role;

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

//parse request of content-type - application/json
app.use(express.json());

//parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
app.use(blogRoutes);
app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
const username = process.env.DB_ADMIN_USERNAME;
const password = process.env.DB_ADMIN_PASSWORD;

async function start() {
  try {
    await db.mongoose.connect(
      `mongodb+srv://${username}:${password}@cluster0.m6k5m.mongodb.net/blog`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    );
    initial();
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
    process.exit();
  }
}

start();

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user'
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }
        console.log(`added 'user' to roles collection`);
      });

      new Role({
        name: 'moderator'
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }
        console.log(`added 'moderator' to roles collection`);
      });

      new Role({
        name: 'admin'
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }
        console.log(`added 'admin' to roles collection`);
      });
    }
  });
}