var mysql = require('mysql');



var db  = mysql.createPool({
    connectionLimit : process.env.LIMIT_DB_MYSQL,
    host     : process.env.HOST_DB_MYSQL,
    user     : process.env.USER_DB_MYSQL,
    password : process.env.PASS_DB_MYSQL,

    database : process.env.MAIN_DB_MYSQL
});


// host     : '127.0.0.1',
//   user     : 'diskominfosandi',
//   password : 'Kominfo2018',
//   database : 'absensi'
// });

db.getConnection((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('Terkoneksi dengan DATABASE UMUM');
    }
})


module.exports = db;