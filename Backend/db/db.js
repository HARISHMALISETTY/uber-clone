// const mongoose = require('mongoose');


// function connectToDb() {
//     mongoose.connect(process.env.DB_CONNECT)
//     .then(() => {
//         console.log('Connected to DB');
//     }).catch(err => console.log(err));
// };


// module.exports = connectToDb;const mongoose = require('mongoose');


const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI; 

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));