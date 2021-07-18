const mongoose = require('mongoose');
const { uri } = require('./config.json');

module.exports = async () => {
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    return mongoose;
}