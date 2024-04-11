const sql=require("mysql");

const sqlconnect=sql.createConnection({
    host:"173.214.175.66",
    user:"avikaa",
    password:"reactnode24",
    database:"reactnode",
    multipleStatements:true
});

sqlconnect.connect((err)=>{

    if(!err)
    {
        console.log("Database connected");
    }
    else
    {
        console.log("Database not connected");
    }
});
module.exports=sqlconnect;