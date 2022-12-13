var express = require('express');
var router = express.Router();
var Questions = require('../Private/questions');
var Result = require('../Private/results');
var Test_list = require('../Private/test_list');
var Users = require('../Private/users');

router.get('/', function (req, res, next) {
    //res.redirect('/signin')
    res.render('index')
})

router.get('/test_list', Users.checkAccess, function (req, res, next) {
    Test_list.sendTestList(req, res);
})

router.get('/signin', function(req, res, next) {
    res.render('signin', { label_mode: 'hidden' , mes: '' });
});

router.post('/signin', function(req, res, next) {
    Users.findUser(req, res, next);
});

router.get('/signup', function(req, res, next) {
    res.render('signup', { label_mode: 'hidden' , mes: '' });
});

router.post('/signup', function(req, res, next) {
    Users.findAndAddUser(req, res, next);
});

router.get('/:test_id', Users.checkAccess, function (req, res, next) {
    //Questions.sendQuestions(req.params.test_id, req,res);
    Questions.check(req, res, next);
}, function (req, res, next) {
    Questions.sendQuestions(req.params.test_id, req,res);
})

router.post('/:test_id', function (req, res, next) {
    Questions.saveAns(req, res);
    res.redirect(req.params.test_id+'/results');
})

router.get('/:test_id/results',Users.checkAccess, function (req, res, next) {
    Result.sendRes(req.params.test_id, req, res);
})

router.get('/logout/p', Users.checkAccess, function(req, res, next) {
    if (req.session) {
        req.session.destroy(function() {});
    }
    res.redirect('/')
});

module.exports = router