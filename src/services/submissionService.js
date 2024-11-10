const { fetchProblemDetails } = require("../apis/problemAdminApi");
const submissionQueueProducer = require("../producers/submissionQueueProducer");

class SubmissionService {
  constructor(submissionRepository) {
    this.submissionRepository = submissionRepository;
  }

  async pingCheck() {
    return "pong";
  }

  async addSubmission(submission) {
    console.log("submission we are getting =>", submission);

    const problemId = submission.problemId;
    const userId = submission.userId;

    const problemAdminApiResponse = await fetchProblemDetails(problemId);

    console.log("problemAdminApiResponse =>", problemAdminApiResponse);

    if (!problemAdminApiResponse) {
      throw { message: "not able to get problem data" };
    }

    const languageCodeStub = problemAdminApiResponse.data.codeStubs.find(
      (codeStub) =>
        codeStub.language.toLowerCase() == submission.language.toLowerCase()
    );

    console.log(languageCodeStub);

    submission.code =
      languageCodeStub.startSnippet +
      "\n\n" +
      submission.code +
      "\n\n" +
      languageCodeStub.endSnippet;

    submission.testCases = languageCodeStub.testCases;

    const createdSubmission = await this.submissionRepository.createSubmission(
      submission
    );

    if (!createdSubmission) {
      throw { message: "not able to create submission" };
    }

    console.log("createdSubmission in db =>", createdSubmission);

    // adding job into submissionQueue
    // const response = await submissionQueueProducer({
    //     [createdSubmission._id] : {
    //         code : createdSubmission.code,
    //         language : createdSubmission.language,
    //         inputCase : problemAdminApiResponse.data.testCases[0].input,
    //         outputCase : problemAdminApiResponse.data.testCases[0].output,
    //         userId : userId,
    //         submissionId : createdSubmission._id
    //     }
    // });

    // Adding job into submissionQueue
    const response = await submissionQueueProducer({
      [createdSubmission._id]: {
        code: createdSubmission.code,
        language: createdSubmission.language,
        testCases: problemAdminApiResponse.data.testCases.map((testCase) => ({
          input: testCase.input,
          output: testCase.output,
        })),
        userId: userId,
        submissionId: createdSubmission._id,
      },
    });

    return { queueResponse: response, submission: createdSubmission };
  }

  async updateSubmission(evaluatedSubmission) {
    const res = await this.submissionRepository.updateSubmission(
      evaluatedSubmission
    );

    return { res };
  }
}

module.exports = SubmissionService;
