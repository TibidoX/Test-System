var connection = require("./db");

function sendRes (test_id, req, res) {
    connection.query("SELECT * FROM questions LEFT JOIN(SELECT id, ques_id, ver,user_id, c FROM questions LEFT JOIN (SELECT result.ques_id,ver,user_id,c FROM result JOIN (SELECT ques_id, COUNT(*) c FROM answers WHERE ver=true GROUP BY ques_id, ver) t ON result.ques_id=t.ques_id) tt ON questions.id=tt.ques_id WHERE questions.test_id=$1 AND user_id=$2) ttt ON questions.id=ttt.id WHERE questions.test_id=$1;" ,[Number(test_id), req.session.user_id], function (err, output) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(output.rows);
        var arr = []
        for (let i = 0; i < output.rows.length; i++) {
            arr.push([Number(output.rows[i].ques_id), output.rows[i].ver, Number(output.rows[i].c)]);
        }
        console.log(arr);

        var result = [];

        const tmp = Object.values(output.rows.reduce((acc, {ques, ver, c})=>{
            acc[ques] = acc[ques] || {ques, ver:[], c};
            acc[ques].ver.push(ver);
            return acc;
        },{}));
        console.log(tmp);
        for (let i = 0; i < tmp.length; i++) {
            if ((tmp[i].ver.every(x => x)) && (Number(tmp[i].c)==tmp[i].ver.length))
                result.push([tmp[i].ques, true]);
            else result.push([tmp[i].ques, false]);
        }

        console.log(result);

        res.render('results', {result:result, test_id:test_id});
    })
}

module.exports = {sendRes};