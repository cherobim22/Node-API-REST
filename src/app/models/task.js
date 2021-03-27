const mongoose = require('../../database');

const TaskSchema = new mongoose.Schema({
    tittle:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    assignTn:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    completed:{
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
    
});


const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;