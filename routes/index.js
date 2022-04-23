var express = require('express');
var router = express.Router();
var schemas = require('../models/schemas.js');

/* GET home page. */
router.get('/', async(req, res) => {
  let menu = schemas.menu;
  let sesh = req.session;

  let menuResult = await menu.find({}).then( (menuData) => {
    res.render('index', {title:'Menu App', data:menuData, search:'', loggedIn:sesh.loggedIn});
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/q', async(req, res) => {
  let menu = schemas.menu;
  let q = req.body.searchInput;
  let menuData = null;
  let sesh = req.session;
  let qry = {name:{$regex:'^' + q, $options:'i'}};

  if (q != null) {
    let menuResult = await menu.find(qry).then( (data) => {
      menuData = data;
    });
  } else {
    q = 'Search';
    let menuResult = await menu.find({}).then( (data) => {
      menuData = data;
    });
  }

  res.render('index', {title:'Menu App', data:menuData, search:q, loggedIn:sesh.loggedIn});
});

module.exports = router;
