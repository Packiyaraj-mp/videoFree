import mongoose from 'mongoose';

const dbConnection=()=>{
    mongoose.connect('mongodb+srv://packiyaraj:Raj357890@shomo.tsgni.mongodb.net/?retryWrites=true&w=majority&appName=shomo')
    .then(conn=>console.log(`db is connected with ${conn.connection.host}`))
};

export default dbConnection;
