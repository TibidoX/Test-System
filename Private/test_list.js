var connection = require("./db");

function sendTestList (req, res) {
    connection.query('SELECT * FROM test', function (err, output) {
        if (err) {
            console.log(err);
            return;
        }

        var result = []
        for (let i = 0; i < output.rows.length; i++) {
            result.push([output.rows[i].id, output.rows[i].name])
        }
        console.log(result);
        res.render('test_list', {result:result, user_id:req.params.user_id})
    })
}

module.exports = {sendTestList};