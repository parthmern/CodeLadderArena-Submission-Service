// const testService = require("../services/testService");

async function pingRequest (req, res){
    console.log("/test/ping-");

    //console.log("fastify obj with testService ===>", this.testService);

    return res.status(200).send({
        "message": "Submission Service is alive 💚"
    });
}

async function createSubmission(req, res) {
    console.log(req.body);
    console.log("create submission", this.submissionService); // fastify obj
    const response = await this.submissionService.addSubmission(req.body);
    return res.status(201).send({
        error: {},
        data: response,
        success: true,
        message: 'Created submission successfully'
    })

}

// async function updateSubmission(evaluatedSubmission) {
//     console.log("evaluatedSubmission=>", evaluatedSubmission);
//     console.log("submissionService=>",this.submissionService);
//     const response = await this.submissionService.updateSubmission(evaluatedSubmission);
//     return res.status(201).send({
//         error: {},
//         data: response,
//         success: true,
//         message: 'updated submission successfully'
//     })
// }

module.exports = {
    pingRequest,
    createSubmission
};