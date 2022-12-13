var connection = require("./db");
var format = require('pg-format');

function check (req, res, next) {
    connection.query('SELECT COUNT(*) c FROM (SELECT user_id, test_id FROM result JOIN questions q on result.ques_id = q.id) t WHERE t.user_id=$1 AND t.test_id=$2',
        [req.session.user_id, Number(req.params.test_id)], function (err, output) {
        if (err) {
            console.log(err);
            return;
        }

        if (output.rows[0].c>0) {
            res.redirect(req.params.test_id+'/results');
        } else {
            next();
        }
    })
}
function sendQuestions (test_id, req, res) {
    connection.query("SELECT ques, ans, ver, ques_id FROM questions JOIN answers on questions.id = answers.ques_id WHERE questions.test_id=$1;",
        [Number(test_id)], function(err, output) {
        if (err) {
            console.log(err);
            return;
        }

        const result = Object.values(output.rows.reduce((acc, {ques, ans, ver, ques_id})=>{
            var arr = {ans:ans, ver:ver, id:ques_id};
            acc[ques] = acc[ques] || {ques, answ:[]};
            acc[ques].answ.push(arr);
            return acc;
        },{}));
         console.log(result);

        for (let i = 0; i < result.length; i++) {
            var ques = result[i].ques;
            console.log(ques);
            for (let j = 0; j < result[i].answ.length; j++) {
                console.log(result[i].answ[j].id);
            }
        }

        res.render('test', {result:result, test_id:test_id});
    })
}

function saveAns(req, res) {
    var a = req.body.correct;
    var r;
    if (typeof (a)=='array') {
        r = '[' + a.join() + ']';
    } else if (typeof(a)=='undefined'){
        r = '[]';
    } else {
        var r = '[' + a + ']';
    }
    console.log(JSON.parse(r));
    var json_data = JSON.parse(r);
    var arr = [];
    for (var i in json_data)
        arr.push([json_data[i].ques_id, json_data[i].ver, req.session.user_id]);
    console.log(arr);

    console.log(format('INSERT INTO result(ques_id, ver, user_id) VALUES %L', arr));
    connection.query(format('INSERT INTO result(ques_id, ver, user_id) VALUES %L', arr), function (err, output) {
        if (err) {
            console.log(err);
            return;
        }
    })
}

module.exports = {sendQuestions, saveAns, check}