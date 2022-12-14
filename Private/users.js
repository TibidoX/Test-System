var connection = require("./db");

function addUser (login, password, res) {
    connection.query("INSERT INTO users (login, password) VALUES( $1 , $2 );", [login, password], function(err){
        if (err){
            res.render('signup', { label_mode: '' , mes: 'Произошла ошибка' });
        }
        else res.redirect('/')
        return;
    });
}

function findAndAddUser (req, res, next) {
    connection.query("SELECT count(login) cnt FROM users WHERE login=$1;", [req.body.login] , function(err, output){

        if (err){
            res.render('signup', { label_mode: '' , mes: 'Ошибка' });
            console.log(err)
        }
        else if (output.rows[0].cnt < 1) {
            addUser(req.body.login, req.body.password, res)
        }
        else {
            res.render('signup', { label_mode: '' , mes: 'Пользователь с таким логином уже существует.' });
        }

    });
}

function findUser (req, res, next) {
    connection.query("SELECT count(login) cnt FROM users WHERE login=$1 and password=$2;", [req.body.login, req.body.password] , function(err, output){

        if (err){
            res.render('signin', { label_mode: '' , mes: 'Ошибка' });
            console.log(err)
        }
        else if (output.rows[0].cnt > 0 ) {
            req.session.user_id = req.body.login;
            req.session.password = req.body.password;

            res.redirect('/test_list');
        }
        else {
            res.render('signin', { label_mode: '' , mes: 'Неправильно введен логин или пароль.' });
        }


    });
}

function checkAccess(req, res, next) {
    if (req.session.user_id) {
        connection.query("select count(*) cnt from users where login=$1 and password=$2", [req.session.user_id,req.session.password], function(err, output){
            if (err){
                console.log(err);
                return;
            }
            if (output.rows[0].cnt == 1) next();
            else {
                req.session.url = req.url;
                res.redirect('/');
            }
        });
    } else {
        req.session.url = req.url;
        res.redirect('/');
    }
}

module.exports = { findAndAddUser, findUser,  checkAccess }