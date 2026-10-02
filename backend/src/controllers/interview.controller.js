const pdfParseModule = require("pdf-parse");
const mongoose = require("mongoose");
const PdfParserClass =
  pdfParseModule && typeof pdfParseModule.PDFParse === "function"
    ? pdfParseModule.PDFParse
    : typeof pdfParseModule === "function"
      ? pdfParseModule
      : null;
const {
  generateInterviewReport: generateInterViewReport,
  generateResumePdf,
  normalizeInterviewReport,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
  try {
    const selfDescription = req.body.selfDescription || "";
    const jobDescription = req.body.jobDescription || "";

    if (!jobDescription.trim()) {
      return res.status(400).json({ message: "Job description is required" });
    }

    if (!req.file && !selfDescription.trim()) {
      return res.status(400).json({ message: "Upload a resume or add a self-description" });
    }

    let resumeText = "";
    if (req.file) {
      let pdfData;

      if (pdfParseModule && typeof pdfParseModule.PDFParse === "function") {
        const parser = new PdfParserClass({ data: req.file.buffer });
        pdfData = await parser.getText();
      } else if (typeof PdfParserClass === "function") {
        pdfData = await PdfParserClass(req.file.buffer);
      }

      resumeText = pdfData?.text || "";
    }

    const rawReport = await generateInterViewReport(
      resumeText,
      selfDescription,
      jobDescription
    );

    const normalizedReport = normalizeInterviewReport(rawReport);

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      title: normalizedReport.title || "Interview Report",
      matchScore: normalizedReport.matchScore,
      technicalQuestions: normalizedReport.technicalQuestions,
      behavioralQuestions: normalizedReport.behavioralQuestions,
      skillGaps: normalizedReport.skillGaps,
      preparationPlan: normalizedReport.preparationPlan.map((item) => ({
        day: Number(item.day),
        focus: item.focus,
        tasks: Array.isArray(item.tasks) ? item.tasks : [],
      })),
    });

    const responseReport = {
      ...interviewReport.toObject(),
      id: String(interviewReport._id),
    };

    return res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport: responseReport,
    });
  } catch (error) {
    console.error("generateInterViewReportController error:", error);
    return res.status(500).json({
      message: "Failed to generate interview report",
      error: error.message,
    });
  }
}

async function getInterviewReportsController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    return res.status(200).json({
      message: "Interview report retrieved successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("getInterviewReportsController error:", error);
    return res.status(500).json({ message: "Failed to fetch interview report", error: error.message });
  }
}

async function getAllinterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select("-resume -selfDescription -jobDescription -__v");

    return res.status(200).json({
      message: "Interview reports fetched successfully.",
      interviewReports,
    });
  } catch (error) {
    console.error("getAllinterviewReportsController error:", error);
    return res.status(500).json({ message: "Failed to fetch interview reports", error: error.message });
  }
}

async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interviewReportId)) {
      return res.status(400).json({ message: "Invalid interview ID" });
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewReportId,
      user: req.user.id,
    });
    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }

    const { resume, selfDescription, jobDescription } = interviewReport;
    const pdfBuffer = await generateResumePdf({ resume, selfDescription, jobDescription });

    res.setHeader("Content-Type", "application/pdf");
    return res.send(pdfBuffer);
  } catch (error) {
    console.error("generateResumePdfController error:", error);
    return res.status(500).json({
      message: "Failed to generate resume PDF",
      error: error.message,
    });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportsController,
  getAllinterviewReportsController,
  generateResumePdfController,
};