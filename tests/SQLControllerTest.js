const sql = require('../controllers/mysql2ORMController');


let main = async function(){
    try{
        let con = await sql.GetConnection();
        let insert = await sql.insertNewChillerTable(con,"meh");
        console.log("insert function finished");
        console.log(insert);
        return insert;
    }catch(e){
        console.log(e)
        return e;
    }

};

main();
