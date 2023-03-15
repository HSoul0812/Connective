const mysql = require("mysql2")
const stripe = require("stripe")(
  "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"
);

async function migrate() {
    const connection = mysql.createConnection('mysql://vvgd8mawgfzp3a7te50o:pscale_pw_bLR8mW7ILIVgsTl5MogEVwtNtkq8cGIzxwEdha0IBx2@us-east.connect.psdb.cloud/connective-app?ssl={"rejectUnauthorized":true}')
    var [users] = await connection.promise().query(`select * from Users`)
    
    for(let i = 0; i < users.length; i++) {
        let user = users[i]
        console.log("Migrating user " + user.username + " with id " + user.id)

        //Generate new stripe ID
        const {id} = await stripe.accounts.create({ type: "express" });
        var stripe_id = id
        console.log("New stripe ID: " + stripe_id)

        //Delete old user (scary spooky ahhhh)
        console.log("Deleting old user...")
        await connection.promise().query(`delete from Users WHERE id=${user.id}`)

        //Create new user
        console.log("Creating new user...")
        var res = await connection.promise().execute(`INSERT INTO Users (username, password_hash, email, stripeID) VALUES ('${user.username}', '${user.password_hash}', '${user.email}', '${stripe_id}');`)
        var insertId = res[0].insertId

        //Point all of users lists to new account
        console.log("Pointing users lists to new account")
        await connection.promise().query(`UPDATE Lists SET creator=${insertId} WHERE creator=${user.id};`)

        //Point users individual / business account to new account
        console.log("Pointing users business account to new account")
        await connection.promise().query(`UPDATE Business SET user_id=${insertId} WHERE user_id=${user.id};`)

        console.log("Pointing users individual account to new account")
        await connection.promise().query(`UPDATE Individual SET user_id=${insertId} WHERE user_id=${user.id};`)

        console.log("==============================================")

        //Dont have to point users purchased lists to new account because none have been purchased yet
    }
    await connection.close()
    console.log("Migration (hopefully) complete!")
}

async function test() {
    const connection = mysql.createConnection('mysql://mzrhcb1bkqvr6zio3ynd:pscale_pw_caBVy1U6q5MykvPEoh0Db5KYbDyA6enQ9SX9fjX9WDW@us-east.connect.psdb.cloud/connective-app?ssl={"rejectUnauthorized":true}')
    let res = await connection.promise().execute(`INSERT INTO Users (username, password_hash, email, stripeID) VALUES ('test', 'test', 'test', 'test');`)
    console.log(res[0].insertId)
}

migrate()