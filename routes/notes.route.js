import express from 'express';
import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import Note from '../models/note.js'
import JWTauthMiddleware from '../middlewares/jwt.middleware.js';

const notesRoute = express.Router();

notesRoute.get(
    '/api/notes', async (request, response) => {
    try {
        const notes= await Note.find({})
        return response.status(200).json({
            status: 'success',
            data: notes,
        })
    } catch (err) {
        return response.status(404).json({
            status: 'fail',
            data: err.toString(),
        })
    }
})

notesRoute.post(
    '/api/notes', 
    body('user').isLength({min: 1, max:50}),
    body('title').isLength({min:5, max:30}),
    body('content').isLength({min:1, max:100}),
    body('date').isDate(), 
    JWTauthMiddleware,
async (request, response) =>{

    body('user').isLenbght({min: 1, max:50}),
    body('title').isLenght({min:5, max:30}),
    body('content').isLenght({min:1, max:100}),
    body('date').isDate()
    const errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(400).json({
            status: 'fail',
            errors: errors.array(),
        })
    }
    try {
        const nota = new Note({
            user: request.body.user,
            title: request.body.title,
            content: request.body.content,
            date: request.body.date,
        });
        await nota.save();

        return response.status(201).json({
            status: 'success',
            data: nota,
        })
    } catch (err) {
        return response.status(404).json({
            status: 'fail',
            data: err.toString(),
        })
    }

})

notesRoute.get(
    '/api/notes/:id', async (request, response) => {
    try {
        const notes= await Note.findById(request.params.id)
        return response.status(200).json({
            status: 'success',
            data: notes,
        })
    } catch (err) {
        return response.status(404).json({
            status: 'fail',
            data: err.toString(),
        })
    }
})


notesRoute.put(
    '/api/notes/:id',
    body('user').isLength({min: 1, max:50}),
    body('title').isLength({min:5, max:30}),
    body('content').isLength({min:1, max:100}),
    body('date').isDate(), 
    async (request, response) => {
    try {
        const nota={
            user:request.body.user,
            content:request.body.content,
            title:request.body.title,
            data:request.body.data,
        }
        const note = await Note.findByIdAndUpdate(request.params.id,nota,{
            returnOriginal: false,
        })
        return response.status(200).json({
            status: 'success',
            data: note,
        })
    } catch (err) {
        return response.status(404).json({
            status: 'fail',
            data: err.toString(),
        })
    }
})

export default notesRoute