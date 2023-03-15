const mysql = require("mysql2")

export default async function handler(req, res) {
    try {
        if(req.method == "GET") {
            console.log("Gettin data")
            const connection = mysql.createConnection(process.env.DATABASE_URL)
            var [results, fields, err] = await connection.promise().query(`SELECT * from Users;`)

            res.status(200).json(results)
        }
    } catch(e) {
        console.log(e)
        return res.status(500).json({success: false, error: e})
    }
}