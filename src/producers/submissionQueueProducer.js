const submissionQueue =  require("../queues/submissionQueue");

module.exports = async function(payload) {
    const job = await submissionQueue.add("SubmissionJob", payload);
    console.log("Successfully added a new submission job", job?.id);
    return ;
}