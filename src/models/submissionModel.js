const mongoose = require('mongoose');

const outputSchema = new mongoose.Schema({
    output: { type: String },
    status: { type: String }
}, { _id: false }); // `_id: false` prevents automatic IDs for sub-documents

const submissionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "User id for the submission is missing"],
    },
    problemId: {
        type: String,
        required: [true, "Problem id for the submission is missing"],
    },
    code: {
        type: String,
        required: [true, "Code for the submission is missing"],
    },
    language: {
        type: String,
        required: [true, "Language for the submission is missing"],
    },
    status: {
        type: String,
        enum: ["Pending", "Success", "RE", "TLE", "MLE", "WA"], // runtimeerror, timelimitexcedded, memorylimitexcedeed, wrongans
        default: "Pending"
    },
    result: {
        type: [outputSchema], // Array of outputSchema objects
        default: []
    }
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;