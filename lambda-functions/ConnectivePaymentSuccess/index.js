const mysql = require("mysql2");

exports.handler = async (event) => {
    // TODO implement
    const metadata = JSON.parse(event.body).data.object.metadata
    console.log(metadata)
    const buyer = metadata.buyer
    const list = metadata.list
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    var [result, fields, err] = await connection
        .promise()
        .query(
          `INSERT INTO purchased_lists (list_id, buyer_id) VALUES ("${list}", "${buyer}");`
        );
    connection.close();
    const response = {
        statusCode: 200,
        body: JSON.stringify('Execution successful :)'),
    };
    return response;
};
