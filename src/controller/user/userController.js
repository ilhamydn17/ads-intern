const { db } = require('../../models/index');
const User = db.user;

const getListUser = async (req, res) => { 
    try {
        const users = await User.findAll({ attributes: ['id', 'name', 'email'] });
        return res.status(200).json({message: 'success', data: users});
    } catch (error) {
        console.log(`${error}`);
        res.status(500).json({error: 'internal server error'});
    }
}

module.exports = { getListUser };