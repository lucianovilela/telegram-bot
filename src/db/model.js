const { Sequelize, DataTypes } = require('sequelize');
console.log("connection ", process.env.DB_CONNECTION)
const sequelize = new Sequelize(process.env.DB_CONNECTION, { dialect:'postgres'});

const Log = sequelize.define("log", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    consulta: DataTypes.TEXT,
    idTelegram : DataTypes.BIGINT
}, {
    sequelize,
    modelName: 'log',
    indexes: [{  fields: ['consulta'] }]
});

module.exports = { Log };

(async () => {
    await sequelize.sync({ force: false });
    console.log("modelo atualizado");
})();