const mysqlConnection = require('../../database/database')


exports.getAllFabricacion = () => {
    return new Promise((resolve, reject) => {
        try {
            const sql = 'SELECT * FROM fabricacion';
            mysqlConnection.query(sql, (err, result) => {
                if (err) throw err;
                resolve(result)
            })
        } catch (error) {
            reject(error)
            console.error(error.message)
            throw error;
        }
    })    
}

exports.createFabricacion = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const sql = 'INSERT INTO fabricacion SET ?';
            mysqlConnection.query(sql, data, (error, result) => {
                if (error) {
                    console.log(error.message);
                    resolve(error)
                }
                resolve(result)
            })
        } catch (error) {
            reject(error)
            console.error(error.message)
        }
    })    
}


exports.getFabricacionById = (id) => {
    return new Promise((resolve, reject) => {
        try {
            const sql = `SELECT * FROM fabricacion WHERE id = ${id}`;
            mysqlConnection.query(sql, (err, result) => {
                if (err) throw err;
                resolve(result)
            })
        } catch (error) {
            reject(error)
            console.error(error.message)
            throw error;
        }
    })    
}
