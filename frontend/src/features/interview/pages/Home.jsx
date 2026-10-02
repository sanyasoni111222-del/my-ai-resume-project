import React, { useEffect, useRef, useState } from "react"
import "../style/home.scss"

import { useInterview } from "../hooks/useinterview"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const {loading,generateReport,reports,getReports} = useInterview()
const [jobDescription,setJobDescription] = useState("")
const [selfDescription,setSelfDescription] = useState("")
const [generationError,setGenerationError] = useState("")
const resumeInputRef = useRef()
const navigate = useNavigate()

useEffect(() => {
    getReports();
}, [getReports]);

const handleGenerateReport = async () => {
    setGenerationError("");
    const resumeFile = resumeInputRef.current.files[0];

    if (!jobDescription.trim()) {
        setGenerationError("Please add the target job description.");
        return;
    }

    if (!resumeFile && !selfDescription.trim()) {
        setGenerationError("Upload a resume or add a self-description.");
        return;
    }

    try {
        const data = await generateReport(jobDescription, selfDescription, resumeFile);
        const interviewId = data?._id || data?.id;

        if (interviewId) {
            navigate(`/interview/${interviewId}`);
        }
    } catch (error) {
        if (error.response?.status === 401) {
            navigate("/login", {
                replace: true,
                state: { message: "Your session expired or is invalid. Please sign in again." },
            });
            return;
        }

        setGenerationError(
            error.response?.data?.message || error.response?.data?.error || "Could not generate your interview strategy. Please try again."
        );
    }
}
if(loading) {
    return(
        <main className = "loading-page">
            <h1>Loading your interiew plan...</h1>
        </main>
    )
}

return (
    <div className="home-page">
        <section className="interview-builder" aria-labelledby="interview-title">
            <header className="builder-heading">
                <p className="eyebrow">YOUR AI INTERVIEW COACH</p>
                <h1 id="interview-title">
                    Your next interview <span>starts with a plan.</span>
                </h1>
                <p className="heading-copy">
                    Turn your experience and target role into a focused practice plan, tailored just for you.
                </p>
            </header>

            <div className="interview-input-group">
                <section className="form-panel job-panel" aria-labelledby="job-panel-title">
                    <div className="panel-heading">
                        <span className="panel-icon" aria-hidden="true">01</span>
                        <h2 id="job-panel-title">Target Job Description</h2>
                        <span className="optional-tag">REQUIRED</span>
                    </div>
                    <label className="field-label" htmlFor="jobDescription">Paste the job description</label>
                    <textarea
                        onChange = {(e) => setJobDescription(e.target.value)}
                        name="jobDescription"
                        id="jobDescription"
                        placeholder="Paste the role description here. Include responsibilities, qualifications, and the skills the employer is looking for..."
                    />
                    <span className="field-note">Include the full description for more relevant questions.</span>
                </section>

                <section className="form-panel profile-panel" aria-labelledby="profile-panel-title">
                    <div className="panel-heading">
                        <span className="panel-icon" aria-hidden="true">02</span>
                        <h2 id="profile-panel-title">Your Profile</h2>
                    </div>

                    <div className="resume-field">
                        <div className="field-title-row">
                            <label className="field-label" htmlFor="resume">Upload Resume</label>
                            <span className="optional-tag">PDF ONLY</span>
                        </div>
                        <label className="upload-zone" htmlFor="resume">
                            <span className="upload-icon" aria-hidden="true">↑</span>
                            <span className="upload-title">Click to upload or drag &amp; drop</span>
                            <span className="upload-detail">PDF document · max 10 MB</span>
                        </label>
                        <input
                            ref={resumeInputRef}
                            className="file-input"
                            type="file"
                            name="resume"
                            id="resume"
                            accept=".pdf,application/pdf"
                        />
                    </div>

                    <div className="or-divider"><span>OR</span></div>

                    <div className="self-description-field">
                        <label className="field-label" htmlFor="selfDescription">Quick Self-Description</label>
                        <textarea
                            onChange = {(e) => setSelfDescription(e.target.value)}
                            name="selfDescription"
                            id="selfDescription"
                            placeholder="Briefly describe your experience, key skills, and areas of expertise..."
                        />
                    </div>

                    <p className="profile-tip">
                        <span aria-hidden="true">i</span>
                        Resume + self-description together help us create a more personalized plan.
                    </p>
                </section>
            </div>
               {reports.length > 0 && (
                <section className = 'recent-reports'> 
                <h2>My Recent Interview Plans</h2> 
                <ul className = 'report-list'>

                    {reports.map((report) => (
                        <li key={report._id} className = 'report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                            <h3>{report.title || "untitled Position"}</h3>
                            <p className = "report-meta">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                            <p className = {`match-score ${report.matchScore >= 70 ? 'high' : report.matchScore >= 50 ? 'medium' : 'low'}`}>
                                Match Score: {report.matchScore}%
                            </p>
                        </li>
                    ))}
         </ul>
                </section>
            )}


            <footer className="builder-footer">
                <p><span className="footer-mark" aria-hidden="true">✦</span> Prepare with purpose <span className="footer-separator">·</span> Answer with confidence</p>
                <button
                    type="button"
                    onClick={handleGenerateReport}
                    className="generate-button"
                >
                    <span aria-hidden="true">✦</span> Generate My Interview Strategy <span aria-hidden="true">→</span>
                </button>
            </footer>
            {generationError && <p className="generation-error" role="alert">{generationError}</p>}
        </section>
    </div>
    );
};

export default Home;
