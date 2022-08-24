const express = require("express")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended : true }));

const {userInput} = require("./src/controller/cowinController")

app.post("/getHospitals" , userInput)

app.listen(3000 , () => {
    console.log(`server is running on the port ${3000}...`)
})
