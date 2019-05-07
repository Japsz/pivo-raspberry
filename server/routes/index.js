var router = require('express').Router();

/* GET mainframe. */
router.get('/', function(req, res) {
    res.render('index');
});
/* GET mainframe. */
module.exports = router;
