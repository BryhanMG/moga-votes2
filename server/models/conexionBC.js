const mongoos = require('mongoose');
const { Schema } = mongoos;

const conexionBCSchema = new Schema({
    ip: { type: String, required: true},
});

module.exports = mongoos.model('conexionBC', conexionBCSchema);