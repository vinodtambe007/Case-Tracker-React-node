const mongoose = require('mongoose');

const {Schema} = mongoose;

const CaseSchema = new Schema({
    case_name:{
        type:String,
        required:true
    }, 
    status: {
        type: String,
        enum: ['completed', 'notcompleted'] 
    },
    condition:{
        type:String,
        enum: ['lock', 'unlock'] 
    },
    lockedBy: {
        type: String,
        ref: 'user'
    }
});

module.exports = mongoose.model("caselist",CaseSchema);