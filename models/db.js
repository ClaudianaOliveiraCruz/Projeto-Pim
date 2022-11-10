const Sequelize = require("sequelize")

const sequelize = new Sequelize('pim', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}