const { Sequelize, DataTypes } = require('sequelize');
console.log("connection ", process.env.DB_CONNECTION)
const sequelize = new Sequelize(process.env.DB_CONNECTION, { dialect:'postgres'});

const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: { type: DataTypes.TEXT },
    email: { type: DataTypes.TEXT }
});
const Especialidade = sequelize.define("especialidade", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: { type: DataTypes.TEXT }
});
const Agenda = sequelize.define("agenda", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    diaSemana: { type: DataTypes.CHAR },
    hora: { type: DataTypes.INTEGER }
});
Especialidade.hasMany(Agenda);

const Reserva = sequelize.define("reserva", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    data: { type: DataTypes.DATE },
    hora: { type: DataTypes.INTEGER }
});
Especialidade.hasMany(Reserva);
User.hasMany(Reserva);

const Chat = sequelize.define("chat", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idTelegram: { type: DataTypes.BIGINT },
    first_name: DataTypes.TEXT,
    last_name: DataTypes.TEXT,

    status: { type: DataTypes.CHAR, defaultValue: 'A' }
}, {
    sequelize,
    modelName: 'chat',
    indexes: [{ unique: true, fields: ['idTelegram'] }]
});

module.exports = { User, Especialidade, Agenda, Reserva, Chat };

(async () => {
    await sequelize.sync({ force: true });
    console.log("modelo atualizado");
})();