const mysql = require('mysql');


const db = mysql.createPool({
    host: 'bzf4tefeukn0q2n6eksl-mysql.services.clever-cloud.com',
    user:'ugonp7mu8ixsnwp7',
    password:'GnvQbWPnJERXUWDAGsad',
    database: "bzf4tefeukn0q2n6eksl",
    port:3306
})

module.exports = async (query) => {
return new Promise((resolve, reject)=>{
    db.getConnection((err, connection)=>{
        if(err) reject(err)
        connection.query(query, (err, results)=>{
            if(err) reject (err)
            else{
                resolve(results)
                connection.release()
        }
           
            })
    })


})
    
}