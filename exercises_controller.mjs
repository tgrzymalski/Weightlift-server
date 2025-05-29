import 'dotenv/config';
import express from 'express';
import * as exercises from './exercises_model.mjs';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    await exercises.connect(false);
    console.log(`Server listening on port ${PORT}...`);
});


app.post('/exercises', async (req, res) => {    

    const info = req.body;

    const isValid = (
        typeof info.name === 'string' && info.name.length > 0 &&
        typeof info.reps === 'number' && info.reps > 0 &&
        typeof info.weight === 'number' && info.weight > 0 &&
        typeof info.unit === 'string' && (info.unit === 'kgs' || info.unit === 'lbs')
    );

    if (isValid && exercises.isDateValid(info.date)){

        const new_exercise = await exercises.createExercise(info.name, info.reps, info.weight, info.unit, info.date);
    
        res.status(201).send(new_exercise);
    }
    else{
        res.status(400).send({"Error": "Invalid request"});
    }

});

app.get('/exercises', async (req, res) => {
    
    const info = req.query;

    const matched_exercises = await exercises.findExercises(info);
    res.status(200).json(matched_exercises);

});

app.get('/exercises/:id', async (req, res) => {

    const given_id = req.params.id;
    
    const spec_id = await exercises.findID(given_id);

    if (!await exercises.findID(req.params.id)){
        res.status(404).send({"Error": "Not found"});
    }

    else{
        res.status(200).json(spec_id);
    }
});

app.put('/exercises/:id', async (req, res) => {

    const given_id = req.params.id;

    const info = req.body;

    const isValid = (
        typeof info.name === 'string' && info.name.length > 0 &&
        typeof info.reps === 'number' && info.reps > 0 &&
        typeof info.weight === 'number' && info.weight > 0 &&
        typeof info.unit === 'string' && (info.unit === 'kgs' || info.unit === 'lbs')
    );

    if (!isValid || !exercises.isDateValid(info.date)){        
        res.status(400).send({"Error": "Invalid request"});
    }
    

    else if (!await exercises.findID(req.params.id)){
        res.status(404).send({"Error": "Not found"});
    }

    else {
        await exercises.updateExercise(given_id, req.body);
        res.json(await exercises.findID(req.params.id));
    }
});

app.delete('/exercises/:id', async (req, res) => {

    const given_id = req.params.id;

    if (!await exercises.findID(req.params.id)){
        res.status(404).send({"Error": "Not found"});
    }

    else{
        const spec_id = await exercises.deleteByID(given_id);
        res.status(204).send();
    }
});
    