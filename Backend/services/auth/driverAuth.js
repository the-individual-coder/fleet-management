const db = require('../../database/connection')
module.exports = () => {

    const getAllAccounts = async () => 
    {
        const query = "Select * from users"
        try {
            const data = await db(query)
            return data
        } catch (error) {
            throw error
        }
    }
    const getAccByUsername =  async (email) => 
    {
        const query = `Select * from users where email = '${email}'`
        try {
            const data = await db(query)    
            return data
        } catch (error) {
            throw error
        }
    }
    return{
        getAccByUsername,
        getAllAccounts
    }
}