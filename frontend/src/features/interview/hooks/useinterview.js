import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from "../services/interview.api";
import { useCallback, useContext } from "react";
import { InterviewContext } from "../interview.context";

const fallbackContext = {
  loading: false,
  setLoading: () => {},
  report: null,
  setReport: () => {},
  reports: [],
  setReports: () => {},
};

export const useInterview = () => {
  const context = useContext(InterviewContext) || fallbackContext;
  const { loading, setLoading, report, setReport, reports, setReports } = context;

  const generateReport = async (jobDescription, selfDescription, resumeFile) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport(jobDescription, selfDescription, resumeFile);
      const interviewReport = response?.interviewReport || response;
      const normalizedReport = interviewReport
        ? { ...interviewReport, id: interviewReport.id || interviewReport._id }
        : null;

      setReport(normalizedReport);
      return normalizedReport;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = useCallback(async (interviewId) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(interviewId);
      const interviewReport = response?.interviewReport || response;
      setReport(interviewReport);
      return interviewReport;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setReport]);

  const getReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      const interviewReports = response?.interviewReports || [];
      setReports(interviewReports);
      return interviewReports;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [setLoading, setReports]);

  const getResumePdf = async (interviewReportId) => {
    if (!interviewReportId) {
      throw new Error("An interview ID is required to download the resume.");
    }

    setLoading(true);
    try {
      const response = await generateResumePdf(interviewReportId);
      const url = window.URL.createObjectURL(
        new Blob([response], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf };
}