// const express = require("express")
// const authUser = require("../middlewares/auth.middleware")
// const upload = require("../middlewares/file.middleware")
// const authMiddleware =require("../middlewares/auth.middleware")
// const interviewRouter = express.Router();
// const interviewController = require("../controllers/interview.controller")
// /**
//  * @route post/inteerview/
//  * @description generate new interview report on the basis of user self description resume , pdf and job description
//  */





// interviewRouter.post("/", authMiddleware,
//     upload.single("resume"),
//     interviewController.generateInterViewReportController);

// module.exports = interviewRouter;
// const express = require("express");
// const {authUser} = require("../middlewares/auth.middleware");
// const upload = require("../middlewares/file.middleware");
// const interviewRouter = express.Router();
// const {generateInterViewReportController} = require("../controllers/interview.controller");

// /**
//  * @route post /interview/
//  * @description generate new interview report on the basis of user self description
//  */



// console.log("authUser:" ,typeof authUser);
// console.log("upload.single:", typeof upload.single);
// console.log("controller:", typeof interviewController.generateInterViewReportController);
// interviewRouter.post(
//   "/",
//   authUser, // Use authUser here
//   upload.single("resume"),
//   interviewController.generateInterviewReportController
// );

// module.exports = interviewRouter;
const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");
const {
  generateInterviewReportController,
  getInterviewReportsController,
  getAllinterviewReportsController,
  generateResumePdfController,
} = require("../controllers/interview.controller");

const interviewRouter = express.Router();

console.log("authUser:", typeof authUser);
console.log("upload.single:", typeof upload.single);
console.log("controller:", typeof generateInterviewReportController);

interviewRouter.post(
  "/",
  authUser,
  upload.single("resume"),
  generateInterviewReportController
);

interviewRouter.get("/report/:interviewId", authUser, getInterviewReportsController);

/**
 * @description Controller to get all interview reports of the logged-in user.
 */
interviewRouter.get("/", authUser, getAllinterviewReportsController);

interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  authUser,
  generateResumePdfController
);

module.exports = interviewRouter;