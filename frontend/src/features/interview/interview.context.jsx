import { createContext, useState } from "react";

const defaultValue = {
  loading: false,
  setLoading: () => {},
  report: null,
  setReport: () => {},
  reports: [],
  setReports: () => {},
};

export const InterviewContext = createContext(defaultValue);

export const InterviewProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);

  return (
    <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports }}>
      {children}
    </InterviewContext.Provider>
  );
};