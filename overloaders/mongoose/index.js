const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

module.exports.connect = function(dbName, port){
    return mongoose.connect(`mongodb://localhost:${port}/${dbName}`,
                            { useMongoClient: true, reconnectTries: 3 });
    
}