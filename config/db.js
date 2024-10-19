
const mongoose = require('mongoose');


const MONGODB_URI = 'mongodb+srv://baboudieye58:wig7kPEWJZV5Gpqp@cluster0.bzzc5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI); // Suppression des options obsolètes
        console.log('Connecté à MongoDB Atlas');
    } catch (error) {
        console.error('Erreur de connexion:', error);
        process.exit(1); 
    }
};

module.exports = connectDB; 