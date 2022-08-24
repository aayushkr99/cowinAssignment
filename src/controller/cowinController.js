const axios = require("axios");
const fs = require("fs");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};


const isValidRequestBody = function (requestbody) {
  return Object.keys(requestbody).length > 0;
};

const isValidNumber = function (num) {
  if (typeof num != "number") return false;
  let a = (num % 10).toString().length;
  if (a > 1 || num < 0) {
    return false;
  } else return true;
};


function dateChecker(str){
    const regexExp = /(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/gi;
    if(regexExp.test(str)){
        return true
    }else{
        return false
    }
}



const userInput = async function (req, res) {
  try {
    let { district_id, date} = req.body;
    if (!isValidRequestBody(req.body))
      return res.send({
        code: 500,
        message: "Request playload should not be empty",
      });

    if (!isValid(district_id))    return res.send({ code: 500, message: "please provide district id" });
    
    if (!isValidNumber(district_id))   return res.send({ code: 500, message: "district_id should be a positive Integer" });
     
    if (!isValid(date))  return res.send({ code: 500, message: "please provide date" });

    if(dateChecker(date) === false) return res.send({code : 500  , message : "please provide date in valid string format"})

    if (req.body.limit) {

      if (!isValid(req.body.limit))   return res.send({ code: 500, message: "please provide limit" });
       
      if (!isValidNumber(req.body.limit))    return res.send({ code: 500, message: "limit should be a non-negative-integer" });
       
    }

    let options = {
      method: "get",
      url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${date}`,
    };
    let result = await axios(options);

    var check;
    if(req.body.limit){
        check = req.body.limit
    }else{
        check = 10
    }
    let res1 = []
    let arr = result.data.sessions

    for(let i = 0; i < check; i++){
        let obj = {
            name : arr[i].name,
            sessions : [{
                available_capacity: arr[i]["available_capacity"],
                vaccine: arr[i]["vaccine"],
            }]
        }
        // if( arr[i]["vaccine"] === "COVAXIN"){}
        // if( arr[i]["vaccine"] === "COVISHIELD"){}
        // if( arr[i]["vaccine"] === "CORBEVAX"){}
        res1.push(obj)
    }

    fs.writeFileSync(
      "Hospital.txt",
      JSON.stringify({
        code: 200,
        message: "Hospitals sent successfully",
        result: res1,
      }),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );

    res.send({ code: 200,  message: "Hospitals sent successfully", result: res1  });
     
  } catch (err) {
    console.log(err);
    res.send({code : 500, message: "Invalid Data Entry", err : err.message  });
  }
};

module.exports.userInput = userInput;
