const sql           = require("../controllers/mysql2ORMController");
const logger        = require('../logs/Wlogger');

// todo create more status messages
// todo create chiller is off status message
createStatusMessage = (chillerDataArray, setpoint, allowedVariation) => {
    let status = "";
    let meanObject = {
        temp1:0,
        temp2:0,
        temp3:0
    };
    for(let i = 0; i <chillerDataArray.length;i++){
        meanObject.temp1 = meanObject.temp1+chillerDataArray[i].temp1;
        meanObject.temp2 = meanObject.temp2+chillerDataArray[i].temp2
        meanObject.temp3 = meanObject.temp3+chillerDataArray[i].temp3
    }
    meanObject.temp1 = meanObject.temp1/chillerDataArray.length;
    meanObject.temp2 = meanObject.temp2/chillerDataArray.length;
    meanObject.temp3 = meanObject.temp3/chillerDataArray.length;
    if(meanObject.temp1>setpoint+allowedVariation || meanObject.temp1 < setpoint-allowedVariation){
        return `mean temp ${meanObject.temp1} exceeded +- ${allowedVariation} `
    }
    return "Running Normally"

};

module.exports = {
    //requires a "serial" string in the req.headers
    addChiller: async (req,res) => {//
        try {
            let con = await sql.GetConnection();
            let user = await sql.selectWhere(con,"users","id",req.user[0].id);
            if(user.length==0){
                res.status(404).json({ error: 'User not found' });
            }
            const InsertObj = {
                chillerName:req.headers.chillername,
                location:req.headers.location,
                ownerID:req.user[0].id,
                serial:req.headers.serial,
                setPoint:"-40"
            };
            let chiller = await sql.insertNewChiller(con,InsertObj);
            con.end();
            console.log(chiller);
            logger.log({
                level:"info",
                message:`Added Chiller for user: ${req.headers.id}|| serial ${req.headers.serial}||`
            });
            res.status(200).json(chiller);
        } catch(e) {
            console.log("ERROR");
            // console.log(e);
            logger.log({
                level:"error",
                message:`ERROR adding Chiller for user: ${req.headers.id}|| serial ${req.headers.serial}||`
            });
            res.json(e);
        }
    },
// todo add error handling for if users chiller doesnt have data
    getChillersForUser: async (req,res) => {
        try {
            let con = await sql.GetConnection();
            let user = await sql.selectWhere(con,"users","id",req.user[0].id);
            if(user.length==0){
                res.status(404).json({ error: 'User not found' });
            }
            let chiller = await sql.selectWhere(con,"chillers","ownerID",req.user[0].id);
            let chillerData = {
                UserChillers:chiller,
                ChillerDataByID:[]
            };
            for(let i =0; i<chiller.length ;i++){
                console.log(chiller[i].id);
                let response = await sql.selectChillerDataForIDInDesc(con, chiller[i].id, "timestamp");
                console.log(response[0][0]);
                chiller[i].statusMsg = createStatusMessage(response[0],chiller[i].setPoint, 5);

                chillerData.ChillerDataByID.push(response[0][0]);

            }
            logger.log({
                level:"info",
                message:`got chiller list for id: ${req.user[0].id}`
            })
            con.end();
            res.status(200).json(chillerData);
        } catch(e) {
            console.log("ERROR");
            console.log(e);
            res.status(500).json(e);
        }
    },

    // return data for a chiller ID all of it in decs order
    getChillerDataForID: async (req,res) => {
        try {
            let con = await sql.GetConnection();
            let user = await sql.selectWhere(con, "users", "id", req.user[0].id);
            if (user.length == 0) {
                res.status(404).json({error: 'User token not found'});
            }
            let chillerdata = await sql.selectChillerDataForIDInDesc(con, req.headers.chillerid,'timestamp')
            res.status(200).json(chillerdata[0]);
        }catch(e){
            console.log(e);
            res.status(500).json(e);
        }
    }

}
