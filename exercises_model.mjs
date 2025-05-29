// Get the mongoose object
import mongoose from 'mongoose';
import 'dotenv/config';

let connection = undefined;
const EXERCISE_CLASS = "Exercise";

let Exercise = undefined;



function createModel(){
    const exerciseSchema = mongoose.Schema({
        name: {type: String, required: true},
        reps: {type: Number, required: true},
        weight: {type: String, required: true},
        unit: {type: String, required: true},
        date: {type: String, required: true}
    });
    return mongoose.model(EXERCISE_CLASS, exerciseSchema);
}


/**
 * This function connects to the MongoDB server.
 */
async function connect(){
    try{
        await mongoose.connect(process.env.MONGODB_CONNECT_STRING);
        connection = mongoose.connection;
        console.log("Successfully connected to MongoDB using Mongoose!");
        Exercise = createModel();
        
    } catch(err){
        console.log(err);
        throw Error(`Could not connect to MongoDB ${err.message}`)
    }
}

async function createExercise(name, reps, weight, unit, date){
    const exercise = new Exercise({name: name, reps: reps, weight: weight, unit: unit, date: date});
    return exercise.save();
}

const findExercises = async (filter) => {
    const query = Exercise.find(filter);
    return query.exec();
    }

const findID = async (idNum) => {
    const query = Exercise.findById(idNum);
    return query.exec();
    }

const updateExercise = async (idNum, updates) => {
    const query = await Exercise.updateOne({_id: idNum}, updates);
    return query;
    }

const deleteByID = async (id) => {
    const query = await Exercise.deleteOne({_id: id});
    return query;
    }

function isDateValid(date) {
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}
export { connect, createExercise, findExercises, findID, updateExercise, deleteByID, isDateValid };
