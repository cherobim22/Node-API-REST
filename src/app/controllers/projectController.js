const express = require('express');
const middleware = require('../middlewares/auth');
const router = express.Router();

const Project = require('../models/projects')
const Task = require('../models/task')

router.use(middleware);

router.get('/', async(req, res) =>{
    try{

        const project = await Project.find().populate(['user', 'tasks']);
        return res.send({project});
    }catch(err){
        return res.status(400).send({error: 'Erro ao carregar projetos'});
    }

});

router.get('/:projectId', async(req, res) =>{
    try{

        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);
        return res.send({project});
    }catch(err){
        return res.status(400).send({error: 'Erro ao carregar projeto'});
    }

});

router.delete('/:projectId', async(req, res) =>{
    try{

        await Project.findByIdAndRemove(req.params.projectId)
        return res.status(200).send({ok: 'true'});
    }catch(err){
        return res.status(400).send({error: 'Erro ao remover o projeto'});
    }

});

router.post('/', async(req, res) =>{
    try{

        const {title, description, tasks} = req.body;

        const project = await Project.create({title, description, user: req.userId });

        await Promise.all(tasks.map(async task =>{
            const projectTask = new Task({ ...task, project: project._id});

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({project});

    }catch(err){
        console.log(err);
        return res.status(400).send({error: 'Erro ao criar novo projeto'});
    }
});

router.put('/:projectId', async(req, res) =>{
    try{

        const {title, description, tasks} = req.body;

        const project = await Project.findByIdAndUpdate(req.params.projectId, {
            title, description, user: req.userId 
        }, {new: true});

        project.tasks = [];
        await Task.remove({project: project._id});

        await Promise.all(tasks.map(async task =>{
            const projectTask = new Task({ ...task, project: project._id});

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({project});

    }catch(err){
        console.log(err);
        return res.status(400).send({error: 'Erro ao criar novo projeto'});
    }
});


module.exports = app => app.use('/projects', router);