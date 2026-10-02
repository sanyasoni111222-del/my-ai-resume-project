import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../style/interview.scss";
import { useInterview } from "../hooks/useinterview";

const severityMap = {
  low: "low",
  medium: "medium",
  high: "high",
};

const Interview = () => {
  const { interviewId } = useParams();
  const { report, getReportById, loading, getResumePdf } = useInterview();
  const reportData = report || {};
  const reportId = reportData.id || reportData._id;
  const isCurrentReport = reportId === interviewId;
  const [loadError, setLoadError] = useState(null);
  const [downloadError, setDownloadError] = useState("");

  const handleResumeDownload = async () => {
    setDownloadError("");
    try {
      await getResumePdf(interviewId);
    } catch (error) {
      const responseMessage = error.response?.data?.message;
      setDownloadError(
        (typeof responseMessage === "string" && responseMessage) ||
          error.message ||
          "Could not download the resume. Please try again."
      );
    }
  };

  const requestReport = useCallback(
    () => getReportById(interviewId),
    [getReportById, interviewId]
  );

  useEffect(() => {
    if (interviewId && !isCurrentReport) {
      requestReport().then((result) => {
        if (!result) {
          setLoadError({
            interviewId,
            message: "Could not load this interview plan. Please try again.",
          });
        }
      });
    }
  }, [interviewId, isCurrentReport, requestReport]);

  const {
    matchScore = 0,
    behavioralQuestions = [],
    skillGaps = [],
    preparationPlan = [],
    technicalQuestions = [],
    technicalQestions = [],
  } = reportData;

  const safeTechnicalQuestions = Array.isArray(technicalQuestions) ? technicalQuestions : [];
  const safeLegacyTechnicalQuestions = Array.isArray(technicalQestions) ? technicalQestions : [];
  const safeBehavioralQuestions = Array.isArray(behavioralQuestions) ? behavioralQuestions : [];
  const safeSkillGaps = Array.isArray(skillGaps) ? skillGaps : [];
  const safePreparationPlan = Array.isArray(preparationPlan) ? preparationPlan : [];

  const technicalQuestionItems = safeTechnicalQuestions.length > 0
    ? safeTechnicalQuestions
    : safeLegacyTechnicalQuestions;

  const selectedTechnicalQuestions = technicalQuestionItems.map((item) => {
    if (typeof item === "string") {
      return {
        question: item,
        intention: "Assess core technical understanding.",
        answer: "No additional details were provided for this technical question.",
      };
    }
    return item;
  });

  const [activeSection, setActiveSection] = useState("Technical Questions");
  const [expandedQuestion, setExpandedQuestion] = useState(0);

  const sectionConfig = [
    { label: "Technical Questions", key: "technical" },
    { label: "Behavioral Questions", key: "behavioral" },
    { label: "Road Map", key: "roadmap" },
  ];
  
  const renderMainContent = () => {
    if (activeSection === "Technical Questions") {
      return (
        <>
          <header className="main-header">
            <h1>
              Technical Questions <span>{selectedTechnicalQuestions.length} questions</span>
            </h1>
          </header>

          <div className="question-list">
            {selectedTechnicalQuestions.map((item, index) => {
              const isOpen = expandedQuestion === index;
              const question = item.question || item;
              const intention = item.intention || "Assess core technical understanding.";
              const answer = item.answer || "No additional details were provided.";

              return (
                <div key={`${question}-${index}`} className={`question-row ${isOpen ? "is-open" : ""}`} role="listitem">
                  <div className="question-mark">Q{index + 1}</div>
                  <button
                    type="button"
                    className="question-toggle"
                    onClick={() => setExpandedQuestion(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="question-text">{question}</span>
                    <span className="chevron" aria-hidden="true">
                      {isOpen ? "⌃" : "⌄"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="question-details">
                      <p>
                        <strong>Intention:</strong> {intention}
                      </p>
                      <p>
                        <strong>Answer:</strong> {answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      );
    }

    if (activeSection === "Behavioral Questions") {
      return (
        <>
          <header className="main-header">
            <h1>
              Behavioral Questions <span>{safeBehavioralQuestions.length} prompts</span>
            </h1>
          </header>

          <div className="behavioral-list">
            {safeBehavioralQuestions.map((item, index) => (
              <article key={`${item.question}-${index}`} className="behavioral-card">
                <div className="behavioral-header">
                  <span className="question-mark">B{index + 1}</span>
                  <h3>{item.question}</h3>
                </div>
                <p className="behavioral-intention">
                  <strong>Intention:</strong> {item.intention}
                </p>
                <p className="behavioral-answer">
                  <strong>Answer focus:</strong> {item.answer}
                </p>
              </article>
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <header className="main-header">
          <h1>
            Road Map <span>{safePreparationPlan.length} stages</span>
          </h1>
        </header>

        <div className="roadmap-list">
          {safePreparationPlan.map((item, index) => (
            <article key={`${item.day || index}-${item.focus || index}`} className="roadmap-card">
              <div className="roadmap-day">Day {item.day || index + 1}</div>
              <div className="roadmap-content">
                <h3>{item.focus || `Focus ${index + 1}`}</h3>
                <p>
                  {Array.isArray(item.tasks) && item.tasks.length > 0
                    ? item.tasks.join(" • ")
                    : "Build practice, review fundamentals, and track measurable improvements."}
                </p>
              </div>
            </article>
          ))}
        </div>

      </>
    );
  };

  const currentLoadError = loadError?.interviewId === interviewId ? loadError.message : "";

  if (!isCurrentReport && (loading || !currentLoadError)) {
    return (
      <main className="loading-page">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  if (!isCurrentReport && currentLoadError) {
    return (
      <main className="loading-page">
        <h1>{currentLoadError}</h1>
        <button
          type="button"
          onClick={() => {
            setLoadError(null);
            requestReport().then((result) => {
              if (!result) {
                setLoadError({
                  interviewId,
                  message: "Could not load this interview plan. Please try again.",
                });
              }
            });
          }}
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="interview-page">
      <div className="interview-shell" role="region" aria-label="Interview dashboard">
        <aside className="interview-sidebar" aria-label="Sections navigation">
          <div className="sidebar-title">SECTIONS</div>
          <nav className="section-nav">
            {sectionConfig.map(({ label }) => (
              <button
                key={label}
                type="button"
                className={`section-item ${activeSection === label ? "is-active" : ""}`}
                onClick={() => setActiveSection(label)}
              >
                <span className="section-icon" aria-hidden="true">
                  {activeSection === label ? "›" : "◌"}
                </span>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {interviewId && (
            <button
              type="button"
              className="button primary-button roadmap-download-button sidebar-download-button"
              onClick={handleResumeDownload}
              disabled={loading}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 3v11m0 0 4-4m-4 4-4-4M4 19h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {loading ? "Preparing Resume..." : "Download Resume"}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" />
              </svg>
            </button>
          )}
          {downloadError && <p role="alert">{downloadError}</p>}
        </aside>

        <section className="interview-main">{renderMainContent()}</section>

        <aside className="interview-aside" aria-label="Match score and skill gaps">
          <div className="aside-block">
            <div className="aside-label">MATCH SCORE</div>
            <div className="score-ring" aria-label={`Match score ${matchScore}`}>
              <div className="score-ring__inner">
                <strong>{matchScore}</strong>
                <span>%</span>
              </div>
            </div>
            <p className="score-copy">Strong match for this role</p>
          </div>

          <div className="aside-block">
            <div className="aside-label">SKILL GAPS</div>
            <div className="skill-list">
              {safeSkillGaps.map((item, index) => {
                const severity = severityMap[item.severity] || "medium";

                return (
                  <div key={`${item.skill}-${index}`} className={`skill-pill skill-pill--${severity}`}>
                    {item.skill}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Interview;