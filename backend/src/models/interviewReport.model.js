const mongoose = require('mongoose');
/**
 * -job description schema:string
 * resume text :String
 * self description : String
 * 
 * -matchscore :number
 * 
 * -technical questions :
 *         [{
 *     question:" ",
 * intention :" ",
 * answer : " ",
 * 
 * }]
 * behavioral question:[{
 * skill : "",
 * severity : {
 *  type: String,
 * enum : ["low", "medium", "high"]
 * }
 * 
 * 
 * }]
 * skill gap:[]
 * preparation plan:[{
 * day:number,
 * focus: String,
 * tasks(String)
 * }]
 * 
 */
const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required : [true,"technical question is required"]
    }, intention:{
          type:String,
          required: [true,"Intention is required"]
    },
    answer: {
        type: String,
        required: [true,"Answer  is required"]
    }
    } ,{
        _id: false
})
const behavioralQuestionSchema = new mongoose.Schema({
     question: {
        type: String,
        required : [true,"technical question is required"]
    }, 
    intention:{
          type:String,
          required: [true,"Intention is required"]
    },
    answer: {
        type: String,
        required: [true,"Answer  is required"]
    },
},{
    _id: false

 })
 const skillGapSchema = new mongoose.Schema({
skill: {
    type:String,
    required: [true,"skill is required" ]
},
severity:{
type: String,
enum: ["low","medium","high"],
required: [true, "Severity is required"]
 },
},{
   _id: false
 })
 const preparationPlanSchema = new mongoose.Schema({
    day:{
        type :Number,
        required: [true,"Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [{
  type: String,
  required: [true,"task is required"]
    }]
 })

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"],
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    technicalQestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    title: {
        type: String,
        required: [true, "Job title is required"],
    },
}, {
    timestamps: true,
});
const interviewReportModel = mongoose.model("InterviewReport",interviewReportSchema);

module.exports = interviewReportModel;