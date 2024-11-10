const Submission = require('../models/submissionModel');

class SubmissionRepository {
    constructor() {
        this.submissionModel = Submission;
    }

    async createSubmission(submission) {
        const response = await this.submissionModel.create(submission);
        return response;
    }

    async updateSubmission(evaluatedSubmission){
        try{
            console.log("evaluatedSubmission-----------------------", evaluatedSubmission);
            const res = await this.submissionModel.findByIdAndUpdate(
                evaluatedSubmission.submissionId, 
                { 
                    status: evaluatedSubmission.overallStatus,
                    $push: { result: { $each: evaluatedSubmission.results } } 
                }, 
                { new: true } 
            );
            console.log("updated submission", res);
            return true;
        }
        catch(e){
            console.log(e);
            throw e;
        }
    }
    
}

module.exports = SubmissionRepository;